<template>
  <div class="max-w-md mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 transition-colors duration-300">
    <h2 class="text-2xl font-bold text-center mb-6 text-gray-800 dark:text-gray-100">Sign Up</h2>
    
    <form @submit.prevent="handleSignUp">
      <div class="mb-4">
        <label for="name" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Name (Optional)
        </label>
        <input
          id="name"
          v-model="form.name"
          type="text"
          class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-colors duration-300"
        >
      </div>
      
      <div class="mb-4">
        <label for="email" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Email
        </label>
        <input
          id="email"
          v-model="form.email"
          type="email"
          required
          class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-colors duration-300"
        >
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
          minlength="6"
          class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-colors duration-300"
        >
      </div>
      
      <div class="mb-6">
        <label for="confirmPassword" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Confirm Password
        </label>
        <input
          id="confirmPassword"
          v-model="form.confirmPassword"
          type="password"
          required
          class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-colors duration-300"
        >
      </div>
      
      <button
        type="submit"
        :disabled="loading || !isFormValid"
        class="w-full bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 disabled:bg-gray-400 dark:disabled:bg-gray-600 text-white py-2 px-4 rounded-md font-semibold transition-colors duration-300"
      >
        {{ loading ? 'Creating Account...' : 'Sign Up' }}
      </button>
    </form>
    
    <div v-if="error" class="mt-4 p-3 bg-red-100 dark:bg-red-900/20 border border-red-400 dark:border-red-600 text-red-700 dark:text-red-300 rounded transition-colors duration-300">
      {{ error }}
    </div>
    
    <div v-if="success" class="mt-4 p-3 bg-green-100 dark:bg-green-900/20 border border-green-400 dark:border-green-600 text-green-700 dark:text-green-300 rounded transition-colors duration-300">
      {{ success }}
    </div>
    
    <p class="text-center mt-4 text-gray-600 dark:text-gray-400">
      Already have an account?
      <NuxtLink to="/auth/signin" class="text-blue-600 dark:text-blue-400 hover:underline">
        Sign in
      </NuxtLink>
    </p>
  </div>
</template>

<script setup>
const form = reactive({
  name: '',
  email: '',
  password: '',
  confirmPassword: ''
})

const loading = ref(false)
const error = ref('')
const success = ref('')

const isFormValid = computed(() => {
  return form.email && 
         form.password && 
         form.confirmPassword && 
         form.password === form.confirmPassword &&
         form.password.length >= 6
})

const handleSignUp = async () => {
  if (form.password !== form.confirmPassword) {
    error.value = 'Passwords do not match'
    return
  }
  
  loading.value = true
  error.value = ''
  success.value = ''
  
  try {
    const { data } = await $fetch('/api/users/register', {
      method: 'POST',
      body: {
        email: form.email,
        password: form.password,
        name: form.name || null
      }
    })
    
    success.value = 'Account created successfully! Redirecting to sign in...'
    
    setTimeout(() => {
      navigateTo('/auth/signin')
    }, 2000)
    
  } catch (err) {
    error.value = err.data?.message || 'An error occurred. Please try again.'
  } finally {
    loading.value = false
  }
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