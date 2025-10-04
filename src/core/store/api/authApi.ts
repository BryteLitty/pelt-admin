import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { env } from '../../config/env'
import type { RootState } from '../store'
import { logout } from '../slices/authSlice'

export interface LoginRequest {
  email: string
  password: string
}

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

export interface LoginResponse {
  user: User
  accessToken: string
}

export interface ForgotPasswordRequest {
  email: string
}

export interface ForgotPasswordResponse {
  message: string
}

export interface RequestPasswordResetRequest {
  email: string
}

export interface RequestPasswordResetResponse {
  message: string
}

export interface ResetPasswordRequest {
  email: string
  code: string
  newPassword: string
}

export interface ResetPasswordResponse {
  message: string
}

export interface CompletePasswordResetRequest {
  newPassword: string
}

export interface CompletePasswordResetResponse {
  message: string
}

export interface VerifyOTPRequest {
  email: string
  otp: string
}

export interface VerifyOTPResponse {
  user: User
  token: string
}

export interface ChangePasswordRequest {
  currentPassword: string
  newPassword: string
}

export interface ChangePasswordResponse {
  message: string
}

export interface SetupMFARequest {
  type: 'TOTP' | 'SMS' | 'EMAIL'
}

export interface SetupMFAResponse {
  secret: string
  qrCodeUrl: string
  backupCodes: string[]
}

export interface VerifyMFASetupRequest {
  token: string
}

export interface VerifyMFASetupResponse {
  success: boolean
}

export interface VerifyMFARequest {
  token: string
}

export interface VerifyMFAResponse {
  success: boolean
}

export interface VerifyBackupCodeRequest {
  code: string
}

export interface VerifyBackupCodeResponse {
  success: boolean
}

export interface RegenerateBackupCodesResponse {
  backupCodes: string[]
}

export interface DisableMFAResponse {
  success: boolean
}


// Base query with automatic logout on token expiration
const baseQueryWithAuth = fetchBaseQuery({
  baseUrl: `${env.API_BASE_URL}`,
  prepareHeaders: (headers, { getState, endpoint }) => {
    // Try to get token from Redux state first, then fallback to localStorage
    const state = getState() as RootState
    const reduxToken = state.auth?.token
    const localToken = localStorage.getItem('authToken')
    const token = reduxToken || localToken

    console.log('🔍 PrepareHeaders Debug:', {
      endpoint: endpoint,
      reduxToken: reduxToken ? `${reduxToken.substring(0, 20)}...` : 'null',
      localToken: localToken ? `${localToken.substring(0, 20)}...` : 'null',
      finalToken: token ? `${token.substring(0, 20)}...` : 'null',
      authState: state.auth?.isAuthenticated
    })

    if (token) {
      // Ensure the token is properly formatted
      const cleanToken = token.replace(/^Bearer\s+/i, '')
      headers.set('authorization', `Bearer ${cleanToken}`)
      console.log('✅ Auth header set for API request:', `Bearer ${cleanToken.substring(0, 20)}...`)
    } else {
      console.log('❌ Warning: No auth token found for API request')
    }

    return headers
  },
})

// Enhanced base query with automatic logout on 401
const baseQueryWithLogout = async (args: any, api: any, extraOptions: any) => {
  let result = await baseQueryWithAuth(args, api, extraOptions)

  // Check if we got a 401 Unauthorized response
  if (result.error && result.error.status === 401) {
    console.log('🔐 Token expired (401), automatically logging out...')

    // Dispatch logout action to clear auth state
    api.dispatch(logout())

    // Redirect to frontend application after session expiration
    console.log('Session expired: redirecting to frontend application')

    // Add a small delay to ensure logout state is processed
    setTimeout(() => {
      window.location.href = env.FRONTEND_URL
    }, 100)
  }

  return result
}

export const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery: baseQueryWithLogout,
  tagTypes: ['User'],
  endpoints: (builder) => ({
    login: builder.mutation<LoginResponse, LoginRequest>({
      query: (credentials) => ({
        url: '/auth/login',
        method: 'POST',
        body: credentials,
      }),
    }),
    requestPasswordReset: builder.mutation<RequestPasswordResetResponse, RequestPasswordResetRequest>({
      query: (data) => ({
        url: '/auth/request-password-reset',
        method: 'POST',
        body: data,
      }),
    }),
    resetPassword: builder.mutation<ResetPasswordResponse, ResetPasswordRequest>({
      query: (data) => ({
        url: '/auth/reset-password',
        method: 'POST',
        body: data,
      }),
    }),
    completePasswordReset: builder.mutation<CompletePasswordResetResponse, CompletePasswordResetRequest>({
      query: (data) => ({
        url: '/auth/complete-password-reset',
        method: 'POST',
        body: data,
        credentials: 'include', // Include session cookies
      }),
    }),
    changePassword: builder.mutation<ChangePasswordResponse, ChangePasswordRequest>({
      query: (data) => {
        console.log('🔐 Change password request initiated - Bearer token will be automatically added by prepareHeaders')
        return {
          url: '/auth/change-password',
          method: 'POST',
          body: data,
        }
      },
      transformResponse: (response: ChangePasswordResponse) => {
        console.log('✅ Change password request completed successfully')
        return response
      },
      transformErrorResponse: (response: any) => {
        console.log('❌ Change password request failed:', response)
        return response
      },
    }),
    verifyOTP: builder.mutation<VerifyOTPResponse, VerifyOTPRequest>({
      query: (data) => ({
        url: '/auth/verify-otp',
        method: 'POST',
        body: data,
      }),
    }),
    getProfile: builder.query<User, void>({
      query: () => '/auth/profile',
      providesTags: ['User'],
    }),
    refreshToken: builder.mutation<{ token: string }, void>({
      query: () => ({
        url: '/auth/refresh',
        method: 'POST',
      }),
    }),
    logout: builder.mutation<{ message: string }, void>({
      query: () => ({
        url: '/auth/logout',
        method: 'POST',
      }),
    }),
    setupMFA: builder.mutation<SetupMFAResponse, SetupMFARequest>({
      query: (data) => ({
        url: '/mfa/setup',
        method: 'POST',
        body: data,
      }),
    }),
    verifyMFASetup: builder.mutation<VerifyMFASetupResponse, VerifyMFASetupRequest>({
      query: (data) => ({
        url: '/mfa/verify-setup',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['User'],
    }),
    verifyMFA: builder.mutation<VerifyMFAResponse, VerifyMFARequest>({
      query: (data) => ({
        url: '/mfa/verify',
        method: 'POST',
        body: data,
      }),
    }),
    verifyBackupCode: builder.mutation<VerifyBackupCodeResponse, VerifyBackupCodeRequest>({
      query: (data) => ({
        url: '/mfa/verify-backup',
        method: 'POST',
        body: data,
      }),
    }),
    regenerateBackupCodes: builder.mutation<RegenerateBackupCodesResponse, void>({
      query: () => ({
        url: '/mfa/regenerate-backup-codes',
        method: 'POST',
      }),
    }),
    disableMFA: builder.mutation<DisableMFAResponse, void>({
      query: () => ({
        url: '/mfa/disable',
        method: 'POST',
      }),
      invalidatesTags: ['User'],
    }),
  }),
})

export const {
  useLoginMutation,
  useRequestPasswordResetMutation,
  useResetPasswordMutation,
  useCompletePasswordResetMutation,
  useChangePasswordMutation,
  useVerifyOTPMutation,
  useGetProfileQuery,
  useRefreshTokenMutation,
  useLogoutMutation,
  useSetupMFAMutation,
  useVerifyMFASetupMutation,
  useVerifyMFAMutation,
  useVerifyBackupCodeMutation,
  useRegenerateBackupCodesMutation,
  useDisableMFAMutation,
} = authApi
