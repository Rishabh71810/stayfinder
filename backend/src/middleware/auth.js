const { ClerkExpressRequireAuth, ClerkExpressWithAuth } = require('@clerk/clerk-sdk-node')

// Middleware to require authentication
const protect = ClerkExpressRequireAuth({
  onError: (error) => {
    console.error('Authentication error:', error)
    return {
      status: 401,
      message: 'Access denied. Please sign in.'
    }
  }
})

// Middleware for optional authentication
const optionalAuth = ClerkExpressWithAuth({
  onError: (error) => {
    console.log('Optional auth error (ignored):', error)
    // Don't throw error for optional auth
  }
})

// Middleware to check user roles
const authorize = (...roles) => {
  return (req, res, next) => {
    const user = req.auth?.user
    
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Access denied. User not authenticated.'
      })
    }

    // Get user role from Clerk metadata
    const userRole = user.publicMetadata?.role || 'guest'
    
    if (!roles.includes(userRole)) {
      return res.status(403).json({
        success: false,
        message: `Access denied. Requires one of the following roles: ${roles.join(', ')}`
      })
    }

    // Add user data to request
    req.user = {
      id: user.id,
      email: user.emailAddresses?.[0]?.emailAddress,
      name: user.firstName && user.lastName ? 
        `${user.firstName} ${user.lastName}` : 
        user.username || 'User',
      role: userRole,
      avatar: user.imageUrl,
      clerkUser: user
    }

    next()
  }
}

// Middleware to check if user is host
const requireHost = (req, res, next) => {
  const user = req.auth?.user
  const userRole = user?.publicMetadata?.role
  
  if (userRole !== 'host' && userRole !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Access denied. Host privileges required.'
    })
  }
  
  next()
}

// Middleware to check if user is admin
const requireAdmin = (req, res, next) => {
  const user = req.auth?.user
  const userRole = user?.publicMetadata?.role
  
  if (userRole !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Access denied. Admin privileges required.'
    })
  }
  
  next()
}

// Helper function to get user from Clerk ID
const getUserFromClerkId = (clerkUserId) => {
  // This would typically fetch additional user data from your database
  // For now, we'll return basic info
  return {
    clerkId: clerkUserId,
    // Add other user properties as needed
  }
}

module.exports = {
  protect,
  optionalAuth,
  authorize,
  requireHost,
  requireAdmin,
  getUserFromClerkId
}