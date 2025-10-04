import { useState } from 'react'
import { Button } from '@/core/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/core/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { Label } from '@/core/components/ui/label'
import {
  Edit,
  UserX,
  UserCheck,
  UserPlus,
  UserMinus,
  Trash2,
  Mail,
  Calendar,
  Shield
} from 'lucide-react'
import {
  useGetRolesQuery,
  useAssignRoleMutation,
  useRemoveRoleMutation,
  useUpdateUserStatusMutation,
  type AdminUser,
  type GeneralUser,
} from '@/core/store'
import { useAppSelector } from '@/core/store/hooks'
import { getUserHighestRole } from '@/core/utils/auth'
import { useSimpleToast } from '@/core/hooks/useSimpleToast'
import { DeleteUserDialog } from './DeleteUserDialog'

interface UserViewModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  user: AdminUser | GeneralUser | null
  onEditUser?: (user: AdminUser | GeneralUser) => void
}

export function UserViewModal({ open, onOpenChange, user, onEditUser }: UserViewModalProps) {
  const { user: currentUser } = useAppSelector((state) => state.auth)
  const { data: roles = [] } = useGetRolesQuery()
  const [assignRole, { isLoading: isAssigningRole }] = useAssignRoleMutation()
  const [removeRole, { isLoading: isRemovingRole }] = useRemoveRoleMutation()
  const [updateUserStatus, { isLoading: isUpdatingStatus }] = useUpdateUserStatusMutation()
  const toast = useSimpleToast()

  const [selectedRoleId, setSelectedRoleId] = useState('')
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [removingRoleId, setRemovingRoleId] = useState<string | null>(null)

  if (!user || !currentUser) return null

  const currentUserRole = getUserHighestRole(currentUser)
  const isSuperAdmin = currentUserRole === 'SUPERADMIN'
  const isAdmin = currentUserRole === 'ADMIN'
  const isMember = currentUserRole === 'MEMBER'

  // Debug logging for MEMBER permissions
  console.log('UserViewModal Debug:', {
    currentUserRole,
    isMember,
    user: { id: user.id, email: user.email, userGroup: user.userGroup },
    isAdminUser: user.userGroup === 'ADMIN'
  })

  // Check if user is an admin user (userGroup should be 'ADMIN' for admin users)
  const isAdminUser = user.userGroup === 'ADMIN'
  const adminUser = user as AdminUser

  // Get the target user's highest role if it's an admin user
  const targetUserRole = isAdminUser && adminUser.roles?.length > 0
    ? adminUser.roles[0].role.name
    : 'USER'

  // Permission logic
  let canEdit = false
  let canSuspend = false
  let canManageRoles = false
  let canDelete = false

  if (isSuperAdmin) {
    canEdit = true
    canSuspend = true
    canManageRoles = true  // SUPERADMIN can manage roles for all users
    canDelete = true
  } else if (isAdmin) {
    if (isAdminUser) {
      canEdit = !['SUPERADMIN'].includes(targetUserRole)
      canSuspend = !['SUPERADMIN'].includes(targetUserRole)
      canManageRoles = false
      canDelete = false
    } else {
      canEdit = true
      canSuspend = true
      canManageRoles = false
      canDelete = false
    }
  } else if (isMember) {
    if (!isAdminUser) {
      canEdit = false
      canSuspend = true
      canManageRoles = false
      canDelete = false

      console.log('MEMBER permissions for general user:', {
        canEdit,
        canSuspend,
        canManageRoles,
        canDelete
      })
    } else {
      console.log('MEMBER cannot manage admin users')
    }
  }

  // Final permission summary
  console.log('Final permissions:', {
    currentUserRole,
    targetUser: user.email,
    canEdit,
    canSuspend,
    canManageRoles,
    canDelete
  })

  // Get available roles for assignment
  const availableRoles = user.roles && user.roles.length > 0
    ? roles.filter(role => !user.roles.some(userRole => userRole.role.name === role.name))
    : roles

  // Get current roles for removal - commented out as not used
  // const currentRoles = isAdminUser ? adminUser.roles || [] : []

  const handleAssignRole = async () => {
    if (!selectedRoleId) {
      toast.error('Please select a role to assign')
      return
    }

    try {
      await assignRole({
        userId: user.id,
        roleId: selectedRoleId,
        assignedBy: currentUser.id
      }).unwrap()
      toast.success('Role assigned successfully')
      setSelectedRoleId('')
    } catch (error: any) {
      toast.error(error?.data?.message || 'Failed to assign role')
    }
  }

  const handleRemoveRole = async (roleId: string) => {
    setRemovingRoleId(roleId)
    try {
      await removeRole({
        userId: user.id,
        roleId
      }).unwrap()
      toast.success('Role removed successfully')
    } catch (error: any) {
      toast.error(error?.data?.message || 'Failed to remove role')
    } finally {
      setRemovingRoleId(null)
    }
  }

  const handleStatusChange = async (status: 'ACTIVE' | 'SUSPENDED') => {
    try {
      await updateUserStatus({
        id: user.id,
        status
      }).unwrap()
      toast.success(`User ${status.toLowerCase()} successfully`)
    } catch (error: any) {
      toast.error(error?.data?.message || `Failed to ${status.toLowerCase()} user`)
    }
  }

  const displayName = user.firstName && user.lastName
    ? `${user.firstName} ${user.lastName}`
    : user.firstName || user.lastName || user.email

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              User Details
            </DialogTitle>
            <DialogDescription>
              View and manage user information and permissions
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6">
            {/* User Info */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-xs font-medium text-muted-foreground">NAME</Label>
                <p className="text-sm font-medium">{displayName}</p>
              </div>
              <div>
                <Label className="text-xs font-medium text-muted-foreground">STATUS</Label>
                <div className="mt-1">
                  <Badge variant={user.status === 'ACTIVE' ? 'default' : 'secondary'}>
                    {user.status}
                  </Badge>
                </div>
              </div>
              <div className="col-span-2">
                <Label className="text-xs font-medium text-muted-foreground">EMAIL</Label>
                <div className="flex items-center gap-2 mt-1">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{user.email}</span>
                  {user.emailVerified && (
                    <Badge variant="outline" className="text-xs">Verified</Badge>
                  )}
                </div>
              </div>
            </div>

            {/* User Roles */}
            {user.roles && user.roles.length > 0 && (
              <div>
                <Label className="text-xs font-medium text-muted-foreground">CURRENT ROLES</Label>
                <div className="mt-2 space-y-2">
                  {user.roles.map((userRole) => (
                    <div key={userRole.roleId} className="flex items-center justify-between p-2 border rounded-md">
                      <div>
                        <p className="text-sm font-medium">{userRole.role.name}</p>
                        <p className="text-xs text-muted-foreground">{userRole.role.description}</p>
                      </div>
                      {canManageRoles && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveRole(userRole.roleId)}
                          disabled={removingRoleId === userRole.roleId || isRemovingRole}
                        >
                          {removingRoleId === userRole.roleId ? (
                            <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                          ) : (
                            <UserMinus className="h-4 w-4" />
                          )}
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Assign Role */}
            {canManageRoles && availableRoles.length > 0 && (
              <div>
                <Label className="text-xs font-medium text-muted-foreground">ASSIGN NEW ROLE</Label>
                <div className="mt-2 flex gap-2">
                  <select
                    value={selectedRoleId}
                    onChange={(e) => setSelectedRoleId(e.target.value)}
                    className="flex-1 px-3 py-2 border border-input bg-background rounded-md text-sm"
                  >
                    <option value="">Select a role...</option>
                    {availableRoles.map((role) => (
                      <option key={role.id} value={role.id}>
                        {role.name} - {role.description}
                      </option>
                    ))}
                  </select>
                  <Button
                    onClick={handleAssignRole}
                    disabled={!selectedRoleId || isAssigningRole}
                  >
                    {isAssigningRole ? (
                      <>
                        <div className="h-4 w-4 mr-2 animate-spin rounded-full border-2 border-current border-t-transparent" />
                        Assigning...
                      </>
                    ) : (
                      <>
                        <UserPlus className="h-4 w-4 mr-2" />
                        Assign
                      </>
                    )}
                  </Button>
                </div>
              </div>
            )}

            {/* Timestamps */}
            <div className="grid grid-cols-2 gap-4 pt-4 border-t">
              <div>
                <Label className="text-xs font-medium text-muted-foreground">CREATED</Label>
                <div className="flex items-center gap-2 mt-1">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{new Date(user.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
              {user.lastLoginAt && (
                <div>
                  <Label className="text-xs font-medium text-muted-foreground">LAST LOGIN</Label>
                  <div className="flex items-center gap-2 mt-1">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{new Date(user.lastLoginAt).toLocaleDateString()}</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isAssigningRole || isRemovingRole || isUpdatingStatus}
            >
              Close
            </Button>

            {canEdit && (
              <Button
                variant="outline"
                onClick={() => onEditUser?.(user)}
                disabled={isAssigningRole || isRemovingRole || isUpdatingStatus}
              >
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </Button>
            )}

            {canSuspend && (
              <Button
                variant={user.status === 'ACTIVE' ? 'secondary' : 'default'}
                onClick={() => handleStatusChange(user.status === 'ACTIVE' ? 'SUSPENDED' : 'ACTIVE')}
                disabled={isUpdatingStatus}
              >
                {isUpdatingStatus ? (
                  <>
                    <div className="h-4 w-4 mr-2 animate-spin rounded-full border-2 border-current border-t-transparent" />
                    {user.status === 'ACTIVE' ? 'Suspending...' : 'Activating...'}
                  </>
                ) : user.status === 'ACTIVE' ? (
                  <>
                    <UserX className="h-4 w-4 mr-2" />
                    Suspend
                  </>
                ) : (
                  <>
                    <UserCheck className="h-4 w-4 mr-2" />
                    Activate
                  </>
                )}
              </Button>
            )}

            {canDelete && (
              <Button
                variant="destructive"
                onClick={() => setIsDeleteDialogOpen(true)}
                disabled={isAssigningRole || isRemovingRole || isUpdatingStatus}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <DeleteUserDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        user={user}
        onSuccess={() => onOpenChange(false)}
      />
    </>
  )
}