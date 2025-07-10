export default defineNuxtRouteMiddleware((to, from) => {
  const { data } = useAuth()
  
  if (!data.value?.user) {
    return navigateTo('/auth/signin')
  }
})