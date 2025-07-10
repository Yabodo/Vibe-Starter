export const useTheme = () => {
  const isDark = ref(false)
  
  const setTheme = (dark: boolean) => {
    isDark.value = dark
    
    if (typeof window !== 'undefined') {
      if (dark) {
        document.documentElement.classList.add('dark')
        localStorage.setItem('theme', 'dark')
      } else {
        document.documentElement.classList.remove('dark')
        localStorage.setItem('theme', 'light')
      }
    }
  }
  
  const toggleTheme = () => {
    setTheme(!isDark.value)
  }
  
  const initTheme = () => {
    if (typeof window !== 'undefined') {
      // Check localStorage first
      const savedTheme = localStorage.getItem('theme')
      
      if (savedTheme) {
        setTheme(savedTheme === 'dark')
      } else {
        // Check system preference
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
        setTheme(prefersDark)
      }
      
      // Listen for system theme changes
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
      const handleChange = (e: MediaQueryListEvent) => {
        // Only auto-change if user hasn't set a preference
        if (!localStorage.getItem('theme')) {
          setTheme(e.matches)
        }
      }
      
      mediaQuery.addEventListener('change', handleChange)
      
      // Cleanup function
      return () => {
        mediaQuery.removeEventListener('change', handleChange)
      }
    }
  }
  
  return {
    isDark: readonly(isDark),
    setTheme,
    toggleTheme,
    initTheme
  }
}