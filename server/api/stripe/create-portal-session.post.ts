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

    if (!user?.subscription?.stripeCustomerId) {
      throw createError({
        statusCode: 400,
        statusMessage: 'No Stripe customer found'
      })
    }

    // Create portal session
    const portalSession = await stripe.billingPortal.sessions.create({
      customer: user.subscription.stripeCustomerId,
      return_url: `${config.public.authUrl}/dashboard`,
    })

    return {
      url: portalSession.url
    }

  } catch (error) {
    console.error('Portal session creation error:', error)
    
    if (error.statusCode) {
      throw error
    }

    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to create portal session'
    })
  }
})