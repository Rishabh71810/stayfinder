import React from 'react'
import { Routes, Route } from 'react-router-dom'
import { useUser } from '@clerk/clerk-react'

// Layout components
import Layout from './components/Layout/Layout'
import ProtectedRoute from './components/Auth/ProtectedRoute'

// Pages
import Home from './pages/Home'
import ListingDetails from './pages/ListingDetails'
import SearchResults from './pages/SearchResults'
import Dashboard from './pages/Dashboard/Dashboard'
import HostDashboard from './pages/Host/HostDashboard'
import CreateListing from './pages/Host/CreateListing'
import EditListing from './pages/Host/EditListing'
import BookingConfirmation from './pages/Booking/BookingConfirmation'
import UserBookings from './pages/Dashboard/UserBookings'
import UserFavorites from './pages/Dashboard/UserFavorites'
import UserProfile from './pages/Dashboard/UserProfile'
import NotFound from './pages/NotFound'

// Loading component
import LoadingSpinner from './components/UI/LoadingSpinner'

function App() {
  let isLoaded = false
  
  try {
    const userContext = useUser()
    isLoaded = userContext?.isLoaded || false
  } catch (error) {
    console.error('Error accessing user context:', error)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-red-600 mb-2">Authentication Error</h2>
          <p className="text-gray-600 mb-4">There was an issue loading the authentication context.</p>
          <button 
            onClick={() => window.location.reload()}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Refresh Page
          </button>
        </div>
      </div>
    )
  }

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  return (
    <div className="App">
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="search" element={<SearchResults />} />
          <Route path="listing/:id" element={<ListingDetails />} />
          
          {/* Protected routes */}
          <Route path="dashboard" element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }>
            <Route index element={<UserProfile />} />
            <Route path="bookings" element={<UserBookings />} />
            <Route path="favorites" element={<UserFavorites />} />
          </Route>
          
          {/* Host routes */}
          <Route path="host" element={
            <ProtectedRoute requiredRole="host">
              <HostDashboard />
            </ProtectedRoute>
          }>
            <Route index element={<HostDashboard />} />
            <Route path="listings/new" element={<CreateListing />} />
            <Route path="listings/:id/edit" element={<EditListing />} />
          </Route>
          
          {/* Booking routes */}
          <Route path="booking" element={
            <ProtectedRoute>
              <BookingConfirmation />
            </ProtectedRoute>
          } />
          
          {/* 404 */}
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </div>
  )
}

export default App 