import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { env } from '../../config/env'
import type { RootState } from '../store'
import { logout } from '../slices/authSlice'

export interface RoleData {
  id: string
  name: string
  description: string
  clearanceLevel: string
  createdAt: string
  updatedAt: string
}

interface Role {
  id: string
  userId: string
  roleId: string
  assignedBy: string | null
  createdAt: string
  role: RoleData
}

export interface AdminUser {
  id: string
  email: string
  firstName: string | null
  lastName: string | null
  passwordHash: string
  googleId: string | null
  authProvider: string
  userGroup: string
  status: string
  emailVerified: boolean
  mfaEnabled: boolean
  mfaType: string | null
  mfaSecret: string | null
  createdAt: string
  updatedAt: string
  lastLoginAt: string | null
  roles: Role[]
}

export interface GeneralUser {
  id: string
  email: string
  firstName: string | null
  lastName: string | null
  passwordHash: string
  googleId: string | null
  authProvider: string
  userGroup: string
  status: string
  emailVerified: boolean
  mfaEnabled: boolean
  mfaType: string | null
  mfaSecret: string | null
  createdAt: string
  updatedAt: string
  lastLoginAt: string | null
  roles: Role[]
}

export interface UpdateUserRequest {
  id: string
  firstName?: string
  lastName?: string
  status?: string
  roleId?: string
}

export interface UpdateUserResponse {
  message: string
  user: AdminUser
}

export interface CreateUserRequest {
  email: string
  firstName: string
  lastName: string
  password: string
  role: string
  department: string
  jobTitle: string
}

export interface CreateUserResponse {
  id: string
  email: string
  firstName: string
  lastName: string
  userGroup: string
  status: string
  emailVerified: boolean
  roles: Array<{
    role: {
      name: string
      clearanceLevel: string
    }
  }>
}

export interface DeleteUserResponse {
  message: string
}

export interface AssignRoleRequest {
  userId: string
  roleId: string
  assignedBy: string
}

export interface AssignRoleResponse {
  message: string
  userId: string
  roleId: string
  assignedBy: string
}

export interface RemoveRoleResponse {
  message: string
}

export interface UpdateUserStatusRequest {
  id: string
  status: 'ACTIVE' | 'SUSPENDED'
}

export interface UpdateUserStatusResponse {
  message: string
  user: AdminUser
}

// Base query with automatic logout on token expiration
const baseQueryWithAuth = fetchBaseQuery({
  baseUrl: `${env.API_BASE_URL}`,
  prepareHeaders: (headers, { getState }) => {
    // Try to get token from Redux state first, then fallback to localStorage
    const state = getState() as RootState
    const reduxToken = state.auth?.token
    const localToken = localStorage.getItem('authToken')
    const token = reduxToken || localToken

    if (token) {
      // Ensure the token is properly formatted
      const cleanToken = token.replace(/^Bearer\s+/i, '')
      headers.set('authorization', `Bearer ${cleanToken}`)
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

export const usersApi = createApi({
  reducerPath: 'usersApi',
  baseQuery: baseQueryWithLogout,
  tagTypes: ['AdminUser', 'GeneralUser', 'Role'],
  endpoints: (builder) => ({
    getAdminUsers: builder.query<AdminUser[], void>({
      query: () => '/users/admin-users',
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: 'AdminUser' as const, id })),
              { type: 'AdminUser', id: 'LIST' },
            ]
          : [{ type: 'AdminUser', id: 'LIST' }],
    }),
    getGeneralUsers: builder.query<GeneralUser[], void>({
      query: () => '/users/general-users',
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: 'GeneralUser' as const, id })),
              { type: 'GeneralUser', id: 'LIST' },
            ]
          : [{ type: 'GeneralUser', id: 'LIST' }],
    }),
    updateUser: builder.mutation<UpdateUserResponse, UpdateUserRequest>({
      query: ({ id, ...patch }) => ({
        url: `/users/${id}`,
        method: 'PATCH',
        body: patch,
      }),
      invalidatesTags: (_, __, { id }) => [
        { type: 'AdminUser', id },
        { type: 'AdminUser', id: 'LIST' },
      ],
    }),
    createUser: builder.mutation<CreateUserResponse, CreateUserRequest>({
      query: (data) => ({
        url: '/users/staff',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: [{ type: 'AdminUser', id: 'LIST' }],
    }),
    deleteUser: builder.mutation<DeleteUserResponse, string>({
      query: (id) => ({
        url: `/users/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (_, __, id) => [
        { type: 'AdminUser', id },
        { type: 'AdminUser', id: 'LIST' },
        { type: 'GeneralUser', id },
        { type: 'GeneralUser', id: 'LIST' },
      ],
    }),
    getRoles: builder.query<RoleData[], void>({
      query: () => '/roles',
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: 'Role' as const, id })),
              { type: 'Role', id: 'LIST' },
            ]
          : [{ type: 'Role', id: 'LIST' }],
    }),
    assignRole: builder.mutation<AssignRoleResponse, AssignRoleRequest>({
      query: (data) => ({
        url: '/roles/assign',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: (_, __, { userId }) => [
        { type: 'AdminUser', id: userId },
        { type: 'AdminUser', id: 'LIST' },
        { type: 'GeneralUser', id: userId },
        { type: 'GeneralUser', id: 'LIST' },
      ],
    }),
    removeRole: builder.mutation<RemoveRoleResponse, { userId: string; roleId: string }>({
      query: ({ userId, roleId }) => ({
        url: `/roles/remove/${userId}/${roleId}`,
        method: 'DELETE',
      }),
      invalidatesTags: (_, __, { userId }) => [
        { type: 'AdminUser', id: userId },
        { type: 'AdminUser', id: 'LIST' },
        { type: 'GeneralUser', id: userId },
        { type: 'GeneralUser', id: 'LIST' },
      ],
    }),
    updateUserStatus: builder.mutation<UpdateUserStatusResponse, UpdateUserStatusRequest>({
      query: ({ id, status }) => ({
        url: `/users/${id}`,
        method: 'PATCH',
        body: { status },
      }),
      invalidatesTags: (_, __, { id }) => [
        { type: 'AdminUser', id },
        { type: 'AdminUser', id: 'LIST' },
        { type: 'GeneralUser', id },
        { type: 'GeneralUser', id: 'LIST' },
      ],
    }),
  }),
})

export const {
  useGetAdminUsersQuery,
  useGetGeneralUsersQuery,
  useUpdateUserMutation,
  useCreateUserMutation,
  useDeleteUserMutation,
  useGetRolesQuery,
  useAssignRoleMutation,
  useRemoveRoleMutation,
  useUpdateUserStatusMutation,
} = usersApi