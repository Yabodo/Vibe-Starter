<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <div class="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900 dark:text-white">
          Subscription Management
        </h1>
        <p class="mt-2 text-gray-600 dark:text-gray-300">
          Manage your subscription, billing, and payment history
        </p>
      </div>

      <div v-if="loading" class="text-center py-8">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <p class="mt-4 text-gray-600 dark:text-gray-300">Loading subscription details...</p>
      </div>

      <div v-else-if="error" class="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
        <p class="text-red-800 dark:text-red-200">{{ error }}</p>
      </div>

      <div v-else class="space-y-8">
        <!-- Subscription Card -->
        <SubscriptionCard
          :subscription="subscriptionData.subscription"
          :plan="subscriptionData.plan"
          @upgrade="handleUpgrade"
          @cancel="handleCancel"
          @reactivate="handleReactivate"
        />

        <!-- Payment History -->
        <PaymentHistory :payments="subscriptionData.recentPayments" />

        <!-- Usage/Limits (if applicable) -->
        <div v-if="subscriptionData.plan.limits" class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4">
            Plan Limits
          </h3>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div class="text-center">
              <div class="text-2xl font-bold text-blue-600 dark:text-blue-400">
                {{ subscriptionData.plan.limits.pageViews === -1 ? '∞' : subscriptionData.plan.limits.pageViews.toLocaleString() }}
              </div>
              <div class="text-sm text-gray-500 dark:text-gray-400">Page Views</div>
            </div>
            <div class="text-center">
              <div class="text-2xl font-bold text-blue-600 dark:text-blue-400">
                {{ subscriptionData.plan.limits.users === -1 ? '∞' : subscriptionData.plan.limits.users }}
              </div>
              <div class="text-sm text-gray-500 dark:text-gray-400">Users</div>
            </div>
            <div class="text-center">
              <div class="text-2xl font-bold text-blue-600 dark:text-blue-400">
                {{ subscriptionData.plan.limits.exports === -1 ? '∞' : subscriptionData.plan.limits.exports }}
              </div>
              <div class="text-sm text-gray-500 dark:text-gray-400">Exports</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Cancel Confirmation Modal -->
    <div v-if="showCancelModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4">
        <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4">
          Cancel Subscription
        </h3>
        <p class="text-gray-600 dark:text-gray-300 mb-6">
          Are you sure you want to cancel your subscription? You'll continue to have access until the end of your current billing period.
        </p>
        <div class="flex space-x-3">
          <button
            @click="confirmCancel"
            :disabled="cancelLoading"
            class="flex-1 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md font-medium disabled:opacity-50"
          >
            {{ cancelLoading ? 'Canceling...' : 'Cancel Subscription' }}
          </button>
          <button
            @click="showCancelModal = false"
            class="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded-md font-medium"
          >
            Keep Subscription
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const subscriptionData = ref(null)
const loading = ref(true)
const error = ref('')
const showCancelModal = ref(false)
const cancelLoading = ref(false)

// Check authentication manually
const checkAuth = () => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('auth-token')
    if (!token) {
      navigateTo('/auth/signin')
      return null
    }
    return token
  }
  return null
}

const fetchSubscriptionData = async () => {
  const token = checkAuth()
  if (!token) return

  try {
    const response = await $fetch('/api/subscriptions/current', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    subscriptionData.value = response
  } catch (err) {
    console.error('Failed to fetch subscription:', err)
    error.value = 'Failed to load subscription data'
  } finally {
    loading.value = false
  }
}

const handleUpgrade = () => {
  navigateTo('/pricing')
}

const handleCancel = () => {
  showCancelModal.value = true
}

const handleReactivate = async () => {
  const token = checkAuth()
  if (!token) return

  try {
    const response = await $fetch('/api/stripe/create-portal-session', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    
    window.location.href = response.url
  } catch (err) {
    console.error('Failed to create portal session:', err)
  }
}

const confirmCancel = async () => {
  const token = checkAuth()
  if (!token) return

  cancelLoading.value = true

  try {
    await $fetch('/api/subscriptions/cancel', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`
      },
      body: {
        cancelAtPeriodEnd: true
      }
    })

    // Refresh subscription data
    await fetchSubscriptionData()
    showCancelModal.value = false
  } catch (err) {
    console.error('Failed to cancel subscription:', err)
    error.value = 'Failed to cancel subscription'
  } finally {
    cancelLoading.value = false
  }
}

onMounted(() => {
  fetchSubscriptionData()
})

// SEO
useHead({
  title: 'Subscription Management - Vibe Starter',
  meta: [
    { name: 'description', content: 'Manage your subscription, billing, and payment history' }
  ]
})
</script>