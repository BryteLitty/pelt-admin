import { useNavigate } from 'react-router-dom'
import { useAppDispatch } from '../store/hooks'
import { logout } from '../store/slices/authSlice'
import { useSimpleToast } from './useSimpleToast'
import { env } from '../config/env'

export const useLogout = () => {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const toast = useSimpleToast()

  const handleLogout = () => {
    // Clear auth state and token from localStorage
    dispatch(logout())

    // Show success message
    toast.success('Signed out successfully', {
      title: 'Goodbye!',
    })

    // Redirect to frontend application
    setTimeout(() => {
      window.location.href = env.FRONTEND_URL
    }, 1000) // Small delay to show the toast message
  }

  return { handleLogout }
}
