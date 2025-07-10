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

    const currentSubscription = await prisma.subscription.findUnique({
      where: { userId: decoded.userId }
    })

    if (!currentSubscription) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Subscription not found'
      })
    }

    if (currentSubscription.status === 'CANCELLED') {
      throw createError({
        statusCode: 400,
        statusMessage: 'Subscription is already cancelled'
      })
    }

    const updatedSubscription = await prisma.subscription.delete({
      where: { userId: decoded.userId }
    })

    return {
      message: 'Subscription cancelled successfully',
      subscription: null
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