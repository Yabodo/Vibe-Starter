import { prisma } from '~/utils/db'
import jwt from 'jsonwebtoken'
import { generateTwoFactorSetup } from '~/utils/twoFactor'

export default defineEventHandler(async (event) => {
  try {
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
        twoFactorEnabled: true 
      }
    })
    
    if (!user) {
      throw createError({
        statusCode: 401,
        statusMessage: 'User not found'
      })
    }
    
    // Check if 2FA is already enabled
    if (user.twoFactorEnabled) {
      throw createError({
        statusCode: 400,
        statusMessage: '2FA is already enabled for this account'
      })
    }
    
    // Generate 2FA setup data
    const setupData = await generateTwoFactorSetup(user.email)
    
    // Store the temporary secret (but don't enable 2FA yet)
    await prisma.user.update({
      where: { id: user.id },
      data: {
        twoFactorSecret: setupData.secret,
        backupCodes: JSON.stringify(setupData.backupCodes)
      }
    })
    
    return {
      success: true,
      data: {
        qrCodeUrl: setupData.qrCodeUrl,
        backupCodes: setupData.backupCodes,
        secret: setupData.secret // Only return this for manual entry
      }
    }
  } catch (error: any) {
    if (error.statusCode) {
      throw error
    }
    
    console.error('2FA setup error:', error)
    
    // Provide more specific error messages
    let errorMessage = 'Failed to set up 2FA'
    if (error.message?.includes('JWT_SECRET')) {
      errorMessage = 'Server configuration error: JWT_SECRET not set'
    } else if (error.message?.includes('otplib')) {
      errorMessage = 'Error generating 2FA secret'
    } else if (error.message?.includes('qrcode')) {
      errorMessage = 'Error generating QR code'
    } else if (error.message?.includes('database') || error.message?.includes('Prisma')) {
      errorMessage = 'Database error during 2FA setup'
    }
    
    throw createError({
      statusCode: 500,
      statusMessage: errorMessage
    })
  }
})