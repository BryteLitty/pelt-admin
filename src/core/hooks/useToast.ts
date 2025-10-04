import { useCallback } from 'react'
import { toast } from 'sonner'
import type { ToastOptions } from '../lib/toast'

export const useToast = () => {
  const showSuccess = useCallback((message: string, options?: ToastOptions) => {
    return toast.success(message, {
      description: options?.description,
      duration: options?.duration || 4000,
      action: options?.action,
      cancel: options?.cancel,
    })
  }, [])

  const showError = useCallback((message: string, options?: ToastOptions) => {
    return toast.error(message, {
      description: options?.description,
      duration: options?.duration || 6000,
      action: options?.action,
      cancel: options?.cancel,
    })
  }, [])

  const showWarning = useCallback((message: string, options?: ToastOptions) => {
    return toast.warning(message, {
      description: options?.description,
      duration: options?.duration || 5000,
      action: options?.action,
      cancel: options?.cancel,
    })
  }, [])

  const showInfo = useCallback((message: string, options?: ToastOptions) => {
    return toast.info(message, {
      description: options?.description,
      duration: options?.duration || 4000,
      action: options?.action,
      cancel: options?.cancel,
    })
  }, [])

  const showLoading = useCallback((message: string) => {
    return toast.loading(message)
  }, [])

  const showPromise = useCallback(<T>(
    promise: Promise<T>,
    messages: {
      loading: string
      success: string | ((data: T) => string)
      error: string | ((error: any) => string)
    }
  ) => {
    return toast.promise(promise, messages)
  }, [])

  const dismiss = useCallback((toastId?: string | number) => {
    toast.dismiss(toastId)
  }, [])

  const dismissAll = useCallback(() => {
    toast.dismiss()
  }, [])

  return {
    success: showSuccess,
    error: showError,
    warning: showWarning,
    info: showInfo,
    loading: showLoading,
    promise: showPromise,
    dismiss,
    dismissAll,
  }
}
