// Re-export everything from the store for easy imports
export { store } from './store'
export type { RootState, AppDispatch } from './store'
export { useAppDispatch, useAppSelector } from './hooks'

// Re-export auth slice actions
export { setCredentials, logout, setLoading, clearAuth } from './slices/authSlice'

// Re-export auth API hooks
export {
  useLoginMutation,
  useRequestPasswordResetMutation,
  useResetPasswordMutation,
  useCompletePasswordResetMutation,
  useChangePasswordMutation,
  useVerifyOTPMutation,
  useVerifyLoginMFAMutation,
  useGetProfileQuery,
  useRefreshTokenMutation,
  useLogoutMutation,
} from './api/authApi'

// Re-export types
export type {
  User,
  LoginRequest,
  LoginResponse,
  RequestPasswordResetRequest,
  RequestPasswordResetResponse,
  ResetPasswordRequest,
  ResetPasswordResponse,
  CompletePasswordResetRequest,
  CompletePasswordResetResponse,
  ChangePasswordRequest,
  ChangePasswordResponse,
  VerifyOTPRequest,
  VerifyOTPResponse,
} from './api/authApi'

// Re-export users API hooks
export {
  useGetAdminUsersQuery,
  useGetGeneralUsersQuery,
  useUpdateUserMutation,
  useCreateUserMutation,
  useDeleteUserMutation,
  useGetRolesQuery,
  useAssignRoleMutation,
  useRemoveRoleMutation,
  useUpdateUserStatusMutation,
} from './api/usersApi'

// Re-export users types
export type {
  AdminUser,
  GeneralUser,
  UpdateUserRequest,
  UpdateUserResponse,
  CreateUserRequest,
  CreateUserResponse,
  DeleteUserResponse,
  RoleData,
  AssignRoleRequest,
  AssignRoleResponse,
  RemoveRoleResponse,
  UpdateUserStatusRequest,
  UpdateUserStatusResponse,
} from './api/usersApi'