// Predefined toast messages for consistent UX
export const TOAST_MESSAGES = {
  // Auth messages
  auth: {
    loginSuccess: (email: string) => ({
      title: 'Welcome back!',
      description: `Signed in as ${email}`,
    }),
    loginError: 'Login Failed',
    loginErrorDesc: 'Invalid credentials. Please try again.',
    
    logoutSuccess: {
      title: 'Signed out',
      description: 'You have been successfully signed out.',
    },
    
    forgotPasswordSuccess: {
      title: 'Reset email sent!',
      description: 'Check your inbox for password reset instructions.',
    },
    forgotPasswordError: 'Failed to send reset email',
    forgotPasswordErrorDesc: 'Please check your email and try again.',
    
    otpVerificationSuccess: {
      title: 'Email verified!',
      description: 'Welcome to Pelt Admin Dashboard.',
    },
    otpVerificationError: 'Verification Failed',
    otpVerificationErrorDesc: 'Invalid OTP. Please try again.',
    
    otpResendSuccess: {
      title: 'OTP resent!',
      description: 'Check your email for the new verification code.',
    },
    otpResendError: 'Failed to resend OTP',
    otpResendErrorDesc: 'Please try again later.',
  },
  
  // General messages
  general: {
    success: 'Success',
    error: 'Error',
    warning: 'Warning',
    info: 'Information',
    
    loading: 'Loading...',
    saving: 'Saving...',
    deleting: 'Deleting...',
    updating: 'Updating...',
    
    networkError: 'Network Error',
    networkErrorDesc: 'Please check your internet connection.',
    
    serverError: 'Server Error',
    serverErrorDesc: 'Something went wrong. Please try again.',
    
    unauthorized: 'Unauthorized',
    unauthorizedDesc: 'You do not have permission to perform this action.',
    
    notFound: 'Not Found',
    notFoundDesc: 'The requested resource was not found.',
  },
  
  // Form validation messages
  validation: {
    required: 'This field is required',
    email: 'Please enter a valid email address',
    password: 'Password must be at least 8 characters',
    passwordMatch: 'Passwords do not match',
    otp: 'Please enter a valid 6-digit code',
  },
  
  // Dashboard messages
  dashboard: {
    dataLoaded: 'Data loaded successfully',
    dataLoadError: 'Failed to load data',
    settingsSaved: 'Settings saved successfully',
    settingsSaveError: 'Failed to save settings',
  },
} as const

// Helper function to get toast message
export const getToastMessage = (category: keyof typeof TOAST_MESSAGES, key: string) => {
  return TOAST_MESSAGES[category]?.[key as keyof typeof TOAST_MESSAGES[typeof category]]
}
