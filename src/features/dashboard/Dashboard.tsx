import { Link } from 'react-router-dom'
import { useAppSelector } from '@/core/store/hooks'
import { Button } from '@/core/components/ui/button'
import { Users } from 'lucide-react'
import { DashboardLayout } from './components/DashboardLayout'

export function Dashboard() {
  const { user } = useAppSelector((state) => state.auth)

  const getUserDisplayName = () => {
    if (user?.firstName && user?.lastName) {
      return `${user.firstName} ${user.lastName}`
    }
    if (user?.email) {
      return user.email.split('@')[0]
    }
    return 'Admin'
  }

  const getRoleDisplayName = () => {
    return user?.roles?.[0]?.role?.name || 'Administrator'
  }

  return (
    <DashboardLayout
      title={`Welcome back, ${getUserDisplayName()}!`}
      subtitle={`${getRoleDisplayName()} Dashboard`}
    >
      <div className="space-y-6">
        {/* User Management Card */}
        <div className="bg-card border border-border rounded-lg p-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6 text-primary" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold mb-2">Team Management</h3>
              <p className="text-muted-foreground text-sm mb-4">
                Manage teams, users, and handle team-related tasks.
              </p>
              <Link to="/dashboard/users">
                <Button variant="outline" size="sm">
                  Manage Teams
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}