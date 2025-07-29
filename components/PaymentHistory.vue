<template>
  <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
    <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-6">
      Payment History
    </h3>
    
    <div v-if="payments.length === 0" class="text-center py-8">
      <div class="text-6xl text-gray-400 mb-4">💳</div>
      <p class="mt-4 text-sm text-gray-500 dark:text-gray-400">
        No payment history yet
      </p>
    </div>
    
    <div v-else class="space-y-4">
      <div
        v-for="payment in payments"
        :key="payment.id"
        class="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg"
      >
        <div class="flex items-center space-x-3">
          <div class="flex-shrink-0 text-lg">
            <span v-if="payment.status === 'succeeded'" class="text-green-500">✅</span>
            <span v-else-if="payment.status === 'failed'" class="text-red-500">❌</span>
            <span v-else class="text-yellow-500">⏳</span>
          </div>
          
          <div>
            <p class="text-sm font-medium text-gray-900 dark:text-white">
              {{ payment.description || 'Subscription Payment' }}
            </p>
            <p class="text-xs text-gray-500 dark:text-gray-400">
              {{ formatDate(payment.createdAt) }}
            </p>
          </div>
        </div>
        
        <div class="text-right">
          <p class="text-sm font-medium text-gray-900 dark:text-white">
            {{ formatCurrency(payment.amount, payment.currency) }}
          </p>
          <p class="text-xs" :class="getStatusClass(payment.status)">
            {{ payment.status }}
          </p>
        </div>
      </div>
      
      <div class="text-center pt-4">
        <p class="text-sm text-gray-500 dark:text-gray-400">
          Showing last 5 payments
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// Using font icons instead of Heroicons

interface Payment {
  id: string
  amount: number
  currency: string
  status: string
  description?: string
  createdAt: string
}

const props = defineProps<{
  payments: Payment[]
}>()

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

const formatCurrency = (amount: number, currency: string) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency.toUpperCase()
  }).format(amount)
}

const getStatusClass = (status: string) => {
  switch (status) {
    case 'succeeded':
      return 'text-green-600 dark:text-green-400'
    case 'failed':
      return 'text-red-600 dark:text-red-400'
    default:
      return 'text-yellow-600 dark:text-yellow-400'
  }
}
</script>