import type { Column } from '@/core/components/DataTable'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/core/components/ui/button'
import { Eye } from 'lucide-react'
import type { GeneralUser } from '@/core/store'
import { getUserDisplayName } from '@/core/utils/auth'

interface GeneralUserColumnsProps {
  userRole: string
  onViewUser?: (user: GeneralUser) => void
}

export const generalUserColumns = (props: GeneralUserColumnsProps): Column<GeneralUser>[] => {
  const { userRole, onViewUser } = props
  const canSeeActions = ['MEMBER', 'ADMIN', 'SUPERADMIN'].includes(userRole)

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
    key: 'actions' as keyof GeneralUser,
    title: 'Actions',
    render: (_: any, user: GeneralUser) => (
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