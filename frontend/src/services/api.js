import axios from 'axios'

// Base API configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || '/api'

// Create axios instances
export const authAPI = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Function to get Clerk session token
const getClerkToken = async () => {
  try {
    // Get Clerk instance from window (available after ClerkProvider loads)
    const clerk = window.Clerk
    if (!clerk || !clerk.session) {
      return null
    }
    
    // Get the session token
    const token = await clerk.session.getToken()
    return token
  } catch (error) {
    console.error('Error getting Clerk token:', error)
    return null
  }
}

// Request interceptor for auth token
const addAuthToken = async (config) => {
  const token = await getClerkToken()
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
}

authAPI.interceptors.request.use(addAuthToken)
api.interceptors.request.use(addAuthToken)

// Response interceptor for error handling
const handleResponse = (response) => response

const handleError = (error) => {
  if (error.response?.status === 401) {
    // Instead of redirecting, let Clerk handle authentication
    console.error('Authentication error:', error)
    // Clerk will automatically redirect to sign-in if needed
  }
  return Promise.reject(error)
}

authAPI.interceptors.response.use(handleResponse, handleError)
api.interceptors.response.use(handleResponse, handleError)

// Listings API
export const listingsAPI = {
  // Get all listings with filters
  getListings: (params = {}) => {
    const searchParams = new URLSearchParams()
    Object.keys(params).forEach(key => {
      if (params[key] !== undefined && params[key] !== '') {
        searchParams.append(key, params[key])
      }
    })
    return api.get(`/listings?${searchParams.toString()}`)
  },

  // Get single listing
  getListing: (id) => api.get(`/listings/${id}`),

  // Create listing (host only)
  createListing: (data) => authAPI.post('/listings', data),

  // Update listing (owner only)
  updateListing: (id, data) => authAPI.put(`/listings/${id}`, data),

  // Delete listing (owner only)
  deleteListing: (id) => authAPI.delete(`/listings/${id}`),

  // Get host's listings
  getMyListings: (params = {}) => {
    const searchParams = new URLSearchParams(params)
    return authAPI.get(`/listings/host/my-listings?${searchParams.toString()}`)
  },

  // Add review to listing
  addReview: (id, data) => authAPI.post(`/listings/${id}/reviews`, data),

  // Get similar listings
  getSimilarListings: (id) => api.get(`/listings/${id}/similar`),
}

// Bookings API
export const bookingsAPI = {
  // Create booking
  createBooking: (data) => authAPI.post('/bookings', data),

  // Get user's bookings
  getMyBookings: (params = {}) => {
    const searchParams = new URLSearchParams(params)
    return authAPI.get(`/bookings?${searchParams.toString()}`)
  },

  // Get single booking
  getBooking: (id) => authAPI.get(`/bookings/${id}`),

  // Update booking status
  updateBookingStatus: (id, data) => authAPI.put(`/bookings/${id}/status`, data),

  // Process payment through Clerk
  processPayment: async (bookingData, paymentData) => {
    // This would integrate with Clerk's payment processing
    // For now, we'll create a booking and handle payment separately
    try {
      const bookingResponse = await authAPI.post('/bookings', bookingData)
      
      // Here you would integrate with Clerk's payment processing
      // Example: await clerk.payments.createPayment(paymentData)
      
      return bookingResponse
    } catch (error) {
      throw error
    }
  }
}

// Users API
export const usersAPI = {
  // Get user profile (public)
  getUser: (id) => api.get(`/users/${id}`),

  // Get all users (admin only)
  getUsers: (params = {}) => {
    const searchParams = new URLSearchParams(params)
    return authAPI.get(`/users?${searchParams.toString()}`)
  },

  // Update user role (for becoming a host)
  updateUserRole: (role) => authAPI.post('/users/update-role', { role }),

  // Toggle favorite listing
  toggleFavorite: (listingId) => authAPI.post(`/users/favorites/${listingId}`),
}

// Search API helpers
export const searchAPI = {
  // Search listings by location
  searchByLocation: (location, filters = {}) => {
    return listingsAPI.getListings({ location, ...filters })
  },

  // Search listings by coordinates
  searchByCoordinates: (lat, lng, radius = 10, filters = {}) => {
    return listingsAPI.getListings({ lat, lng, radius, ...filters })
  },

  // Advanced search with multiple filters
  advancedSearch: (filters) => {
    return listingsAPI.getListings(filters)
  },
}

// Export default api instance
export default api 