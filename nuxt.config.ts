// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-05-15',
  devtools: { enabled: process.env.NODE_ENV === 'development' },
  
  
  modules: [
    '@sidebase/nuxt-auth',
    '@nuxtjs/tailwindcss'
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
    
    // Public keys (exposed to client-side)
    public: {
      authUrl: process.env.NUXT_AUTH_URL || 'http://localhost:3000'
    }
  },
  
  // Server-side rendering configuration
  ssr: true,
  
  // Build configuration for Vercel
  build: {
    transpile: process.env.NODE_ENV === 'production' ? ['@prisma/client'] : []
  },
  
  // Vite configuration for Prisma compatibility
  vite: {
    define: {
      global: 'globalThis'
    },
    optimizeDeps: {
      exclude: process.env.NODE_ENV === 'production' ? [] : ['@prisma/client']
    }
  },
  
  // Nitro configuration for serverless
  nitro: {
    preset: 'vercel',
    externals: process.env.NODE_ENV === 'production' ? {
      inline: ['@prisma/client']
    } : {}
  },
  
  
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
