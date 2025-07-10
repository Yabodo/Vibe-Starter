<template>
  <div class="max-w-7xl mx-auto">
    <!-- Header -->
    <div class="mb-8">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-2">
            {{ t('admin.users.title') }}
          </h1>
          <p class="text-gray-600 dark:text-gray-300">
            {{ t('admin.users.subtitle') }}
          </p>
        </div>
        <div class="flex space-x-3">
          <button
            @click="exportUsers"
            :disabled="exporting"
            class="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-50 transition-colors duration-200"
          >
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
            </svg>
            {{ exporting ? t('admin.users.exporting') : t('admin.users.export') }}
          </button>
          <button
            @click="showCreateUserModal = true"
            class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 transition-colors duration-200"
          >
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
            </svg>
            {{ t('admin.users.createUser') }}
          </button>
        </div>
      </div>
    </div>

    <!-- Filters and Search -->
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6 transition-colors duration-300">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <!-- Search -->
        <div class="md:col-span-2">
          <label for="search" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            {{ t('admin.users.search') }}
          </label>
          <input
            id="search"
            v-model="searchQuery"
            type="text"
            :placeholder="t('admin.users.searchPlaceholder')"
            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-colors duration-300"
          />
        </div>
        
        <!-- Role Filter -->
        <div>
          <label for="roleFilter" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            {{ t('admin.users.filterByRole') }}
          </label>
          <select
            id="roleFilter"
            v-model="roleFilter"
            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-colors duration-300"
          >
            <option value="">{{ t('admin.users.allRoles') }}</option>
            <option value="USER">{{ t('admin.users.roles.user') }}</option>
            <option value="MODERATOR">{{ t('admin.users.roles.moderator') }}</option>
            <option value="ADMIN">{{ t('admin.users.roles.admin') }}</option>
          </select>
        </div>
        
        <!-- Status Filter -->
        <div>
          <label for="statusFilter" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            {{ t('admin.users.filterByStatus') }}
          </label>
          <select
            id="statusFilter"
            v-model="statusFilter"
            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-colors duration-300"
          >
            <option value="">{{ t('admin.users.allStatuses') }}</option>
            <option value="active">{{ t('admin.users.status.active') }}</option>
            <option value="inactive">{{ t('admin.users.status.inactive') }}</option>
            <option value="banned">{{ t('admin.users.status.banned') }}</option>
          </select>
        </div>
      </div>
    </div>

    <!-- Users Table -->
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden transition-colors duration-300">
      <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
        <h3 class="text-lg font-medium text-gray-900 dark:text-gray-100">
          {{ t('admin.users.userList') }} ({{ filteredUsers.length }})
        </h3>
      </div>
      
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead class="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                {{ t('admin.users.table.user') }}
              </th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                {{ t('admin.users.table.role') }}
              </th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                {{ t('admin.users.table.status') }}
              </th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                {{ t('admin.users.table.lastLogin') }}
              </th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                {{ t('admin.users.table.subscription') }}
              </th>
              <th scope="col" class="relative px-6 py-3">
                <span class="sr-only">{{ t('admin.users.table.actions') }}</span>
              </th>
            </tr>
          </thead>
          <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            <tr v-for="user in paginatedUsers" :key="user.id" class="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200">
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                  <div class="flex-shrink-0 h-10 w-10">
                    <img 
                      class="h-10 w-10 rounded-full" 
                      :src="user.profileImage || '/default-avatar.png'" 
                      :alt="user.name || 'User'"
                    />
                  </div>
                  <div class="ml-4">
                    <div class="text-sm font-medium text-gray-900 dark:text-gray-100">
                      {{ user.name || t('admin.users.noName') }}
                    </div>
                    <div class="text-sm text-gray-500 dark:text-gray-400">
                      {{ user.email }}
                    </div>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span 
                  class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                  :class="getUserRoleColor(user.role)"
                >
                  {{ getRoleDisplayName(user.role) }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span 
                  class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                  :class="getUserStatusColor(user.isActive)"
                >
                  {{ user.isActive ? t('admin.users.status.active') : t('admin.users.status.inactive') }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                {{ formatDate(user.lastLoginAt) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                {{ user.subscription?.tier || t('admin.users.noSubscription') }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <div class="flex items-center space-x-2">
                  <button
                    @click="editUser(user)"
                    class="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                  >
                    {{ t('admin.users.edit') }}
                  </button>
                  <button
                    v-if="user.role !== 'ADMIN'"
                    @click="confirmDeleteUser(user)"
                    class="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                  >
                    {{ t('admin.users.delete') }}
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      
      <!-- Pagination -->
      <div class="bg-white dark:bg-gray-800 px-4 py-3 border-t border-gray-200 dark:border-gray-700 sm:px-6">
        <div class="flex items-center justify-between">
          <div class="flex-1 flex justify-between sm:hidden">
            <button
              @click="previousPage"
              :disabled="currentPage === 1"
              class="relative inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-50"
            >
              {{ t('admin.users.previous') }}
            </button>
            <button
              @click="nextPage"
              :disabled="currentPage === totalPages"
              class="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-50"
            >
              {{ t('admin.users.next') }}
            </button>
          </div>
          <div class="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p class="text-sm text-gray-700 dark:text-gray-300">
                {{ t('admin.users.showingResults', { 
                  start: (currentPage - 1) * itemsPerPage + 1,
                  end: Math.min(currentPage * itemsPerPage, filteredUsers.length),
                  total: filteredUsers.length
                }) }}
              </p>
            </div>
            <div>
              <nav class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                <button
                  @click="previousPage"
                  :disabled="currentPage === 1"
                  class="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm font-medium text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-50"
                >
                  {{ t('admin.users.previous') }}
                </button>
                <button
                  v-for="page in visiblePages"
                  :key="page"
                  @click="goToPage(page)"
                  :class="page === currentPage ? 
                    'bg-blue-50 dark:bg-blue-900/20 border-blue-500 text-blue-600 dark:text-blue-400' :
                    'bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-600'"
                  class="relative inline-flex items-center px-4 py-2 border text-sm font-medium"
                >
                  {{ page }}
                </button>
                <button
                  @click="nextPage"
                  :disabled="currentPage === totalPages"
                  class="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm font-medium text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-50"
                >
                  {{ t('admin.users.next') }}
                </button>
              </nav>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { getUserRoleColor, getRoleDisplayName } from '~/utils/roles'

const { t } = useTranslation()

definePageMeta({
  middleware: 'admin',
  layout: 'admin'
})

// Data
const searchQuery = ref('')
const roleFilter = ref('')
const statusFilter = ref('')
const currentPage = ref(1)
const itemsPerPage = 10
const exporting = ref(false)
const showCreateUserModal = ref(false)

// Mock users data - replace with real API
const users = ref([
  {
    id: '1',
    name: 'John Doe',
    email: 'john.doe@example.com',
    role: 'USER',
    isActive: true,
    lastLoginAt: new Date(Date.now() - 1000 * 60 * 30),
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7),
    profileImage: null,
    subscription: { tier: 'PREMIUM' }
  },
  {
    id: '2',
    name: 'Sarah Smith',
    email: 'sarah.smith@example.com',
    role: 'MODERATOR',
    isActive: true,
    lastLoginAt: new Date(Date.now() - 1000 * 60 * 60 * 2),
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30),
    profileImage: null,
    subscription: { tier: 'DONATOR' }
  },
  {
    id: '3',
    name: 'Mike Johnson',
    email: 'mike.johnson@example.com',
    role: 'USER',
    isActive: false,
    lastLoginAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5),
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 60),
    profileImage: null,
    subscription: null
  },
  {
    id: '4',
    name: 'Admin User',
    email: 'admin@example.com',
    role: 'ADMIN',
    isActive: true,
    lastLoginAt: new Date(Date.now() - 1000 * 60 * 5),
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 365),
    profileImage: null,
    subscription: null
  }
])

// Computed
const filteredUsers = computed(() => {
  return users.value.filter(user => {
    const matchesSearch = !searchQuery.value || 
      user.name?.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.value.toLowerCase())
    
    const matchesRole = !roleFilter.value || user.role === roleFilter.value
    
    const matchesStatus = !statusFilter.value || 
      (statusFilter.value === 'active' && user.isActive) ||
      (statusFilter.value === 'inactive' && !user.isActive)
    
    return matchesSearch && matchesRole && matchesStatus
  })
})

const totalPages = computed(() => Math.ceil(filteredUsers.value.length / itemsPerPage))

const paginatedUsers = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  const end = start + itemsPerPage
  return filteredUsers.value.slice(start, end)
})

const visiblePages = computed(() => {
  const pages = []
  const start = Math.max(1, currentPage.value - 2)
  const end = Math.min(totalPages.value, currentPage.value + 2)
  
  for (let i = start; i <= end; i++) {
    pages.push(i)
  }
  
  return pages
})

// Methods
function getUserStatusColor(isActive) {
  return isActive
    ? 'text-green-800 bg-green-100 dark:text-green-400 dark:bg-green-900/20'
    : 'text-red-800 bg-red-100 dark:text-red-400 dark:bg-red-900/20'
}

function formatDate(date) {
  if (!date) return t('admin.users.never')
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(new Date(date))
}

function editUser(user) {
  // Implement edit user modal
  console.log('Edit user:', user)
}

function confirmDeleteUser(user) {
  // Implement delete confirmation
  console.log('Delete user:', user)
}

function exportUsers() {
  exporting.value = true
  // Simulate export
  setTimeout(() => {
    exporting.value = false
    // Download CSV or similar
  }, 2000)
}

function previousPage() {
  if (currentPage.value > 1) {
    currentPage.value--
  }
}

function nextPage() {
  if (currentPage.value < totalPages.value) {
    currentPage.value++
  }
}

function goToPage(page) {
  currentPage.value = page
}

// Watch for filter changes to reset page
watch([searchQuery, roleFilter, statusFilter], () => {
  currentPage.value = 1
})
</script>