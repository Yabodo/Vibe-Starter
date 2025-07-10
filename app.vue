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

onMounted(() => {
  initTheme()
})
</script>

<style>
.container {
  max-width: 1200px;
}
</style>
