import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { DashboardLayout } from '@/features/dashboard/components/DashboardLayout'
import { TeamsTab } from './components/TeamsTab'
import { UsersTab } from './components/UsersTab'
import { useAppSelector } from '@/core/store/hooks'
import { getUserHighestRole } from '@/core/utils/auth'

export function TeamManagement() {
  const { user: currentUser } = useAppSelector((state) => state.auth)
  const currentUserRole = getUserHighestRole(currentUser)

  // Permission levels based on ROLE_IMPLEMENTATION.md
  const canViewAdminUsers = ['ADMIN', 'SUPERADMIN'].includes(currentUserRole)
  const canViewGeneralUsers = ['MEMBER', 'ADMIN', 'SUPERADMIN'].includes(currentUserRole)

  // Default tab based on role
  const defaultTab = currentUserRole === 'MEMBER' ? 'users' : 'teams'

  return (
    <DashboardLayout
      title="Team Management"
      subtitle={
        currentUserRole === 'MEMBER'
          ? "View user information"
          : "Manage teams and users"
      }
    >
      <div className="space-y-6">
        <Tabs defaultValue={defaultTab} className="space-y-4">
          <TabsList>
            {canViewAdminUsers && (
              <TabsTrigger value="teams">Admin Users</TabsTrigger>
            )}
            {canViewGeneralUsers && (
              <TabsTrigger value="users">General Users</TabsTrigger>
            )}
          </TabsList>

          {canViewAdminUsers && (
            <TabsContent value="teams" className="space-y-4">
              <TeamsTab />
            </TabsContent>
          )}

          {canViewGeneralUsers && (
            <TabsContent value="users" className="space-y-4">
              <UsersTab />
            </TabsContent>
          )}
        </Tabs>
      </div>
    </DashboardLayout>
  )
}