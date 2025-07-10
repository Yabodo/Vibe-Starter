<template>
  <div>
    <div class="mb-8 text-center">
      <h1 class="text-4xl font-bold text-gray-800 dark:text-gray-100 mb-4 transition-colors duration-300">Choose Your Plan</h1>
      <p class="text-xl text-gray-600 dark:text-gray-300 mb-2 transition-colors duration-300">Unlock premium features or support our mission</p>
      <p class="text-gray-500 dark:text-gray-400 transition-colors duration-300">No hidden fees • Cancel anytime • 30-day money back guarantee</p>
    </div>
    
    <div v-if="currentSubscription" class="mb-8 text-center">
      <div class="inline-flex items-center px-6 py-3 rounded-full text-sm font-semibold" :class="getCurrentPlanClass()">
        <span class="mr-2">✨</span>
        Currently on {{ currentSubscription.tier }} plan
        <span class="ml-2">✨</span>
      </div>
    </div>
    
    <div class="max-w-5xl mx-auto">
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
        <!-- Premium Plan -->
        <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 border-2 border-blue-200 dark:border-blue-700 relative transform hover:scale-105 transition-all duration-300">
          <div class="absolute -top-4 left-1/2 transform -translate-x-1/2">
            <span class="bg-blue-600 text-white text-sm font-bold px-4 py-2 rounded-full shadow-lg">
              🚀 MOST POPULAR
            </span>
          </div>
          
          <div class="text-center mb-6 pt-4">
            <h3 class="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-2 transition-colors duration-300">Premium</h3>
            <div class="flex items-center justify-center mb-4">
              <span class="text-5xl font-bold text-blue-600 dark:text-blue-400">$4.99</span>
              <span class="text-gray-500 dark:text-gray-400 ml-2">/month</span>
            </div>
            <p class="text-gray-600 dark:text-gray-300 text-lg">Full access to everything we offer</p>
          </div>
          
          <div class="space-y-4 mb-8">
            <div class="flex items-center">
              <span class="text-blue-600 text-xl mr-3">✓</span>
              <span class="text-gray-700 dark:text-gray-300 font-medium">Complete access to all features</span>
            </div>
            <div class="flex items-center">
              <span class="text-blue-600 text-xl mr-3">✓</span>
              <span class="text-gray-700 dark:text-gray-300 font-medium">Priority customer support</span>
            </div>
            <div class="flex items-center">
              <span class="text-blue-600 text-xl mr-3">✓</span>
              <span class="text-gray-700 dark:text-gray-300 font-medium">Advanced analytics & insights</span>
            </div>
            <div class="flex items-center">
              <span class="text-blue-600 text-xl mr-3">✓</span>
              <span class="text-gray-700 dark:text-gray-300 font-medium">API access & integrations</span>
            </div>
            <div class="flex items-center">
              <span class="text-blue-600 text-xl mr-3">✓</span>
              <span class="text-gray-700 dark:text-gray-300 font-medium">Early access to new features</span>
            </div>
          </div>
          
          <button
            v-if="currentSubscription?.tier !== 'PREMIUM'"
            @click="upgradePlan('PREMIUM')"
            :disabled="loading"
            class="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 px-6 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all duration-300"
          >
            {{ loading ? 'Processing...' : 'Get Premium' }}
          </button>
          <div v-else class="w-full bg-gray-100 text-gray-600 py-4 px-6 rounded-xl font-bold text-lg text-center border-2 border-gray-200">
            ✅ Your Current Plan
          </div>
        </div>
        
        <!-- Donator Plan -->
        <div class="bg-gradient-to-br from-purple-50 via-pink-50 to-yellow-50 dark:from-purple-900/20 dark:via-pink-900/20 dark:to-yellow-900/20 rounded-2xl shadow-2xl p-8 border-4 border-transparent bg-clip-padding relative transform hover:scale-105 transition-all duration-300 overflow-hidden">
          <!-- Beautiful background pattern -->
          <div class="absolute inset-0 bg-gradient-to-br from-purple-400/10 via-pink-400/10 to-yellow-400/10 dark:from-purple-300/5 dark:via-pink-300/5 dark:to-yellow-300/5"></div>
          <div class="absolute -top-10 -right-10 w-40 h-40 bg-gradient-to-br from-purple-300/20 to-pink-300/20 dark:from-purple-400/10 dark:to-pink-400/10 rounded-full blur-xl"></div>
          <div class="absolute -bottom-10 -left-10 w-32 h-32 bg-gradient-to-br from-yellow-300/20 to-orange-300/20 dark:from-yellow-400/10 dark:to-orange-400/10 rounded-full blur-xl"></div>
          
          <div class="relative z-10">
            <div class="absolute -top-4 left-1/2 transform -translate-x-1/2">
              <SparkleEffect :count="6" :colors="['#ffd700', '#ff69b4', '#9370db', '#ffa500', '#fff']">
                <span class="bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-400 dark:to-pink-400 text-white dark:text-gray-100 text-sm font-bold px-4 py-2 rounded-full shadow-lg">
                  💝 CHARITY HERO
                </span>
              </SparkleEffect>
            </div>
            
            <div class="text-center mb-6 pt-4">
              <h3 class="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-400 dark:to-pink-400 bg-clip-text text-transparent mb-2">
                Donator
              </h3>
              <div class="flex items-center justify-center mb-4">
                <span class="text-5xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-400 dark:to-pink-400 bg-clip-text text-transparent">$19.99</span>
                <span class="text-gray-600 dark:text-gray-300 ml-2">/month</span>
              </div>
              <p class="text-gray-700 dark:text-gray-300 text-lg font-medium">Support our mission + Premium access</p>
            </div>
            
            <div class="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-xl p-6 mb-6 border border-purple-200/50 dark:border-purple-600/30">
              <div class="text-center mb-4">
                <span class="text-2xl">💖</span>
                <h4 class="text-lg font-bold text-purple-800 dark:text-purple-300 mt-2">You're Making a Difference!</h4>
                <p class="text-purple-700 dark:text-purple-400 text-sm mt-1">Your donation helps us continue building amazing features for everyone</p>
              </div>
            </div>
            
            <div class="space-y-3 mb-8">
              <div class="flex items-center">
                <span class="text-purple-600 dark:text-purple-400 text-xl mr-3">✨</span>
                <span class="text-gray-700 dark:text-gray-300 font-medium">Everything in Premium</span>
              </div>
              <div class="flex items-center">
                <span class="text-pink-600 dark:text-pink-400 text-xl mr-3">💝</span>
                <span class="text-gray-700 dark:text-gray-300 font-medium">Special "Donator" badge & recognition</span>
              </div>
              <div class="flex items-center">
                <span class="text-purple-600 dark:text-purple-400 text-xl mr-3">🎁</span>
                <span class="text-gray-700 dark:text-gray-300 font-medium">Special thanks in our credits</span>
              </div>
              <div class="flex items-center">
                <span class="text-pink-600 dark:text-pink-400 text-xl mr-3">💌</span>
                <span class="text-gray-700 dark:text-gray-300 font-medium">Direct line to our development team</span>
              </div>
            </div>
            
            <button
              v-if="currentSubscription?.tier !== 'DONATOR'"
              @click="upgradePlan('DONATOR')"
              :disabled="loading"
              class="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 dark:from-purple-500 dark:to-pink-500 dark:hover:from-purple-600 dark:hover:to-pink-600 text-white py-4 px-6 rounded-xl font-bold text-lg shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1"
            >
              {{ loading ? 'Processing...' : '💝 Become a Donator' }}
            </button>
            <div v-else class="w-full bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-800/50 dark:to-pink-800/50 text-purple-800 dark:text-purple-200 py-4 px-6 rounded-xl font-bold text-lg text-center border-2 border-purple-200 dark:border-purple-600/50">
              💖 Thank you for your support!
            </div>
          </div>
        </div>
      </div>
      
      <!-- No Subscription Option -->
      <div v-if="!currentSubscription" class="text-center bg-gray-50 dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 transition-colors duration-300">
        <h3 class="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">Not ready to subscribe?</h3>
        <p class="text-gray-600 dark:text-gray-400 mb-4">You can still use our basic features for free. Upgrade anytime to unlock premium functionality.</p>
        <span class="inline-flex items-center px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg font-medium">
          <span class="mr-2">🆓</span>
          Currently using free features
        </span>
      </div>
    </div>
    
    <div v-if="currentSubscription" class="mt-12 bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700 transition-colors duration-300">
      <h3 class="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-100">Subscription Management</h3>
      <p class="text-gray-600 dark:text-gray-400 mb-4">
        You can cancel your subscription at any time. You'll continue to have access until the end of your billing period.
      </p>
      <button
        @click="cancelSubscription"
        :disabled="loading"
        class="bg-red-600 hover:bg-red-700 text-white py-2 px-6 rounded-lg font-semibold transition-colors duration-200"
      >
        {{ loading ? 'Processing...' : 'Cancel Subscription' }}
      </button>
    </div>
    
    <div v-if="message" class="fixed bottom-6 right-6 p-4 rounded-lg shadow-lg max-w-md" :class="messageClass">
      {{ message }}
    </div>
  </div>
</template>

<script setup>

const currentSubscription = ref(null)
const loading = ref(false)
const message = ref('')
const messageType = ref('')

const messageClass = computed(() => {
  switch (messageType.value) {
    case 'success': return 'bg-green-500 text-white'
    case 'error': return 'bg-red-500 text-white'
    default: return 'bg-blue-500 text-white'
  }
})

const getCurrentPlanClass = () => {
  if (!currentSubscription.value) return ''
  
  switch (currentSubscription.value.tier) {
    case 'PREMIUM':
      return 'bg-blue-100 text-blue-800 border border-blue-300'
    case 'DONATOR':
      return 'bg-gradient-to-r from-purple-100 to-pink-100 text-purple-800 border border-purple-300'
    default:
      return 'bg-gray-100 text-gray-800 border border-gray-300'
  }
}

const upgradePlan = async (tier) => {
  await updateSubscription(tier, tier === 'DONATOR' ? 'donate' : 'upgrade')
}

const updateSubscription = async (tier, action) => {
  loading.value = true
  message.value = ''
  
  try {
    const token = await getToken()
    const response = await $fetch('/api/subscriptions/upgrade', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: { tier }
    })
    
    currentSubscription.value = response.subscription
    
    // Trigger subscription changed event for navbar
    window.dispatchEvent(new Event('subscription-changed'))
    
    if (action === 'donate') {
      message.value = `🎉 Thank you for becoming a Donator! Your support means the world to us! 💝`
    } else {
      message.value = `Successfully ${action}d to ${tier} plan!`
    }
    messageType.value = 'success'
  } catch (err) {
    message.value = err.data?.message || `Failed to ${action} subscription`
    messageType.value = 'error'
  } finally {
    loading.value = false
  }
}

const cancelSubscription = async () => {
  if (!confirm('Are you sure you want to cancel your subscription?')) {
    return
  }
  
  loading.value = true
  message.value = ''
  
  try {
    const token = await getToken()
    const response = await $fetch('/api/subscriptions/cancel', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    
    currentSubscription.value = response.subscription
    
    // Trigger subscription changed event for navbar
    window.dispatchEvent(new Event('subscription-changed'))
    
    message.value = 'Subscription cancelled successfully'
    messageType.value = 'success'
  } catch (err) {
    message.value = err.data?.message || 'Failed to cancel subscription'
    messageType.value = 'error'
  } finally {
    loading.value = false
  }
}

const checkAuth = () => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('auth-token')
    if (!token) {
      navigateTo('/auth/signin')
      return false
    }
    return true
  }
  return false
}

const fetchSubscription = async () => {
  if (!checkAuth()) return
  
  try {
    const token = localStorage.getItem('auth-token')
    const response = await $fetch('/api/subscriptions', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    currentSubscription.value = response.subscription
  } catch (err) {
    if (err.status === 401) {
      localStorage.removeItem('auth-token')
      localStorage.removeItem('user-data')
      await navigateTo('/auth/signin')
    } else {
      console.error('Failed to fetch subscription:', err)
    }
  }
}

async function getToken() {
  return localStorage.getItem('auth-token')
}

onMounted(() => {
  fetchSubscription()
})
</script>