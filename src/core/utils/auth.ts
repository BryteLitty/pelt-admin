interface Role {
  id: string
  userId: string
  roleId: string
  assignedBy: string | null
  createdAt: string
  role: {
    id: string
    name: string
    description: string
    clearanceLevel: string
    createdAt: string
    updatedAt: string
  }
}

interface User {
  id: string
  email: string
  firstName: string | null
  lastName: string | null
  passwordHash?: string
  googleId: string | null
  authProvider: string
  userGroup: string
  status: string
  emailVerified: boolean
  mfaEnabled: boolean
  mfaType: string | null
  mfaSecret?: string | null
  createdAt: string
  updatedAt: string
  lastLoginAt: string | null
  roles: Role[]
}

export const ALLOWED_ROLES = ['SUPERADMIN', 'ADMIN', 'MEMBER'] as const

export function hasAuthorizedRole(user: User | null): boolean {
  return user?.roles?.some(userRole =>
    ALLOWED_ROLES.includes(userRole.role.name as any)
  ) ?? false
}

export function getUserHighestRole(user: User | null): string {
  if (!user?.roles?.length) return 'USER'

  // Priority order: SUPERADMIN > ADMIN > MEMBER > USER
  const roleHierarchy = {
    SUPERADMIN: 4,
    ADMIN: 3,
    MEMBER: 2,
    USER: 1
  } as const

  const highestRole = user.roles
    .map(userRole => userRole.role.name)
    .sort((a, b) => (roleHierarchy[b as keyof typeof roleHierarchy] || 0) - (roleHierarchy[a as keyof typeof roleHierarchy] || 0))[0]

  return highestRole || 'USER'
}

export function getUserDisplayName(user: User | null): string {
  if (!user) return ''

  if (user.firstName && user.lastName) {
    return `${user.firstName} ${user.lastName}`
  }

  if (user.firstName) return user.firstName
  if (user.lastName) return user.lastName

  return user.email
}