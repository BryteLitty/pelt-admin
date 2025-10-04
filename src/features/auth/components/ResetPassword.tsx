import { useState, useEffect } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { Button } from '@/core/components/ui/button'
import { Input } from '@/core/components/ui/input'
import { Label } from '@/core/components/ui/label'
import { useTheme } from '@/core/context/theme-context'
import { useCompletePasswordResetMutation } from '@/core/store'
import { useSimpleToast } from '@/core/hooks/useSimpleToast'
import { Eye, EyeOff, CheckCircle } from 'lucide-react'
import { CryptoIllustration } from './CryptoIllustration'

import logoTextDark from '@/assets/brand/logo-text-dark.png'
import logoTextWhite from '@/assets/brand/logo-text-white.png'

interface ResetPasswordFormData {
  newPassword: string
  confirmPassword: string
}

export function ResetPassword() {
  const { theme } = useTheme()
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const [completePasswordReset, { isLoading }] = useCompletePasswordResetMutation()
  const toast = useSimpleToast()

  const [formData, setFormData] = useState<ResetPasswordFormData>({
    newPassword: '',
    confirmPassword: '',
  })
  const [errors, setErrors] = useState<Partial<ResetPasswordFormData>>({})
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [sessionError, setSessionError] = useState<string | null>(null)

  // Check for error from backend redirect
  useEffect(() => {
    const error = searchParams.get('error')
    if (error) {
      setSessionError(decodeURIComponent(error))
    }
  }, [searchParams])

  const validateForm = (): boolean => {
    const newErrors: Partial<ResetPasswordFormData> = {}

    if (!formData.newPassword) {
      newErrors.newPassword = 'New password is required'
    } else if (formData.newPassword.length < 8) {
      newErrors.newPassword = 'Password must be at least 8 characters'
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password'
    } else if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    try {
      await completePasswordReset({
        newPassword: formData.newPassword
      }).unwrap()

      toast.success('Your password has been successfully reset.', {
        title: 'Password Reset Successful!',
      })
      setIsSuccess(true)

      // Redirect to login after 3 seconds
      setTimeout(() => {
        navigate('/login')
      }, 3000)
    } catch (error: unknown) {
      console.error('Password reset error:', error)
      const errorMessage = (error as { data?: { message?: string } })?.data?.message || 'Failed to reset password. Please try again.'

      if (errorMessage.includes('session') || errorMessage.includes('expired')) {
        setSessionError(errorMessage)
      } else {
        toast.error(errorMessage, {
          title: 'Password Reset Failed',
        })
        setErrors({ newPassword: errorMessage })
      }
    }
  }

  const handleChange = (field: keyof ResetPasswordFormData) => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setFormData(prev => ({ ...prev, [field]: e.target.value }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }))
    }
  }

  // Success screen
  if (isSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <div className="w-full max-w-md text-center">
          <div className="mb-8">
            <Link to="/">
              <img
                src={theme === 'dark' ? logoTextWhite : logoTextDark}
                alt="Pelt"
                className="h-8 mx-auto mb-6 hover:opacity-80 transition-opacity"
              />
            </Link>
            <div className="w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <h1 className="text-2xl font-bold mb-2">Password Reset Successful</h1>
            <p className="text-muted-foreground mb-8">
              Your password has been successfully updated. You will be redirected to the login page shortly.
            </p>
          </div>

          <Button asChild className="w-full">
            <Link to="/login">
              Continue to Sign In
            </Link>
          </Button>
        </div>
      </div>
    )
  }

  // Error screen (invalid/expired session)
  if (sessionError) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <div className="w-full max-w-md text-center">
          <div className="mb-8">
            <Link to="/">
              <img
                src={theme === 'dark' ? logoTextWhite : logoTextDark}
                alt="Pelt"
                className="h-8 mx-auto mb-6 hover:opacity-80 transition-opacity"
              />
            </Link>
            <div className="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-destructive" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 18.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold mb-2">Reset Link Invalid</h1>
            <p className="text-muted-foreground mb-8">
              {sessionError}
            </p>
          </div>

          <div className="space-y-4">
            <Button asChild className="w-full">
              <Link to="/forgot-password">
                Request New Reset Link
              </Link>
            </Button>
            <Button variant="outline" asChild className="w-full">
              <Link to="/login">
                Back to Sign In
              </Link>
            </Button>
          </div>
        </div>
      </div>
    )
  }

  // Main reset form
  return (
    <div className="min-h-screen flex">
      {/* Left side - Illustration */}
      <div className="hidden lg:flex lg:w-1/2 bg-muted items-center justify-center p-12">
        <div className="max-w-md">
          <CryptoIllustration className="mb-8" />
          <h2 className="text-2xl font-bold text-center mb-4">
            Create New Password
          </h2>
          <p className="text-muted-foreground text-center">
            Choose a strong password to secure your Pelt account.
          </p>
        </div>
      </div>

      {/* Right side - Form */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <Link to="/">
              <img
                src={theme === 'dark' ? logoTextWhite : logoTextDark}
                alt="Pelt"
                className="h-8 mx-auto mb-6 hover:opacity-80 transition-opacity"
              />
            </Link>
            <h1 className="text-2xl font-bold mb-2">Create New Password</h1>
            <p className="text-muted-foreground">
              Choose a strong password for your account
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="newPassword">New Password</Label>
              <div className="relative">
                <Input
                  id="newPassword"
                  type={showNewPassword ? 'text' : 'password'}
                  placeholder="Enter new password"
                  value={formData.newPassword}
                  onChange={handleChange('newPassword')}
                  className={`pr-10 ${errors.newPassword ? 'border-destructive' : ''}`}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                >
                  {showNewPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
              </div>
              {errors.newPassword && (
                <p className="text-sm text-destructive">{errors.newPassword}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder="Confirm new password"
                  value={formData.confirmPassword}
                  onChange={handleChange('confirmPassword')}
                  className={`pr-10 ${errors.confirmPassword ? 'border-destructive' : ''}`}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
              </div>
              {errors.confirmPassword && (
                <p className="text-sm text-destructive">{errors.confirmPassword}</p>
              )}
            </div>

            <div className="text-sm text-muted-foreground">
              <p>Password requirements:</p>
              <ul className="list-disc list-inside mt-1 space-y-1">
                <li>At least 8 characters long</li>
                <li>Mix of letters, numbers, and symbols recommended</li>
              </ul>
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? 'Resetting Password...' : 'Reset Password'}
            </Button>
          </form>

          <p className="text-center text-sm text-muted-foreground mt-6">
            Remember your password?{' '}
            <Link
              to="/login"
              className="text-primary hover:underline font-medium"
            >
              Back to Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}