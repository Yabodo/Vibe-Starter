<template>
  <div>
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-2 transition-colors duration-300">Dashboard</h1>
      <p class="text-gray-600 dark:text-gray-300 transition-colors duration-300">Manage your account and subscription</p>
    </div>
    
    <div v-if="!loading && user" class="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <!-- User Info Card -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 transition-colors duration-300">
        <h2 class="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-100">Account Information</h2>
        <div class="space-y-3">
          <div>
            <span class="text-sm font-medium text-gray-500 dark:text-gray-400">Name:</span>
            <p class="text-gray-800 dark:text-gray-100">{{ user.name || 'Not provided' }}</p>
          </div>
          <div>
            <span class="text-sm font-medium text-gray-500 dark:text-gray-400">Email:</span>
            <p class="text-gray-800 dark:text-gray-100">{{ user.email }}</p>
          </div>
          <div>
            <span class="text-sm font-medium text-gray-500 dark:text-gray-400">Role:</span>
            <span class="inline-block bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-1 rounded text-sm">
              {{ user.role }}
            </span>
          </div>
          <div>
            <span class="text-sm font-medium text-gray-500 dark:text-gray-400">Member since:</span>
            <p class="text-gray-800 dark:text-gray-100">{{ formatDate(user.createdAt) }}</p>
          </div>
        </div>
        
        <div class="mt-6">
          <NuxtLink 
            to="/profile"
            class="bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white px-4 py-2 rounded font-semibold transition-colors duration-300"
          >
            Edit Profile
          </NuxtLink>
        </div>
      </div>
      
      <!-- Subscription Card -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 transition-colors duration-300">
        <h2 class="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-100">Subscription</h2>
        <div v-if="subscription" class="space-y-3">
          <div>
            <span class="text-sm font-medium text-gray-500 dark:text-gray-400">Plan:</span>
            <span class="inline-block bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 px-2 py-1 rounded text-sm font-semibold">
              {{ subscription.tier }}
            </span>
          </div>
          <div>
            <span class="text-sm font-medium text-gray-500 dark:text-gray-400">Status:</span>
            <span 
              :class="getStatusClass(subscription.status)"
              class="inline-block px-2 py-1 rounded text-sm font-semibold"
            >
              {{ subscription.status }}
            </span>
          </div>
          <div v-if="subscription.endDate">
            <span class="text-sm font-medium text-gray-500 dark:text-gray-400">Expires:</span>
            <p class="text-gray-800 dark:text-gray-100">{{ formatDate(subscription.endDate) }}</p>
          </div>
        </div>
        
        <div class="mt-6 space-x-3">
          <NuxtLink 
            to="/subscription"
            class="bg-green-600 hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-600 text-white px-4 py-2 rounded font-semibold transition-colors duration-300"
          >
            Manage Subscription
          </NuxtLink>
        </div>
      </div>
    </div>
    
    <div v-if="loading" class="text-center py-8">
      <p class="text-gray-600 dark:text-gray-300">Loading...</p>
    </div>
    
    <div v-if="error" class="bg-red-100 dark:bg-red-900/20 border border-red-400 dark:border-red-600 text-red-700 dark:text-red-300 px-4 py-3 rounded transition-colors duration-300">
      {{ error }}
    </div>
  </div>
</template>

<script setup>
const user = ref(null)
const subscription = ref(null)
const loading = ref(true)
const error = ref('')

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString()
}

const getStatusClass = (status) => {
  switch (status) {
    case 'ACTIVE': return 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200'
    case 'CANCELLED': return 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200'
    case 'EXPIRED': return 'bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200'
    default: return 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200'
  }
}

const checkAuth = () => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('auth-token')
    const userData = localStorage.getItem('user-data')
    
    if (!token || !userData) {
      navigateTo('/auth/signin')
      return false
    }
    
    try {
      user.value = JSON.parse(userData)
      return true
    } catch {
      localStorage.removeItem('auth-token')
      localStorage.removeItem('user-data')
      navigateTo('/auth/signin')
      return false
    }
  }
  return false
}

const fetchUserData = async () => {
  if (!checkAuth()) return
  
  try {
    const token = localStorage.getItem('auth-token')

    const [userResponse, subscriptionResponse] = await Promise.all([
      $fetch('/api/users/profile', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }),
      $fetch('/api/subscriptions', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
    ])

    user.value = userResponse.user
    subscription.value = subscriptionResponse.subscription
  } catch (err) {
    if (err.status === 401) {
      localStorage.removeItem('auth-token')
      localStorage.removeItem('user-data')
      await navigateTo('/auth/signin')
    } else {
      error.value = 'Failed to load user data'
    }
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchUserData()
})
</script>