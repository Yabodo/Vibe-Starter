export type UserRole = 'USER' | 'MODERATOR' | 'ADMIN'

export const ROLES = {
  USER: 'USER',
  MODERATOR: 'MODERATOR', 
  ADMIN: 'ADMIN'
} as const

export function hasRole(userRole: string, requiredRole: UserRole): boolean {
  const roleHierarchy = {
    USER: 1,
    MODERATOR: 2,
    ADMIN: 3
  }
  
  return roleHierarchy[userRole as UserRole] >= roleHierarchy[requiredRole]
}

export function isAdmin(userRole: string): boolean {
  return userRole === ROLES.ADMIN
}

export function isModerator(userRole: string): boolean {
  return userRole === ROLES.MODERATOR || userRole === ROLES.ADMIN
}

export function canAccessAdminPanel(userRole: string): boolean {
  return userRole === ROLES.ADMIN
}

export function canAccessModeratorPanel(userRole: string): boolean {
  return userRole === ROLES.MODERATOR || userRole === ROLES.ADMIN
}

export function getUserRoleColor(role: string): string {
  switch (role) {
    case ROLES.ADMIN:
      return 'text-red-600 bg-red-100 dark:text-red-400 dark:bg-red-900/20'
    case ROLES.MODERATOR:
      return 'text-blue-600 bg-blue-100 dark:text-blue-400 dark:bg-blue-900/20'
    default:
      return 'text-gray-600 bg-gray-100 dark:text-gray-400 dark:bg-gray-900/20'
  }
}

export function getRoleDisplayName(role: string): string {
  switch (role) {
    case ROLES.ADMIN:
      return 'Administrator'
    case ROLES.MODERATOR:
      return 'Moderator'
    default:
      return 'User'
  }
}