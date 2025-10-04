import { useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '../store/hooks'
import { clearAuth } from '../store/slices/authSlice'
import { hasAuthorizedRole } from '../utils/auth'

interface AuthInitializerProps {
  children: React.ReactNode
}

export function AuthInitializer({ children }: AuthInitializerProps) {
  const dispatch = useAppDispatch()
  const { user, token, isAuthenticated } = useAppSelector((state) => state.auth)

  useEffect(() => {
    // Validate stored authentication data on app initialization
    if (isAuthenticated) {
      console.log('🔍 Validating stored authentication...')
      console.log('🔍 Auth state debug:', {
        isAuthenticated,
        hasUser: !!user,
        hasToken: !!token,
        userEmail: user?.email,
        tokenPrefix: token?.substring(0, 20)
      })

      // Check if we have both user and token
      if (!user || !token) {
        console.log('❌ Invalid auth state - missing user or token')
        dispatch(clearAuth())
        return
      }

      // Check if user has authorized role
      if (!hasAuthorizedRole(user)) {
        console.log('❌ User does not have authorized role - clearing auth')
        dispatch(clearAuth())
        return
      }

      console.log('✅ Authentication state validated successfully')
      console.log('👤 Current user:', {
        email: user.email,
        roles: user.roles?.map(r => r.role.name),
        isAuthenticated
      })
    } else {
      console.log('🔍 No stored authentication found')
    }
  }, [dispatch, user, token, isAuthenticated])

  return <>{children}</>
}