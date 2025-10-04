import { DashboardLayout } from './components/DashboardLayout'

export function UserManagement() {
  return (
    <DashboardLayout
      title="User Management"
      subtitle="Manage users and their profiles"
    >
      <div className="space-y-6">
        {/* Simple Text Content */}
        <div className="bg-card border border-border rounded-lg p-6">
          <div className="text-center py-12">
            <h3 className="text-xl font-semibold mb-4">User Management System</h3>
            <p className="text-muted-foreground max-w-md mx-auto">
              This is where you would manage all users in the system. Features include viewing user profiles,
              managing permissions, and handling user-related administrative tasks.
            </p>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}