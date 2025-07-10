<template>
  <div class="max-w-md mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 transition-colors duration-300">
    <h2 class="text-2xl font-bold text-center mb-6 text-gray-800 dark:text-gray-100">Sign In</h2>
    
    <form @submit.prevent="handleSignIn">
      <div class="mb-4">
        <label for="email" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Email
        </label>
        <input
          id="email"
          v-model="form.email"
          type="email"
          required
          :disabled="requires2FA"
          class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-colors duration-300 disabled:bg-gray-100 dark:disabled:bg-gray-600"
        />
      </div>
      
      <div class="mb-4">
        <label for="password" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Password
        </label>
        <input
          id="password"
          v-model="form.password"
          type="password"
          required
          :disabled="requires2FA"
          class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-colors duration-300 disabled:bg-gray-100 dark:disabled:bg-gray-600"
        />
      </div>
      
      <div v-if="requires2FA" class="mb-6">
        <label for="twoFactorToken" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          <span class="flex items-center">
            🔐 Two-Factor Authentication Code
            <button 
              type="button" 
              @click="showBackupCodeInput = !showBackupCodeInput"
              class="ml-2 text-xs text-blue-600 dark:text-blue-400 hover:underline"
            >
              {{ showBackupCodeInput ? 'Use authenticator app' : 'Use backup code' }}
            </button>
          </span>
        </label>
        <input
          id="twoFactorToken"
          v-model="form.twoFactorToken"
          type="text"
          required
          :maxlength="showBackupCodeInput ? 8 : 6"
          :pattern="showBackupCodeInput ? '[A-Fa-f0-9]{8}' : '[0-9]{6}'"
          :placeholder="showBackupCodeInput ? 'Enter backup code' : 'Enter 6-digit code'"
          class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-colors duration-300"
        />
        <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">
          {{ showBackupCodeInput ? 'Enter one of your backup codes' : 'Enter the code from your authenticator app' }}
        </p>
      </div>
      
      <div class="flex space-x-3">
        <button
          v-if="requires2FA"
          type="button"
          @click="resetForm"
          class="flex-1 bg-gray-200 hover:bg-gray-300 dark:bg-gray-600 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-100 py-2 px-4 rounded-md font-semibold transition-colors duration-300"
        >
          Back
        </button>
        <button
          type="submit"
          :disabled="loading"
          :class="requires2FA ? 'flex-1' : 'w-full'"
          class="bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 disabled:bg-gray-400 dark:disabled:bg-gray-600 text-white py-2 px-4 rounded-md font-semibold transition-colors duration-300"
        >
          {{ loading ? 'Verifying...' : requires2FA ? 'Verify & Sign In' : 'Sign In' }}
        </button>
      </div>
    </form>
    
    <div v-if="error" class="mt-4 p-3 bg-red-100 dark:bg-red-900/20 border border-red-400 dark:border-red-600 text-red-700 dark:text-red-300 rounded transition-colors duration-300">
      {{ error }}
    </div>
    
    <p class="text-center mt-4 text-gray-600 dark:text-gray-400">
      Don't have an account?
      <NuxtLink to="/auth/signup" class="text-blue-600 dark:text-blue-400 hover:underline">
        Sign up
      </NuxtLink>
    </p>
  </div>
</template>

<script setup>
const form = reactive({
  email: '',
  password: '',
  twoFactorToken: ''
})

const loading = ref(false)
const error = ref('')
const requires2FA = ref(false)
const showBackupCodeInput = ref(false)

const handleSignIn = async () => {
  loading.value = true
  error.value = ''
  
  try {
    const requestBody = {
      email: form.email,
      password: form.password
    }
    
    if (requires2FA.value && form.twoFactorToken) {
      requestBody.twoFactorToken = form.twoFactorToken
    }
    
    const response = await $fetch('/api/auth/login', {
      method: 'POST',
      body: requestBody
    })
    
    if (response.requires2FA) {
      requires2FA.value = true
      error.value = ''
      return
    }
    
    if (response.token) {
      localStorage.setItem('auth-token', response.token)
      localStorage.setItem('user-data', JSON.stringify(response.user))
      
      window.dispatchEvent(new Event('auth-changed'))
      
      await navigateTo('/dashboard')
    } else {
      error.value = 'Invalid email or password'
    }
  } catch (err) {
    error.value = err.data?.message || 'Invalid email or password'
  } finally {
    loading.value = false
  }
}

const resetForm = () => {
  requires2FA.value = false
  showBackupCodeInput.value = false
  form.twoFactorToken = ''
  error.value = ''
}

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