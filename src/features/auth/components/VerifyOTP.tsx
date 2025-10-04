import { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation, useSearchParams } from 'react-router-dom'
import { Button } from '@/core/components/ui/button'
import { Input } from '@/core/components/ui/input'
import { Label } from '@/core/components/ui/label'
import { useTheme } from '@/core/context/theme-context'
import { useVerifyOTPMutation, useAppDispatch, setCredentials } from '@/core/store'
import { useSimpleToast } from '@/core/hooks/useSimpleToast'
import { otpSchema, type OTPFormData } from '../types'

import logoTextDark from '@/assets/brand/logo-text-dark.png'
import logoTextWhite from '@/assets/brand/logo-text-white.png'

export function VerifyOTP() {
  const { theme } = useTheme()
  const navigate = useNavigate()
  const location = useLocation()
  const [searchParams] = useSearchParams()
  const dispatch = useAppDispatch()
  const [verifyOTP, { isLoading }] = useVerifyOTPMutation()
  const toast = useSimpleToast()

  // Get email from location state or search params
  const email = location.state?.email || searchParams.get('email') || ''
  // Get verification type (email-verification or password-reset)
  const verificationType = searchParams.get('type') || 'email-verification'

  const [formData, setFormData] = useState<OTPFormData>({
    otp: '',
  })
  const [errors, setErrors] = useState<Partial<OTPFormData>>({})
  const [countdown, setCountdown] = useState(60)
  const [canResend, setCanResend] = useState(false)

  // Countdown timer for resend
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000)
      return () => clearTimeout(timer)
    } else {
      setCanResend(true)
    }
  }, [countdown])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    const result = otpSchema.safeParse(formData)
    if (!result.success) {
      const fieldErrors: Partial<OTPFormData> = {}
      result.error.issues.forEach((error) => {
        if (error.path[0]) {
          fieldErrors[error.path[0] as keyof OTPFormData] = error.message
        }
      })
      setErrors(fieldErrors)
      return
    }
    
    setErrors({})
    
    try {
      const response = await verifyOTP({ email, otp: formData.otp }).unwrap()

      if (verificationType === 'password-reset') {
        // For password reset, the response should contain a reset token
        toast.success('Code verified! You can now reset your password.', {
          title: 'Verification Successful!',
        })
        // Navigate to reset password page with the token
        // Assuming the API returns a token for password reset
        navigate(`/reset-password?token=${response.token || 'verified'}`)
      } else {
        // For email verification during registration
        dispatch(setCredentials(response))
        toast.success('Welcome to Pelt Admin Dashboard.', {
          title: 'Email verified!',
        })
        navigate('/dashboard')
      }
    } catch (error: unknown) {
      console.error('OTP verification error:', error)
      const errorMessage = (error as { data?: { message?: string } })?.data?.message || 'Invalid OTP. Please try again.'
      toast.error(errorMessage, {
        title: 'Verification Failed',
      })
      setErrors({
        otp: errorMessage
      })
    }
  }

  const handleResendOTP = async () => {
    if (!canResend) return
    
    try {
      // TODO: Implement resend OTP API call
      console.log('Resending OTP to:', email)
      await new Promise(resolve => setTimeout(resolve, 500))
      
      toast.success('Check your email for the new verification code.', {
        title: 'OTP resent!',
      })
      setCountdown(60)
      setCanResend(false)
    } catch (error) {
      console.error('Resend OTP error:', error)
      toast.error('Please try again later.', {
        title: 'Failed to resend OTP',
      })
    }
  }

  const handleOTPInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 6)
    setFormData({ otp: value })
    if (errors.otp) {
      setErrors({})
    }
  }

  // Redirect if no email provided
  if (!email) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Invalid Access</h1>
          <p className="text-muted-foreground mb-6">
            Please start the registration process from the beginning.
          </p>
          <Link to="/register">
            <Button>Go to Register</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/">
            <img 
              src={theme === 'dark' ? logoTextWhite : logoTextDark} 
              alt="Pelt" 
              className="h-8 mx-auto mb-6 hover:opacity-80 transition-opacity"
            />
          </Link>
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold mb-2">
            {verificationType === 'password-reset' ? 'Reset your password' : 'Verify your email'}
          </h1>
          <p className="text-muted-foreground">
            We've sent a verification code to<br />
            <span className="font-medium">{email}</span>
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="otp">Verification Code</Label>
            <Input
              id="otp"
              type="text"
              placeholder="Enter 6-digit code"
              value={formData.otp}
              onChange={handleOTPInput}
              className={`text-center text-2xl tracking-widest ${errors.otp ? 'border-destructive' : ''}`}
              maxLength={6}
            />
            {errors.otp && (
              <p className="text-sm text-destructive text-center">{errors.otp}</p>
            )}
          </div>

          <Button type="submit" className="w-full" disabled={isLoading || formData.otp.length !== 6}>
            {isLoading ? 'Verifying...' : 'Verify Code'}
          </Button>
        </form>

        <div className="text-center mt-6">
          {canResend ? (
            <button
              onClick={handleResendOTP}
              className="text-primary hover:underline text-sm"
            >
              Resend verification code
            </button>
          ) : (
            <p className="text-sm text-muted-foreground">
              Resend code in {countdown}s
            </p>
          )}
        </div>

        <p className="text-center text-sm text-muted-foreground mt-4">
          Wrong email?{' '}
          <Link
            to={verificationType === 'password-reset' ? "/forgot-password" : "/register"}
            className="text-primary hover:underline font-medium"
          >
            {verificationType === 'password-reset' ? 'Go back' : 'Change email'}
          </Link>
        </p>
      </div>
    </div>
  )
}