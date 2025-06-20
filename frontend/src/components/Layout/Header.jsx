import React, { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { 
  Search, 
  Menu, 
  X, 
  User, 
  LogOut, 
  Settings, 
  Heart, 
  Calendar,
  Home,
  Plus
} from 'lucide-react'
import { 
  useUser, 
  useClerk, 
  SignInButton, 
  SignUpButton, 
  UserButton 
} from '@clerk/clerk-react'
import { cn } from '../../utils/cn'

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [isScrolled, setIsScrolled] = useState(false)
  
  const { isSignedIn, user } = useUser()
  const { signOut } = useClerk()
  const navigate = useNavigate()
  const location = useLocation()

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate(`/search?location=${encodeURIComponent(searchQuery.trim())}`)
      setSearchQuery('')
    }
  }

  const handleSignOut = async () => {
    await signOut()
    navigate('/')
  }

  const isActivePath = (path) => location.pathname === path

  // Check if user is a host (this would need to be stored in user metadata)
  const isHost = user?.publicMetadata?.role === 'host'

  return (
    <header className={cn(
      "sticky top-0 z-50 transition-all duration-300",
      isScrolled 
        ? "bg-white/95 backdrop-blur-lg border-b border-gray-200/50 shadow-soft" 
        : "bg-white/90 backdrop-blur-sm border-b border-gray-200/30"
    )}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-18">
          {/* Logo */}
          <Link 
            to="/" 
            className="flex items-center space-x-3 group"
          >
            <div className="p-2 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl group-hover:from-primary-600 group-hover:to-primary-700 transition-all duration-300 group-hover:scale-105">
              <Home className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-primary-600 to-primary-800 bg-clip-text text-transparent font-display group-hover:from-primary-700 group-hover:to-primary-900 transition-all duration-300">
              StayFinder
            </span>
          </Link>

          {/* Search Bar - Desktop */}
          <div className="hidden md:block flex-1 max-w-md mx-8">
            <form onSubmit={handleSearch} className="relative group">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search destinations..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-white/80 backdrop-blur-sm border-2 border-gray-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-primary-500/25 focus:border-primary-400 transition-all duration-300 placeholder-gray-500 group-hover:border-gray-300"
                />
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 group-hover:text-primary-500 transition-colors" />
              </div>
            </form>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-2">
            {isSignedIn ? (
              <>
                {isHost && (
                  <Link
                    to="/host"
                    className={cn(
                      "flex items-center space-x-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 hover:scale-105",
                      isActivePath('/host') 
                        ? "bg-primary-100 text-primary-700 shadow-soft" 
                        : "text-gray-700 hover:bg-primary-50 hover:text-primary-600"
                    )}
                  >
                    <Plus className="w-4 h-4" />
                    <span>Host</span>
                  </Link>
                )}
                
                {/* Custom Navigation Links */}
                <div className="flex items-center space-x-1">
                  <Link
                    to="/dashboard"
                    className={cn(
                      "flex items-center space-x-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 hover:scale-105",
                      isActivePath('/dashboard') 
                        ? "bg-primary-100 text-primary-700 shadow-soft" 
                        : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                    )}
                  >
                    <User className="w-4 h-4" />
                    <span>Dashboard</span>
                  </Link>
                  
                  <Link
                    to="/dashboard/bookings"
                    className={cn(
                      "flex items-center space-x-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 hover:scale-105",
                      isActivePath('/dashboard/bookings') 
                        ? "bg-primary-100 text-primary-700 shadow-soft" 
                        : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                    )}
                  >
                    <Calendar className="w-4 h-4" />
                    <span>Bookings</span>
                  </Link>
                  
                  <Link
                    to="/dashboard/favorites"
                    className={cn(
                      "flex items-center space-x-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 hover:scale-105",
                      isActivePath('/dashboard/favorites') 
                        ? "bg-primary-100 text-primary-700 shadow-soft" 
                        : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                    )}
                  >
                    <Heart className="w-4 h-4" />
                    <span>Favorites</span>
                  </Link>
                </div>

                {/* Clerk User Button */}
                <div className="ml-4">
                  <UserButton 
                    afterSignOutUrl="/"
                    appearance={{
                      elements: {
                        avatarBox: "w-12 h-12 rounded-xl shadow-soft hover:shadow-medium transition-all duration-300",
                        userButtonPopoverCard: "bg-white/95 backdrop-blur-lg shadow-strong border border-gray-200/50 rounded-2xl",
                        userButtonPopoverActions: "bg-gray-50/80"
                      }
                    }}
                  />
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-3">
                <SignInButton mode="modal">
                  <button className="px-6 py-2.5 text-sm font-semibold text-gray-700 hover:text-gray-900 hover:bg-gray-100/80 rounded-xl transition-all duration-200 hover:scale-105">
                    Login
                  </button>
                </SignInButton>
                <SignUpButton mode="modal">
                  <button className="px-6 py-2.5 text-sm font-semibold bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-xl hover:from-primary-700 hover:to-primary-800 transition-all duration-300 hover:scale-105 hover:shadow-lg">
                    Sign up
                  </button>
                </SignUpButton>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-3 rounded-xl hover:bg-gray-100/80 transition-all duration-200 hover:scale-105"
          >
            {isMenuOpen ? 
              <X className="w-6 h-6 text-gray-600" /> : 
              <Menu className="w-6 h-6 text-gray-600" />
            }
          </button>
        </div>

        {/* Mobile Search */}
        <div className="md:hidden pb-4">
          <form onSubmit={handleSearch} className="relative group">
            <div className="relative">
              <input
                type="text"
                placeholder="Search destinations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-white/80 backdrop-blur-sm border-2 border-gray-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-primary-500/25 focus:border-primary-400 transition-all duration-300 placeholder-gray-500"
              />
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            </div>
          </form>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-gray-200/50 py-4 space-y-1 bg-white/95 backdrop-blur-sm rounded-b-2xl animate-slide-down">
            {isSignedIn ? (
              <>
                <Link
                  to="/dashboard"
                  className={cn(
                    "flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-primary-50 hover:text-primary-600 rounded-xl transition-all duration-200",
                    isActivePath('/dashboard') && "bg-primary-100 text-primary-700"
                  )}
                  onClick={() => setIsMenuOpen(false)}
                >
                  <User className="w-5 h-5" />
                  <span className="font-medium">Dashboard</span>
                </Link>
                
                <Link
                  to="/dashboard/bookings"
                  className={cn(
                    "flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-primary-50 hover:text-primary-600 rounded-xl transition-all duration-200",
                    isActivePath('/dashboard/bookings') && "bg-primary-100 text-primary-700"
                  )}
                  onClick={() => setIsMenuOpen(false)}
                >
                  <Calendar className="w-5 h-5" />
                  <span className="font-medium">My Bookings</span>
                </Link>
                
                <Link
                  to="/dashboard/favorites"
                  className={cn(
                    "flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-primary-50 hover:text-primary-600 rounded-xl transition-all duration-200",
                    isActivePath('/dashboard/favorites') && "bg-primary-100 text-primary-700"
                  )}
                  onClick={() => setIsMenuOpen(false)}
                >
                  <Heart className="w-5 h-5" />
                  <span className="font-medium">Favorites</span>
                </Link>
                
                {isHost && (
                  <Link
                    to="/host"
                    className={cn(
                      "flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-primary-50 hover:text-primary-600 rounded-xl transition-all duration-200",
                      isActivePath('/host') && "bg-primary-100 text-primary-700"
                    )}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <Plus className="w-5 h-5" />
                    <span className="font-medium">Host Dashboard</span>
                  </Link>
                )}
                
                <button
                  onClick={() => {
                    handleSignOut()
                    setIsMenuOpen(false)
                  }}
                  className="flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-red-50 hover:text-red-600 rounded-xl transition-all duration-200 w-full"
                >
                  <LogOut className="w-5 h-5" />
                  <span className="font-medium">Sign Out</span>
                </button>
              </>
            ) : (
              <div className="space-y-2 px-4">
                <SignInButton mode="modal">
                  <button 
                    className="w-full px-4 py-3 text-gray-700 hover:bg-gray-100/80 rounded-xl transition-all duration-200 font-medium text-left"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Login
                  </button>
                </SignInButton>
                <SignUpButton mode="modal">
                  <button 
                    className="w-full px-4 py-3 bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-xl hover:from-primary-700 hover:to-primary-800 transition-all duration-300 font-semibold"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Sign up
                  </button>
                </SignUpButton>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  )
}

export default Header 