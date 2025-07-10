export const useTranslation = () => {
  const runtimeConfig = useRuntimeConfig()
  const i18nEnabled = runtimeConfig.public.i18nEnabled !== false
  
  if (i18nEnabled) {
    const { t, locale, locales, setLocale } = useI18n()
    return {
      t,
      locale,
      locales,
      setLocale,
      enabled: true
    }
  }
  
  // Fallback when i18n is disabled
  const fallbackTranslations = {
    'home.title': 'Welcome to Vibe Starter',
    'home.subtitle': 'Your comprehensive user and subscription management platform',
    'home.getStarted': 'Get Started',
    'home.goDashboard': 'Go to Dashboard',
    'nav.signin': 'Sign In',
    'nav.signup': 'Sign Up',
    'home.features.userManagement.title': 'User Management',
    'home.features.userManagement.description': 'Complete user authentication and profile management system',
    'home.features.subscriptionTiers.title': 'Subscription Tiers',
    'home.features.subscriptionTiers.description': 'Premium and Donator plans with beautiful UI',
    'home.features.secureScalable.title': 'Secure & Scalable',
    'home.features.secureScalable.description': 'Built with modern security practices and scalable architecture',
    'auth.signin.title': 'Sign In',
    'auth.signin.email': 'Email',
    'auth.signin.password': 'Password',
    'auth.signin.twoFactorCode': 'Two-Factor Authentication Code',
    'auth.signin.twoFactorPlaceholder': 'Enter 6-digit code',
    'auth.signin.backupCodePlaceholder': 'Enter backup code',
    'auth.signin.useBackupCode': 'Use backup code',
    'auth.signin.useAuthenticatorApp': 'Use authenticator app',
    'auth.signin.twoFactorDescription': 'Enter the code from your authenticator app',
    'auth.signin.backupCodeDescription': 'Enter one of your backup codes',
    'auth.signin.verifying': 'Verifying...',
    'auth.signin.verifySignIn': 'Verify & Sign In',
    'auth.signin.signIn': 'Sign In',
    'auth.signin.noAccount': "Don't have an account?",
    'auth.signin.signUp': 'Sign up',
    'common.loading': 'Loading...',
    'common.back': 'Back',
    'dashboard.title': 'Dashboard',
    'dashboard.subtitle': 'Manage your account and subscription',
    'dashboard.accountInfo.title': 'Account Information',
    'dashboard.accountInfo.name': 'Name',
    'dashboard.accountInfo.email': 'Email',
    'dashboard.accountInfo.role': 'Role',
    'dashboard.accountInfo.memberSince': 'Member since',
    'dashboard.accountInfo.notProvided': 'Not provided',
    'dashboard.accountInfo.editProfile': 'Edit Profile',
    'dashboard.subscription.title': 'Subscription',
    'dashboard.subscription.plan': 'Plan',
    'dashboard.subscription.status': 'Status',
    'dashboard.subscription.expires': 'Expires',
    'dashboard.subscription.manageSubscription': 'Manage Subscription',
    'dashboard.errors.loadUserData': 'Failed to load user data'
  }
  
  // Fallback when i18n is disabled - still remember language choice
  const savedLocale = ref('en')
  
  if (process.client) {
    const stored = localStorage.getItem('i18n_locale') || 
                  document.cookie.split('; ').find(row => row.startsWith('i18n_locale='))?.split('=')[1]
    if (stored && (stored === 'en' || stored === 'et')) {
      savedLocale.value = stored
    }
  }
  
  const availableLocales = [
    { code: 'en', name: 'English' },
    { code: 'et', name: 'Eesti' }
  ]
  
  const etFallbacks = {
    'home.title': 'Tere tulemast Vibe Starterisse',
    'home.subtitle': 'Teie täielik kasutaja- ja tellimushalduse platvorm',
    'home.getStarted': 'Alusta',
    'home.goDashboard': 'Mine juhtpaneeli',
    'nav.signin': 'Logi sisse',
    'nav.signup': 'Registreeru',
    'home.features.userManagement.title': 'Kasutajahaldus',
    'home.features.userManagement.description': 'Täielik kasutaja autentimise ja profiilihalduse süsteem',
    'home.features.subscriptionTiers.title': 'Tellimuste tasemed',
    'home.features.subscriptionTiers.description': 'Premium ja Donator plaanid kaunite kasutajaliidestega',
    'home.features.secureScalable.title': 'Turvaline ja skaleeruv',
    'home.features.secureScalable.description': 'Ehitatud kaasaegsete turvapraktikatega ja skaleeruva arhitektuuriga',
    'auth.signin.title': 'Logi sisse',
    'auth.signin.email': 'E-post',
    'auth.signin.password': 'Parool',
    'auth.signin.twoFactorCode': 'Kahefaktoriline autentimiskood',
    'auth.signin.twoFactorPlaceholder': 'Sisesta 6-kohaline kood',
    'auth.signin.backupCodePlaceholder': 'Sisesta varukood',
    'auth.signin.useBackupCode': 'Kasuta varukoodi',
    'auth.signin.useAuthenticatorApp': 'Kasuta autentimisrakendust',
    'auth.signin.twoFactorDescription': 'Sisesta kood oma autentimisrakendusest',
    'auth.signin.backupCodeDescription': 'Sisesta üks oma varukoodidest',
    'auth.signin.verifying': 'Kontrollin...',
    'auth.signin.verifySignIn': 'Kontrolli ja logi sisse',
    'auth.signin.signIn': 'Logi sisse',
    'auth.signin.noAccount': 'Pole kontot?',
    'auth.signin.signUp': 'Registreeru',
    'auth.signup.title': 'Registreeru',
    'auth.signup.nameOptional': 'Nimi (Valikuline)',
    'auth.signup.email': 'E-post',
    'auth.signup.password': 'Parool',
    'auth.signup.confirmPassword': 'Kinnita parool',
    'auth.signup.creating': 'Loon kontot...',
    'auth.signup.createAccount': 'Registreeru',
    'auth.signup.hasAccount': 'Juba on konto?',
    'auth.signup.signIn': 'Logi sisse',
    'common.loading': 'Laadimine...',
    'common.back': 'Tagasi',
    'dashboard.title': 'Juhtpaan',
    'dashboard.subtitle': 'Halda oma kontot ja tellimust',
    'dashboard.accountInfo.title': 'Konto informatsioon',
    'dashboard.accountInfo.name': 'Nimi',
    'dashboard.accountInfo.email': 'E-post',
    'dashboard.accountInfo.role': 'Roll',
    'dashboard.accountInfo.memberSince': 'Liige alates',
    'dashboard.accountInfo.notProvided': 'Pole esitatud',
    'dashboard.accountInfo.editProfile': 'Muuda profiili',
    'dashboard.subscription.title': 'Tellimus',
    'dashboard.subscription.plan': 'Plaan',
    'dashboard.subscription.status': 'Olek',
    'dashboard.subscription.expires': 'Aegub',
    'dashboard.subscription.manageSubscription': 'Halda tellimust',
    'dashboard.errors.loadUserData': 'Kasutaja andmete laadimine ebaõnnestus',
    'profile.title': 'Kasutaja profiil',
    'profile.subtitle': 'Halda oma isikuandmeid ja konto seadeid',
    'profile.personalInfo': 'Isikuandmed',
    'profile.changePassword': 'Muuda parooli',
    'profile.updateProfile': 'Uuenda profiili',
    'subscription.title': 'Vali oma plaan',
    'subscription.subtitle': 'Ava premium funktsioonid või toeta meie missiooni',
    'subscription.premium.title': 'Premium',
    'subscription.donator.title': 'Annetaja',
    'security.twoFactorSetup': 'Seadista kahefaktoriline autentimine'
  }
  
  const fallbackSetLocale = (newLocale: string) => {
    if (newLocale === 'en' || newLocale === 'et') {
      savedLocale.value = newLocale
      if (process.client) {
        localStorage.setItem('i18n_locale', newLocale)
        document.cookie = `i18n_locale=${newLocale}; path=/; max-age=31536000; SameSite=Lax`
      }
    }
  }
  
  const fallbackT = (key: string) => {
    if (savedLocale.value === 'et' && etFallbacks[key]) {
      return etFallbacks[key]
    }
    return fallbackTranslations[key] || key
  }
  
  return {
    t: fallbackT,
    locale: savedLocale,
    locales: ref(availableLocales),
    setLocale: fallbackSetLocale,
    enabled: false
  }
}