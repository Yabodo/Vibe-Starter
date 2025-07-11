<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8">
      <!-- Loading state -->
      <div v-if="verifying" class="text-center">
        <div class="mx-auto w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
          <svg class="animate-spin w-8 h-8 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        </div>
        <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-gray-100">
          {{ t('auth.verifyEmail.verifying') }}
        </h2>
        <p class="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
          {{ t('auth.verifyEmail.pleaseWait') }}
        </p>
      </div>

      <!-- Success state -->
      <div v-else-if="verified" class="text-center space-y-4">
        <div class="mx-auto w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
          <svg class="w-8 h-8 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
          </svg>
        </div>
        <h2 class="text-center text-3xl font-extrabold text-gray-900 dark:text-gray-100">
          {{ t('auth.verifyEmail.success') }}
        </h2>
        <p class="text-center text-sm text-gray-600 dark:text-gray-400">
          {{ t('auth.verifyEmail.successMessage') }}
        </p>
        <NuxtLink 
          to="/auth/signin" 
          class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          {{ t('auth.verifyEmail.goToSignIn') }}
        </NuxtLink>
      </div>

      <!-- Error state -->
      <div v-else class="text-center space-y-4">
        <div class="mx-auto w-16 h-16 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center">
          <svg class="w-8 h-8 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </div>
        <h2 class="text-center text-3xl font-extrabold text-gray-900 dark:text-gray-100">
          {{ t('auth.verifyEmail.failed') }}
        </h2>
        <p class="text-center text-sm text-gray-600 dark:text-gray-400">
          {{ errorMessage }}
        </p>
        <div class="space-y-2">
          <button
            @click="resendVerification"
            :disabled="resending"
            class="w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {{ resending ? t('auth.verifyEmail.resending') : t('auth.verifyEmail.resendVerification') }}
          </button>
          <NuxtLink 
            to="/auth/signin" 
            class="text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300 text-sm"
          >
            {{ t('auth.verifyEmail.backToSignIn') }}
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const { t } = useTranslation()
const route = useRoute()

// Page meta
definePageMeta({
  layout: false,
  auth: false
})

// Data
const verifying = ref(true)
const verified = ref(false)
const errorMessage = ref('')
const resending = ref(false)

// Get token from URL
const token = route.query.token

// Verify email on mount
onMounted(async () => {
  if (!token) {
    verifying.value = false
    errorMessage.value = t('auth.verifyEmail.invalidToken')
    return
  }

  try {
    const response = await $fetch('/api/auth/verify-email', {
      method: 'POST',
      body: { token }
    })

    if (response.success) {
      verified.value = true
    }
  } catch (error) {
    errorMessage.value = error?.data?.statusMessage || t('auth.verifyEmail.error')
  } finally {
    verifying.value = false
  }
})

// Resend verification
async function resendVerification() {
  // We'd need the email for this, which we don't have from the token
  // For now, redirect to a page where they can enter their email
  await navigateTo('/auth/resend-verification')
}

// SEO
useHead({
  title: t('auth.verifyEmail.title'),
  meta: [
    { name: 'description', content: t('auth.verifyEmail.subtitle') }
  ]
})
</script>