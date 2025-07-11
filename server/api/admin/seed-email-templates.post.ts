import jwt from 'jsonwebtoken'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  try {
    // Check authorization
    const authHeader = getHeader(event, 'authorization')
    if (!authHeader?.startsWith('Bearer ')) {
      throw createError({
        statusCode: 401,
        statusMessage: 'Authorization required'
      })
    }

    const token = authHeader.substring(7)
    const config = useRuntimeConfig()
    const decoded = jwt.verify(token, config.jwtSecret) as { userId: string, role: string }
    
    // Check if user is admin
    if (decoded.role !== 'ADMIN') {
      throw createError({
        statusCode: 403,
        statusMessage: 'Admin access required'
      })
    }

    // Default email templates
    const templates = [
      {
        name: 'welcome',
        subject: 'Welcome to {{appName}}!',
        htmlContent: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #333;">Welcome to {{appName}}, {{name}}!</h2>
            <p>Thank you for joining our platform. We're excited to have you on board!</p>
            <p>You can now:</p>
            <ul>
              <li>Explore your dashboard</li>
              <li>Set up your profile</li>
              <li>Enable two-factor authentication for extra security</li>
            </ul>
            <p>If you have any questions, feel free to reach out to our support team.</p>
            <p>Best regards,<br>The {{appName}} Team</p>
          </div>
        `,
        textContent: `Welcome to {{appName}}, {{name}}! Thank you for joining our platform. We're excited to have you on board!`,
        variables: JSON.stringify(['name', 'appName'])
      },
      {
        name: 'password-reset',
        subject: 'Password Reset Request - {{appName}}',
        htmlContent: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #333;">Password Reset Request</h2>
            <p>Hi {{name}},</p>
            <p>We received a request to reset your password for your {{appName}} account.</p>
            <p>Click the button below to reset your password (this link will expire in {{expiryTime}}):</p>
            <div style="text-align: center; margin: 30px 0;">
              <a href="{{resetUrl}}" style="background-color: #007bff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block;">Reset Password</a>
            </div>
            <p>If you didn't request this password reset, you can safely ignore this email.</p>
            <p>Best regards,<br>The {{appName}} Team</p>
          </div>
        `,
        textContent: `Hi {{name}}, we received a request to reset your password. Visit: {{resetUrl}}`,
        variables: JSON.stringify(['name', 'appName', 'resetUrl', 'expiryTime'])
      },
      {
        name: 'email-verification',
        subject: 'Verify Your Email - {{appName}}',
        htmlContent: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #333;">Email Verification</h2>
            <p>Hi {{name}},</p>
            <p>Thank you for signing up for {{appName}}! Please verify your email address to complete your registration.</p>
            <div style="text-align: center; margin: 30px 0;">
              <a href="{{verifyUrl}}" style="background-color: #28a745; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block;">Verify Email</a>
            </div>
            <p>If you didn't create an account with us, you can safely ignore this email.</p>
            <p>Best regards,<br>The {{appName}} Team</p>
          </div>
        `,
        textContent: `Hi {{name}}, please verify your email by visiting: {{verifyUrl}}`,
        variables: JSON.stringify(['name', 'appName', 'verifyUrl'])
      },
      {
        name: 'subscription-confirmation',
        subject: 'Subscription Confirmed - {{appName}}',
        htmlContent: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #333;">Subscription Confirmed!</h2>
            <p>Hi {{name}},</p>
            <p>Your {{plan}} subscription has been confirmed and is now active.</p>
            <p>You now have access to all {{plan}} features including:</p>
            <ul>
              <li>Premium dashboard</li>
              <li>Advanced analytics</li>
              <li>Priority support</li>
            </ul>
            <p>Thank you for upgrading to {{plan}}!</p>
            <p>Best regards,<br>The {{appName}} Team</p>
          </div>
        `,
        textContent: `Hi {{name}}, your {{plan}} subscription is now active. Thank you for upgrading!`,
        variables: JSON.stringify(['name', 'appName', 'plan'])
      },
      {
        name: '2fa-enabled',
        subject: 'Two-Factor Authentication Enabled - {{appName}}',
        htmlContent: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #333;">Two-Factor Authentication Enabled</h2>
            <p>Hi {{name}},</p>
            <p>Two-factor authentication has been successfully enabled on your {{appName}} account.</p>
            <p>Your account is now more secure! You'll need your authenticator app to log in.</p>
            <p><strong>Time:</strong> {{timestamp}}</p>
            <p>If you didn't enable this, please contact support immediately.</p>
            <p>Best regards,<br>The {{appName}} Team</p>
          </div>
        `,
        textContent: `Hi {{name}}, 2FA has been enabled on your account at {{timestamp}}.`,
        variables: JSON.stringify(['name', 'appName', 'timestamp'])
      }
    ]

    // Insert templates (upsert to avoid duplicates)
    const results = await Promise.all(
      templates.map(template =>
        prisma.emailTemplate.upsert({
          where: { name: template.name },
          update: template,
          create: template
        })
      )
    )

    return {
      success: true,
      message: `Successfully seeded ${results.length} email templates`,
      data: results
    }
  } catch (error) {
    if (error.statusCode) {
      throw error
    }
    
    console.error('Failed to seed email templates:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to seed email templates'
    })
  }
})