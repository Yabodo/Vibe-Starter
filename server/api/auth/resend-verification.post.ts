import { PrismaClient } from '@prisma/client'
import { emailService } from '~/utils/email'
import crypto from 'crypto'

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

    if (!user) {
      throw createError({
        statusCode: 404,
        statusMessage: 'User not found'
      })
    }

    if (user.emailVerified) {
      return {
        success: true,
        message: 'Email is already verified'
      }
    }

    // Generate new verification token
    const verificationToken = crypto.randomBytes(32).toString('hex')

    // Save verification token to database (reusing resetToken field)
    await prisma.user.update({
      where: { id: user.id },
      data: {
        resetToken: verificationToken
      }
    })

    // Send verification email
    const emailResult = await emailService.sendEmailVerification(
      user.email,
      user.name || 'User',
      verificationToken
    )

    if (!emailResult.success) {
      console.error('Failed to send verification email:', emailResult.error)
      throw createError({
        statusCode: 500,
        statusMessage: 'Failed to send verification email'
      })
    }

    // Log the action
    await prisma.userActivity.create({
      data: {
        userId: user.id,
        action: 'verification_email_sent',
        details: JSON.stringify({ email }),
        ipAddress: getClientIP(event) || 'unknown',
        userAgent: getHeader(event, 'user-agent') || ''
      }
    })

    return {
      success: true,
      message: 'Verification email sent successfully'
    }
  } catch (error) {
    console.error('Resend verification error:', error)
    
    if (error.statusCode) {
      throw error
    }

    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to resend verification email'
    })
  }
})