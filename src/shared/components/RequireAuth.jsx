import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const RequireAuth = ({ children }) => {
  const { isAuthenticated, loading, requiresProfileCompletion } = useAuth()
  const location = useLocation()

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center text-gray-600">Loading account...</div>
  }

  const redirectTo = `${location.pathname}${location.search}${location.hash}`

  if (!isAuthenticated) {
    return <Navigate to={`/auth?redirect=${encodeURIComponent(redirectTo)}`} replace state={{ from: location }} />
  }

  if (requiresProfileCompletion) {
    return <Navigate to={`/auth?mode=complete-profile&redirect=${encodeURIComponent(redirectTo)}`} replace state={{ from: location }} />
  }

  return children
}

export default RequireAuth
