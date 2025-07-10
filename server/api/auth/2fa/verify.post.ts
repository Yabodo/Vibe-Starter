import { PrismaClient } from '@prisma/client'
import jwt from 'jsonwebtoken'
import { verifyTwoFactorCode, removeUsedBackupCode } from '~/utils/twoFactor'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    const { token: totpToken } = body
    
    if (!totpToken) {
      throw createError({
        statusCode: 400,
        statusMessage: 'TOTP token is required'
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

    const jwtToken = authHeader.substring(7)
    
    // Get JWT secret from runtime config
    const config = useRuntimeConfig()
    const jwtSecret = config.jwtSecret || 'your-secret-key'
    
    // Verify the JWT token
    const decoded = jwt.verify(jwtToken, jwtSecret) as { userId: string }
    
    // Get user from database
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: { 
        id: true, 
        email: true, 
        twoFactorEnabled: true,
        twoFactorSecret: true,
        backupCodes: true
      }
    })
    
    if (!user) {
      throw createError({
        statusCode: 401,
        statusMessage: 'User not found'
      })
    }
    
    if (!user.twoFactorSecret) {
      throw createError({
        statusCode: 400,
        statusMessage: '2FA is not set up for this account'
      })
    }
    
    // Parse backup codes
    const backupCodes = user.backupCodes ? JSON.parse(user.backupCodes) : []
    
    // Verify the token
    const verification = verifyTwoFactorCode(totpToken, user.twoFactorSecret, backupCodes)
    
    if (!verification.isValid) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Invalid 2FA token'
      })
    }
    
    // If this is the first verification (during setup), enable 2FA
    if (!user.twoFactorEnabled) {
      await prisma.user.update({
        where: { id: user.id },
        data: {
          twoFactorEnabled: true
        }
      })
    }
    
    // If a backup code was used, remove it from the list
    if (verification.usedBackupCode) {
      const updatedBackupCodes = removeUsedBackupCode(backupCodes, totpToken)
      await prisma.user.update({
        where: { id: user.id },
        data: {
          backupCodes: JSON.stringify(updatedBackupCodes)
        }
      })
    }
    
    return {
      success: true,
      message: user.twoFactorEnabled ? '2FA verified successfully' : '2FA enabled successfully',
      usedBackupCode: verification.usedBackupCode
    }
  } catch (error: any) {
    if (error.statusCode) {
      throw error
    }
    
    console.error('2FA verification error:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to verify 2FA token'
    })
  }
})