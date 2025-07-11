import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  try {
    const { token } = await readBody(event)

    if (!token) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Verification token is required'
      })
    }

    // Find user with this verification token (we'll use resetToken field for email verification too)
    const user = await prisma.user.findFirst({
      where: {
        resetToken: token,
        emailVerified: false
      }
    })

    if (!user) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Invalid verification token or email already verified'
      })
    }

    // Update user as email verified
    await prisma.user.update({
      where: { id: user.id },
      data: {
        emailVerified: true,
        emailVerifiedAt: new Date(),
        resetToken: null, // Clear the verification token
        updatedAt: new Date()
      }
    })

    // Log the action
    await prisma.userActivity.create({
      data: {
        userId: user.id,
        action: 'email_verified',
        details: JSON.stringify({ email: user.email }),
        ipAddress: getClientIP(event) || 'unknown',
        userAgent: getHeader(event, 'user-agent') || ''
      }
    })

    return {
      success: true,
      message: 'Email verified successfully!'
    }
  } catch (error) {
    console.error('Email verification error:', error)
    
    if (error.statusCode) {
      throw error
    }

    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to verify email'
    })
  }
})