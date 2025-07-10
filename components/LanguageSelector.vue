<template>
  <div class="relative inline-block text-left">
    <div>
      <button
        @click="isOpen = !isOpen"
        type="button"
        class="inline-flex items-center px-3 py-2 border border-gray-300 dark:border-gray-600 shadow-sm text-sm font-medium rounded-md text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-gray-800"
        :aria-expanded="isOpen"
      >
        <span class="mr-2">{{ currentLocale.toUpperCase() }}</span>
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
        </svg>
      </button>
    </div>

    <div
      v-if="isOpen"
      class="origin-top-right absolute right-0 mt-2 w-24 rounded-md shadow-lg bg-white dark:bg-gray-700 ring-1 ring-black ring-opacity-5 focus:outline-none z-10"
    >
      <div class="py-1">
        <button
          v-for="locale in availableLocales"
          :key="locale.code"
          @click="changeLocale(locale.code)"
          class="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600"
          :class="{ 'bg-gray-100 dark:bg-gray-600': locale.code === currentLocale }"
        >
          {{ locale.name }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
const { locale, locales, setLocale } = useI18n()

const isOpen = ref(false)

const currentLocale = computed(() => locale.value)
const availableLocales = computed(() => locales.value)

const changeLocale = async (newLocale) => {
  await setLocale(newLocale)
  
  // Ensure the choice is persisted
  if (process.client) {
    document.cookie = `i18n_locale=${newLocale}; path=/; max-age=31536000; SameSite=Lax`
    localStorage.setItem('i18n_locale', newLocale)
  }
  
  isOpen.value = false
}

onMounted(() => {
  const handleClickOutside = (event) => {
    if (!event.target.closest('.relative')) {
      isOpen.value = false
    }
  }
  document.addEventListener('click', handleClickOutside)
  onUnmounted(() => {
    document.removeEventListener('click', handleClickOutside)
  })
})
</script>