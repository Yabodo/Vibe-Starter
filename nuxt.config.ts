// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-05-15',
  devtools: { enabled: process.env.NODE_ENV === 'development' },
  
  
  modules: [
    '@sidebase/nuxt-auth',
    '@nuxtjs/tailwindcss',
    ...(process.env.I18N_ENABLED !== 'false' ? ['@nuxtjs/i18n'] : [])
  ],
  
  tailwindcss: {
    config: {
      darkMode: 'class'
    }
  },
  
  auth: {
    baseURL: process.env.AUTH_ORIGIN || process.env.NUXT_AUTH_URL,
    provider: {
      type: 'authjs'
    }
  },
  
  runtimeConfig: {
    // Private keys (only available on server-side)
    authSecret: process.env.NUXT_AUTH_SECRET || 'fallback-auth-secret',
    jwtSecret: process.env.JWT_SECRET || process.env.NUXT_AUTH_SECRET || 'fallback-jwt-secret',
    databaseUrl: process.env.DATABASE_URL,
    authOrigin: process.env.AUTH_ORIGIN || process.env.NUXT_AUTH_URL,
    plausibleApiKey: process.env.PLAUSIBLE_API_KEY,
    
    // Email configuration
    resendApiKey: process.env.RESEND_API_KEY,
    emailFrom: process.env.EMAIL_FROM,
    
    // Public keys (exposed to client-side)
    public: {
      authUrl: process.env.NUXT_AUTH_URL || 'http://localhost:3000',
      i18nEnabled: process.env.I18N_ENABLED !== 'false',
      siteUrl: process.env.SITE_URL || 'localhost:3000',
      posthogKey: process.env.POSTHOG_KEY,
      posthogHost: process.env.POSTHOG_HOST
    }
  },
  
  // Server-side rendering configuration
  ssr: true,
  
  // Build configuration for Vercel
  build: {
    transpile: []
  },
  
  // Vite configuration for Prisma compatibility
  vite: {
    define: {
      global: 'globalThis'
    },
    optimizeDeps: {
      exclude: ['@prisma/client', '.prisma/client']
    }
  },
  
  // Nitro configuration for serverless
  nitro: {
    preset: 'vercel',
    experimental: {
      wasm: true
    },
    rollupConfig: {
      external: ['.prisma/client', '@prisma/engines']
    }
  },
  
  
  // i18n configuration
  i18n: process.env.I18N_ENABLED !== 'false' ? {
    locales: [
      {
        code: 'en',
        iso: 'en-US',
        name: 'English',
        file: 'en.json'
      },
      {
        code: 'et',
        iso: 'et-EE', 
        name: 'Eesti',
        file: 'et.json'
      }
    ],
    defaultLocale: 'en',
    strategy: 'no_prefix',
    detectBrowserLanguage: {
      useCookie: true,
      cookieKey: 'i18n_locale',
      redirectOn: 'no prefix'
    }
  } : {},

  // App configuration
  app: {
    head: {
      title: 'Vibe Starter',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { hid: 'description', name: 'description', content: 'Vibe Starter - Modern user management and subscription boilerplate' }
      ]
    }
  }
})
