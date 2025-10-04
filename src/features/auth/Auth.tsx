import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { LoginForm } from './components'
import { useLoginMutation } from '@/core/store/api/authApi'
import { useAppDispatch } from '@/core/store/hooks'
import { setCredentials } from '@/core/store/slices/authSlice'
import { toastSuccess, toastError, toastInfo } from '@/core/lib/toast'
import type { LoginFormData } from './types'

export function Auth() {
  const [isLoading, setIsLoading] = useState(false)
  const [login] = useLoginMutation()
  const dispatch = useAppDispatch()
  const navigate = useNavigate()

  const handleLogin = async (data: LoginFormData) => {
    setIsLoading(true)
    try {
      const result = await login(data).unwrap()

      // Check if MFA is required
      if (result.mfaRequired) {
        toastInfo('MFA verification required. Please check the login page.')
        setIsLoading(false)
        return
      }

      // Ensure we have an access token before proceeding
      if (!result.accessToken) {
        toastError('Login failed. No access token received.')
        setIsLoading(false)
        return
      }

      // Store credentials in Redux store (this also saves to localStorage)
      dispatch(setCredentials({
        user: result.user,
        token: result.accessToken
      }))

      toastSuccess('Login successful! Welcome back.')

      // Redirect to dashboard
      navigate('/dashboard', { replace: true })
    } catch (error: unknown) {
      console.error('Login error:', error)
      const errorMessage = (error as { data?: { message?: string } })?.data?.message || 'Login failed. Please try again.'
      toastError(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleSignIn = async () => {
    setIsLoading(true)
    try {
      // TODO: Implement Google OAuth
      console.log('Google sign in')
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      toastInfo('Google sign-in is not yet implemented.')
    } catch (error) {
      console.error('Google sign in error:', error)
      toastError('Google sign-in failed. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <LoginForm
      onSubmit={handleLogin}
      onGoogleSignIn={handleGoogleSignIn}
      isLoading={isLoading}
    />
  )
}