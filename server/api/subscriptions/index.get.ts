import { prisma } from '~/utils/db'
import jwt from 'jsonwebtoken'

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
    
    const subscription = await prisma.subscription.findUnique({
      where: { userId: decoded.userId },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            name: true
          }
        }
      }
    })

    if (!subscription) {
      // Return default free subscription when user has no subscription
      return {
        subscription: {
          id: null,
          userId: decoded.userId,
          status: 'inactive',
          tier: 'FREE',
          startDate: null,
          endDate: null,
          createdAt: null,
          updatedAt: null
        }
      }
    }

    return {
      subscription
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