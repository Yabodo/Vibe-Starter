<template>
  <div class="max-w-7xl mx-auto">
    <!-- Header -->
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-2">
        {{ t('admin.dashboard.title') }}
      </h1>
      <p class="text-gray-600 dark:text-gray-300">
        {{ t('admin.dashboard.subtitle') }}
      </p>
    </div>

    <!-- Quick Stats -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 transition-colors duration-300">
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <div class="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"/>
              </svg>
            </div>
          </div>
          <div class="ml-5 w-0 flex-1">
            <dl>
              <dt class="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                {{ t('admin.stats.totalUsers') }}
              </dt>
              <dd class="text-lg font-medium text-gray-900 dark:text-gray-100">
                {{ stats.totalUsers }}
              </dd>
            </dl>
          </div>
        </div>
      </div>

      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 transition-colors duration-300">
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <div class="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
              <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"/>
              </svg>
            </div>
          </div>
          <div class="ml-5 w-0 flex-1">
            <dl>
              <dt class="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                {{ t('admin.stats.activeUsers') }}
              </dt>
              <dd class="text-lg font-medium text-gray-900 dark:text-gray-100">
                {{ stats.activeUsers }}
              </dd>
            </dl>
          </div>
        </div>
      </div>

      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 transition-colors duration-300">
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <div class="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center">
              <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"/>
              </svg>
            </div>
          </div>
          <div class="ml-5 w-0 flex-1">
            <dl>
              <dt class="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                {{ t('admin.stats.premiumUsers') }}
              </dt>
              <dd class="text-lg font-medium text-gray-900 dark:text-gray-100">
                {{ stats.premiumUsers }}
              </dd>
            </dl>
          </div>
        </div>
      </div>

      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 transition-colors duration-300">
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <div class="w-8 h-8 bg-yellow-600 rounded-lg flex items-center justify-center">
              <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
            </div>
          </div>
          <div class="ml-5 w-0 flex-1">
            <dl>
              <dt class="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                {{ t('admin.stats.monthlyRevenue') }}
              </dt>
              <dd class="text-lg font-medium text-gray-900 dark:text-gray-100">
                ${{ stats.monthlyRevenue }}
              </dd>
            </dl>
          </div>
        </div>
      </div>
    </div>

    <!-- Quick Actions -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
      <!-- User Management -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 transition-colors duration-300">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-semibold text-gray-800 dark:text-gray-100">
            {{ t('admin.userManagement.title') }}
          </h3>
          <NuxtLink 
            to="/admin/users"
            class="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
          >
            {{ t('admin.userManagement.viewAll') }}
          </NuxtLink>
        </div>
        <div class="space-y-3">
          <div class="flex justify-between items-center">
            <span class="text-sm text-gray-600 dark:text-gray-400">{{ t('admin.userManagement.newToday') }}</span>
            <span class="font-medium text-gray-900 dark:text-gray-100">{{ stats.newUsersToday }}</span>
          </div>
          <div class="flex justify-between items-center">
            <span class="text-sm text-gray-600 dark:text-gray-400">{{ t('admin.userManagement.pendingApproval') }}</span>
            <span class="font-medium text-gray-900 dark:text-gray-100">{{ stats.pendingUsers }}</span>
          </div>
          <div class="flex justify-between items-center">
            <span class="text-sm text-gray-600 dark:text-gray-400">{{ t('admin.userManagement.reported') }}</span>
            <span class="font-medium text-red-600 dark:text-red-400">{{ stats.reportedUsers }}</span>
          </div>
        </div>
      </div>

      <!-- System Analytics -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 transition-colors duration-300">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-semibold text-gray-800 dark:text-gray-100">
            {{ t('admin.analytics.title') }}
          </h3>
          <NuxtLink 
            to="/admin/analytics"
            class="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
          >
            {{ t('admin.analytics.viewFull') }}
          </NuxtLink>
        </div>
        <div class="space-y-3">
          <div class="flex justify-between items-center">
            <span class="text-sm text-gray-600 dark:text-gray-400">{{ t('admin.analytics.pageViews') }}</span>
            <span class="font-medium text-gray-900 dark:text-gray-100">{{ stats.pageViewsToday }}</span>
          </div>
          <div class="flex justify-between items-center">
            <span class="text-sm text-gray-600 dark:text-gray-400">{{ t('admin.analytics.conversionRate') }}</span>
            <span class="font-medium text-green-600 dark:text-green-400">{{ stats.conversionRate }}%</span>
          </div>
          <div class="flex justify-between items-center">
            <span class="text-sm text-gray-600 dark:text-gray-400">{{ t('admin.analytics.avgSessionTime') }}</span>
            <span class="font-medium text-gray-900 dark:text-gray-100">{{ stats.avgSessionTime }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Recent Activity -->
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 transition-colors duration-300">
      <h3 class="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4">
        {{ t('admin.recentActivity.title') }}
      </h3>
      <div class="space-y-3">
        <div v-for="activity in recentActivities" :key="activity.id" 
             class="flex items-center space-x-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-700">
          <div class="flex-shrink-0">
            <div class="w-8 h-8 rounded-full flex items-center justify-center"
                 :class="getActivityColor(activity.type)">
              <component :is="getActivityIcon(activity.type)" class="w-4 h-4" />
            </div>
          </div>
          <div class="flex-1 min-w-0">
            <p class="text-sm text-gray-900 dark:text-gray-100">
              {{ activity.description }}
            </p>
            <p class="text-xs text-gray-500 dark:text-gray-400">
              {{ formatTime(activity.timestamp) }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const { t } = useTranslation()

definePageMeta({
  middleware: 'admin',
  layout: 'admin'
})

// Mock data - replace with real API calls
const stats = ref({
  totalUsers: 1247,
  activeUsers: 892,
  premiumUsers: 156,
  monthlyRevenue: 7824,
  newUsersToday: 23,
  pendingUsers: 5,
  reportedUsers: 2,
  pageViewsToday: 15640,
  conversionRate: 3.2,
  avgSessionTime: '4m 32s'
})

const recentActivities = ref([
  {
    id: 1,
    type: 'user_signup',
    description: 'New user registered: john.doe@example.com',
    timestamp: new Date(Date.now() - 1000 * 60 * 5) // 5 minutes ago
  },
  {
    id: 2,
    type: 'subscription',
    description: 'User upgraded to Premium plan: sarah.smith@example.com',
    timestamp: new Date(Date.now() - 1000 * 60 * 15) // 15 minutes ago
  },
  {
    id: 3,
    type: 'security',
    description: 'Failed login attempts detected from IP: 192.168.1.100',
    timestamp: new Date(Date.now() - 1000 * 60 * 30) // 30 minutes ago
  },
  {
    id: 4,
    type: 'report',
    description: 'User reported inappropriate content: Report #1245',
    timestamp: new Date(Date.now() - 1000 * 60 * 45) // 45 minutes ago
  }
])

function getActivityColor(type) {
  switch (type) {
    case 'user_signup':
      return 'bg-green-100 text-green-600 dark:bg-green-900/20 dark:text-green-400'
    case 'subscription':
      return 'bg-blue-100 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400'
    case 'security':
      return 'bg-red-100 text-red-600 dark:bg-red-900/20 dark:text-red-400'
    case 'report':
      return 'bg-yellow-100 text-yellow-600 dark:bg-yellow-900/20 dark:text-yellow-400'
    default:
      return 'bg-gray-100 text-gray-600 dark:bg-gray-900/20 dark:text-gray-400'
  }
}

function getActivityIcon(type) {
  // Return SVG icon component based on type
  return 'div' // Simplified for now
}

function formatTime(timestamp) {
  const now = new Date()
  const diff = now - timestamp
  const minutes = Math.floor(diff / 60000)
  
  if (minutes < 1) return 'Just now'
  if (minutes < 60) return `${minutes}m ago`
  
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}h ago`
  
  const days = Math.floor(hours / 24)
  return `${days}d ago`
}
</script>