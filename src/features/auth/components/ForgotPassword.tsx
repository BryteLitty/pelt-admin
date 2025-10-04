import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Button } from '@/core/components/ui/button'
import { Input } from '@/core/components/ui/input'
import { Label } from '@/core/components/ui/label'
import { useTheme } from '@/core/context/theme-context'
import { useRequestPasswordResetMutation } from '@/core/store'
import { useSimpleToast } from '@/core/hooks/useSimpleToast'
import { passwordResetSchema, type PasswordResetFormData } from '../types'
import { CryptoIllustration } from './CryptoIllustration'

import logoTextDark from '@/assets/brand/logo-text-dark.png'
import logoTextWhite from '@/assets/brand/logo-text-white.png'

export function ForgotPassword() {
  const { theme } = useTheme()
  const [requestPasswordReset, { isLoading }] = useRequestPasswordResetMutation()
  const toast = useSimpleToast()
  
  const [formData, setFormData] = useState<PasswordResetFormData>({
    email: '',
  })
  const [errors, setErrors] = useState<Partial<PasswordResetFormData>>({})
  const [isSuccess, setIsSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    const result = passwordResetSchema.safeParse(formData)
    if (!result.success) {
      const fieldErrors: Partial<PasswordResetFormData> = {}
      result.error.issues.forEach((error) => {
        if (error.path[0]) {
          fieldErrors[error.path[0] as keyof PasswordResetFormData] = error.message
        }
      })
      setErrors(fieldErrors)
      return
    }
    
    setErrors({})
    
    try {
      await requestPasswordReset(formData).unwrap()
      toast.success('Check your inbox and click the reset link.', {
        title: 'Reset link sent!',
      })
      setIsSuccess(true)
    } catch (error: unknown) {
      console.error('Password reset error:', error)
      const errorMessage = (error as { data?: { message?: string } })?.data?.message || 'Failed to send reset email. Please try again.'
      toast.error(errorMessage, {
        title: 'Failed to send reset email',
      })
      setErrors({
        email: errorMessage
      })
    }
  }

  const handleChange = (field: keyof PasswordResetFormData) => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setFormData(prev => ({ ...prev, [field]: e.target.value }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }))
    }
  }

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
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold mb-2">Check your email</h1>
            <p className="text-muted-foreground mb-8">
              We've sent a password reset link to<br />
              <span className="font-medium">{formData.email}</span>
            </p>
          </div>

          <div className="space-y-4">
            <Button asChild className="w-full">
              <Link to="/login">
                Back to Sign In
              </Link>
            </Button>
          </div>

          <p className="text-sm text-muted-foreground mt-6">
            Didn't receive the email? Check your spam folder or{' '}
            <button
              onClick={() => {
                setIsSuccess(false)
                setFormData({ email: '' })
              }}
              className="text-primary hover:underline"
            >
              try again
            </button>
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex">
      {/* Left side - Illustration */}
      <div className="hidden lg:flex lg:w-1/2 bg-muted items-center justify-center p-12">
        <div className="max-w-md">
          <CryptoIllustration className="mb-8" />
          <h2 className="text-2xl font-bold text-center mb-4">
            Reset Your Password
          </h2>
          <p className="text-muted-foreground text-center">
            Secure password recovery for your Pelt account. We'll send you a link to reset your password safely.
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
            <h1 className="text-2xl font-bold mb-2">Forgot your password?</h1>
            <p className="text-muted-foreground">
              Enter your email and we'll send you a password reset link
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange('email')}
                className={errors.email ? 'border-destructive' : ''}
              />
              {errors.email && (
                <p className="text-sm text-destructive">{errors.email}</p>
              )}
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? 'Sending link...' : 'Send Reset Link'}
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