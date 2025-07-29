<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <AppHeader />
    
    <div class="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <div class="text-center">
        <h2 class="text-3xl font-extrabold text-gray-900 dark:text-white sm:text-4xl">
          Choose the right plan for you
        </h2>
        <p class="mt-4 text-xl text-gray-600 dark:text-gray-300">
          Start free, then add a site plan to go live. Account plans unlock additional features.
        </p>
      </div>

      <div class="mt-12 space-y-4 sm:mt-16 sm:space-y-0 sm:grid sm:grid-cols-2 sm:gap-6 lg:max-w-4xl lg:mx-auto xl:max-w-none xl:mx-0 xl:grid-cols-3">
        <!-- Free Plan -->
        <div class="border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm divide-y divide-gray-200 dark:divide-gray-700">
          <div class="p-6">
            <h3 class="text-lg leading-6 font-medium text-gray-900 dark:text-white">Free</h3>
            <p class="mt-4 text-sm text-gray-500 dark:text-gray-400">
              Perfect for getting started with basic analytics
            </p>
            <p class="mt-8">
              <span class="text-4xl font-extrabold text-gray-900 dark:text-white">$0</span>
              <span class="text-base font-medium text-gray-500 dark:text-gray-400">/month</span>
            </p>
            <button
              @click="selectPlan('FREE')"
              :disabled="currentPlan === 'FREE'"
              class="mt-8 block w-full bg-gray-800 dark:bg-gray-700 border border-gray-800 dark:border-gray-700 rounded-md py-2 text-sm font-semibold text-white text-center hover:bg-gray-900 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {{ currentPlan === 'FREE' ? 'Current Plan' : 'Get Started' }}
            </button>
          </div>
          <div class="pt-6 pb-8 px-6">
            <h4 class="text-sm font-medium text-gray-900 dark:text-white uppercase tracking-wide">
              What's included
            </h4>
            <ul class="mt-6 space-y-4">
              <li v-for="feature in plans.FREE.features" :key="feature" class="flex space-x-3">
                <span class="flex-shrink-0 text-green-500">✓</span>
                <span class="text-sm text-gray-500 dark:text-gray-400">{{ feature }}</span>
              </li>
            </ul>
          </div>
        </div>

        <!-- Starter Plan -->
        <div class="border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm divide-y divide-gray-200 dark:divide-gray-700">
          <div class="p-6">
            <h3 class="text-lg leading-6 font-medium text-gray-900 dark:text-white">Starter</h3>
            <p class="mt-4 text-sm text-gray-500 dark:text-gray-400">
              Great for small businesses and growing websites
            </p>
            <p class="mt-8">
              <span class="text-4xl font-extrabold text-gray-900 dark:text-white">${{ plans.STARTER.price }}</span>
              <span class="text-base font-medium text-gray-500 dark:text-gray-400">/month</span>
            </p>
            <button
              @click="selectPlan('STARTER')"
              :disabled="currentPlan === 'STARTER' || loading"
              class="mt-8 block w-full bg-blue-600 border border-blue-600 rounded-md py-2 text-sm font-semibold text-white text-center hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {{ currentPlan === 'STARTER' ? 'Current Plan' : loading ? 'Loading...' : 'Choose Starter' }}
            </button>
          </div>
          <div class="pt-6 pb-8 px-6">
            <h4 class="text-sm font-medium text-gray-900 dark:text-white uppercase tracking-wide">
              What's included
            </h4>
            <ul class="mt-6 space-y-4">
              <li v-for="feature in plans.STARTER.features" :key="feature" class="flex space-x-3">
                <span class="flex-shrink-0 text-green-500">✓</span>
                <span class="text-sm text-gray-500 dark:text-gray-400">{{ feature }}</span>
              </li>
            </ul>
          </div>
        </div>

        <!-- Premium Plan -->
        <div class="border border-blue-200 dark:border-blue-700 rounded-lg shadow-sm divide-y divide-blue-200 dark:divide-blue-700 relative">
          <div class="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <span class="inline-flex rounded-full bg-blue-100 dark:bg-blue-900 px-4 py-1 text-sm font-semibold text-blue-600 dark:text-blue-200">
              Most Popular
            </span>
          </div>
          <div class="p-6">
            <h3 class="text-lg leading-6 font-medium text-gray-900 dark:text-white">Premium</h3>
            <p class="mt-4 text-sm text-gray-500 dark:text-gray-400">
              Perfect for businesses that need advanced features
            </p>
            <p class="mt-8">
              <span class="text-4xl font-extrabold text-gray-900 dark:text-white">${{ plans.PREMIUM.price }}</span>
              <span class="text-base font-medium text-gray-500 dark:text-gray-400">/month</span>
            </p>
            <button
              @click="selectPlan('PREMIUM')"
              :disabled="currentPlan === 'PREMIUM' || loading"
              class="mt-8 block w-full bg-blue-600 border border-blue-600 rounded-md py-2 text-sm font-semibold text-white text-center hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {{ currentPlan === 'PREMIUM' ? 'Current Plan' : loading ? 'Loading...' : 'Choose Premium' }}
            </button>
          </div>
          <div class="pt-6 pb-8 px-6">
            <h4 class="text-sm font-medium text-gray-900 dark:text-white uppercase tracking-wide">
              What's included
            </h4>
            <ul class="mt-6 space-y-4">
              <li v-for="feature in plans.PREMIUM.features" :key="feature" class="flex space-x-3">
                <span class="flex-shrink-0 text-green-500">✓</span>
                <span class="text-sm text-gray-500 dark:text-gray-400">{{ feature }}</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <!-- FAQ Section -->
      <div class="mt-16">
        <h3 class="text-2xl font-extrabold text-gray-900 dark:text-white text-center">
          Frequently Asked Questions
        </h3>
        <div class="mt-8 max-w-3xl mx-auto space-y-6">
          <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
            <h4 class="text-lg font-medium text-gray-900 dark:text-white">
              Can I change my plan later?
            </h4>
            <p class="mt-2 text-gray-600 dark:text-gray-300">
              Yes, you can upgrade or downgrade your plan at any time. Changes will be prorated and reflected in your next billing cycle.
            </p>
          </div>
          <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
            <h4 class="text-lg font-medium text-gray-900 dark:text-white">
              Is there a free trial?
            </h4>
            <p class="mt-2 text-gray-600 dark:text-gray-300">
              Yes! The Free plan is available forever with no time limit. You can upgrade to a paid plan whenever you need more features.
            </p>
          </div>
          <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
            <h4 class="text-lg font-medium text-gray-900 dark:text-white">
              How do I cancel my subscription?
            </h4>
            <p class="mt-2 text-gray-600 dark:text-gray-300">
              You can cancel your subscription at any time from your dashboard. Your subscription will remain active until the end of your current billing period.
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// Using font icons instead of Heroicons

// Plans configuration
const plans = {
  FREE: {
    name: 'Free',
    price: 0,
    features: [
      'Basic analytics',
      'Up to 1,000 page views',
      'Email support',
      'Basic dashboard'
    ]
  },
  STARTER: {
    name: 'Starter',
    price: 9.99,
    features: [
      'Advanced analytics',
      'Up to 10,000 page views',
      'Priority email support',
      'Custom dashboard',
      'Basic integrations'
    ]
  },
  PREMIUM: {
    name: 'Premium',
    price: 29.99,
    features: [
      'Full analytics suite',
      'Unlimited page views',
      'Priority support',
      'Custom integrations',
      'Advanced reporting',
      'API access'
    ]
  }
}

// Reactive state
const loading = ref(false)
const currentPlan = ref('FREE')

// Get current user's subscription
const { data: authData } = useAuth()

onMounted(async () => {
  if (authData.value?.token) {
    try {
      const response = await $fetch('/api/subscriptions/current', {
        headers: {
          Authorization: `Bearer ${authData.value.token}`
        }
      })
      currentPlan.value = response.subscription.tier
    } catch (error) {
      console.error('Failed to get current subscription:', error)
    }
  }
})

// Plan selection handler
const selectPlan = async (planId: string) => {
  if (planId === 'FREE') {
    // Free plan doesn't need checkout
    return
  }

  if (!authData.value?.token) {
    // Redirect to login
    await navigateTo('/auth/signin')
    return
  }

  loading.value = true

  try {
    const priceId = planId === 'STARTER' 
      ? process.env.STRIPE_STARTER_PRICE_ID || 'price_starter_monthly'
      : process.env.STRIPE_PREMIUM_PRICE_ID || 'price_premium_monthly'

    const response = await $fetch('/api/stripe/create-checkout-session', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${authData.value.token}`
      },
      body: {
        priceId,
        planId
      }
    })

    // Redirect to Stripe Checkout
    window.location.href = response.url

  } catch (error) {
    console.error('Failed to create checkout session:', error)
    // Show error message to user
  } finally {
    loading.value = false
  }
}

// SEO
useHead({
  title: 'Pricing - Vibe Starter',
  meta: [
    { name: 'description', content: 'Choose the right plan for your needs. Start free, then upgrade as you grow.' }
  ]
})
</script>