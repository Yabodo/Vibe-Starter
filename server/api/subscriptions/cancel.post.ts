import { stripe } from '~/utils/stripe'
import { prisma } from '~/utils/db'
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
    const decoded = jwt.verify(token, jwtSecret) as any

    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      include: { subscription: true }
    })

    if (!user?.subscription?.stripeSubscriptionId) {
      throw createError({
        statusCode: 400,
        statusMessage: 'No active subscription found'
      })
    }

    const { cancelAtPeriodEnd = true } = await readBody(event)

    // Update subscription in Stripe
    const stripeSubscription = await stripe.subscriptions.update(
      user.subscription.stripeSubscriptionId,
      {
        cancel_at_period_end: cancelAtPeriodEnd
      }
    )

    // Update local subscription
    await prisma.subscription.update({
      where: { id: user.subscription.id },
      data: {
        cancelAtPeriodEnd,
        status: cancelAtPeriodEnd ? 'active' : 'canceled',
        endDate: cancelAtPeriodEnd ? new Date(stripeSubscription.current_period_end * 1000) : new Date()
      }
    })

    // Log activity
    await prisma.userActivity.create({
      data: {
        userId: user.id,
        action: cancelAtPeriodEnd ? 'subscription_cancel_scheduled' : 'subscription_canceled',
        details: JSON.stringify({
          subscriptionId: user.subscription.stripeSubscriptionId,
          cancelAtPeriodEnd,
          endDate: cancelAtPeriodEnd ? new Date(stripeSubscription.current_period_end * 1000) : new Date()
        })
      }
    })

    return {
      success: true,
      message: cancelAtPeriodEnd 
        ? 'Subscription will be canceled at the end of the current period'
        : 'Subscription has been canceled immediately'
    }

  } catch (error) {
    console.error('Cancel subscription error:', error)
    
    if (error.statusCode) {
      throw error
    }

    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to cancel subscription'
    })
  }
})