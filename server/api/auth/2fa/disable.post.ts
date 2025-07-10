import { PrismaClient } from '@prisma/client'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    const { password } = body
    
    if (!password) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Password is required to disable 2FA'
      })
    }
    
    // Get the authorization header
    const authHeader = getHeader(event, 'authorization')
    if (!authHeader?.startsWith('Bearer ')) {
      throw createError({
        statusCode: 401,
        statusMessage: 'Authorization header required'
      })
    }

    const token = authHeader.substring(7)
    
    // Get JWT secret from runtime config
    const config = useRuntimeConfig()
    const jwtSecret = config.jwtSecret || 'your-secret-key'
    
    // Verify the JWT token
    const decoded = jwt.verify(token, jwtSecret) as { userId: string }
    
    // Get user from database
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: { 
        id: true, 
        email: true, 
        password: true,
        twoFactorEnabled: true
      }
    })
    
    if (!user) {
      throw createError({
        statusCode: 401,
        statusMessage: 'User not found'
      })
    }
    
    if (!user.twoFactorEnabled) {
      throw createError({
        statusCode: 400,
        statusMessage: '2FA is not enabled for this account'
      })
    }
    
    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password)
    if (!isValidPassword) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Invalid password'
      })
    }
    
    // Disable 2FA and clear related data
    await prisma.user.update({
      where: { id: user.id },
      data: {
        twoFactorEnabled: false,
        twoFactorSecret: null,
        backupCodes: null
      }
    })
    
    return {
      success: true,
      message: '2FA has been disabled successfully'
    }
  } catch (error: any) {
    if (error.statusCode) {
      throw error
    }
    
    console.error('2FA disable error:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to disable 2FA'
    })
  }
})