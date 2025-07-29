import { prisma } from '~/utils/db'
import jwt from 'jsonwebtoken'

const SUBSCRIPTION_TIERS = ['STARTER', 'PREMIUM']
const TIER_PRICES = {
  STARTER: 4.99,
  PREMIUM: 29.99
}

export default defineEventHandler(async (event) => {
  const authHeader = getHeader(event, 'authorization')
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Authorization token required'
    })
  }

  const token = authHeader.substring(7)
  const body = await readBody(event)

  try {
    const config = useRuntimeConfig()
    const jwtSecret = config.jwtSecret || config.authSecret || 'your-secret-key'
    const decoded = jwt.verify(token, jwtSecret) as any
    const { tier } = body

    if (!tier || !SUBSCRIPTION_TIERS.includes(tier)) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Invalid subscription tier'
      })
    }

    let currentSubscription = await prisma.subscription.findUnique({
      where: { userId: decoded.userId }
    })

    // Create subscription if it doesn't exist
    if (!currentSubscription) {
      currentSubscription = await prisma.subscription.create({
        data: {
          userId: decoded.userId,
          tier,
          status: 'ACTIVE',
          startDate: new Date(),
          endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days
        }
      })
    } else {
      // Update existing subscription
      currentSubscription = await prisma.subscription.update({
        where: { userId: decoded.userId },
        data: {
          tier,
          status: 'ACTIVE',
          startDate: new Date(),
          endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days
        }
      })
    }

    const updatedSubscription = currentSubscription

    return {
      message: 'Subscription upgraded successfully',
      subscription: updatedSubscription,
      price: TIER_PRICES[tier as keyof typeof TIER_PRICES]
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