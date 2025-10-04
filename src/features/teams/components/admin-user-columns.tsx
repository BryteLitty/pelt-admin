import type { Column } from '@/core/components/DataTable'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/core/components/ui/button'
import { Eye } from 'lucide-react'
import type { AdminUser } from '@/core/store'
import { getUserDisplayName } from '@/core/utils/auth'

interface AdminUserColumnsProps {
  userRole: string
  onViewUser?: (user: AdminUser) => void
}

export const adminUserColumns = (props: AdminUserColumnsProps): Column<AdminUser>[] => {
  const { userRole, onViewUser } = props
  const canSeeActions = ['ADMIN', 'SUPERADMIN'].includes(userRole)

  return [
  {
    key: 'name',
    title: 'Name',
    render: (_, user) => {
      const displayName = getUserDisplayName(user)
      return (
        <div className="flex flex-col">
          <span className="font-medium">{displayName}</span>
          <span className="text-sm text-muted-foreground">{user.email}</span>
        </div>
      )
    }
  },
  {
    key: 'role',
    title: 'Role',
    render: (_, user) => {
      const role = user.roles?.[0]?.role?.name || 'No Role'
      const variant = role === 'SUPERADMIN' ? 'destructive' :
                    role === 'ADMIN' ? 'default' : 'secondary'

      return <Badge variant={variant}>{role}</Badge>
    }
  },
  {
    key: 'status',
    title: 'Status',
    render: (_, user) => {
      const isActive = user.status === 'ACTIVE'
      return (
        <Badge variant={isActive ? 'default' : 'secondary'}>
          {isActive ? 'Active' : user.status}
        </Badge>
      )
    }
  },
  {
    key: 'emailVerified',
    title: 'Email Verified',
    render: (value) => (
      <Badge variant={value ? 'default' : 'destructive'}>
        {value ? 'Verified' : 'Unverified'}
      </Badge>
    )
  },
  {
    key: 'lastLoginAt',
    title: 'Last Login',
    render: (value) => value
      ? new Date(value).toLocaleDateString()
      : 'Never'
  },
  {
    key: 'createdAt',
    title: 'Created',
    render: (value) => new Date(value).toLocaleDateString()
  },
  ...(canSeeActions ? [{
    key: 'actions' as keyof AdminUser,
    title: 'Actions',
    render: (_: any, user: AdminUser) => (
      <Button
        variant="ghost"
        size="sm"
        onClick={() => onViewUser?.(user)}
      >
        <Eye className="h-4 w-4 mr-2" />
        View
      </Button>
    )
  }] : [])
  ]
}