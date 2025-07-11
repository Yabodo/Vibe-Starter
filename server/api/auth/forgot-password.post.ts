import { PrismaClient } from '@prisma/client'
import crypto from 'crypto'
import { Resend } from 'resend'
import handlebars from 'handlebars'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  try {
    const { email } = await readBody(event)

    if (!email) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Email is required'
      })
    }

    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() }
    })

    // Always return success (security: don't reveal if email exists)
    const response = {
      success: true,
      message: 'If an account with that email exists, we\'ve sent a password reset link.'
    }

    if (!user) {
      return response
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex')
    const resetTokenExpiry = new Date(Date.now() + 60 * 60 * 1000) // 1 hour from now

    // Save reset token to database
    await prisma.user.update({
      where: { id: user.id },
      data: {
        resetToken,
        resetTokenExpiry
      }
    })

    // Send password reset email
    try {
      const config = useRuntimeConfig()
      const resend = new Resend(config.resendApiKey)
      
      const resetUrl = `${config.public.authUrl}/auth/reset-password?token=${resetToken}`
      
      // Get email template or use default
      const template = await prisma.emailTemplate.findUnique({
        where: { name: 'password-reset', isActive: true }
      })
      
      let subject = 'Password Reset Request - Vibe Starter'
      let html = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Password Reset Request</h2>
          <p>Hi ${user.name || 'User'},</p>
          <p>We received a request to reset your password.</p>
          <p>Click the button below to reset your password (this link will expire in 1 hour):</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${resetUrl}" style="background-color: #007bff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block;">Reset Password</a>
          </div>
          <p>If you didn't request this password reset, you can safely ignore this email.</p>
          <p>Best regards,<br>The Vibe Starter Team</p>
        </div>
      `
      
      if (template) {
        const compiled = handlebars.compile(template.htmlContent)
        html = compiled({
          name: user.name || 'User',
          resetUrl,
          appName: 'Vibe Starter',
          expiryTime: '1 hour'
        })
        
        const subjectCompiled = handlebars.compile(template.subject)
        subject = subjectCompiled({ appName: 'Vibe Starter' })
      }
      
      console.log('Sending email to:', user.email)
      console.log('From:', config.emailFrom)
      
      const emailResult = await resend.emails.send({
        from: config.emailFrom || 'noreply@example.com',
        to: user.email,
        subject,
        html
      })
      
      console.log('Email send result:', emailResult)
      
      // Log email
      await prisma.emailLog.create({
        data: {
          to: user.email,
          from: config.emailFrom || 'noreply@example.com',
          subject,
          template: 'password-reset',
          status: 'sent',
          sentAt: new Date()
        }
      })
    } catch (emailError) {
      console.error('Failed to send password reset email:', emailError)
      
      // Log failed email
      try {
        const config = useRuntimeConfig()
        await prisma.emailLog.create({
          data: {
            to: user.email,
            from: config.emailFrom || 'noreply@example.com',
            subject: 'Password Reset Request',
            template: 'password-reset',
            status: 'failed',
            error: emailError.message
          }
        })
      } catch (logError) {
        console.error('Failed to log email error:', logError)
      }
      // Still return success to user for security
    }

    // Log the action
    await prisma.userActivity.create({
      data: {
        userId: user.id,
        action: 'password_reset_requested',
        details: JSON.stringify({ email }),
        ipAddress: getClientIP(event) || 'unknown',
        userAgent: getHeader(event, 'user-agent') || ''
      }
    })

    return response
  } catch (error) {
    console.error('Forgot password error:', error)
    console.error('Error details:', {
      message: error.message,
      stack: error.stack,
      name: error.name
    })
    
    if (error.statusCode) {
      throw error
    }

    throw createError({
      statusCode: 500,
      statusMessage: `Failed to process password reset request: ${error.message}`
    })
  }
})