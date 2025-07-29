import { prisma } from '~/utils/db'
import { STRIPE_CONFIG } from '~/utils/stripe'
import jwt from 'jsonwebtoken'

export default defineEventHandler(async (event) => {
  try {
    // Get the user from the JWT token
    const authHeader = getHeader(event, 'authorization')
    if (!authHeader?.startsWith('Bearer ')) {
      throw createError({
        statusCode: 401,
        statusMessage: 'Authorization required'
      })
    }

    const token = authHeader.substring(7)
    const config = useRuntimeConfig()
    const jwtSecret = config.jwtSecret || config.authSecret
    
    console.log('JWT Secret exists:', !!jwtSecret)
    console.log('Token length:', token.length)
    
    const decoded = jwt.verify(token, jwtSecret) as any
    console.log('Decoded token:', { userId: decoded.userId, email: decoded.email })

    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      include: { 
        subscription: true
      }
    })

    if (!user) {
      throw createError({
        statusCode: 404,
        statusMessage: 'User not found'
      })
    }

    // Get or create subscription
    let subscription = user.subscription
    if (!subscription) {
      subscription = await prisma.subscription.create({
        data: {
          userId: user.id,
          status: 'active',
          tier: 'FREE'
        }
      })
    }

    // Get plan details
    const plan = STRIPE_CONFIG.plans[subscription.tier as keyof typeof STRIPE_CONFIG.plans]
    
    // Get recent payments separately to avoid relation issues
    let recentPayments = []
    try {
      recentPayments = await prisma.payment.findMany({
        where: { userId: user.id },
        orderBy: { createdAt: 'desc' },
        take: 5
      })
    } catch (error) {
      console.log('Payments table not available yet:', error.message)
    }

    return {
      subscription: {
        id: subscription.id,
        status: subscription.status,
        tier: subscription.tier,
        startDate: subscription.startDate,
        endDate: subscription.endDate,
        cancelAtPeriodEnd: subscription.cancelAtPeriodEnd || false,
        currentPeriodStart: subscription.stripeCurrentPeriodStart,
        currentPeriodEnd: subscription.stripeCurrentPeriodEnd,
        stripeCustomerId: subscription.stripeCustomerId,
        stripeSubscriptionId: subscription.stripeSubscriptionId
      },
      plan: plan || STRIPE_CONFIG.plans.FREE,
      recentPayments: recentPayments.map(payment => ({
        id: payment.id,
        amount: payment.amount,
        currency: payment.currency,
        status: payment.status,
        description: payment.description,
        createdAt: payment.createdAt
      }))
    }

  } catch (error) {
    console.error('Get current subscription error:', error)
    
    if (error.statusCode) {
      throw error
    }

    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to get subscription'
    })
  }
})