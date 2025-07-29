import { stripe, getPlanByPriceId } from '~/utils/stripe'
import { prisma } from '~/utils/db'
import type Stripe from 'stripe'

export default defineEventHandler(async (event) => {
  try {
    const config = useRuntimeConfig()
    const body = await readRawBody(event)
    const sig = getHeader(event, 'stripe-signature')

    if (!sig || !body) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Missing signature or body'
      })
    }

    let stripeEvent: Stripe.Event

    try {
      stripeEvent = stripe.webhooks.constructEvent(
        body,
        sig,
        config.stripeWebhookSecret
      )
    } catch (err: any) {
      console.error('Webhook signature verification failed:', err.message)
      throw createError({
        statusCode: 400,
        statusMessage: 'Invalid signature'
      })
    }

    console.log('Stripe webhook event:', stripeEvent.type)

    switch (stripeEvent.type) {
      case 'checkout.session.completed':
        await handleCheckoutSessionCompleted(stripeEvent.data.object as Stripe.Checkout.Session)
        break

      case 'customer.subscription.created':
      case 'customer.subscription.updated':
        await handleSubscriptionUpdated(stripeEvent.data.object as Stripe.Subscription)
        break

      case 'customer.subscription.deleted':
        await handleSubscriptionDeleted(stripeEvent.data.object as Stripe.Subscription)
        break

      case 'invoice.payment_succeeded':
        await handleInvoicePaymentSucceeded(stripeEvent.data.object as Stripe.Invoice)
        break

      case 'invoice.payment_failed':
        await handleInvoicePaymentFailed(stripeEvent.data.object as Stripe.Invoice)
        break

      default:
        console.log(`Unhandled event type: ${stripeEvent.type}`)
    }

    return { received: true }

  } catch (error) {
    console.error('Webhook handler error:', error)
    
    if (error.statusCode) {
      throw error
    }

    throw createError({
      statusCode: 500,
      statusMessage: 'Webhook handler failed'
    })
  }
})

async function handleCheckoutSessionCompleted(session: Stripe.Checkout.Session) {
  const userId = session.metadata?.userId
  
  if (!userId) {
    console.error('No userId in checkout session metadata')
    return
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: { subscription: true }
  })

  if (!user) {
    console.error('User not found:', userId)
    return
  }

  // Update subscription status
  await prisma.subscription.upsert({
    where: { userId },
    update: {
      status: 'active',
      stripeCustomerId: session.customer as string,
      stripeSubscriptionId: session.subscription as string
    },
    create: {
      userId,
      status: 'active',
      tier: 'FREE',
      stripeCustomerId: session.customer as string,
      stripeSubscriptionId: session.subscription as string
    }
  })

  // Log activity
  await prisma.userActivity.create({
    data: {
      userId,
      action: 'subscription_created',
      details: JSON.stringify({
        sessionId: session.id,
        customerId: session.customer
      })
    }
  })
}

async function handleSubscriptionUpdated(subscription: Stripe.Subscription) {
  const customerId = subscription.customer as string
  
  // Find user by Stripe customer ID
  const userSub = await prisma.subscription.findFirst({
    where: { stripeCustomerId: customerId },
    include: { user: true }
  })

  if (!userSub) {
    console.error('Subscription not found for customer:', customerId)
    return
  }

  // Get plan details from price ID
  const priceId = subscription.items.data[0]?.price.id
  const plan = getPlanByPriceId(priceId)

  await prisma.subscription.update({
    where: { id: userSub.id },
    data: {
      status: subscription.status,
      tier: plan?.id.toUpperCase() || 'FREE',
      stripePriceId: priceId,
      stripeCurrentPeriodStart: new Date(subscription.current_period_start * 1000),
      stripeCurrentPeriodEnd: new Date(subscription.current_period_end * 1000),
      cancelAtPeriodEnd: subscription.cancel_at_period_end
    }
  })

  // Log activity
  await prisma.userActivity.create({
    data: {
      userId: userSub.userId,
      action: 'subscription_updated',
      details: JSON.stringify({
        subscriptionId: subscription.id,
        status: subscription.status,
        tier: plan?.id.toUpperCase() || 'FREE'
      })
    }
  })
}

async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
  const customerId = subscription.customer as string
  
  const userSub = await prisma.subscription.findFirst({
    where: { stripeCustomerId: customerId }
  })

  if (!userSub) {
    console.error('Subscription not found for customer:', customerId)
    return
  }

  await prisma.subscription.update({
    where: { id: userSub.id },
    data: {
      status: 'canceled',
      tier: 'FREE',
      endDate: new Date()
    }
  })

  // Log activity
  await prisma.userActivity.create({
    data: {
      userId: userSub.userId,
      action: 'subscription_canceled',
      details: JSON.stringify({
        subscriptionId: subscription.id,
        canceledAt: new Date()
      })
    }
  })
}

async function handleInvoicePaymentSucceeded(invoice: Stripe.Invoice) {
  const customerId = invoice.customer as string
  
  const userSub = await prisma.subscription.findFirst({
    where: { stripeCustomerId: customerId }
  })

  if (!userSub) {
    console.error('Subscription not found for customer:', customerId)
    return
  }

  // Record payment
  await prisma.payment.create({
    data: {
      userId: userSub.userId,
      amount: (invoice.amount_paid || 0) / 100, // Convert from cents
      currency: invoice.currency,
      status: 'succeeded',
      stripeInvoiceId: invoice.id,
      stripeSubscriptionId: invoice.subscription as string,
      description: `Subscription payment - ${invoice.lines.data[0]?.description || 'Unknown'}`,
      metadata: JSON.stringify({
        invoiceId: invoice.id,
        periodStart: invoice.period_start,
        periodEnd: invoice.period_end
      })
    }
  })

  // Log activity
  await prisma.userActivity.create({
    data: {
      userId: userSub.userId,
      action: 'payment_succeeded',
      details: JSON.stringify({
        invoiceId: invoice.id,
        amount: (invoice.amount_paid || 0) / 100,
        currency: invoice.currency
      })
    }
  })
}

async function handleInvoicePaymentFailed(invoice: Stripe.Invoice) {
  const customerId = invoice.customer as string
  
  const userSub = await prisma.subscription.findFirst({
    where: { stripeCustomerId: customerId }
  })

  if (!userSub) {
    console.error('Subscription not found for customer:', customerId)
    return
  }

  // Record failed payment
  await prisma.payment.create({
    data: {
      userId: userSub.userId,
      amount: (invoice.amount_due || 0) / 100,
      currency: invoice.currency,
      status: 'failed',
      stripeInvoiceId: invoice.id,
      stripeSubscriptionId: invoice.subscription as string,
      description: `Failed subscription payment - ${invoice.lines.data[0]?.description || 'Unknown'}`,
      metadata: JSON.stringify({
        invoiceId: invoice.id,
        failureReason: invoice.last_finalization_error?.message || 'Unknown'
      })
    }
  })

  // Log activity
  await prisma.userActivity.create({
    data: {
      userId: userSub.userId,
      action: 'payment_failed',
      details: JSON.stringify({
        invoiceId: invoice.id,
        amount: (invoice.amount_due || 0) / 100,
        currency: invoice.currency
      })
    }
  })
}