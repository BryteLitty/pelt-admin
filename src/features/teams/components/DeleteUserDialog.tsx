import { Button } from '@/core/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/core/components/ui/dialog'
import { Trash2, AlertTriangle } from 'lucide-react'
import { useDeleteUserMutation, type AdminUser, type GeneralUser } from '@/core/store'
import { useSimpleToast } from '@/core/hooks/useSimpleToast'

interface DeleteUserDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  user: AdminUser | GeneralUser | null
  onSuccess?: () => void
}

export function DeleteUserDialog({ open, onOpenChange, user, onSuccess }: DeleteUserDialogProps) {
  const [deleteUser, { isLoading }] = useDeleteUserMutation()
  const toast = useSimpleToast()

  const handleDelete = async () => {
    if (!user) return

    try {
      await deleteUser(user.id).unwrap()
      toast.success('User deleted successfully')
      onOpenChange(false)
      onSuccess?.() // Close parent modal
    } catch (error: any) {
      console.error('Delete user error:', error)
      toast.error(error?.data?.message || 'Failed to delete user')
    }
  }

  if (!user) return null

  const displayName = user.firstName && user.lastName
    ? `${user.firstName} ${user.lastName}`
    : user.email

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-destructive/10">
              <AlertTriangle className="h-5 w-5 text-destructive" />
            </div>
            <div>
              <DialogTitle>Delete User</DialogTitle>
              <DialogDescription>
                This action cannot be undone.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="py-4">
          <p className="text-sm text-muted-foreground">
            Are you sure you want to permanently delete{' '}
            <span className="font-medium text-foreground">{displayName}</span>?
          </p>
          <div className="mt-3 rounded-md bg-destructive/5 p-3">
            <div className="flex items-start gap-2">
              <Trash2 className="h-4 w-4 text-destructive mt-0.5" />
              <div className="text-xs text-destructive">
                <p className="font-medium">This will permanently:</p>
                <ul className="mt-1 list-disc list-inside space-y-1">
                  <li>Delete the user account</li>
                  <li>Remove all associated data</li>
                  <li>Revoke all permissions and roles</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant="destructive"
            onClick={handleDelete}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <div className="h-4 w-4 mr-2 animate-spin rounded-full border-2 border-current border-t-transparent" />
                Deleting...
              </>
            ) : (
              <>
                <Trash2 className="h-4 w-4 mr-2" />
                Delete User
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}