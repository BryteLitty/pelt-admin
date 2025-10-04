import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface Role {
  id: string
  userId: string
  roleId: string
  assignedBy: string
  createdAt: string
  role: {
    id: string
    name: string
    description: string
    clearanceLevel: string
    createdAt: string
    updatedAt: string
  }
}

interface User {
  id: string
  email: string
  firstName: string | null
  lastName: string | null
  googleId: string | null
  authProvider: string
  userGroup: string
  status: string
  emailVerified: boolean
  mfaEnabled: boolean
  mfaType: string | null
  createdAt: string
  updatedAt: string
  lastLoginAt: string
  roles: Role[]
}

interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  isLoading: boolean
}

// Helper function to safely parse stored user data
const getStoredUser = (): User | null => {
  try {
    const storedUser = localStorage.getItem('authUser')
    return storedUser ? JSON.parse(storedUser) : null
  } catch (error) {
    console.error('Error parsing stored user data:', error)
    localStorage.removeItem('authUser')
    return null
  }
}

// Helper function to validate if we have both token and user data
const isValidStoredAuth = (): boolean => {
  const token = localStorage.getItem('authToken')
  const user = getStoredUser()
  return !!(token && user)
}

// Log initialization state for debugging
const storedUser = getStoredUser()
const storedToken = localStorage.getItem('authToken')
const isValidAuth = isValidStoredAuth()

console.log('🔍 Auth initialization:', {
  hasStoredUser: !!storedUser,
  hasStoredToken: !!storedToken,
  isValidAuth,
  userRoles: storedUser?.roles?.map(r => r.role.name) || []
})

const initialState: AuthState = {
  user: storedUser,
  token: storedToken,
  isAuthenticated: isValidAuth,
  isLoading: false,
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action: PayloadAction<{ user: User; token: string }>) => {
      state.user = action.payload.user
      state.token = action.payload.token
      state.isAuthenticated = true
      // Store both token and user data in localStorage
      localStorage.setItem('authToken', action.payload.token)
      localStorage.setItem('authUser', JSON.stringify(action.payload.user))
      console.log('✅ Auth credentials saved to localStorage')
    },
    logout: (state) => {
      state.user = null
      state.token = null
      state.isAuthenticated = false
      localStorage.removeItem('authToken')
      localStorage.removeItem('authUser')
      console.log('🔐 User logged out - localStorage cleared')
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload
    },
    clearAuth: (state) => {
      state.user = null
      state.token = null
      state.isAuthenticated = false
      state.isLoading = false
      localStorage.removeItem('authToken')
      localStorage.removeItem('authUser')
      console.log('🔐 Auth state cleared - localStorage cleaned')
    },
    restoreAuth: (state) => {
      const user = getStoredUser()
      const token = localStorage.getItem('authToken')
      if (user && token) {
        state.user = user
        state.token = token
        state.isAuthenticated = true
        console.log('✅ Auth state restored from localStorage')
      } else {
        console.log('❌ Cannot restore auth - missing data')
      }
    },
    updateUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload
      localStorage.setItem('authUser', JSON.stringify(action.payload))
      console.log('✅ User profile updated in state and localStorage')
    },
  },
})

export const { setCredentials, logout, setLoading, clearAuth, restoreAuth, updateUser } = authSlice.actions
export default authSlice.reducer
