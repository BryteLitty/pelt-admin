import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { DashboardLayout } from './components/DashboardLayout'
import { AccountTab } from './components/settings/AccountTab'
import { MFATab } from './components/settings/MFATab'

export function Settings() {
  return (
    <DashboardLayout
      title="Settings"
      subtitle="Manage your account and security settings"
    >
      <div className="space-y-6">
        <Tabs defaultValue="account" className="space-y-4">
          <TabsList>
            <TabsTrigger value="account">Account</TabsTrigger>
            <TabsTrigger value="mfa">Two-Factor Auth</TabsTrigger>
          </TabsList>

          <TabsContent value="account" className="space-y-4">
            <AccountTab />
          </TabsContent>

          <TabsContent value="mfa" className="space-y-4">
            <MFATab />
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}