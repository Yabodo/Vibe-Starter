import { stripe, STRIPE_CONFIG } from '~/utils/stripe'
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

    if (!user) {
      throw createError({
        statusCode: 404,
        statusMessage: 'User not found'
      })
    }

    const { priceId, planId } = await readBody(event)

    if (!priceId || !planId) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Price ID and Plan ID are required'
      })
    }

    // Validate the plan
    const plan = STRIPE_CONFIG.plans[planId as keyof typeof STRIPE_CONFIG.plans]
    if (!plan) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Invalid plan ID'
      })
    }

    // Get or create Stripe customer
    let stripeCustomerId = user.subscription?.stripeCustomerId
    
    if (!stripeCustomerId) {
      const customer = await stripe.customers.create({
        email: user.email,
        name: user.name || undefined,
        metadata: {
          userId: user.id
        }
      })
      stripeCustomerId = customer.id

      // Update or create subscription record with customer ID
      await prisma.subscription.upsert({
        where: { userId: user.id },
        update: { stripeCustomerId },
        create: {
          userId: user.id,
          status: 'active',
          tier: 'FREE',
          stripeCustomerId
        }
      })
    }

    // Create checkout session
    const session = await stripe.checkout.sessions.create({
      customer: stripeCustomerId,
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${config.public.authUrl}/dashboard?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${config.public.authUrl}/pricing`,
      metadata: {
        userId: user.id,
        planId: planId
      }
    })

    return {
      sessionId: session.id,
      url: session.url
    }

  } catch (error) {
    console.error('Checkout session creation error:', error)
    
    if (error.statusCode) {
      throw error
    }

    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to create checkout session'
    })
  }
})