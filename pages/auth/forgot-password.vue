<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8">
      <div>
        <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-gray-100">
          {{ t('auth.forgotPassword.title') }}
        </h2>
        <p class="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
          {{ t('auth.forgotPassword.subtitle') }}
        </p>
      </div>
      
      <form class="mt-8 space-y-6" @submit.prevent="handleSubmit">
        <div>
          <label for="email" class="sr-only">{{ t('auth.email') }}</label>
          <input
            id="email"
            v-model="email"
            name="email"
            type="email"
            autocomplete="email"
            required
            class="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-700 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
            :placeholder="t('auth.emailPlaceholder')"
          />
        </div>

        <div>
          <button
            type="submit"
            :disabled="loading"
            class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span v-if="loading" class="absolute left-0 inset-y-0 flex items-center pl-3">
              <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </span>
            {{ loading ? t('auth.forgotPassword.sending') : t('auth.forgotPassword.sendReset') }}
          </button>
        </div>

        <div v-if="message" class="text-center">
          <p :class="messageType === 'success' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'" class="text-sm">
            {{ message }}
          </p>
        </div>

        <div class="text-center">
          <NuxtLink 
            to="/auth/signin" 
            class="text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300 text-sm"
          >
            {{ t('auth.forgotPassword.backToSignIn') }}
          </NuxtLink>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
const { t } = useTranslation()

// Page meta
definePageMeta({
  layout: false,
  auth: false
})

// Data
const email = ref('')
const loading = ref(false)
const message = ref('')
const messageType = ref('error')

// Methods
async function handleSubmit() {
  if (!email.value) {
    message.value = t('auth.forgotPassword.emailRequired')
    messageType.value = 'error'
    return
  }

  loading.value = true
  message.value = ''

  try {
    const response = await $fetch('/api/auth/forgot-password', {
      method: 'POST',
      body: {
        email: email.value
      }
    })

    if (response.success) {
      message.value = response.message
      messageType.value = 'success'
      email.value = '' // Clear form
    }
  } catch (error) {
    message.value = error?.data?.statusMessage || t('auth.forgotPassword.error')
    messageType.value = 'error'
  } finally {
    loading.value = false
  }
}

// SEO
useHead({
  title: t('auth.forgotPassword.title'),
  meta: [
    { name: 'description', content: t('auth.forgotPassword.subtitle') }
  ]
})
</script>