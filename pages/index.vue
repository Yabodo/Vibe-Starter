<template>
  <div class="text-center">
    <h1 class="text-4xl font-bold text-gray-800 dark:text-gray-100 mb-6 transition-colors duration-300">
      Welcome to MyApp
    </h1>
    
    <p class="text-xl text-gray-600 dark:text-gray-300 mb-8 transition-colors duration-300">
      Your comprehensive user and subscription management platform
    </p>
    
    <div v-if="!data?.user" class="space-x-4">
      <NuxtLink 
        to="/auth/signup"
        class="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg text-lg font-semibold"
      >
        Get Started
      </NuxtLink>
      
      <NuxtLink 
        to="/auth/signin"
        class="bg-gray-200 hover:bg-gray-300 text-gray-800 px-6 py-3 rounded-lg text-lg font-semibold"
      >
        Sign In
      </NuxtLink>
    </div>
    
    <div v-else>
      <NuxtLink 
        to="/dashboard"
        class="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg text-lg font-semibold"
      >
        Go to Dashboard
      </NuxtLink>
    </div>
    
    <div class="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
      <div class="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md transition-colors duration-300">
        <h3 class="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-100">User Management</h3>
        <p class="text-gray-600 dark:text-gray-300">Complete user authentication and profile management system</p>
      </div>
      
      <div class="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md transition-colors duration-300">
        <h3 class="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-100">Subscription Tiers</h3>
        <p class="text-gray-600 dark:text-gray-300">Premium and Donator plans with beautiful UI</p>
      </div>
      
      <div class="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md transition-colors duration-300">
        <h3 class="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-100">Secure & Scalable</h3>
        <p class="text-gray-600 dark:text-gray-300">Built with modern security practices and scalable architecture</p>
      </div>
    </div>
  </div>
</template>

<script setup>
const { data } = useAuth()

const checkAuthAndRedirect = () => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('auth-token')
    const userData = localStorage.getItem('user-data')
    
    if (token && userData) {
      navigateTo('/dashboard')
    }
  }
}

onMounted(() => {
  checkAuthAndRedirect()
})
</script>