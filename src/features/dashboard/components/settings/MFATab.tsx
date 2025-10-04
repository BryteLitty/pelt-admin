import { useState, useEffect } from 'react'
import { useAppSelector, useAppDispatch } from '@/core/store/hooks'
import { updateUser } from '@/core/store/slices/authSlice'
import { Button } from '@/core/components/ui/button'
import { Input } from '@/core/components/ui/input'
import { Label } from '@/core/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/core/components/ui/dialog'
import { Shield, ShieldCheck, Smartphone, Key, Copy, CheckCircle, Download, Printer, AlertTriangle } from 'lucide-react'
import { QRCodeSVG } from 'qrcode.react'
import {
  useSetupMFAMutation,
  useVerifyMFASetupMutation,
  useRegenerateBackupCodesMutation,
  useDisableMFAMutation,
  useGetProfileQuery
} from '@/core/store/api/authApi'
import { toast } from 'sonner'

export function MFATab() {
  const dispatch = useAppDispatch()
  const { user } = useAppSelector((state) => state.auth)
  const [isMFAEnabled, setIsMFAEnabled] = useState(user?.mfaEnabled || false)
  const [showSetupSteps, setShowSetupSteps] = useState(false)
  const [verificationCode, setVerificationCode] = useState('')
  const [secretKey, setSecretKey] = useState('')
  const [qrCodeUrl, setQrCodeUrl] = useState('')
  const [copied, setCopied] = useState(false)
  const [backupCodes, setBackupCodes] = useState<string[]>([])
  const [showBackupCodes, setShowBackupCodes] = useState(false)
  const [showDisableDialog, setShowDisableDialog] = useState(false)
  const [showRegenerateDialog, setShowRegenerateDialog] = useState(false)

  const { refetch: refetchProfile } = useGetProfileQuery()
  const [setupMFA, { isLoading: isSetupLoading }] = useSetupMFAMutation()
  const [verifyMFASetup, { isLoading: isVerifyLoading }] = useVerifyMFASetupMutation()
  const [regenerateBackupCodes, { isLoading: isRegeneratingCodes }] = useRegenerateBackupCodesMutation()
  const [disableMFA, { isLoading: isDisableLoading }] = useDisableMFAMutation()

  useEffect(() => {
    setIsMFAEnabled(user?.mfaEnabled || false)
  }, [user?.mfaEnabled])

  const handleEnableMFA = async () => {
    // Check if MFA is already enabled
    if (user?.mfaEnabled) {
      toast.info('MFA is already enabled for your account')
      return
    }

    try {
      console.log('🔐 Setting up MFA with type: TOTP')
      const response = await setupMFA({ type: 'TOTP' }).unwrap()
      console.log('✅ MFA setup response:', response)
      setSecretKey(response.secret)
      setQrCodeUrl(response.qrCodeUrl)
      setBackupCodes(response.backupCodes)
      setShowSetupSteps(true)
      toast.success('MFA setup initiated. Please scan the QR code.')
    } catch (error: any) {
      console.error('❌ MFA setup error:', error)

      // Handle specific error cases
      if (error?.status === 409 || error?.data?.message?.includes('already enabled')) {
        // Refetch profile to sync state
        const { data: updatedProfile } = await refetchProfile()
        if (updatedProfile) {
          dispatch(updateUser(updatedProfile))
        }
        toast.info('MFA is already enabled for your account')
      } else {
        const errorMessage = error?.data?.message || error?.message || 'Failed to setup MFA'
        toast.error(errorMessage)
      }
    }
  }

  const handleDisableMFA = async () => {
    try {
      console.log('🔐 Disabling MFA...')
      await disableMFA().unwrap()

      // Refetch profile to update MFA status
      const { data: updatedProfile } = await refetchProfile()
      if (updatedProfile) {
        dispatch(updateUser(updatedProfile))
      }

      setIsMFAEnabled(false)
      setShowSetupSteps(false)
      setVerificationCode('')
      setBackupCodes([])
      setShowBackupCodes(false)
      setShowDisableDialog(false)
      toast.success('MFA disabled successfully')
    } catch (error: any) {
      console.error('❌ MFA disable error:', error)
      const errorMessage = error?.data?.message || error?.message || 'Failed to disable MFA'
      toast.error(errorMessage)
      setShowDisableDialog(false)
    }
  }

  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault()
    if (verificationCode.length !== 6) return

    try {
      await verifyMFASetup({ token: verificationCode }).unwrap()

      // Refetch profile to update MFA status
      const { data: updatedProfile } = await refetchProfile()
      if (updatedProfile) {
        dispatch(updateUser(updatedProfile))
      }

      setIsMFAEnabled(true)
      setShowSetupSteps(false)
      setVerificationCode('')
      setShowBackupCodes(true)
      toast.success('MFA enabled successfully! Please save your backup codes.')
    } catch (error: any) {
      toast.error(error?.data?.message || 'Invalid verification code')
    }
  }

  const handleCopySecret = () => {
    navigator.clipboard.writeText(secretKey)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
    toast.success('Secret key copied to clipboard')
  }

  const handleRegenerateBackupCodes = async () => {
    try {
      const response = await regenerateBackupCodes().unwrap()
      setBackupCodes(response.backupCodes)
      setShowBackupCodes(true)
      setShowRegenerateDialog(false)
      toast.success('New backup codes generated')
    } catch (error: any) {
      toast.error(error?.data?.message || 'Failed to regenerate backup codes')
    }
  }

  const handleDownloadBackupCodes = () => {
    const codesText = backupCodes.join('\n')
    const blob = new Blob([codesText], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'backup-codes.txt'
    a.click()
    URL.revokeObjectURL(url)
    toast.success('Backup codes downloaded')
  }

  const handlePrintBackupCodes = () => {
    const printWindow = window.open('', '', 'height=600,width=800')
    if (printWindow) {
      printWindow.document.write('<html><head><title>MFA Backup Codes</title></head><body>')
      printWindow.document.write('<h1>MFA Backup Codes</h1>')
      printWindow.document.write('<p>Save these codes in a secure location. Each code can only be used once.</p>')
      printWindow.document.write('<ul>')
      backupCodes.forEach(code => {
        printWindow.document.write(`<li>${code}</li>`)
      })
      printWindow.document.write('</ul>')
      printWindow.document.write('</body></html>')
      printWindow.document.close()
      printWindow.print()
    }
  }

  const handleBackupCodes = () => {
    setShowBackupCodes(!showBackupCodes)
  }

  return (
    <div className="space-y-6">
      {/* MFA Status Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            {isMFAEnabled ? (
              <ShieldCheck className="h-6 w-6 text-green-600" />
            ) : (
              <Shield className="h-6 w-6 text-yellow-600" />
            )}
            <div>
              <CardTitle>Two-Factor Authentication</CardTitle>
              <CardDescription>
                {isMFAEnabled
                  ? 'Your account is protected with two-factor authentication'
                  : 'Add an extra layer of security to your account'
                }
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Badge variant={isMFAEnabled ? 'default' : 'secondary'}>
                {isMFAEnabled ? 'Enabled' : 'Disabled'}
              </Badge>
              {isMFAEnabled && (
                <span className="text-sm text-muted-foreground">
                  Last used: 2 hours ago
                </span>
              )}
            </div>
            <div className="flex gap-2">
              {isMFAEnabled ? (
                <>
                  <Button variant="outline" onClick={handleBackupCodes}>
                    <Key className="h-4 w-4 mr-2" />
                    Backup Codes
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={() => setShowDisableDialog(true)}
                  >
                    Disable MFA
                  </Button>
                </>
              ) : (
                <Button onClick={handleEnableMFA} disabled={isSetupLoading}>
                  <Shield className="h-4 w-4 mr-2" />
                  {isSetupLoading ? 'Setting up...' : 'Enable MFA'}
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* MFA Setup Steps */}
      {showSetupSteps && (
        <Card>
          <CardHeader>
            <CardTitle>Set up Two-Factor Authentication</CardTitle>
            <CardDescription>
              Scan the QR code with your authenticator app
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* QR Code Section */}
            <div className="flex flex-col items-center gap-4">
              <div className="bg-white p-4 rounded-lg border">
                {qrCodeUrl && (
                  <img
                    src={qrCodeUrl}
                    alt="QR Code for MFA setup"
                    className="w-48 h-48"
                  />
                )}
              </div>

              {/* Secret Key - Collapsible */}
              <details className="w-full">
                <summary className="text-sm text-muted-foreground cursor-pointer hover:text-foreground">
                  Can't scan? Click to show manual setup key
                </summary>
                <div className="flex items-center gap-2 p-3 bg-muted rounded-lg mt-2">
                  <code className="text-xs font-mono flex-1 break-all">{secretKey}</code>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleCopySecret}
                  >
                    {copied ? (
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </details>
            </div>

            {/* Verification Form */}
            <form onSubmit={handleVerifyCode} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="verificationCode">
                  Enter the 6-digit code from your app
                </Label>
                <Input
                  id="verificationCode"
                  type="text"
                  placeholder="000000"
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, ''))}
                  className="max-w-xs text-center text-lg tracking-widest"
                  maxLength={6}
                  autoComplete="off"
                />
              </div>
              <div className="flex gap-2">
                <Button
                  type="submit"
                  disabled={verificationCode.length !== 6 || isVerifyLoading}
                >
                  {isVerifyLoading ? 'Verifying...' : 'Verify and Enable'}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowSetupSteps(false)}
                  disabled={isVerifyLoading}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Backup Codes */}
      {showBackupCodes && backupCodes.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Backup Recovery Codes</CardTitle>
            <CardDescription>
              Save these codes in a safe place. Each code can only be used once.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-2 p-4 bg-muted rounded-lg font-mono text-sm">
              {backupCodes.map((code, index) => (
                <div key={index} className="p-2 bg-background rounded">
                  {code}
                </div>
              ))}
            </div>
            <div className="mt-4 flex gap-2 flex-wrap">
              <Button
                variant="outline"
                onClick={() => {
                  const codesText = backupCodes.join('\n')
                  navigator.clipboard.writeText(codesText)
                  toast.success('Backup codes copied to clipboard')
                }}
              >
                <Copy className="h-4 w-4 mr-2" />
                Copy All
              </Button>
              <Button
                variant="outline"
                onClick={handleDownloadBackupCodes}
              >
                <Download className="h-4 w-4 mr-2" />
                Download
              </Button>
              <Button
                variant="outline"
                onClick={handlePrintBackupCodes}
              >
                <Printer className="h-4 w-4 mr-2" />
                Print
              </Button>
              <Button
                variant="outline"
                onClick={() => setShowBackupCodes(false)}
              >
                Done
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Recovery Information */}
      {isMFAEnabled && (
        <Card>
          <CardHeader>
            <CardTitle>Recovery Options</CardTitle>
            <CardDescription>
              Keep these options safe in case you lose access to your authenticator
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center gap-3">
                <Key className="h-5 w-5 text-muted-foreground" />
                <div>
                  <h4 className="font-medium">Backup Recovery Codes</h4>
                  <p className="text-sm text-muted-foreground">
                    Use these one-time codes if you can't access your authenticator
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" onClick={handleBackupCodes}>
                  {showBackupCodes ? 'Hide Codes' : 'View Codes'}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setShowRegenerateDialog(true)}
                >
                  <Key className="h-4 w-4 mr-2" />
                  Generate New Codes
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Disable MFA Confirmation Dialog */}
      <Dialog open={showDisableDialog} onOpenChange={setShowDisableDialog}>
        <DialogContent>
          <DialogHeader>
            <div className="flex items-center gap-3">
              <div className="p-3 bg-destructive/10 rounded-full">
                <AlertTriangle className="h-6 w-6 text-destructive" />
              </div>
              <div>
                <DialogTitle>Disable Two-Factor Authentication</DialogTitle>
                <DialogDescription className="mt-2">
                  Are you sure you want to disable MFA? This will reduce your account security and make it more vulnerable to unauthorized access.
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>
          <DialogFooter className="mt-6">
            <Button
              variant="outline"
              onClick={() => setShowDisableDialog(false)}
              disabled={isDisableLoading}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDisableMFA}
              disabled={isDisableLoading}
            >
              {isDisableLoading ? 'Disabling...' : 'Yes, Disable MFA'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Regenerate Backup Codes Confirmation Dialog */}
      <Dialog open={showRegenerateDialog} onOpenChange={setShowRegenerateDialog}>
        <DialogContent>
          <DialogHeader>
            <div className="flex items-center gap-3">
              <div className="p-3 bg-yellow-500/10 rounded-full">
                <Key className="h-6 w-6 text-yellow-600" />
              </div>
              <div>
                <DialogTitle>Regenerate Backup Codes</DialogTitle>
                <DialogDescription className="mt-2">
                  Are you sure you want to regenerate backup codes? All existing backup codes will be invalidated and will no longer work.
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>
          <DialogFooter className="mt-6">
            <Button
              variant="outline"
              onClick={() => setShowRegenerateDialog(false)}
              disabled={isRegeneratingCodes}
            >
              Cancel
            </Button>
            <Button
              onClick={handleRegenerateBackupCodes}
              disabled={isRegeneratingCodes}
            >
              {isRegeneratingCodes ? 'Generating...' : 'Yes, Regenerate Codes'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}