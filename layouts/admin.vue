<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
    <!-- Navigation -->
    <nav class="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 transition-colors duration-300">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16">
          <div class="flex items-center">
            <!-- Logo -->
            <NuxtLink to="/dashboard" class="flex-shrink-0">
              <h1 class="text-xl font-bold text-gray-800 dark:text-gray-100">
                Vibe Admin
              </h1>
            </NuxtLink>
            
            <!-- Admin Navigation -->
            <div class="hidden md:ml-8 md:flex md:space-x-6">
              <NuxtLink 
                to="/admin"
                class="inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors duration-200"
                :class="$route.path === '/admin' ? 
                  'border-blue-500 text-blue-600 dark:text-blue-400' : 
                  'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'"
              >
                {{ t('admin.nav.dashboard') }}
              </NuxtLink>
              
              <NuxtLink 
                to="/admin/users"
                class="inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors duration-200"
                :class="$route.path.startsWith('/admin/users') ? 
                  'border-blue-500 text-blue-600 dark:text-blue-400' : 
                  'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'"
              >
                {{ t('admin.nav.users') }}
              </NuxtLink>
              
              <NuxtLink 
                to="/admin/analytics"
                class="inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors duration-200"
                :class="$route.path.startsWith('/admin/analytics') ? 
                  'border-blue-500 text-blue-600 dark:text-blue-400' : 
                  'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'"
              >
                {{ t('admin.nav.analytics') }}
              </NuxtLink>
              
              <NuxtLink 
                to="/admin/settings"
                class="inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors duration-200"
                :class="$route.path.startsWith('/admin/settings') ? 
                  'border-blue-500 text-blue-600 dark:text-blue-400' : 
                  'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'"
              >
                {{ t('admin.nav.settings') }}
              </NuxtLink>
            </div>
          </div>
          
          <div class="flex items-center space-x-4">
            <!-- Theme Toggle -->
            <ThemeToggle />
            
            <!-- Language Selector -->
            <LanguageSelector v-if="enabled" />
            
            <!-- Back to App -->
            <NuxtLink 
              to="/dashboard"
              class="inline-flex items-center px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors duration-200"
            >
              {{ t('admin.nav.backToApp') }}
            </NuxtLink>
            
            <!-- User Menu -->
            <div class="relative">
              <button 
                @click="showUserMenu = !showUserMenu"
                class="flex items-center text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-gray-800"
              >
                <img 
                  class="h-8 w-8 rounded-full" 
                  :src="userAvatar || '/default-avatar.png'" 
                  :alt="userName || 'User'"
                />
              </button>
              
              <!-- Dropdown menu -->
              <div 
                v-show="showUserMenu"
                @click.away="showUserMenu = false"
                class="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5 z-50"
              >
                <div class="py-1">
                  <div class="px-4 py-2 border-b border-gray-200 dark:border-gray-700">
                    <p class="text-sm font-medium text-gray-900 dark:text-gray-100">{{ userName }}</p>
                    <p class="text-xs text-gray-500 dark:text-gray-400">{{ userEmail }}</p>
                    <span class="inline-block px-2 py-1 text-xs rounded-full mt-1"
                          :class="getUserRoleColor(userRole)">
                      {{ getRoleDisplayName(userRole) }}
                    </span>
                  </div>
                  <NuxtLink 
                    to="/profile" 
                    class="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    {{ t('admin.nav.profile') }}
                  </NuxtLink>
                  <button 
                    @click="signOut"
                    class="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    {{ t('admin.nav.signOut') }}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Mobile menu -->
      <div class="md:hidden" v-show="showMobileMenu">
        <div class="pt-2 pb-3 space-y-1">
          <NuxtLink 
            to="/admin"
            class="block pl-3 pr-4 py-2 border-l-4 text-base font-medium transition-colors duration-200"
            :class="$route.path === '/admin' ? 
              'border-blue-500 text-blue-700 bg-blue-50 dark:text-blue-400 dark:bg-blue-900/20' : 
              'border-transparent text-gray-600 hover:text-gray-800 hover:bg-gray-50 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300 dark:hover:bg-gray-700'"
          >
            {{ t('admin.nav.dashboard') }}
          </NuxtLink>
          <NuxtLink 
            to="/admin/users"
            class="block pl-3 pr-4 py-2 border-l-4 text-base font-medium transition-colors duration-200"
            :class="$route.path.startsWith('/admin/users') ? 
              'border-blue-500 text-blue-700 bg-blue-50 dark:text-blue-400 dark:bg-blue-900/20' : 
              'border-transparent text-gray-600 hover:text-gray-800 hover:bg-gray-50 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300 dark:hover:bg-gray-700'"
          >
            {{ t('admin.nav.users') }}
          </NuxtLink>
          <NuxtLink 
            to="/admin/analytics"
            class="block pl-3 pr-4 py-2 border-l-4 text-base font-medium transition-colors duration-200"
            :class="$route.path.startsWith('/admin/analytics') ? 
              'border-blue-500 text-blue-700 bg-blue-50 dark:text-blue-400 dark:bg-blue-900/20' : 
              'border-transparent text-gray-600 hover:text-gray-800 hover:bg-gray-50 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300 dark:hover:bg-gray-700'"
          >
            {{ t('admin.nav.analytics') }}
          </NuxtLink>
        </div>
      </div>
    </nav>

    <!-- Main Content -->
    <main class="py-6">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <slot />
      </div>
    </main>
  </div>
</template>

<script setup>
import { getUserRoleColor, getRoleDisplayName } from '~/utils/roles'

const { t, enabled } = useTranslation()

// User state
const userName = ref('Admin User')
const userEmail = ref('admin@example.com')
const userRole = ref('ADMIN')
const userAvatar = ref(null)

// UI state
const showUserMenu = ref(false)
const showMobileMenu = ref(false)

function signOut() {
  localStorage.removeItem('auth-token')
  navigateTo('/auth/signin')
}
</script>