import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth()
  
  // Show loading state while checking authentication
  if (isLoading) {
    return <div>Loading...</div>
  }
  
  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }
  
  // Render children if authenticated
  return children
}

export default ProtectedRoute
