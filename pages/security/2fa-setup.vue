<template>
  <div class="max-w-2xl mx-auto">
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-2 transition-colors duration-300">
        Set Up Two-Factor Authentication
      </h1>
      <p class="text-gray-600 dark:text-gray-300 transition-colors duration-300">
        Add an extra layer of security to your account with 2FA
      </p>
    </div>

    <div v-if="loading" class="text-center py-8">
      <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      <p class="mt-2 text-gray-600 dark:text-gray-300">Setting up 2FA...</p>
    </div>

    <div v-else-if="!setupComplete" class="space-y-6">
      <!-- Step 1: Install Authenticator App -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 transition-colors duration-300">
        <div class="flex items-center mb-4">
          <div class="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center mr-3">
            1
          </div>
          <h2 class="text-xl font-semibold text-gray-800 dark:text-gray-100">Install an Authenticator App</h2>
        </div>
        <p class="text-gray-600 dark:text-gray-300 mb-4">
          Download and install an authenticator app on your phone:
        </p>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div class="text-center p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
            <div class="text-2xl mb-2">📱</div>
            <strong class="text-gray-800 dark:text-gray-100">Google Authenticator</strong>
            <p class="text-sm text-gray-600 dark:text-gray-300">iOS & Android</p>
          </div>
          <div class="text-center p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
            <div class="text-2xl mb-2">🔐</div>
            <strong class="text-gray-800 dark:text-gray-100">Authy</strong>
            <p class="text-sm text-gray-600 dark:text-gray-300">iOS & Android</p>
          </div>
          <div class="text-center p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
            <div class="text-2xl mb-2">🛡️</div>
            <strong class="text-gray-800 dark:text-gray-100">2FAS Auth</strong>
            <p class="text-sm text-gray-600 dark:text-gray-300">iOS & Android</p>
          </div>
          <div class="text-center p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
            <div class="text-2xl mb-2">🔑</div>
            <strong class="text-gray-800 dark:text-gray-100">1Password</strong>
            <p class="text-sm text-gray-600 dark:text-gray-300">iOS & Android</p>
          </div>
        </div>
      </div>

      <!-- Step 2: Scan QR Code -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 transition-colors duration-300">
        <div class="flex items-center mb-4">
          <div class="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center mr-3">
            2
          </div>
          <h2 class="text-xl font-semibold text-gray-800 dark:text-gray-100">Scan QR Code</h2>
        </div>
        
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div class="text-center">
            <div v-if="qrCodeUrl" class="inline-block p-4 bg-white rounded-lg shadow-sm">
              <img :src="qrCodeUrl" alt="2FA QR Code" class="w-48 h-48 mx-auto" />
            </div>
            <div v-else class="w-48 h-48 mx-auto bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center">
              <span class="text-gray-400">Loading QR Code...</span>
            </div>
          </div>
          
          <div>
            <p class="text-gray-600 dark:text-gray-300 mb-4">
              Open your authenticator app and scan this QR code to add your account.
            </p>
            
            <div class="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 mb-4">
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Can't scan? Enter this code manually:
              </label>
              <div class="flex items-center space-x-2">
                <code class="flex-1 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 px-3 py-2 rounded border text-sm font-mono">
                  {{ manualSecret }}
                </code>
                <button
                  @click="copySecret"
                  class="px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors duration-200"
                >
                  Copy
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Step 3: Verify Setup -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 transition-colors duration-300">
        <div class="flex items-center mb-4">
          <div class="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center mr-3">
            3
          </div>
          <h2 class="text-xl font-semibold text-gray-800 dark:text-gray-100">Verify Setup</h2>
        </div>
        
        <p class="text-gray-600 dark:text-gray-300 mb-4">
          Enter the 6-digit code from your authenticator app to complete setup:
        </p>
        
        <form @submit.prevent="verifySetup" class="space-y-4">
          <div>
            <label for="verificationCode" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Verification Code
            </label>
            <input
              id="verificationCode"
              v-model="verificationCode"
              type="text"
              maxlength="6"
              pattern="[0-9]{6}"
              required
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-colors duration-300"
              placeholder="123456"
            />
          </div>
          
          <button
            type="submit"
            :disabled="verificationLoading || verificationCode.length !== 6"
            class="w-full bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 disabled:bg-gray-400 dark:disabled:bg-gray-600 text-white py-2 px-4 rounded-md font-semibold transition-colors duration-300"
          >
            {{ verificationLoading ? 'Verifying...' : 'Enable 2FA' }}
          </button>
        </form>
      </div>
    </div>

    <!-- Setup Complete -->
    <div v-else class="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700 rounded-lg p-6 text-center">
      <div class="text-green-600 dark:text-green-400 text-4xl mb-4">✅</div>
      <h2 class="text-2xl font-bold text-green-800 dark:text-green-200 mb-2">
        2FA Successfully Enabled!
      </h2>
      <p class="text-green-600 dark:text-green-400 mb-6">
        Your account is now protected with two-factor authentication.
      </p>
      
      <!-- Backup Codes -->
      <div class="bg-white dark:bg-gray-800 rounded-lg p-6 mb-6 border border-yellow-200 dark:border-yellow-700">
        <h3 class="text-lg font-semibold text-yellow-800 dark:text-yellow-200 mb-4">
          ⚠️ Important: Save Your Backup Codes
        </h3>
        <p class="text-sm text-gray-600 dark:text-gray-300 mb-4">
          Store these backup codes in a safe place. You can use them to access your account if you lose your authenticator device.
        </p>
        
        <div class="grid grid-cols-2 gap-2 mb-4">
          <div 
            v-for="(code, index) in backupCodes" 
            :key="index"
            class="bg-gray-50 dark:bg-gray-700 font-mono text-sm p-2 rounded text-center border"
          >
            {{ code }}
          </div>
        </div>
        
        <button
          @click="downloadBackupCodes"
          class="bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded font-semibold transition-colors duration-200"
        >
          Download Backup Codes
        </button>
      </div>
      
      <div class="space-x-4">
        <NuxtLink 
          to="/profile"
          class="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded font-semibold inline-block transition-colors duration-200"
        >
          Go to Profile
        </NuxtLink>
        <NuxtLink 
          to="/dashboard"
          class="bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-100 px-6 py-2 rounded font-semibold inline-block transition-colors duration-200"
        >
          Go to Dashboard
        </NuxtLink>
      </div>
    </div>

    <!-- Error Message -->
    <div v-if="error" class="mt-4 p-4 bg-red-100 dark:bg-red-900/20 border border-red-400 dark:border-red-600 text-red-700 dark:text-red-300 rounded transition-colors duration-300">
      {{ error }}
    </div>
  </div>
</template>

<script setup>
definePageMeta({
  layout: 'default'
})

const qrCodeUrl = ref('')
const manualSecret = ref('')
const backupCodes = ref([])
const verificationCode = ref('')
const loading = ref(true)
const verificationLoading = ref(false)
const setupComplete = ref(false)
const error = ref('')

const checkAuth = () => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('auth-token')
    if (!token) {
      navigateTo('/auth/signin')
      return false
    }
    return true
  }
  return false
}

const setup2FA = async () => {
  if (!checkAuth()) return
  
  try {
    const token = localStorage.getItem('auth-token')
    const response = await $fetch('/api/auth/2fa/setup', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    
    qrCodeUrl.value = response.data.qrCodeUrl
    manualSecret.value = response.data.secret
    backupCodes.value = response.data.backupCodes
    
  } catch (err) {
    error.value = err.data?.message || 'Failed to set up 2FA'
  } finally {
    loading.value = false
  }
}

const verifySetup = async () => {
  verificationLoading.value = true
  error.value = ''
  
  try {
    const token = localStorage.getItem('auth-token')
    await $fetch('/api/auth/2fa/verify', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: {
        token: verificationCode.value
      }
    })
    
    setupComplete.value = true
    
  } catch (err) {
    error.value = err.data?.message || 'Invalid verification code'
  } finally {
    verificationLoading.value = false
  }
}

const copySecret = async () => {
  try {
    await navigator.clipboard.writeText(manualSecret.value)
    // Could add a toast notification here
  } catch (err) {
    console.error('Failed to copy secret:', err)
  }
}

const downloadBackupCodes = () => {
  const codesText = backupCodes.value.join('\n')
  const blob = new Blob([
    `Vibe Starter 2FA Backup Codes\n` +
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
}

onMounted(() => {
  setup2FA()
})
</script>