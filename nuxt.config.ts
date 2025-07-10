// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-05-15',
  devtools: { enabled: true },
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
    authSecret: process.env.NUXT_AUTH_SECRET,
    jwtSecret: process.env.JWT_SECRET,
    public: {
      authUrl: process.env.NUXT_AUTH_URL || 'http://localhost:3000'
    }
  }
})
