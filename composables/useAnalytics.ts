export const useAnalytics = () => {
  const { $analytics } = useNuxtApp()

  return {
    // Track user actions
    trackUserRegistration: (method: string = 'email') => {
      $analytics.trackRegistration(method)
    },

    trackUserLogin: (method: string = 'email') => {
      $analytics.trackLogin(method)
    },

    // Track subscription events
    trackSubscriptionUpgrade: (tier: string, amount?: number) => {
      $analytics.trackSubscription('Upgrade', tier, amount)
    },

    trackSubscriptionCancel: (tier: string) => {
      $analytics.trackSubscription('Cancel', tier)
    },

    // Track admin actions
    trackAdminUserEdit: (action: string) => {
      $analytics.trackAdminAction('User Edit', action)
    },

    trackAdminUserDelete: () => {
      $analytics.trackAdminAction('User Delete')
    },

    trackAdminRoleChange: (fromRole: string, toRole: string) => {
      $analytics.trackAdminAction('Role Change', `${fromRole} to ${toRole}`)
    },

    trackAdminDataExport: (dataType: string) => {
      $analytics.trackAdminAction('Data Export', dataType)
    },

    // Track moderator actions
    trackModeratorAction: (action: string, target?: string) => {
      $analytics.track('Moderator Action', { action, target })
    },

    // Track feature usage
    track2FASetup: () => {
      $analytics.track2FA('setup')
    },

    track2FAEnable: () => {
      $analytics.track2FA('enable')
    },

    track2FADisable: () => {
      $analytics.track2FA('disable')
    },

    trackProfileUpdate: (fields: string[]) => {
      $analytics.trackProfileUpdate(fields)
    },

    trackAvatarUpload: () => {
      $analytics.trackFeatureUsage('Avatar Upload')
    },

    trackLanguageChange: (fromLang: string, toLang: string) => {
      $analytics.trackFeatureUsage('Language Change', `${fromLang} to ${toLang}`)
    },

    trackThemeToggle: (theme: string) => {
      $analytics.trackFeatureUsage('Theme Toggle', theme)
    },

    // Track search and filtering
    trackUserSearch: (query: string, results: number) => {
      $analytics.track('User Search', { query, results })
    },

    trackUserFilter: (filterType: string, filterValue: string) => {
      $analytics.track('User Filter', { type: filterType, value: filterValue })
    },

    // Track page-specific events
    trackDashboardView: (userRole: string) => {
      $analytics.track('Dashboard View', { role: userRole })
    },

    trackAnalyticsView: (timePeriod: string) => {
      $analytics.track('Analytics View', { period: timePeriod })
    },

    // Track errors (for debugging)
    trackError: (errorType: string, errorMessage: string) => {
      $analytics.trackError(errorType, errorMessage)
    },

    // Track purchases
    trackPurchase: (tier: string, amount: number) => {
      $analytics.trackPurchase(tier, amount)
    },

    // Custom event tracking
    trackCustomEvent: (eventName: string, props?: Record<string, any>) => {
      $analytics.trackCustom(eventName, props)
    },

    // Identify user
    identifyUser: (userId: string, traits?: Record<string, any>) => {
      $analytics.identify(userId, traits)
    },

    // Track page views manually
    trackPageView: (path?: string, title?: string) => {
      $analytics.page({ path, title })
    }
  }
}