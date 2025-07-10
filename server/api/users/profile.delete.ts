import { PrismaClient } from '@prisma/client'
import jwt from 'jsonwebtoken'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  const authHeader = getHeader(event, 'authorization')
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Authorization token required'
    })
  }

  const token = authHeader.substring(7)

  try {
    const config = useRuntimeConfig()
    const jwtSecret = config.jwtSecret || config.authSecret || 'your-secret-key'
    const decoded = jwt.verify(token, jwtSecret) as any
    
    // Delete user's subscription first (due to foreign key constraint)
    await prisma.subscription.deleteMany({
      where: { userId: decoded.userId }
    })
    
    // Delete user's sessions and accounts
    await prisma.session.deleteMany({
      where: { userId: decoded.userId }
    })
    
    await prisma.account.deleteMany({
      where: { userId: decoded.userId }
    })
    
    // Finally delete the user
    await prisma.user.delete({
      where: { id: decoded.userId }
    })

    return {
      message: 'Account deleted successfully'
    }
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      throw createError({
        statusCode: 401,
        statusMessage: 'Invalid token'
      })
    }
    
    if (error.statusCode) {
      throw error
    }
    
    throw createError({
      statusCode: 500,
      statusMessage: 'Internal server error'
    })
  }
})