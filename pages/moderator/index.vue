<template>
  <div class="max-w-7xl mx-auto">
    <!-- Header -->
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-2">
        {{ t('moderator.dashboard.title') }}
      </h1>
      <p class="text-gray-600 dark:text-gray-300">
        {{ t('moderator.dashboard.subtitle') }}
      </p>
    </div>

    <!-- Quick Stats -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 transition-colors duration-300">
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <div class="w-8 h-8 bg-yellow-600 rounded-lg flex items-center justify-center">
              <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"/>
              </svg>
            </div>
          </div>
          <div class="ml-5 w-0 flex-1">
            <dl>
              <dt class="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                {{ t('moderator.stats.pendingReports') }}
              </dt>
              <dd class="text-lg font-medium text-gray-900 dark:text-gray-100">
                {{ stats.pendingReports }}
              </dd>
            </dl>
          </div>
        </div>
      </div>

      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 transition-colors duration-300">
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <div class="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center">
              <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728L5.636 5.636m12.728 12.728L5.636 5.636"/>
              </svg>
            </div>
          </div>
          <div class="ml-5 w-0 flex-1">
            <dl>
              <dt class="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                {{ t('moderator.stats.bannedUsers') }}
              </dt>
              <dd class="text-lg font-medium text-gray-900 dark:text-gray-100">
                {{ stats.bannedUsers }}
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
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
            </div>
          </div>
          <div class="ml-5 w-0 flex-1">
            <dl>
              <dt class="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                {{ t('moderator.stats.resolvedToday') }}
              </dt>
              <dd class="text-lg font-medium text-gray-900 dark:text-gray-100">
                {{ stats.resolvedToday }}
              </dd>
            </dl>
          </div>
        </div>
      </div>

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
                {{ t('moderator.stats.activeUsers') }}
              </dt>
              <dd class="text-lg font-medium text-gray-900 dark:text-gray-100">
                {{ stats.activeUsers }}
              </dd>
            </dl>
          </div>
        </div>
      </div>
    </div>

    <!-- Action Items -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
      <!-- Pending Reports -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 transition-colors duration-300">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-semibold text-gray-800 dark:text-gray-100">
            {{ t('moderator.reports.title') }}
          </h3>
          <NuxtLink 
            to="/moderator/reports"
            class="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
          >
            {{ t('moderator.reports.viewAll') }}
          </NuxtLink>
        </div>
        <div class="space-y-3">
          <div v-for="report in recentReports" :key="report.id"
               class="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-700">
            <div class="flex-1">
              <p class="text-sm font-medium text-gray-900 dark:text-gray-100">
                {{ report.type }} - {{ report.targetUser }}
              </p>
              <p class="text-xs text-gray-500 dark:text-gray-400">
                {{ t('moderator.reports.reportedBy') }}: {{ report.reportedBy }}
              </p>
            </div>
            <div class="flex space-x-2">
              <button
                @click="resolveReport(report.id, 'approved')"
                class="px-2 py-1 text-xs bg-green-600 text-white rounded hover:bg-green-700"
              >
                {{ t('moderator.reports.approve') }}
              </button>
              <button
                @click="resolveReport(report.id, 'rejected')"
                class="px-2 py-1 text-xs bg-red-600 text-white rounded hover:bg-red-700"
              >
                {{ t('moderator.reports.reject') }}
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Recent User Activity -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 transition-colors duration-300">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-semibold text-gray-800 dark:text-gray-100">
            {{ t('moderator.activity.title') }}
          </h3>
          <NuxtLink 
            to="/moderator/activity"
            class="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
          >
            {{ t('moderator.activity.viewAll') }}
          </NuxtLink>
        </div>
        <div class="space-y-3">
          <div v-for="activity in recentActivity" :key="activity.id"
               class="flex items-center space-x-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-700">
            <div class="flex-shrink-0">
              <div class="w-8 h-8 rounded-full flex items-center justify-center"
                   :class="getActivityColor(activity.type)">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"/>
                </svg>
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

    <!-- Quick Actions -->
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 transition-colors duration-300">
      <h3 class="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4">
        {{ t('moderator.quickActions.title') }}
      </h3>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <NuxtLink 
          to="/moderator/users"
          class="flex items-center p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
        >
          <div class="flex-shrink-0">
            <div class="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"/>
              </svg>
            </div>
          </div>
          <div class="ml-3">
            <p class="text-sm font-medium text-gray-900 dark:text-gray-100">
              {{ t('moderator.quickActions.manageUsers') }}
            </p>
            <p class="text-xs text-gray-500 dark:text-gray-400">
              {{ t('moderator.quickActions.manageUsersDesc') }}
            </p>
          </div>
        </NuxtLink>

        <NuxtLink 
          to="/moderator/reports"
          class="flex items-center p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
        >
          <div class="flex-shrink-0">
            <div class="w-8 h-8 bg-yellow-600 rounded-lg flex items-center justify-center">
              <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"/>
              </svg>
            </div>
          </div>
          <div class="ml-3">
            <p class="text-sm font-medium text-gray-900 dark:text-gray-100">
              {{ t('moderator.quickActions.reviewReports') }}
            </p>
            <p class="text-xs text-gray-500 dark:text-gray-400">
              {{ t('moderator.quickActions.reviewReportsDesc') }}
            </p>
          </div>
        </NuxtLink>

        <NuxtLink 
          to="/moderator/content"
          class="flex items-center p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
        >
          <div class="flex-shrink-0">
            <div class="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center">
              <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
              </svg>
            </div>
          </div>
          <div class="ml-3">
            <p class="text-sm font-medium text-gray-900 dark:text-gray-100">
              {{ t('moderator.quickActions.moderateContent') }}
            </p>
            <p class="text-xs text-gray-500 dark:text-gray-400">
              {{ t('moderator.quickActions.moderateContentDesc') }}
            </p>
          </div>
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup>
const { t } = useTranslation()

definePageMeta({
  middleware: 'moderator',
  layout: 'moderator'
})

// Mock data
const stats = ref({
  pendingReports: 8,
  bannedUsers: 23,
  resolvedToday: 12,
  activeUsers: 847
})

const recentReports = ref([
  {
    id: 1,
    type: 'Inappropriate Content',
    targetUser: 'user123@example.com',
    reportedBy: 'reporter@example.com'
  },
  {
    id: 2,
    type: 'Spam',
    targetUser: 'spammer@example.com',
    reportedBy: 'victim@example.com'
  },
  {
    id: 3,
    type: 'Harassment',
    targetUser: 'bully@example.com',
    reportedBy: 'target@example.com'
  }
])

const recentActivity = ref([
  {
    id: 1,
    type: 'user_banned',
    description: 'User john.doe@example.com was banned for policy violation',
    timestamp: new Date(Date.now() - 1000 * 60 * 15)
  },
  {
    id: 2,
    type: 'report_resolved',
    description: 'Report #1234 was resolved - content removed',
    timestamp: new Date(Date.now() - 1000 * 60 * 30)
  },
  {
    id: 3,
    type: 'user_warned',
    description: 'Warning issued to user sarah.smith@example.com',
    timestamp: new Date(Date.now() - 1000 * 60 * 45)
  }
])

function getActivityColor(type) {
  switch (type) {
    case 'user_banned':
      return 'bg-red-100 text-red-600 dark:bg-red-900/20 dark:text-red-400'
    case 'report_resolved':
      return 'bg-green-100 text-green-600 dark:bg-green-900/20 dark:text-green-400'
    case 'user_warned':
      return 'bg-yellow-100 text-yellow-600 dark:bg-yellow-900/20 dark:text-yellow-400'
    default:
      return 'bg-gray-100 text-gray-600 dark:bg-gray-900/20 dark:text-gray-400'
  }
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

function resolveReport(reportId, action) {
  // Handle report resolution
  console.log(`Report ${reportId} ${action}`)
  // Remove from list or update status
  const index = recentReports.value.findIndex(r => r.id === reportId)
  if (index > -1) {
    recentReports.value.splice(index, 1)
    stats.value.pendingReports--
    stats.value.resolvedToday++
  }
}
</script>