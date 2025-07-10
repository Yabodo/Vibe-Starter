import { prisma } from '~/utils/db'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

export default defineEventHandler(async (event) => {
  console.log('Login endpoint called')
  const body = await readBody(event)
  
  const { email, password, twoFactorToken } = body

  console.log('Login attempt for email:', email)
  console.log('Database URL available:', !!process.env.DATABASE_URL)
  console.log('Prisma client type:', typeof prisma)

  if (!email || !password) {
    console.log('Missing email or password')
    throw createError({
      statusCode: 400,
      statusMessage: 'Email and password are required'
    })
  }

  try {
    console.log('About to query database for user')
    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        name: true,
        password: true,
        role: true,
        profileImage: true,
        createdAt: true,
        twoFactorEnabled: true,
        twoFactorSecret: true,
        backupCodes: true,
        subscription: true
      }
    })
    console.log('Database query completed')

    console.log('User found:', !!user)
    if (user) {
      console.log('User email matches:', user.email === email)
      console.log('User has password:', !!user.password)
      console.log('Password length:', user.password?.length)
    }

    if (!user) {
      console.log('User not found for email:', email)
      throw createError({
        statusCode: 401,
        statusMessage: 'Invalid credentials'
      })
    }

    console.log('About to compare passwords')
    const isPasswordValid = await bcrypt.compare(password, user.password)
    console.log('Password comparison completed, result:', isPasswordValid)

    if (!isPasswordValid) {
      console.log('Invalid password for user:', email)
      throw createError({
        statusCode: 401,
        statusMessage: 'Invalid credentials'
      })
    }

    console.log('Password validation passed, creating JWT')

    // Check if 2FA is enabled for this user
    if (user.twoFactorEnabled && user.twoFactorSecret) {
      if (!twoFactorToken) {
        // Return a special response indicating 2FA is required
        return {
          requires2FA: true,
          message: '2FA verification required'
        }
      }
      
      // Verify 2FA token
      const { verifyTwoFactorCode, removeUsedBackupCode } = await import('~/utils/twoFactor')
      const backupCodes = user.backupCodes ? JSON.parse(user.backupCodes) : []
      
      const verification = verifyTwoFactorCode(twoFactorToken, user.twoFactorSecret, backupCodes)
      
      if (!verification.isValid) {
        throw createError({
          statusCode: 401,
          statusMessage: 'Invalid 2FA token'
        })
      }
      
      // If a backup code was used, remove it
      if (verification.usedBackupCode) {
        const updatedBackupCodes = removeUsedBackupCode(backupCodes, twoFactorToken)
        await prisma.user.update({
          where: { id: user.id },
          data: {
            backupCodes: JSON.stringify(updatedBackupCodes)
          }
        })
      }
    }

    const config = useRuntimeConfig()
    const jwtSecret = config.jwtSecret || config.authSecret || 'your-secret-key'
    
    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      jwtSecret,
      { expiresIn: '7d' }
    )

    return {
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        profileImage: user.profileImage,
        createdAt: user.createdAt.toISOString(),
        twoFactorEnabled: user.twoFactorEnabled,
        subscription: user.subscription
      }
    }
  } catch (error) {
    console.error('Login error:', error)
    if (error.statusCode) {
      throw error
    }
    
    throw createError({
      statusCode: 500,
      statusMessage: 'Internal server error'
    })
  }
})