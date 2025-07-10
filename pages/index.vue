<template>
  <div class="text-center">
    <h1 class="text-4xl font-bold text-gray-800 dark:text-gray-100 mb-6 transition-colors duration-300">
      {{ $t('home.title') }}
    </h1>
    
    <p class="text-xl text-gray-600 dark:text-gray-300 mb-8 transition-colors duration-300">
      {{ $t('home.subtitle') }}
    </p>
    
    <div v-if="!data?.user" class="space-x-4">
      <NuxtLink 
        to="/auth/signup"
        class="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg text-lg font-semibold"
      >
        {{ $t('home.getStarted') }}
      </NuxtLink>
      
      <NuxtLink 
        to="/auth/signin"
        class="bg-gray-200 hover:bg-gray-300 text-gray-800 px-6 py-3 rounded-lg text-lg font-semibold"
      >
        {{ $t('nav.signin') }}
      </NuxtLink>
    </div>
    
    <div v-else>
      <NuxtLink 
        to="/dashboard"
        class="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg text-lg font-semibold"
      >
        {{ $t('home.goDashboard') }}
      </NuxtLink>
    </div>
    
    <div class="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
      <div class="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md transition-colors duration-300">
        <h3 class="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-100">{{ $t('home.features.userManagement.title') }}</h3>
        <p class="text-gray-600 dark:text-gray-300">{{ $t('home.features.userManagement.description') }}</p>
      </div>
      
      <div class="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md transition-colors duration-300">
        <h3 class="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-100">{{ $t('home.features.subscriptionTiers.title') }}</h3>
        <p class="text-gray-600 dark:text-gray-300">{{ $t('home.features.subscriptionTiers.description') }}</p>
      </div>
      
      <div class="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md transition-colors duration-300">
        <h3 class="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-100">{{ $t('home.features.secureScalable.title') }}</h3>
        <p class="text-gray-600 dark:text-gray-300">{{ $t('home.features.secureScalable.description') }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
const { data } = useAuth()
const { t: $t } = useTranslation()

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