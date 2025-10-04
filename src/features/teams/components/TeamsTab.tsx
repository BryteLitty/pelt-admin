import { useState } from 'react'
import { DataTable } from '@/core/components/DataTable'
import { Button } from '@/core/components/ui/button'
import { Plus, RefreshCw } from 'lucide-react'
import { useGetAdminUsersQuery, type AdminUser } from '@/core/store'
import { useAppSelector } from '@/core/store/hooks'
import { getUserHighestRole } from '@/core/utils/auth'
import { adminUserColumns } from './admin-user-columns'
import { CreateUserDialog } from './CreateUserDialog'
import { UserViewModal } from './UserViewModal'
import { useSimpleToast } from '@/core/hooks/useSimpleToast'

export function TeamsTab() {
  const { user: currentUser } = useAppSelector((state) => state.auth)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isUserViewModalOpen, setIsUserViewModalOpen] = useState(false)
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null)
  const toast = useSimpleToast()

  const {
    data: adminUsers = [],
    isLoading,
    isError,
    refetch
  } = useGetAdminUsersQuery()

  const currentUserRole = getUserHighestRole(currentUser)
  const isSuperAdmin = currentUserRole === 'SUPERADMIN'

  const handleRefresh = () => {
    refetch()
    toast.success('Admin users list refreshed')
  }

  const handleViewUser = (user: AdminUser) => {
    setSelectedUser(user)
    setIsUserViewModalOpen(true)
  }

  const handleEditUser = (user: AdminUser) => {
    console.log('Edit user:', user.id)
    toast.info('Edit user functionality coming soon')
    setIsUserViewModalOpen(false)
  }

  if (isError) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold">Admin Users</h3>
            <p className="text-sm text-muted-foreground">
              Manage admin user accounts and permissions
            </p>
          </div>
          <Button onClick={handleRefresh} variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Retry
          </Button>
        </div>
        <div className="text-center py-8">
          <p className="text-destructive">Failed to load admin users. Please try again.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Admin Users</h3>
          <p className="text-sm text-muted-foreground">
            Manage admin user accounts and permissions
          </p>
        </div>
        <div className="flex gap-2">
          <Button onClick={handleRefresh} variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          {isSuperAdmin && (
            <Button onClick={() => setIsCreateDialogOpen(true)} size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Add Admin User
            </Button>
          )}
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading admin users...</p>
          </div>
        </div>
      ) : (
        <DataTable
          data={adminUsers}
          columns={adminUserColumns({
            userRole: currentUserRole,
            onViewUser: handleViewUser,
          })}
          emptyMessage="No admin users found"
        />
      )}

      {isSuperAdmin && (
        <CreateUserDialog
          open={isCreateDialogOpen}
          onOpenChange={setIsCreateDialogOpen}
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