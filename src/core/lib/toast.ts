import { toast } from 'sonner'

export interface ToastOptions {
  title?: string
  description?: string
  duration?: number
  action?: {
    label: string
    onClick: () => void
  }
  cancel?: {
    label: string
    onClick: () => void
  }
}

// Success toast
export const toastSuccess = (message: string, options?: ToastOptions) => {
  return toast.success(message, {
    description: options?.description,
    duration: options?.duration || 4000,
    action: options?.action,
    cancel: options?.cancel,
  })
}

// Error toast
export const toastError = (message: string, options?: ToastOptions) => {
  return toast.error(message, {
    description: options?.description,
    duration: options?.duration || 6000,
    action: options?.action,
    cancel: options?.cancel,
  })
}

// Warning toast
export const toastWarning = (message: string, options?: ToastOptions) => {
  return toast.warning(message, {
    description: options?.description,
    duration: options?.duration || 5000,
    action: options?.action,
    cancel: options?.cancel,
  })
}

// Info toast
export const toastInfo = (message: string, options?: ToastOptions) => {
  return toast.info(message, {
    description: options?.description,
    duration: options?.duration || 4000,
    action: options?.action,
    cancel: options?.cancel,
  })
}

// Loading toast
export const toastLoading = (message: string) => {
  return toast.loading(message)
}

// Promise toast
export const toastPromise = <T>(
  promise: Promise<T>,
  messages: {
    loading: string
    success: string | ((data: T) => string)
    error: string | ((error: unknown) => string)
  }
) => {
  return toast.promise(promise, messages)
}

// Dismiss toast
export const dismissToast = (toastId?: string | number) => {
  toast.dismiss(toastId)
}

// Dismiss all toasts
export const dismissAllToasts = () => {
  toast.dismiss()
}

// Custom toast
export const toastCustom = (message: string, options?: ToastOptions) => {
  return toast(message, {
    description: options?.description,
    duration: options?.duration || 4000,
    action: options?.action,
    cancel: options?.cancel,
  })
}
