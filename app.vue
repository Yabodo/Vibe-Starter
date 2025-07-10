<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
    <NuxtRouteAnnouncer />
    <AppHeader />
    <main class="container mx-auto px-4 py-8">
      <NuxtPage />
    </main>
  </div>
</template>

<script setup>
const { initTheme } = useTheme()

// Global error handling for better production debugging
useHead({
  titleTemplate: '%s - Vibe Starter',
  meta: [
    { name: 'description', content: 'Vibe Starter - Modern user management and subscription boilerplate built with Nuxt 3, Prisma, and TypeScript' },
    { name: 'viewport', content: 'width=device-width, initial-scale=1' }
  ]
})

onMounted(() => {
  initTheme()
  
  // Handle global errors in production
  if (process.client) {
    window.addEventListener('error', (event) => {
      console.error('Global error:', event.error)
    })
    
    window.addEventListener('unhandledrejection', (event) => {
      console.error('Unhandled promise rejection:', event.reason)
    })
  }
})
</script>

<style>
.container {
  max-width: 1200px;
}
</style>
