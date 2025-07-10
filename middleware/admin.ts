export default defineNuxtRouteMiddleware((to, from) => {
  if (process.client) {
    const token = localStorage.getItem('auth-token')
    if (!token) {
      return navigateTo('/auth/signin')
    }

    try {
      // Decode JWT to check role
      const payload = JSON.parse(atob(token.split('.')[1]))
      if (payload.role !== 'ADMIN') {
        throw createError({
          statusCode: 403,
          statusMessage: 'Access denied. Admin privileges required.'
        })
      }
    } catch (error) {
      return navigateTo('/auth/signin')
    }
  }
})