import { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { Button } from '@/core/components/ui/button'
import { Input } from '@/core/components/ui/input'
import { Label } from '@/core/components/ui/label'
import { useTheme } from '@/core/context/theme-context'
import { useLoginMutation, useAppDispatch, setCredentials } from '@/core/store'
import { useSimpleToast } from '@/core/hooks/useSimpleToast'
import { hasAuthorizedRole } from '@/core/utils/auth'
import { loginSchema, type LoginFormData } from '../types'
import { CryptoIllustration } from './CryptoIllustration'
import { Eye, EyeOff } from 'lucide-react'

import logoTextDark from '@/assets/brand/logo-text-dark.png'
import logoTextWhite from '@/assets/brand/logo-text-white.png'

export function Login() {
  const { theme } = useTheme()
  const navigate = useNavigate()
  const location = useLocation()
  const dispatch = useAppDispatch()
  const [login, { isLoading }] = useLoginMutation()
  const toast = useSimpleToast()
  const [showSessionExpired, setShowSessionExpired] = useState(false)
  
  // Get the intended destination or default to dashboard
  const from = location.state?.from?.pathname || '/dashboard'

  // Check if user was redirected due to session expiration
  useEffect(() => {
    const wasRedirected = location.state?.from && location.state.from.pathname !== '/login'
    if (wasRedirected) {
      setShowSessionExpired(true)
      // Auto-hide the message after 10 seconds
      const timer = setTimeout(() => setShowSessionExpired(false), 10000)
      return () => clearTimeout(timer)
    }
  }, [location.state])
  
  const [formData, setFormData] = useState<LoginFormData>({
    email: '',
    password: '',
  })
  const [errors, setErrors] = useState<Partial<LoginFormData>>({})
  const [showPassword, setShowPassword] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    const result = loginSchema.safeParse(formData)
    if (!result.success) {
      const fieldErrors: Partial<LoginFormData> = {}
      for (const error of result.error.issues) {
        if (error.path[0]) {
          fieldErrors[error.path[0] as keyof LoginFormData] = error.message
        }
      }
      setErrors(fieldErrors)
      return
    }
    
    setErrors({})
    
    try {
      const response = await login(formData).unwrap()

      // Debug user roles
      console.log('👤 Login successful! User data:', {
        email: response.user.email,
        roles: response.user.roles?.map(r => r.role.name) || [],
        hasRole: hasAuthorizedRole(response.user)
      })

      // Check if user has authorized role
      if (!hasAuthorizedRole(response.user)) {
        console.error('❌ Authorization failed. User roles:', response.user.roles?.map(r => r.role.name) || [])
        console.error('❌ Required roles:', ['SUPERADMIN', 'ADMIN', 'MEMBER'])
        toast.error('Access denied. You do not have permission to access this application.', {
          title: 'Unauthorized Access',
        })
        setErrors({
          email: 'Access denied. Contact your administrator for access.'
        })
        return
      }

      dispatch(setCredentials({
        user: response.user,
        token: response.accessToken
      }))
      toast.success(`Signed in as ${response.user.email}`, {
        title: 'Welcome back!',
      })
      navigate(from, { replace: true })
    } catch (error: unknown) {
      console.error('Login error:', error)
      const errorMessage = (error as { data?: { message?: string } })?.data?.message || 'Login failed. Please try again.'
      toast.error(errorMessage, {
        title: 'Login Failed',
      })
      setErrors({ 
        email: errorMessage
      })
    }
  }

  const handleChange = (field: keyof LoginFormData) => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setFormData(prev => ({ ...prev, [field]: e.target.value }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }))
    }
  }

  return (
    <div className="min-h-screen flex">
      {/* Left side - Illustration */}
      <div className="hidden lg:flex lg:w-1/2 bg-muted items-center justify-center p-12">
        <div className="max-w-md">
          <CryptoIllustration className="mb-8" />
          <h2 className="text-2xl font-bold text-center mb-4">
            Secure Access
          </h2>
          <p className="text-muted-foreground text-center">
            Sign in to your Pelt wallet and manage your crypto portfolio with enterprise-grade security.
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
            <h1 className="text-2xl font-bold mb-2">Admin Login</h1>
            <p className="text-muted-foreground">
              Granular Access to Pelt
            </p>
          </div>

          {/* Session Expired Notification */}
          {showSessionExpired && (
            <div className="mb-6 p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg">
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 text-amber-600 dark:text-amber-400">
                  <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 18.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-amber-800 dark:text-amber-200">
                    Session Expired
                  </p>
                  <p className="text-sm text-amber-700 dark:text-amber-300">
                    Your session has expired due to inactivity. Please log in again.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setShowSessionExpired(false)}
                  className="text-amber-600 dark:text-amber-400 hover:text-amber-800 dark:hover:text-amber-200"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
          )}

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

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <Link 
                  to="/forgot-password" 
                  className="text-sm text-primary hover:underline"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleChange('password')}
                  className={`pr-10 ${errors.password ? 'border-destructive' : ''}`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="text-sm text-destructive">{errors.password}</p>
              )}
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? 'Signing in...' : 'Sign In'}
            </Button>
          </form>
        </div>
      </div>
    </div>
  )
}