// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-05-15',
  devtools: { enabled: process.env.NODE_ENV === 'development' },
  
  // Vercel deployment configuration
  nitro: {
    preset: 'vercel'
  },
  
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
    baseURL: process.env.AUTH_ORIGIN,
    provider: {
      type: 'authjs'
    }
  },
  
  runtimeConfig: {
    // Private keys (only available on server-side)
    authSecret: process.env.NUXT_AUTH_SECRET,
    jwtSecret: process.env.JWT_SECRET,
    databaseUrl: process.env.DATABASE_URL,
    
    // Public keys (exposed to client-side)
    public: {
      authUrl: process.env.NUXT_AUTH_URL || 'http://localhost:3000'
    }
  },
  
  // Server-side rendering configuration
  ssr: true,
  
  // Build configuration for Vercel
  build: {
    transpile: ['@prisma/client']
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
