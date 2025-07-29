import Stripe from 'stripe'

const config = useRuntimeConfig()

if (!config.stripeSecretKey) {
  throw new Error('STRIPE_SECRET_KEY is not defined in environment variables')
}

export const stripe = new Stripe(config.stripeSecretKey, {
  apiVersion: '2024-11-20.acacia',
  typescript: true,
})

// Stripe configuration
export const STRIPE_CONFIG = {
  currency: 'usd',
  plans: {
    FREE: {
      id: 'free',
      name: 'Free',
      price: 0,
      interval: 'month',
      features: [
        'Basic analytics',
        'Up to 1,000 page views',
        'Email support',
        'Basic dashboard'
      ],
      stripePriceId: null, // Free plan has no Stripe price
      limits: {
        pageViews: 1000,
        users: 1,
        exports: 1
      }
    },
    STARTER: {
      id: 'starter',
      name: 'Starter',
      price: 9.99,
      interval: 'month',
      features: [
        'Advanced analytics',
        'Up to 10,000 page views',
        'Priority email support',
        'Custom dashboard',
        'Basic integrations'
      ],
      stripePriceId: process.env.STRIPE_STARTER_PRICE_ID || 'price_1starter_monthly_499',
      limits: {
        pageViews: 10000,
        users: 5,
        exports: 10
      }
    },
    PREMIUM: {
      id: 'premium',
      name: 'Premium',
      price: 29.99,
      interval: 'month',
      features: [
        'Full analytics suite',
        'Unlimited page views',
        'Priority support',
        'Custom integrations',
        'Advanced reporting',
        'API access'
      ],
      stripePriceId: process.env.STRIPE_PREMIUM_PRICE_ID || 'price_1premium_monthly_2999',
      limits: {
        pageViews: -1, // Unlimited
        users: -1,     // Unlimited
        exports: -1    // Unlimited
      }
    }
  }
}

// Helper function to get plan by ID
export function getPlanById(planId: string) {
  return Object.values(STRIPE_CONFIG.plans).find(plan => plan.id === planId)
}

// Helper function to get plan by Stripe price ID
export function getPlanByPriceId(priceId: string) {
  return Object.values(STRIPE_CONFIG.plans).find(plan => plan.stripePriceId === priceId)
}

// Helper function to format currency
export function formatCurrency(amount: number, currency: string = 'usd') {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency.toUpperCase(),
  }).format(amount)
}