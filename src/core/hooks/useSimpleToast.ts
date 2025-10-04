import { useToast as useToastContext } from '../components/ui/simple-toast'

export const useSimpleToast = () => {
  const { addToast, removeToast } = useToastContext()

  const success = (message: string, options?: { title?: string; description?: string; duration?: number }) => {
    addToast({
      type: 'success',
      title: options?.title || 'Success',
      description: message,
      duration: options?.duration || 4000,
    })
  }

  const error = (message: string, options?: { title?: string; description?: string; duration?: number }) => {
    addToast({
      type: 'error',
      title: options?.title || 'Error',
      description: message,
      duration: options?.duration || 6000,
    })
  }

  const warning = (message: string, options?: { title?: string; description?: string; duration?: number }) => {
    addToast({
      type: 'warning',
      title: options?.title || 'Warning',
      description: message,
      duration: options?.duration || 5000,
    })
  }

  const info = (message: string, options?: { title?: string; description?: string; duration?: number }) => {
    addToast({
      type: 'info',
      title: options?.title || 'Information',
      description: message,
      duration: options?.duration || 4000,
    })
  }

  const dismiss = (id: string) => {
    removeToast(id)
  }

  return {
    success,
    error,
    warning,
    info,
    dismiss,
  }
}
