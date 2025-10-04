import { useState } from 'react'
import { DataTable } from '@/core/components/DataTable'
import { Button } from '@/core/components/ui/button'
import { RefreshCw } from 'lucide-react'
import { useGetGeneralUsersQuery, type GeneralUser } from '@/core/store'
import { useAppSelector } from '@/core/store/hooks'
import { getUserHighestRole } from '@/core/utils/auth'
import { generalUserColumns } from './general-user-columns'
import { UserViewModal } from './UserViewModal'
import { useSimpleToast } from '@/core/hooks/useSimpleToast'

export function UsersTab() {
  const { user: currentUser } = useAppSelector((state) => state.auth)
  const [isUserViewModalOpen, setIsUserViewModalOpen] = useState(false)
  const [selectedUser, setSelectedUser] = useState<GeneralUser | null>(null)
  const toast = useSimpleToast()

  const {
    data: generalUsers = [],
    isLoading,
    isError,
    refetch
  } = useGetGeneralUsersQuery()

  const currentUserRole = getUserHighestRole(currentUser)

  const handleRefresh = () => {
    refetch()
    toast.success('Users list refreshed')
  }

  const handleViewUser = (user: GeneralUser) => {
    setSelectedUser(user)
    setIsUserViewModalOpen(true)
  }

  const handleEditUser = (user: GeneralUser) => {
    console.log('Edit general user:', user.id)
    toast.info('Edit user functionality coming soon')
    setIsUserViewModalOpen(false)
  }

  if (isError) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold">General Users</h3>
            <p className="text-sm text-muted-foreground">
              Manage general user accounts
            </p>
          </div>
          <Button onClick={handleRefresh} variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Retry
          </Button>
        </div>
        <div className="text-center py-8">
          <p className="text-destructive">Failed to load users. Please try again.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">General Users</h3>
          <p className="text-sm text-muted-foreground">
            Manage general user accounts
          </p>
        </div>
        <div className="flex gap-2">
          <Button onClick={handleRefresh} variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading users...</p>
          </div>
        </div>
      ) : (
        <DataTable
          data={generalUsers}
          columns={generalUserColumns({
            userRole: currentUserRole,
            onViewUser: handleViewUser,
          })}
          emptyMessage="No users found"
        />
      )}

      <UserViewModal
        open={isUserViewModalOpen}
        onOpenChange={setIsUserViewModalOpen}
        user={selectedUser}
        onEditUser={handleEditUser}
      />
    </div>
  )
}