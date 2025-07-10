<template>
  <div class="max-w-md mx-auto mt-8 p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
    <h1 class="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-6">
      Create Admin User (Dev Only)
    </h1>
    
    <div v-if="result" class="mb-4 p-4 rounded-lg" 
         :class="result.success ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400' : 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'">
      <p class="font-semibold">{{ result.message }}</p>
      <div v-if="result.success && result.users" class="mt-2">
        <p class="text-sm font-medium">Test Users Created:</p>
        <div v-for="user in result.users" :key="user.email" class="mt-1 text-xs">
          <strong>{{ user.role }}:</strong> {{ user.email }} / {{ user.password }}
        </div>
      </div>
    </div>
    
    <button 
      @click="createAdminUser"
      :disabled="loading"
      class="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white py-2 px-4 rounded-md font-semibold transition-colors duration-200"
    >
      {{ loading ? 'Creating...' : 'Create Admin & Moderator Users' }}
    </button>
    
    <div class="mt-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
      <h3 class="font-semibold text-gray-800 dark:text-gray-100 mb-2">Instructions:</h3>
      <ol class="text-sm text-gray-600 dark:text-gray-300 space-y-1">
        <li>1. Click the button above to create test users</li>
        <li>2. Go to <NuxtLink to="/auth/signin" class="text-blue-600 hover:underline">/auth/signin</NuxtLink></li>
        <li>3. Login with: <code class="bg-gray-200 dark:bg-gray-600 px-1 rounded">admin@example.com</code> / <code class="bg-gray-200 dark:bg-gray-600 px-1 rounded">admin123</code></li>
        <li>4. You'll see admin links in the header</li>
        <li>5. Visit <NuxtLink to="/admin" class="text-blue-600 hover:underline">/admin</NuxtLink> to access admin dashboard</li>
      </ol>
    </div>
    
    <div class="mt-4 text-xs text-gray-500 dark:text-gray-400">
      <p>⚠️ This page only works in development mode with mock database</p>
    </div>
  </div>
</template>

<script setup>
const loading = ref(false)
const result = ref(null)

async function createAdminUser() {
  loading.value = true
  result.value = null
  
  try {
    const response = await $fetch('/api/dev/seed-admin', {
      method: 'POST'
    })
    
    result.value = response
  } catch (error) {
    result.value = {
      success: false,
      message: error.data?.message || 'Failed to create admin user'
    }
  } finally {
    loading.value = false
  }
}
</script>