import { Navigate } from 'react-router-dom'
import { useAuth } from './auth'

interface PublicRouteProps {
  children: React.ReactNode
}

/**
 * PublicRoute component that redirects authenticated users to dashboard
 * Use this to wrap routes that should only be accessible to unauthenticated users
 */
export default function PublicRoute({ children }: PublicRouteProps) {
  const { token } = useAuth()

  // If user is authenticated, redirect to dashboard
  if (token) {
    return <Navigate to="/dashboard" replace />
  }

  // If user is not authenticated, render the children (login page)
  return <>{children}</>
}
