// Re-export types from the store for easy access
export type { RootState, AppDispatch } from '../index'

// Auth types
export interface User {
  id: string
  email: string
  name: string
  role: string
}

export interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  isLoading: boolean
}

// API types
export interface ApiError {
  message: string
  status: number
  data?: unknown
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  limit: number
  hasNext: boolean
  hasPrev: boolean
}
