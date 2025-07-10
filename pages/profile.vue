<template>
  <div>
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-2 transition-colors duration-300">User Profile</h1>
      <p class="text-gray-600 dark:text-gray-300 transition-colors duration-300">Manage your personal information and account settings</p>
    </div>

    <div v-if="loading" class="text-center py-8">
      <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      <p class="mt-2 text-gray-600 dark:text-gray-300">Loading profile...</p>
    </div>

    <div v-else-if="user" class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <!-- Profile Information -->
      <div class="lg:col-span-2">
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6 transition-colors duration-300">
          <h2 class="text-xl font-semibold mb-6 text-gray-800 dark:text-gray-100">Personal Information</h2>
          
          <form @submit.prevent="updateProfile">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label for="name" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Full Name
                </label>
                <input
                  id="name"
                  v-model="profileForm.name"
                  type="text"
                  class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-colors duration-300"
                  placeholder="Enter your full name"
                >
              </div>
              
              <div>
                <label for="email" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Email Address
                </label>
                <input
                  id="email"
                  v-model="profileForm.email"
                  type="email"
                  required
                  class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-colors duration-300"
                >
              </div>
            </div>
            
            <div class="mt-6 flex justify-end">
              <button
                type="submit"
                :disabled="profileLoading"
                class="bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 disabled:bg-gray-400 dark:disabled:bg-gray-600 text-white px-6 py-2 rounded-md font-semibold transition-colors duration-300"
              >
                {{ profileLoading ? 'Updating...' : 'Update Profile' }}
              </button>
            </div>
          </form>
        </div>

        <!-- Change Password -->
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6 transition-colors duration-300">
          <h2 class="text-xl font-semibold mb-6 text-gray-800 dark:text-gray-100">Change Password</h2>
          
          <form @submit.prevent="changePassword">
            <div class="space-y-4">
              <div>
                <label for="currentPassword" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Current Password
                </label>
                <input
                  id="currentPassword"
                  v-model="passwordForm.currentPassword"
                  type="password"
                  required
                  class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-colors duration-300"
                >
              </div>
              
              <div>
                <label for="newPassword" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  New Password
                </label>
                <input
                  id="newPassword"
                  v-model="passwordForm.newPassword"
                  type="password"
                  required
                  minlength="6"
                  class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-colors duration-300"
                >
                <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">Password must be at least 6 characters long</p>
              </div>
              
              <div>
                <label for="confirmPassword" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Confirm New Password
                </label>
                <input
                  id="confirmPassword"
                  v-model="passwordForm.confirmPassword"
                  type="password"
                  required
                  class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-colors duration-300"
                >
              </div>
            </div>
            
            <div class="mt-6 flex justify-end">
              <button
                type="submit"
                :disabled="passwordLoading || !isPasswordFormValid"
                class="bg-green-600 hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-600 disabled:bg-gray-400 dark:disabled:bg-gray-600 text-white px-6 py-2 rounded-md font-semibold transition-colors duration-300"
              >
                {{ passwordLoading ? 'Changing...' : 'Change Password' }}
              </button>
            </div>
          </form>
        </div>

        <!-- Two-Factor Authentication -->
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6 transition-colors duration-300">
          <h2 class="text-xl font-semibold mb-6 text-gray-800 dark:text-gray-100">Two-Factor Authentication</h2>
          
          <div v-if="user.twoFactorEnabled" class="space-y-4">
            <div class="flex items-center justify-between p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700 rounded-lg">
              <div class="flex items-center">
                <div class="text-green-600 dark:text-green-400 text-xl mr-3">✅</div>
                <div>
                  <h3 class="font-medium text-green-800 dark:text-green-200">2FA Enabled</h3>
                  <p class="text-sm text-green-600 dark:text-green-400">Your account is protected with two-factor authentication</p>
                </div>
              </div>
              <button
                @click="show2FADisableModal = true"
                class="bg-red-600 hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-600 text-white px-4 py-2 rounded font-semibold transition-colors duration-300"
              >
                Disable 2FA
              </button>
            </div>
            
            <div class="p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700 rounded-lg">
              <h4 class="font-medium text-yellow-800 dark:text-yellow-200 mb-2">Backup Codes</h4>
              <p class="text-sm text-yellow-600 dark:text-yellow-400 mb-3">
                If you lose access to your authenticator app, you can use backup codes to sign in.
              </p>
              <button
                @click="regenerateBackupCodes"
                :disabled="backupCodesLoading"
                class="bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded font-semibold transition-colors duration-200"
              >
                {{ backupCodesLoading ? 'Generating...' : 'Generate New Backup Codes' }}
              </button>
            </div>
          </div>
          
          <div v-else class="space-y-4">
            <div class="flex items-center justify-between p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-lg">
              <div class="flex items-center">
                <div class="text-blue-600 dark:text-blue-400 text-xl mr-3">🔒</div>
                <div>
                  <h3 class="font-medium text-blue-800 dark:text-blue-200">Enable Two-Factor Authentication</h3>
                  <p class="text-sm text-blue-600 dark:text-blue-400">Add an extra layer of security to your account</p>
                </div>
              </div>
              <NuxtLink 
                to="/security/2fa-setup"
                class="bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white px-4 py-2 rounded font-semibold transition-colors duration-300"
              >
                Set Up 2FA
              </NuxtLink>
            </div>
            
            <div class="text-sm text-gray-600 dark:text-gray-400">
              <p class="mb-2"><strong>Benefits of 2FA:</strong></p>
              <ul class="list-disc list-inside space-y-1">
                <li>Protects your account even if your password is compromised</li>
                <li>Uses time-based codes from your phone's authenticator app</li>
                <li>Industry standard security practice</li>
                <li>Includes backup codes for emergency access</li>
              </ul>
            </div>
          </div>
        </div>

        <!-- Account Actions -->
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 transition-colors duration-300">
          <h2 class="text-xl font-semibold mb-6 text-gray-800 dark:text-gray-100">Account Actions</h2>
          
          <div class="space-y-4">
            <div class="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
              <div>
                <h3 class="font-medium text-gray-900 dark:text-gray-100">Sign Out</h3>
                <p class="text-sm text-gray-500 dark:text-gray-400">Sign out of your account on this device</p>
              </div>
              <button
                @click="logout"
                class="bg-gray-600 hover:bg-gray-700 dark:bg-gray-500 dark:hover:bg-gray-600 text-white px-4 py-2 rounded font-semibold transition-colors duration-300"
              >
                Sign Out
              </button>
            </div>
            
            <div class="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
              <div>
                <h3 class="font-medium text-gray-900 dark:text-gray-100">Download Account Data</h3>
                <p class="text-sm text-gray-500 dark:text-gray-400">Export all your account information and data</p>
              </div>
              <button
                @click="downloadAccountData"
                :disabled="downloadLoading"
                class="bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 disabled:bg-gray-400 dark:disabled:bg-gray-600 text-white px-4 py-2 rounded font-semibold transition-colors duration-300"
              >
                {{ downloadLoading ? 'Preparing...' : 'Download' }}
              </button>
            </div>
            
            <div class="flex items-center justify-between p-4 border border-red-200 dark:border-red-700 rounded-lg bg-red-50 dark:bg-red-900/20 transition-colors duration-300">
              <div>
                <h3 class="font-medium text-red-900 dark:text-red-200">Delete Account</h3>
                <p class="text-sm text-red-600 dark:text-red-400">Permanently delete your account and all associated data</p>
              </div>
              <button
                @click="showDeleteConfirm = true"
                class="bg-red-600 hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-600 text-white px-4 py-2 rounded font-semibold transition-colors duration-300"
              >
                Delete Account
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Profile Summary -->
      <div class="lg:col-span-1">
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 transition-colors duration-300">
          <h2 class="text-xl font-semibold mb-6 text-gray-800 dark:text-gray-100">Account Summary</h2>
          
          <div class="space-y-4">
            <div class="text-center">
              <div class="relative inline-block mb-3">
                <div class="w-20 h-20 rounded-full overflow-hidden bg-blue-100 flex items-center justify-center">
                  <img 
                    v-if="user.profileImage" 
                    :src="user.profileImage" 
                    :alt="user.name || 'Profile'"
                    class="w-full h-full object-cover"
                  >
                  <span v-else class="text-2xl font-bold text-blue-600">
                    {{ getInitials(user.name || user.email) }}
                  </span>
                </div>
                <button 
                  @click="triggerFileUpload"
                  class="absolute -bottom-1 -right-1 bg-blue-600 hover:bg-blue-700 text-white p-1 rounded-full w-6 h-6 flex items-center justify-center text-xs"
                  title="Change profile picture"
                >
                  ✏️
                </button>
              </div>
              <input 
                ref="fileInput"
                type="file"
                accept="image/*"
                @change="handleFileUpload"
                class="hidden"
              >
              <h3 class="font-semibold text-lg text-gray-800 dark:text-gray-100">{{ user.name || 'Anonymous User' }}</h3>
              <p class="text-gray-600 dark:text-gray-300">{{ user.email }}</p>
            </div>
            
            <div class="border-t pt-4">
              <div class="space-y-3">
                <div class="flex justify-between">
                  <span class="text-sm font-medium text-gray-500 dark:text-gray-400">Account Type:</span>
                  <span class="text-sm font-semibold text-gray-900 dark:text-gray-100">{{ user.role }}</span>
                </div>
                
                <div class="flex justify-between">
                  <span class="text-sm font-medium text-gray-500 dark:text-gray-400">Member Since:</span>
                  <span class="text-sm text-gray-900 dark:text-gray-100">{{ formatDate(user.createdAt) }}</span>
                </div>
                
                <div v-if="user.subscription" class="flex justify-between items-center">
                  <span class="text-sm font-medium text-gray-500 dark:text-gray-400">Subscription:</span>
                  <div class="flex items-center">
                    <span v-if="isDonator(user.subscription.tier)" class="mr-2">💝</span>
                    <span class="text-sm" :class="getSubscriptionClass(user.subscription.tier)">
                      {{ user.subscription.tier }}
                    </span>
                    <span v-if="isDonator(user.subscription.tier)" class="ml-2">✨</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div class="border-t pt-4">
              <NuxtLink 
                to="/subscription"
                class="w-full bg-green-600 hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-600 text-white px-4 py-2 rounded font-semibold text-center block transition-colors duration-300"
              >
                Manage Subscription
              </NuxtLink>
            </div>
          </div>
        </div>

        <!-- Activity Log -->
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mt-6 transition-colors duration-300">
          <h2 class="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-100">Recent Activity</h2>
          <div class="space-y-3">
            <div class="text-sm text-gray-600 dark:text-gray-300 border-l-4 border-blue-500 pl-3">
              <p class="font-medium">Profile viewed</p>
              <p class="text-xs text-gray-500 dark:text-gray-400">Just now</p>
            </div>
            <div class="text-sm text-gray-600 dark:text-gray-300 border-l-4 border-green-500 pl-3">
              <p class="font-medium">Account created</p>
              <p class="text-xs text-gray-500 dark:text-gray-400">{{ formatDate(user.createdAt) }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Messages -->
    <div v-if="message" class="fixed bottom-4 right-4 p-4 rounded-lg shadow-lg" :class="messageClass">
      {{ message }}
    </div>

    <!-- 2FA Disable Modal -->
    <div v-if="show2FADisableModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md mx-4 transition-colors duration-300">
        <h3 class="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-100">Disable Two-Factor Authentication</h3>
        <p class="text-gray-600 dark:text-gray-300 mb-6">
          Enter your password to confirm disabling 2FA. This will make your account less secure.
        </p>
        
        <form @submit.prevent="disable2FA">
          <div class="mb-4">
            <label for="disablePassword" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Password
            </label>
            <input
              id="disablePassword"
              v-model="disable2FAForm.password"
              type="password"
              required
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-colors duration-300"
            />
          </div>
          
          <div class="flex space-x-3">
            <button
              type="button"
              @click="show2FADisableModal = false; disable2FAForm.password = ''"
              class="flex-1 bg-gray-200 hover:bg-gray-300 dark:bg-gray-600 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-100 px-4 py-2 rounded font-semibold transition-colors duration-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              :disabled="disable2FALoading"
              class="flex-1 bg-red-600 hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-600 text-white px-4 py-2 rounded font-semibold transition-colors duration-300"
            >
              {{ disable2FALoading ? 'Disabling...' : 'Disable 2FA' }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <div v-if="showDeleteConfirm" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md mx-4 transition-colors duration-300">
        <h3 class="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-100">Confirm Account Deletion</h3>
        <p class="text-gray-600 dark:text-gray-300 mb-6">
          This action cannot be undone. All your data will be permanently deleted.
        </p>
        <div class="flex space-x-3">
          <button
            @click="showDeleteConfirm = false"
            class="flex-1 bg-gray-200 hover:bg-gray-300 dark:bg-gray-600 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-100 px-4 py-2 rounded font-semibold transition-colors duration-300"
          >
            Cancel
          </button>
          <button
            @click="deleteAccount"
            class="flex-1 bg-red-600 hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-600 text-white px-4 py-2 rounded font-semibold transition-colors duration-300"
          >
            Delete Account
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const user = ref(null)
const loading = ref(true)
const profileLoading = ref(false)
const passwordLoading = ref(false)
const downloadLoading = ref(false)
const uploadLoading = ref(false)
const message = ref('')
const messageType = ref('')
const showDeleteConfirm = ref(false)
const fileInput = ref(null)

const profileForm = reactive({
  name: '',
  email: ''
})

const passwordForm = reactive({
  currentPassword: '',
  newPassword: '',
  confirmPassword: ''
})

const disable2FAForm = reactive({
  password: ''
})

const show2FADisableModal = ref(false)
const disable2FALoading = ref(false)
const backupCodesLoading = ref(false)

const messageClass = computed(() => {
  switch (messageType.value) {
    case 'success': return 'bg-green-500 text-white'
    case 'error': return 'bg-red-500 text-white'
    default: return 'bg-blue-500 text-white'
  }
})

const isPasswordFormValid = computed(() => {
  return passwordForm.currentPassword && 
         passwordForm.newPassword && 
         passwordForm.confirmPassword &&
         passwordForm.newPassword === passwordForm.confirmPassword &&
         passwordForm.newPassword.length >= 6
})

const checkAuth = () => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('auth-token')
    const userData = localStorage.getItem('user-data')
    
    if (!token || !userData) {
      navigateTo('/auth/signin')
      return false
    }
    
    try {
      user.value = JSON.parse(userData)
      profileForm.name = user.value.name || ''
      profileForm.email = user.value.email || ''
      return true
    } catch {
      localStorage.removeItem('auth-token')
      localStorage.removeItem('user-data')
      navigateTo('/auth/signin')
      return false
    }
  }
  return false
}

const showMessage = (text, type = 'success') => {
  message.value = text
  messageType.value = type
  setTimeout(() => {
    message.value = ''
  }, 5000)
}

const getInitials = (name) => {
  if (!name) return '?'
  return name.split(' ').map(word => word[0]).join('').toUpperCase().slice(0, 2)
}

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

const getSubscriptionClass = (tier) => {
  switch (tier) {
    case 'PREMIUM':
      return 'text-blue-600 font-semibold'
    case 'DONATOR':
      return 'bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent font-bold'
    default: return 'text-gray-600'
  }
}

const isDonator = (tier) => {
  return tier === 'DONATOR'
}

const triggerFileUpload = () => {
  fileInput.value?.click()
}

const resizeImageToCanvas = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      const img = new Image()
      img.onload = () => {
        const canvas = document.createElement('canvas')
        const ctx = canvas.getContext('2d')
        
        // Set canvas size to 50x50
        canvas.width = 50
        canvas.height = 50
        
        // Calculate scaling to maintain aspect ratio and fill the square
        const size = Math.min(img.width, img.height)
        const offsetX = (img.width - size) / 2
        const offsetY = (img.height - size) / 2
        
        // Draw image to canvas (cropped to square and resized to 50x50)
        ctx.drawImage(
          img,
          offsetX, offsetY, size, size,  // Source rectangle (square crop)
          0, 0, 50, 50                   // Destination rectangle (50x50)
        )
        
        // Convert to base64
        const base64 = canvas.toDataURL('image/jpeg', 0.9)
        resolve(base64)
      }
      img.onerror = reject
      img.src = e.target.result
    }
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

const handleFileUpload = async (event) => {
  const file = event.target.files[0]
  if (!file) return

  // Validate file size (max 5MB)
  if (file.size > 5 * 1024 * 1024) {
    showMessage('File size must be less than 5MB', 'error')
    return
  }

  // Validate file type
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
  if (!allowedTypes.includes(file.type)) {
    showMessage('Please select a valid image file (JPEG, PNG, or WebP)', 'error')
    return
  }

  uploadLoading.value = true

  try {
    // Resize image to 50x50 using Canvas
    const resizedImageData = await resizeImageToCanvas(file)

    const token = localStorage.getItem('auth-token')
    const response = await $fetch('/api/users/upload-avatar', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: {
        imageData: resizedImageData
      }
    })

    user.value = response.user
    localStorage.setItem('user-data', JSON.stringify(response.user))
    
    // Trigger auth state update in navbar
    window.dispatchEvent(new Event('auth-changed'))
    
    showMessage('Profile picture updated successfully!', 'success')
  } catch (err) {
    showMessage(err.data?.message || 'Failed to upload profile picture', 'error')
  } finally {
    uploadLoading.value = false
    // Clear the file input
    if (fileInput.value) {
      fileInput.value.value = ''
    }
  }
}

const updateProfile = async () => {
  profileLoading.value = true
  
  try {
    const token = localStorage.getItem('auth-token')
    const response = await $fetch('/api/users/profile', {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: {
        name: profileForm.name,
        email: profileForm.email
      }
    })
    
    user.value = response.user
    localStorage.setItem('user-data', JSON.stringify(response.user))
    
    // Trigger auth state update in navbar
    window.dispatchEvent(new Event('auth-changed'))
    
    showMessage('Profile updated successfully!', 'success')
  } catch (err) {
    showMessage(err.data?.message || 'Failed to update profile', 'error')
  } finally {
    profileLoading.value = false
  }
}

const changePassword = async () => {
  if (passwordForm.newPassword !== passwordForm.confirmPassword) {
    showMessage('Passwords do not match', 'error')
    return
  }
  
  passwordLoading.value = true
  
  try {
    const token = localStorage.getItem('auth-token')
    await $fetch('/api/users/profile', {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: {
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword
      }
    })
    
    passwordForm.currentPassword = ''
    passwordForm.newPassword = ''
    passwordForm.confirmPassword = ''
    showMessage('Password changed successfully!', 'success')
  } catch (err) {
    showMessage(err.data?.message || 'Failed to change password', 'error')
  } finally {
    passwordLoading.value = false
  }
}

const downloadAccountData = async () => {
  downloadLoading.value = true
  
  try {
    const token = localStorage.getItem('auth-token')
    const response = await $fetch('/api/users/profile', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    
    const dataStr = JSON.stringify(response.user, null, 2)
    const dataBlob = new Blob([dataStr], { type: 'application/json' })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement('a')
    link.href = url
    link.download = `account-data-${new Date().toISOString().split('T')[0]}.json`
    link.click()
    URL.revokeObjectURL(url)
    
    showMessage('Account data downloaded successfully!', 'success')
  } catch (err) {
    showMessage('Failed to download account data', 'error')
  } finally {
    downloadLoading.value = false
  }
}

const deleteAccount = async () => {
  try {
    const token = localStorage.getItem('auth-token')
    await $fetch('/api/users/profile', {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    
    localStorage.removeItem('auth-token')
    localStorage.removeItem('user-data')
    showMessage('Account deleted successfully', 'success')
    
    setTimeout(() => {
      navigateTo('/')
    }, 2000)
  } catch (err) {
    showMessage('Failed to delete account', 'error')
  }
  
  showDeleteConfirm.value = false
}

const disable2FA = async () => {
  disable2FALoading.value = true
  
  try {
    const token = localStorage.getItem('auth-token')
    await $fetch('/api/auth/2fa/disable', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: {
        password: disable2FAForm.password
      }
    })
    
    // Update user data
    user.value.twoFactorEnabled = false
    localStorage.setItem('user-data', JSON.stringify(user.value))
    
    show2FADisableModal.value = false
    disable2FAForm.password = ''
    showMessage('2FA has been disabled successfully', 'success')
  } catch (err) {
    showMessage(err.data?.message || 'Failed to disable 2FA', 'error')
  } finally {
    disable2FALoading.value = false
  }
}

const regenerateBackupCodes = async () => {
  if (!confirm('This will invalidate your existing backup codes. Continue?')) {
    return
  }
  
  backupCodesLoading.value = true
  
  try {
    const token = localStorage.getItem('auth-token')
    const response = await $fetch('/api/auth/2fa/setup', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    
    // Download new backup codes
    const codesText = response.data.backupCodes.join('\n')
    const blob = new Blob([
      `Vibe Starter 2FA Backup Codes (Regenerated)\n` +
      `Generated: ${new Date().toLocaleString()}\n\n` +
      `Important: Keep these codes safe and secure.\n` +
      `Each code can only be used once.\n\n` +
      `Backup Codes:\n${codesText}`
    ], { type: 'text/plain' })
    
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `vibe-starter-2fa-backup-codes-${new Date().toISOString().split('T')[0]}.txt`
    link.click()
    URL.revokeObjectURL(url)
    
    showMessage('New backup codes generated and downloaded', 'success')
  } catch (err) {
    showMessage(err.data?.message || 'Failed to regenerate backup codes', 'error')
  } finally {
    backupCodesLoading.value = false
  }
}

const logout = () => {
  // Clear authentication data
  localStorage.removeItem('auth-token')
  localStorage.removeItem('user-data')
  
  // Trigger auth state update in navbar
  window.dispatchEvent(new Event('auth-changed'))
  
  // Show success message and redirect
  showMessage('You have been signed out successfully', 'success')
  
  setTimeout(() => {
    navigateTo('/auth/signin')
  }, 1500)
}

const fetchUserData = async () => {
  if (!checkAuth()) return
  
  try {
    const token = localStorage.getItem('auth-token')
    const response = await $fetch('/api/users/profile', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    
    user.value = response.user
    profileForm.name = user.value.name || ''
    profileForm.email = user.value.email || ''
  } catch (err) {
    if (err.status === 401) {
      localStorage.removeItem('auth-token')
      localStorage.removeItem('user-data')
      await navigateTo('/auth/signin')
    } else {
      showMessage('Failed to load profile data', 'error')
    }
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchUserData()
})
</script>