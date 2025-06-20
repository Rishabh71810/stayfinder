import React from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useUser, RedirectToSignIn } from '@clerk/clerk-react'
import LoadingSpinner from '../UI/LoadingSpinner'

const ProtectedRoute = ({ children, requiredRole = null }) => {
  const { isSignedIn, isLoaded, user } = useUser()
  const location = useLocation()

  // Show loading spinner while Clerk is loading
  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" showText text="Loading..." />
      </div>
    )
  }

  // Redirect to sign-in if not authenticated
  if (!isSignedIn) {
    return <RedirectToSignIn redirectUrl={location.pathname} />
  }

  // Check for required role
  if (requiredRole) {
    const userRole = user?.publicMetadata?.role
    
    if (userRole !== requiredRole) {
      // If user doesn't have required role, redirect to dashboard with error
      return (
        <Navigate 
          to="/dashboard" 
          state={{ 
            error: `Access denied. This page requires ${requiredRole} privileges.`,
            from: location.pathname 
          }} 
          replace 
        />
      )
    }
  }

  return children
}

export default ProtectedRoute 