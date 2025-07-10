<template>
  <header class="bg-blue-600 dark:bg-blue-800 text-white shadow-lg transition-colors duration-300">
    <div class="container mx-auto px-4 py-4 flex justify-between items-center">
      <div class="flex items-center">
        <h1 class="text-xl font-bold">
          <NuxtLink :to="user ? '/dashboard' : '/'" class="hover:text-blue-200">
            Vibe Starter
          </NuxtLink>
        </h1>
      </div>
      
      <nav class="flex items-center space-x-4">
        <ThemeToggle />
        <LanguageSelector v-if="i18nEnabled" />
        <template v-if="user">
          <!-- Admin/Moderator Links -->
          <div v-if="canAccessAdminPanel(user.role)" class="flex items-center space-x-2">
            <NuxtLink 
              to="/admin"
              class="px-3 py-1 bg-red-600 hover:bg-red-700 text-white text-xs rounded-full font-bold transition-colors duration-200"
            >
              🛡️ {{ $t('nav.admin') }}
            </NuxtLink>
          </div>
          <div v-else-if="canAccessModeratorPanel(user.role)" class="flex items-center space-x-2">
            <NuxtLink 
              to="/moderator"
              class="px-3 py-1 bg-yellow-600 hover:bg-yellow-700 text-white text-xs rounded-full font-bold transition-colors duration-200"
            >
              🛡️ {{ $t('nav.moderator') }}
            </NuxtLink>
          </div>
          
          <div class="flex items-center space-x-3">
            <NuxtLink to="/profile" class="hover:text-blue-200">
              <div class="w-8 h-8 rounded-full overflow-hidden bg-blue-100 flex items-center justify-center">
                <img 
                  v-if="user.profileImage" 
                  :src="user.profileImage" 
                  :alt="user.name || 'Profile'"
                  class="w-full h-full object-cover"
                >
                <span v-else class="text-xs font-bold text-blue-600">
                  {{ getInitials(user.name || user.email) }}
                </span>
              </div>
            </NuxtLink>
            <div class="flex items-center">
              <span class="text-sm">Welcome, {{ user.name || user.email }}</span>
              <div v-if="getDonatorStatus()" class="sparkle-wrapper">
                <span class="ml-2 px-2 py-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs rounded-full font-bold">
                  💝 DONATOR
                </span>
                <span class="sparkle-emoji sparkle-1">✨</span>
                <span class="sparkle-emoji sparkle-2">⭐</span>
                <span class="sparkle-emoji sparkle-3">💫</span>
                <span class="sparkle-emoji sparkle-4">🌟</span>
              </div>
              <span v-else-if="getPremiumStatus()" class="ml-2 px-2 py-1 bg-blue-500 text-white text-xs rounded-full font-bold">
                ⭐ PREMIUM
              </span>
            </div>
          </div>
        </template>
        <template v-else>
          <NuxtLink to="/auth/signin" class="hover:text-blue-200">
            {{ $t('nav.signin') }}
          </NuxtLink>
          <NuxtLink to="/auth/signup" class="bg-blue-700 hover:bg-blue-800 px-3 py-1 rounded">
            {{ $t('nav.signup') }}
          </NuxtLink>
        </template>
      </nav>
    </div>
  </header>
</template>

<script setup>
const user = ref(null)
const runtimeConfig = useRuntimeConfig()
const i18nEnabled = runtimeConfig.public.i18nEnabled !== false
const { t: $t } = useTranslation()

const checkAuth = () => {
  if (typeof window !== 'undefined') {
    const userData = localStorage.getItem('user-data')
    if (userData) {
      try {
        user.value = JSON.parse(userData)
      } catch {
        user.value = null
      }
    } else {
      user.value = null
    }
  }
}

const getInitials = (name) => {
  if (!name) return '?'
  return name.split(' ').map(word => word[0]).join('').toUpperCase().slice(0, 2)
}

const getDonatorStatus = () => {
  if (!user.value?.subscription) return false
  return user.value.subscription.tier === 'DONATOR'
}

const getPremiumStatus = () => {
  if (!user.value?.subscription) return false
  return user.value.subscription.tier === 'PREMIUM'
}

const canAccessAdminPanel = (userRole) => {
  return userRole === 'ADMIN'
}

const canAccessModeratorPanel = (userRole) => {
  return userRole === 'MODERATOR' || userRole === 'ADMIN'
}

const refreshUserData = async () => {
  if (typeof window === 'undefined') return
  
  const token = localStorage.getItem('auth-token')
  if (!token) return
  
  try {
    const response = await $fetch('/api/users/profile', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    
    user.value = response.user
    localStorage.setItem('user-data', JSON.stringify(response.user))
  } catch (error) {
    console.error('Failed to refresh user data:', error)
  }
}

const handleSignOut = () => {
  localStorage.removeItem('auth-token')
  localStorage.removeItem('user-data')
  user.value = null
  navigateTo('/')
}

// Check auth on mount
onMounted(() => {
  checkAuth()
  
  // Refresh user data to get latest subscription info
  refreshUserData()
  
  // Listen for storage changes (sign in/out in other tabs)
  window.addEventListener('storage', (e) => {
    if (e.key === 'user-data' || e.key === 'auth-token') {
      checkAuth()
    }
  })
  
  // Listen for custom auth events
  window.addEventListener('auth-changed', () => {
    checkAuth()
    refreshUserData()
  })
  
  // Listen for subscription changes
  window.addEventListener('subscription-changed', () => {
    refreshUserData()
  })
})

// Watch for route changes to update auth state
watch(() => useRoute().path, () => {
  checkAuth()
})

// Provide a way for other components to trigger auth state update
const updateAuthState = () => {
  checkAuth()
}

// Expose to parent components
defineExpose({ updateAuthState })
</script>

<style scoped>
.container {
  max-width: 1200px;
}

.sparkle-wrapper {
  position: relative;
  display: inline-block;
}

.sparkle-emoji {
  position: absolute;
  pointer-events: none;
  font-size: 10px;
  opacity: 0;
  animation: sparkle-twinkle 2s ease-in-out infinite;
}

.sparkle-1 {
  top: -8px;
  right: -8px;
  animation-delay: 0s;
}

.sparkle-2 {
  bottom: -8px;
  left: -8px;
  animation-delay: 0.5s;
}

.sparkle-3 {
  top: 50%;
  right: -12px;
  transform: translateY(-50%);
  animation-delay: 1s;
}

.sparkle-4 {
  top: -12px;
  left: 50%;
  transform: translateX(-50%);
  animation-delay: 1.5s;
}

@keyframes sparkle-twinkle {
  0%, 100% {
    opacity: 0;
    transform: scale(0.5) rotate(0deg);
  }
  50% {
    opacity: 1;
    transform: scale(1) rotate(180deg);
  }
}

.sparkle-emoji:nth-child(odd) {
  animation-duration: 2.5s;
}

.sparkle-emoji:nth-child(even) {
  animation-duration: 2s;
}
</style>