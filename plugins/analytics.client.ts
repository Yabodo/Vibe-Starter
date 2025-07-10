import Analytics from 'analytics'
import { posthog } from 'posthog-js'

export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig()
  
  // Initialize PostHog (self-hostable option)
  if (config.public.posthogKey) {
    posthog.init(config.public.posthogKey, {
      api_host: config.public.posthogHost || 'https://app.posthog.com',
      autocapture: false, // We'll track manually for better control
      capture_pageview: false, // We'll handle page views manually
      disable_session_recording: process.env.NODE_ENV === 'development'
    })
  }

  // Initialize Analytics.js with database plugin only
  const analytics = Analytics({
    app: 'vibe-starter',
    version: '1.0.0',
    plugins: [
      
      // Custom database plugin
      {
        name: 'database-analytics',
        track: ({ payload }) => {
          // Send to our internal analytics API
          $fetch('/api/analytics/track', {
            method: 'POST',
            body: {
              event: payload.event,
              properties: payload.properties,
              userId: payload.userId,
              anonymousId: payload.anonymousId,
              timestamp: new Date().toISOString()
            }
          }).catch(err => console.warn('Database analytics error:', err))
        },
        page: ({ payload }) => {
          // Track page views
          $fetch('/api/analytics/pageview', {
            method: 'POST',
            body: {
              path: payload.properties.path,
              title: payload.properties.title,
              referrer: payload.properties.referrer,
              userId: payload.userId,
              timestamp: new Date().toISOString()
            }
          }).catch(err => console.warn('Database pageview error:', err))
        },
        identify: ({ payload }) => {
          // Identify users
          $fetch('/api/analytics/identify', {
            method: 'POST',
            body: {
              userId: payload.userId,
              traits: payload.traits,
              timestamp: new Date().toISOString()
            }
          }).catch(err => console.warn('Database identify error:', err))
        }
      }
    ]
  })

  // Enable automatic page tracking
  analytics.page()

  // Add to global context
  return {
    provide: {
      analytics: {
        // Core tracking methods
        track: (event: string, properties?: Record<string, any>) => {
          analytics.track(event, properties)
          // Also send to PostHog if enabled
          if (config.public.posthogKey) {
            posthog.capture(event, properties)
          }
        },
        
        page: (properties?: Record<string, any>) => {
          analytics.page(properties)
          if (config.public.posthogKey) {
            posthog.capture('$pageview', properties)
          }
        },
        
        identify: (userId: string, traits?: Record<string, any>) => {
          analytics.identify(userId, traits)
          if (config.public.posthogKey) {
            posthog.identify(userId, traits)
          }
        },

        // Business-specific tracking methods
        trackRegistration: (method: string = 'email') => {
          analytics.track('User Registered', { method, timestamp: new Date() })
        },

        trackLogin: (method: string = 'email') => {
          analytics.track('User Logged In', { method, timestamp: new Date() })
        },

        trackSubscription: (action: string, tier: string, amount?: number) => {
          analytics.track(`Subscription ${action}`, { 
            tier, 
            amount,
            currency: 'USD',
            timestamp: new Date() 
          })
        },

        trackAdminAction: (action: string, target?: string) => {
          analytics.track('Admin Action', { action, target, timestamp: new Date() })
        },

        trackFeatureUsage: (feature: string, context?: string) => {
          analytics.track('Feature Used', { feature, context, timestamp: new Date() })
        },

        track2FA: (action: 'setup' | 'enable' | 'disable' | 'verify') => {
          analytics.track('2FA Action', { action, timestamp: new Date() })
        },

        trackProfileUpdate: (fields: string[]) => {
          analytics.track('Profile Updated', { fields, timestamp: new Date() })
        },

        trackError: (error: string, context?: string) => {
          analytics.track('Error Occurred', { error, context, timestamp: new Date() })
        },

        // E-commerce tracking
        trackPurchase: (tier: string, amount: number, currency: string = 'USD') => {
          analytics.track('Purchase Completed', { 
            tier, 
            amount, 
            currency,
            timestamp: new Date() 
          })
        },

        // Custom events
        trackCustom: (event: string, properties?: Record<string, any>) => {
          analytics.track(event, { ...properties, timestamp: new Date() })
        }
      }
    }
  }
})