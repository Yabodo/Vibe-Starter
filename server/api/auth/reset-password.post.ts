import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  try {
    const { token, password } = await readBody(event)

    if (!token || !password) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Token and password are required'
      })
    }

    if (password.length < 8) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Password must be at least 8 characters long'
      })
    }

    // Find user with valid reset token
    const user = await prisma.user.findFirst({
      where: {
        resetToken: token,
        resetTokenExpiry: {
          gt: new Date()
        }
      }
    })

    if (!user) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Invalid or expired reset token'
      })
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(password, 12)

    // Update user with new password and clear reset token
    await prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        resetToken: null,
        resetTokenExpiry: null,
        updatedAt: new Date()
      }
    })

    // Log the action
    await prisma.userActivity.create({
      data: {
        userId: user.id,
        action: 'password_reset_completed',
        details: JSON.stringify({ method: 'reset_token' }),
        ipAddress: getClientIP(event) || 'unknown',
        userAgent: getHeader(event, 'user-agent') || ''
      }
    })

    return {
      success: true,
      message: 'Password has been reset successfully. You can now log in with your new password.'
    }
  } catch (error) {
    console.error('Reset password error:', error)
    
    if (error.statusCode) {
      throw error
    }

    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to reset password'
    })
  }
})