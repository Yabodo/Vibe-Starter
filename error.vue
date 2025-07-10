<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center px-4">
    <div class="max-w-md w-full text-center">
      <div class="mb-8">
        <h1 class="text-6xl font-bold text-gray-800 dark:text-gray-100 mb-4">
          {{ error.statusCode || 500 }}
        </h1>
        <h2 class="text-2xl font-semibold text-gray-600 dark:text-gray-300 mb-2">
          {{ getErrorTitle() }}
        </h2>
        <p class="text-gray-500 dark:text-gray-400 mb-8">
          {{ getErrorMessage() }}
        </p>
      </div>
      
      <div class="space-y-4">
        <button
          @click="handleError"
          class="w-full bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors duration-200"
        >
          Try Again
        </button>
        
        <NuxtLink
          to="/"
          class="block w-full bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-100 px-6 py-3 rounded-lg font-semibold transition-colors duration-200"
        >
          Go Home
        </NuxtLink>
      </div>
      
      <!-- Development error details -->
      <div v-if="isDevelopment && error.message" class="mt-8 p-4 bg-red-100 dark:bg-red-900/20 border border-red-300 dark:border-red-700 rounded-lg text-left">
        <h3 class="font-semibold text-red-800 dark:text-red-200 mb-2">Error Details (Development)</h3>
        <p class="text-sm text-red-600 dark:text-red-400 font-mono">{{ error.message }}</p>
        <pre v-if="error.stack" class="mt-2 text-xs text-red-500 dark:text-red-400 overflow-auto">{{ error.stack }}</pre>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  error: Object
})

const isDevelopment = process.dev

const getErrorTitle = () => {
  switch (props.error?.statusCode) {
    case 404:
      return 'Page Not Found'
    case 401:
      return 'Unauthorized'
    case 403:
      return 'Forbidden'
    case 500:
      return 'Server Error'
    default:
      return 'Something went wrong'
  }
}

const getErrorMessage = () => {
  switch (props.error?.statusCode) {
    case 404:
      return 'The page you are looking for could not be found.'
    case 401:
      return 'You need to sign in to access this page.'
    case 403:
      return 'You do not have permission to access this page.'
    case 500:
      return 'An internal server error occurred. Please try again later.'
    default:
      return 'An unexpected error occurred. Please try again.'
  }
}

const handleError = async () => {
  await clearError({ redirect: '/' })
}

// Set page title
useHead({
  title: `Error ${props.error?.statusCode || 500}`
})
</script>