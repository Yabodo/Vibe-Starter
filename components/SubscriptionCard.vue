<template>
  <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
    <div class="flex items-center justify-between">
      <div>
        <h3 class="text-lg font-medium text-gray-900 dark:text-white">
          {{ plan.name }} Plan
        </h3>
        <p class="text-sm text-gray-500 dark:text-gray-400">
          {{ subscription.status === 'active' ? 'Active' : 'Inactive' }}
        </p>
      </div>
      <div class="text-right">
        <p class="text-2xl font-bold text-gray-900 dark:text-white">
          ${{ plan.price }}
        </p>
        <p class="text-sm text-gray-500 dark:text-gray-400">
          /month
        </p>
      </div>
    </div>

    <div class="mt-6">
      <div class="flex items-center justify-between text-sm">
        <span class="text-gray-500 dark:text-gray-400">Status</span>
        <span :class="statusClass">
          {{ statusText }}
        </span>
      </div>
      
      <div v-if="subscription.currentPeriodEnd" class="flex items-center justify-between text-sm mt-2">
        <span class="text-gray-500 dark:text-gray-400">Next billing</span>
        <span class="text-gray-900 dark:text-white">
          {{ formatDate(subscription.currentPeriodEnd) }}
        </span>
      </div>
    </div>

    <div class="mt-6 flex space-x-3">
      <button
        v-if="subscription.tier !== 'FREE'"
        @click="openBillingPortal"
        :disabled="loading"
        class="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {{ loading ? 'Loading...' : 'Manage Billing' }}
      </button>
      
      <button
        v-if="subscription.tier === 'FREE'"
        @click="$emit('upgrade')"
        class="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium"
      >
        Upgrade Plan
      </button>
      
      <button
        v-if="subscription.tier !== 'FREE' && !subscription.cancelAtPeriodEnd"
        @click="$emit('cancel')"
        class="flex-1 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium"
      >
        Cancel
      </button>
      
      <button
        v-if="subscription.cancelAtPeriodEnd"
        @click="$emit('reactivate')"
        class="flex-1 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm font-medium"
      >
        Reactivate
      </button>
    </div>

    <div class="mt-6 border-t border-gray-200 dark:border-gray-700 pt-6">
      <h4 class="text-sm font-medium text-gray-900 dark:text-white mb-3">
        Plan Features
      </h4>
      <ul class="space-y-2">
        <li v-for="feature in plan.features" :key="feature" class="flex items-center text-sm">
          <span class="text-green-500 mr-2">✓</span>
          <span class="text-gray-600 dark:text-gray-300">{{ feature }}</span>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
// Using font icons instead of Heroicons

interface Subscription {
  id: string
  status: string
  tier: string
  cancelAtPeriodEnd: boolean
  currentPeriodEnd?: string
}

interface Plan {
  name: string
  price: number
  features: string[]
}

const props = defineProps<{
  subscription: Subscription
  plan: Plan
}>()

const emit = defineEmits<{
  upgrade: []
  cancel: []
  reactivate: []
}>()

const loading = ref(false)
const { data: authData } = useAuth()

const statusClass = computed(() => {
  if (props.subscription.cancelAtPeriodEnd) {
    return 'text-orange-600 dark:text-orange-400'
  }
  return props.subscription.status === 'active' 
    ? 'text-green-600 dark:text-green-400'
    : 'text-red-600 dark:text-red-400'
})

const statusText = computed(() => {
  if (props.subscription.cancelAtPeriodEnd) {
    return 'Canceling at period end'
  }
  return props.subscription.status === 'active' ? 'Active' : 'Inactive'
})

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

const openBillingPortal = async () => {
  if (!authData.value?.token) return
  
  loading.value = true
  
  try {
    const response = await $fetch('/api/stripe/create-portal-session', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${authData.value.token}`
      }
    })
    
    window.location.href = response.url
  } catch (error) {
    console.error('Failed to open billing portal:', error)
  } finally {
    loading.value = false
  }
}
</script>