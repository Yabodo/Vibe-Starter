<template>
  <div class="max-w-7xl mx-auto">
    <!-- Header -->
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-2">
        {{ t('admin.analytics.title') }}
      </h1>
      <p class="text-gray-600 dark:text-gray-300">
        {{ t('admin.analytics.subtitle') }}
      </p>
    </div>

    <!-- Time Period Selector -->
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6 transition-colors duration-300">
      <div class="flex items-center space-x-4">
        <label class="text-sm font-medium text-gray-700 dark:text-gray-300">
          {{ t('admin.analytics.timePeriod') }}:
        </label>
        <div class="flex space-x-2">
          <button
            v-for="period in timePeriods"
            :key="period.value"
            @click="selectedPeriod = period.value"
            :class="selectedPeriod === period.value ? 
              'bg-blue-600 text-white' : 
              'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'"
            class="px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
          >
            {{ t(`admin.analytics.periods.${period.label}`) }}
          </button>
        </div>
      </div>
    </div>

    <!-- Key Metrics Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <!-- User Growth -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 transition-colors duration-300">
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <div class="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
              </svg>
            </div>
          </div>
          <div class="ml-5 w-0 flex-1">
            <dl>
              <dt class="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                {{ t('admin.analytics.metrics.userGrowth') }}
              </dt>
              <dd class="flex items-baseline">
                <div class="text-2xl font-semibold text-gray-900 dark:text-gray-100">
                  +{{ analytics.userGrowth.value }}%
                </div>
                <div class="ml-2 flex items-baseline text-sm font-semibold"
                     :class="analytics.userGrowth.trend > 0 ? 'text-green-600' : 'text-red-600'">
                  <svg v-if="analytics.userGrowth.trend > 0" class="self-center flex-shrink-0 h-5 w-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z" clip-rule="evenodd"/>
                  </svg>
                  <svg v-else class="self-center flex-shrink-0 h-5 w-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M14.707 10.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L9 12.586V5a1 1 0 012 0v7.586l2.293-2.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
                  </svg>
                  {{ Math.abs(analytics.userGrowth.trend) }}%
                </div>
              </dd>
            </dl>
          </div>
        </div>
      </div>

      <!-- Revenue -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 transition-colors duration-300">
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <div class="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
              <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"/>
              </svg>
            </div>
          </div>
          <div class="ml-5 w-0 flex-1">
            <dl>
              <dt class="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                {{ t('admin.analytics.metrics.revenue') }}
              </dt>
              <dd class="flex items-baseline">
                <div class="text-2xl font-semibold text-gray-900 dark:text-gray-100">
                  ${{ analytics.revenue.value.toLocaleString() }}
                </div>
                <div class="ml-2 flex items-baseline text-sm font-semibold"
                     :class="analytics.revenue.trend > 0 ? 'text-green-600' : 'text-red-600'">
                  <svg v-if="analytics.revenue.trend > 0" class="self-center flex-shrink-0 h-5 w-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z" clip-rule="evenodd"/>
                  </svg>
                  +${{ Math.abs(analytics.revenue.trend) }}
                </div>
              </dd>
            </dl>
          </div>
        </div>
      </div>

      <!-- Conversion Rate -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 transition-colors duration-300">
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <div class="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center">
              <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
              </svg>
            </div>
          </div>
          <div class="ml-5 w-0 flex-1">
            <dl>
              <dt class="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                {{ t('admin.analytics.metrics.conversionRate') }}
              </dt>
              <dd class="flex items-baseline">
                <div class="text-2xl font-semibold text-gray-900 dark:text-gray-100">
                  {{ analytics.conversionRate.value }}%
                </div>
                <div class="ml-2 flex items-baseline text-sm font-semibold"
                     :class="analytics.conversionRate.trend > 0 ? 'text-green-600' : 'text-red-600'">
                  <svg v-if="analytics.conversionRate.trend > 0" class="self-center flex-shrink-0 h-5 w-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z" clip-rule="evenodd"/>
                  </svg>
                  {{ analytics.conversionRate.trend > 0 ? '+' : '' }}{{ analytics.conversionRate.trend }}%
                </div>
              </dd>
            </dl>
          </div>
        </div>
      </div>

      <!-- Churn Rate -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 transition-colors duration-300">
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <div class="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center">
              <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6"/>
              </svg>
            </div>
          </div>
          <div class="ml-5 w-0 flex-1">
            <dl>
              <dt class="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                {{ t('admin.analytics.metrics.churnRate') }}
              </dt>
              <dd class="flex items-baseline">
                <div class="text-2xl font-semibold text-gray-900 dark:text-gray-100">
                  {{ analytics.churnRate.value }}%
                </div>
                <div class="ml-2 flex items-baseline text-sm font-semibold"
                     :class="analytics.churnRate.trend < 0 ? 'text-green-600' : 'text-red-600'">
                  <svg v-if="analytics.churnRate.trend < 0" class="self-center flex-shrink-0 h-5 w-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M14.707 10.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L9 12.586V5a1 1 0 012 0v7.586l2.293-2.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
                  </svg>
                  {{ analytics.churnRate.trend }}%
                </div>
              </dd>
            </dl>
          </div>
        </div>
      </div>
    </div>

    <!-- Charts Grid -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
      <!-- User Activity Chart -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 transition-colors duration-300">
        <h3 class="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">
          {{ t('admin.analytics.charts.userActivity') }}
        </h3>
        <div class="h-64 flex items-center justify-center bg-gray-50 dark:bg-gray-700 rounded-lg">
          <div class="text-center">
            <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
            </svg>
            <p class="mt-2 text-sm text-gray-500 dark:text-gray-400">
              {{ t('admin.analytics.chartPlaceholder') }}
            </p>
          </div>
        </div>
      </div>

      <!-- Revenue Chart -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 transition-colors duration-300">
        <h3 class="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">
          {{ t('admin.analytics.charts.revenue') }}
        </h3>
        <div class="h-64 flex items-center justify-center bg-gray-50 dark:bg-gray-700 rounded-lg">
          <div class="text-center">
            <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"/>
            </svg>
            <p class="mt-2 text-sm text-gray-500 dark:text-gray-400">
              {{ t('admin.analytics.chartPlaceholder') }}
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- Detailed Analytics Tables -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <!-- Top Pages -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 transition-colors duration-300">
        <h3 class="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">
          {{ t('admin.analytics.topPages.title') }}
        </h3>
        <div class="space-y-3">
          <div v-for="page in topPages" :key="page.path" 
               class="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-700">
            <div class="flex-1">
              <p class="text-sm font-medium text-gray-900 dark:text-gray-100">{{ page.path }}</p>
              <p class="text-xs text-gray-500 dark:text-gray-400">{{ page.title }}</p>
            </div>
            <div class="text-right">
              <p class="text-sm font-medium text-gray-900 dark:text-gray-100">{{ page.views.toLocaleString() }}</p>
              <p class="text-xs text-gray-500 dark:text-gray-400">{{ t('admin.analytics.views') }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- User Acquisition -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 transition-colors duration-300">
        <h3 class="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">
          {{ t('admin.analytics.acquisition.title') }}
        </h3>
        <div class="space-y-3">
          <div v-for="source in acquisitionSources" :key="source.name" 
               class="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-700">
            <div class="flex items-center">
              <div class="w-3 h-3 rounded-full mr-3" :style="{ backgroundColor: source.color }"></div>
              <span class="text-sm font-medium text-gray-900 dark:text-gray-100">{{ source.name }}</span>
            </div>
            <div class="text-right">
              <p class="text-sm font-medium text-gray-900 dark:text-gray-100">{{ source.users }}</p>
              <p class="text-xs text-gray-500 dark:text-gray-400">{{ source.percentage }}%</p>
            </div>
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

const selectedPeriod = ref('7d')

const timePeriods = [
  { value: '24h', label: 'last24h' },
  { value: '7d', label: 'last7d' },
  { value: '30d', label: 'last30d' },
  { value: '90d', label: 'last90d' }
]

// Real analytics data
const analytics = ref({
  userGrowth: { value: 0, trend: 0 },
  revenue: { value: 0, trend: 0 },
  conversionRate: { value: 0, trend: 0 },
  churnRate: { value: 0, trend: 0 }
})

const topPages = ref([])
const acquisitionSources = ref([])
const loading = ref(true)
const error = ref(null)

// Track analytics page view
const analyticsComposable = useAnalytics()
onMounted(() => {
  analyticsComposable.trackAnalyticsView(selectedPeriod.value)
})

// Fetch real analytics data
async function fetchAnalytics() {
  try {
    loading.value = true
    error.value = null
    
    const token = localStorage.getItem('auth-token')
    if (!token) {
      throw new Error('No authentication token')
    }

    const response = await $fetch('/api/admin/analytics', {
      headers: {
        Authorization: `Bearer ${token}`
      },
      query: {
        period: selectedPeriod.value
      }
    })

    if (response.success) {
      analytics.value = response.data.trends
      
      // Use data from our analytics API
      topPages.value = response.data.topPages || []
      acquisitionSources.value = response.data.acquisitionSources || []
    }
  } catch (err) {
    error.value = err.message || 'Failed to fetch analytics'
    console.error('Analytics fetch error:', err)
  } finally {
    loading.value = false
  }
}

// Watch for period changes
watch(selectedPeriod, (newPeriod) => {
  analyticsComposable.trackAnalyticsView(newPeriod)
  fetchAnalytics()
})


// Fetch data on mount
onMounted(() => {
  fetchAnalytics()
})
</script>