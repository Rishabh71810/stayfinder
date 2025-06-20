import React, { useState, useEffect } from 'react'
import { useLocation, useSearchParams } from 'react-router-dom'
import PropertyCard from '../components/UI/PropertyCard'
import SearchFilter from '../components/UI/SearchFilter'
import LoadingSpinner from '../components/UI/LoadingSpinner'
import PropertyMap from '../components/UI/PropertyMap'
import { Map, Grid3X3 } from 'lucide-react'
import { listingsAPI } from '../services/api'

const SearchResults = () => {
  const location = useLocation()
  const [searchParams] = useSearchParams()
  const [listings, setListings] = useState([])
  const [loading, setLoading] = useState(true)
  const [totalCount, setTotalCount] = useState(0)
  const [currentPage, setCurrentPage] = useState(1)
  const [sortBy, setSortBy] = useState('createdAt')
  const [sortOrder, setSortOrder] = useState('desc')
  const [showMapView, setShowMapView] = useState(false)

  const limit = 12

  // Sample listings data for different cities
  const getSampleListings = () => {
    return [
      // New York listings
      {
        _id: '507f1f77bcf86cd799439001',
        title: 'Modern Downtown Manhattan Apartment',
        description: 'Stylish apartment in the heart of Manhattan with stunning city views, floor-to-ceiling windows, and contemporary design. Walking distance to subway, restaurants, and major attractions.',
        images: [
          { url: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800', caption: 'Living room', isMain: true },
          { url: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800', caption: 'Kitchen' },
          { url: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800', caption: 'Bedroom' }
        ],
        location: { 
          city: 'New York', 
          state: 'NY', 
          country: 'United States',
          address: '123 Broadway',
          neighborhood: 'Financial District',
          coordinates: { type: 'Point', coordinates: [-74.0060, 40.7128] }
        },
        capacity: { guests: 4, bedrooms: 2, bathrooms: 2, beds: 2 },
        pricing: { basePrice: 180, cleaningFee: 30, serviceFee: 20 },
        propertyType: 'apartment',
        rating: { average: 4.8, count: 124 },
        amenities: ['WiFi', 'Kitchen', 'Air Conditioning', 'Elevator', 'Dishwasher', 'TV', 'City View', 'Washer/Dryer'],
        host: { name: 'Emma Thompson', rating: 4.9, responseTime: '1 hour' }
      },
      {
        _id: '507f1f77bcf86cd799439002',
        title: 'Brooklyn Heights Historic Brownstone',
        description: 'Charming historic brownstone with stunning Brooklyn Bridge views, original hardwood floors, and spacious rooms. Perfect for families exploring NYC.',
        images: [
          { url: 'https://images.unsplash.com/photo-1549517045-bc93de075e53?w=800', caption: 'Brownstone exterior', isMain: true },
          { url: 'https://images.unsplash.com/photo-1581858726788-75bc0f6a952d?w=800', caption: 'Living room' },
          { url: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800', caption: 'Kitchen' }
        ],
        location: { 
          city: 'New York', 
          state: 'NY', 
          country: 'United States',
          address: '456 Remsen Street',
          neighborhood: 'Brooklyn Heights',
          coordinates: { type: 'Point', coordinates: [-73.9969, 40.6968] }
        },
        capacity: { guests: 6, bedrooms: 3, bathrooms: 2, beds: 4 },
        pricing: { basePrice: 220, cleaningFee: 45, serviceFee: 25 },
        propertyType: 'house',
        rating: { average: 4.9, count: 89 },
        amenities: ['WiFi', 'Kitchen', 'Heating', 'Garden', 'Fireplace', 'Washer/Dryer', 'Bridge View', 'Historic Character'],
        host: { name: 'David Miller', rating: 4.8, responseTime: '2 hours' }
      },
      {
        _id: '507f1f77bcf86cd799439003',
        title: 'Times Square Studio Loft',
        description: 'Modern studio in the heart of Times Square, perfect for city exploration',
        images: [
          { url: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800', caption: 'Studio loft', isMain: true }
        ],
        location: { city: 'New York', state: 'NY', country: 'United States' },
        capacity: { guests: 2, bedrooms: 1, bathrooms: 1 },
        pricing: { basePrice: 120 },
        propertyType: 'studio',
        rating: { average: 4.6, count: 67 }
      },
      // Los Angeles listings
      {
        _id: '507f1f77bcf86cd799439004',
        title: 'Hollywood Hills Luxury Villa with Infinity Pool',
        description: 'Stunning modern villa in the Hollywood Hills featuring an infinity pool, panoramic city views, and designer furnishings. Perfect for celebrities and luxury seekers.',
        images: [
          { url: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800', caption: 'Villa exterior', isMain: true },
          { url: 'https://images.unsplash.com/photo-1602002418082-a4443e081dd1?w=800', caption: 'Pool area' },
          { url: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800', caption: 'Living room' }
        ],
        location: { 
          city: 'Los Angeles', 
          state: 'CA', 
          country: 'United States',
          address: '123 Mulholland Drive',
          neighborhood: 'Hollywood Hills',
          coordinates: { type: 'Point', coordinates: [-118.3701, 34.1341] }
        },
        capacity: { guests: 8, bedrooms: 4, bathrooms: 3, beds: 5 },
        pricing: { basePrice: 450, cleaningFee: 85, serviceFee: 45 },
        propertyType: 'villa',
        rating: { average: 4.9, count: 156 },
        amenities: ['WiFi', 'Pool', 'City View', 'Parking', 'Kitchen', 'Hot Tub', 'BBQ Grill', 'Security System', 'Gym'],
        host: { name: 'Sophia Martinez', rating: 4.9, responseTime: '30 minutes' }
      },
      {
        _id: '507f1f77bcf86cd799439005',
        title: 'Venice Beach Apartment',
        description: 'Trendy beachfront apartment just steps from the Venice Boardwalk',
        images: [
          { url: 'https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800', caption: 'Beach apartment', isMain: true }
        ],
        location: { city: 'Los Angeles', state: 'CA', country: 'United States' },
        capacity: { guests: 4, bedrooms: 2, bathrooms: 2 },
        pricing: { basePrice: 200 },
        propertyType: 'apartment',
        rating: { average: 4.7, count: 98 }
      },
      {
        _id: '507f1f77bcf86cd799439006',
        title: 'Beverly Hills Luxury Condo',
        description: 'Upscale condominium in prestigious Beverly Hills with concierge service',
        images: [
          { url: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800', caption: 'Luxury condo', isMain: true }
        ],
        location: { city: 'Los Angeles', state: 'CA', country: 'United States' },
        capacity: { guests: 6, bedrooms: 3, bathrooms: 3 },
        pricing: { basePrice: 350 },
        propertyType: 'condo',
        rating: { average: 4.8, count: 134 }
      },
      // Miami listings
      {
        _id: '507f1f77bcf86cd799439007',
        title: 'South Beach Art Deco Apartment',
        description: 'Stylish apartment in iconic Art Deco building steps from South Beach',
        images: [
          { url: 'https://images.unsplash.com/photo-1505142468610-359e7d316be0?w=800', caption: 'Art Deco apartment', isMain: true }
        ],
        location: { city: 'Miami', state: 'FL', country: 'United States' },
        capacity: { guests: 4, bedrooms: 2, bathrooms: 2 },
        pricing: { basePrice: 180 },
        propertyType: 'apartment',
        rating: { average: 4.7, count: 112 }
      },
      {
        _id: '507f1f77bcf86cd799439008',
        title: 'Miami Beach Oceanfront Villa with Private Beach',
        description: 'Luxury beachfront villa with private beach access, stunning ocean views, and resort-style amenities. Perfect for large groups and special celebrations.',
        images: [
          { url: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800', caption: 'Villa exterior', isMain: true },
          { url: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800', caption: 'Ocean view' },
          { url: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800', caption: 'Pool area' }
        ],
        location: { 
          city: 'Miami', 
          state: 'FL', 
          country: 'United States',
          address: '789 Ocean Drive',
          neighborhood: 'South Beach',
          coordinates: { type: 'Point', coordinates: [-80.1300, 25.7907] }
        },
        capacity: { guests: 10, bedrooms: 5, bathrooms: 4, beds: 6 },
        pricing: { basePrice: 600, cleaningFee: 120, serviceFee: 60 },
        propertyType: 'villa',
        rating: { average: 4.9, count: 89 },
        amenities: ['WiFi', 'Beach Access', 'Pool', 'Ocean View', 'BBQ Grill', 'Parking', 'Kitchen', 'Hot Tub', 'Butler Service'],
        host: { name: 'Isabella Rodriguez', rating: 5.0, responseTime: '15 minutes' }
      },
      // Paris listings
      {
        _id: '507f1f77bcf86cd799439011',
        title: 'Montmartre Artist Studio',
        description: 'Charming artist studio in historic Montmartre with Sacré-Cœur views',
        images: [
          { url: 'https://images.unsplash.com/photo-1502602898536-47ad22581b52?w=800&h=600&fit=crop&crop=center', caption: 'Studio view', isMain: true }
        ],
        location: { city: 'Paris', state: '', country: 'France' },
        capacity: { guests: 2, bedrooms: 1, bathrooms: 1 },
        pricing: { basePrice: 120 },
        propertyType: 'studio',
        rating: { average: 4.8, count: 78 }
      },
      {
        _id: '507f1f77bcf86cd799439012',
        title: 'Champs-Élysées Elegant Haussmann Apartment',
        description: 'Elegant Haussmann-style apartment near the Champs-Élysées with classic French architecture, high ceilings, and modern amenities. Walking distance to Arc de Triomphe and luxury shopping.',
        images: [
          { url: 'https://images.unsplash.com/photo-1549638441-b787d2e11f14?w=800&h=600&fit=crop&crop=center', caption: 'Living room', isMain: true },
          { url: 'https://images.unsplash.com/photo-1523906834658-6e24ef2386f9?w=800&h=600&fit=crop&crop=center', caption: 'Bedroom' },
          { url: 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=800&h=600&fit=crop&crop=center', caption: 'Kitchen' }
        ],
        location: { 
          city: 'Paris', 
          state: '', 
          country: 'France',
          address: '123 Avenue des Champs-Élysées',
          neighborhood: '8th Arrondissement',
          coordinates: { type: 'Point', coordinates: [2.3083, 48.8698] }
        },
        capacity: { guests: 6, bedrooms: 3, bathrooms: 2, beds: 3 },
        pricing: { basePrice: 280, cleaningFee: 50, serviceFee: 30 },
        propertyType: 'apartment',
        rating: { average: 4.9, count: 156 },
        amenities: ['WiFi', 'Kitchen', 'Heating', 'Classic Architecture', 'City View', 'Concierge', 'Elevator', 'Balcony'],
        host: { name: 'Philippe Dubois', rating: 4.9, responseTime: '1 hour' }
      },
      // London listings
      {
        _id: '507f1f77bcf86cd799439013',
        title: 'Covent Garden Victorian Townhouse',
        description: 'Beautiful Victorian townhouse in the heart of Covent Garden',
        images: [
          { url: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=800', caption: 'Townhouse exterior', isMain: true }
        ],
        location: { city: 'London', state: '', country: 'United Kingdom' },
        capacity: { guests: 8, bedrooms: 4, bathrooms: 3 },
        pricing: { basePrice: 320 },
        propertyType: 'townhouse',
        rating: { average: 4.8, count: 142 }
      },
      {
        _id: '507f1f77bcf86cd799439014',
        title: 'Thames View Modern Apartment',
        description: 'Contemporary apartment with stunning Thames and city skyline views',
        images: [
          { url: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=800', caption: 'Thames view', isMain: true }
        ],
        location: { city: 'London', state: '', country: 'United Kingdom' },
        capacity: { guests: 4, bedrooms: 2, bathrooms: 2 },
        pricing: { basePrice: 200 },
        propertyType: 'apartment',
        rating: { average: 4.7, count: 98 }
      },
      // Tokyo listings
      {
        _id: '507f1f77bcf86cd799439015',
        title: 'Shibuya Modern Studio',
        description: 'Ultra-modern studio in the heart of Shibuya with city views',
        images: [
          { url: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800', caption: 'Studio view', isMain: true }
        ],
        location: { city: 'Tokyo', state: '', country: 'Japan' },
        capacity: { guests: 2, bedrooms: 1, bathrooms: 1 },
        pricing: { basePrice: 100 },
        propertyType: 'studio',
        rating: { average: 4.6, count: 87 }
      },
      {
        _id: '507f1f77bcf86cd799439016',
        title: 'Traditional Ryokan Experience in Historic Asakusa',
        description: 'Authentic Japanese ryokan experience in the traditional Asakusa district with tatami floors, futon beds, and traditional architecture. Near Senso-ji Temple and traditional markets.',
        images: [
          { url: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800', caption: 'Ryokan exterior', isMain: true },
          { url: 'https://images.unsplash.com/photo-1580741569599-b58252ff5e4e?w=800', caption: 'Interior room' },
          { url: 'https://images.unsplash.com/photo-1536098561742-ca998e48cbcc?w=800', caption: 'Garden view' }
        ],
        location: { 
          city: 'Tokyo', 
          state: '', 
          country: 'Japan',
          address: '123 Asakusa Street',
          neighborhood: 'Asakusa',
          coordinates: { type: 'Point', coordinates: [139.7967, 35.7148] }
        },
        capacity: { guests: 4, bedrooms: 2, bathrooms: 2, beds: 4 },
        pricing: { basePrice: 150, cleaningFee: 25, serviceFee: 15 },
        propertyType: 'house',
        rating: { average: 4.9, count: 134 },
        amenities: ['WiFi', 'Traditional Architecture', 'Tatami Floors', 'Tea Ceremony Room', 'Garden', 'Temple View', 'Cultural Experience'],
        host: { name: 'Yuki Tanaka', rating: 4.9, responseTime: '1 hour' }
      },
      // Barcelona listings
      {
        _id: '507f1f77bcf86cd799439017',
        title: 'Gothic Quarter Penthouse',
        description: 'Stunning penthouse in the historic Gothic Quarter with terrace',
        images: [
          { url: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=800', caption: 'Penthouse terrace', isMain: true }
        ],
        location: { city: 'Barcelona', state: '', country: 'Spain' },
        capacity: { guests: 6, bedrooms: 3, bathrooms: 2 },
        pricing: { basePrice: 180 },
        propertyType: 'apartment',
        rating: { average: 4.8, count: 123 }
      },
      {
        _id: '507f1f77bcf86cd799439018',
        title: 'Park Güell Artist Loft',
        description: 'Artistic loft near Park Güell with unique Gaudí-inspired design',
        images: [
          { url: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800', caption: 'Artist loft', isMain: true }
        ],
        location: { city: 'Barcelona', state: '', country: 'Spain' },
        capacity: { guests: 4, bedrooms: 2, bathrooms: 1 },
        pricing: { basePrice: 140 },
        propertyType: 'loft',
        rating: { average: 4.7, count: 89 }
      },
      // Mountain/Cabin destinations
      {
        _id: '507f1f77bcf86cd799439019',
        title: 'Aspen Luxury Mountain Cabin',
        description: 'Luxury mountain cabin with hot tub and ski-in/ski-out access',
        images: [
          { url: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=800', caption: 'Mountain cabin', isMain: true }
        ],
        location: { city: 'Aspen', state: 'CO', country: 'United States' },
        capacity: { guests: 8, bedrooms: 4, bathrooms: 3 },
        pricing: { basePrice: 400 },
        propertyType: 'cabin',
        rating: { average: 4.9, count: 67 }
      },
      {
        _id: '507f1f77bcf86cd799439020',
        title: 'Lake Tahoe Lakefront Cabin',
        description: 'Cozy lakefront cabin with private dock and mountain views',
        images: [
          { url: 'https://images.unsplash.com/photo-1470770841072-f978cf4d019e?w=800', caption: 'Lakefront cabin', isMain: true }
        ],
        location: { city: 'Lake Tahoe', state: 'CA', country: 'United States' },
        capacity: { guests: 6, bedrooms: 3, bathrooms: 2 },
        pricing: { basePrice: 250 },
        propertyType: 'cabin',
        rating: { average: 4.8, count: 94 }
      }
    ]
  }

  // Filter sample listings based on search criteria
  const filterSampleListings = (sampleData, filters) => {
    let filtered = [...sampleData]

    // Filter by location (city, state, or country)
    if (filters.location) {
      const searchLocation = filters.location.toLowerCase()
      filtered = filtered.filter(listing => 
        listing.location.city.toLowerCase().includes(searchLocation) ||
        listing.location.state.toLowerCase().includes(searchLocation) ||
        listing.location.country.toLowerCase().includes(searchLocation)
      )
    }

    // Filter by property type
    if (filters.propertyType) {
      filtered = filtered.filter(listing => 
        listing.propertyType === filters.propertyType
      )
    }

    // Filter by guest capacity
    if (filters.guests) {
      const guestCount = parseInt(filters.guests)
      filtered = filtered.filter(listing => 
        listing.capacity.guests >= guestCount
      )
    }

    // Filter by price range
    if (filters.minPrice) {
      const minPrice = parseInt(filters.minPrice)
      filtered = filtered.filter(listing => 
        listing.pricing.basePrice >= minPrice
      )
    }

    if (filters.maxPrice) {
      const maxPrice = parseInt(filters.maxPrice)
      filtered = filtered.filter(listing => 
        listing.pricing.basePrice <= maxPrice
      )
    }

    return filtered
  }

  // Sort sample listings
  const sortSampleListings = (data, sortBy, sortOrder) => {
    const sorted = [...data]
    
    sorted.sort((a, b) => {
      let aValue, bValue
      
      switch (sortBy) {
        case 'price':
          aValue = a.pricing.basePrice
          bValue = b.pricing.basePrice
          break
        case 'rating.average':
          aValue = a.rating.average
          bValue = b.rating.average
          break
        case 'title':
          aValue = a.title.toLowerCase()
          bValue = b.title.toLowerCase()
          break
        default: // createdAt
          // For sample data, we'll use title as fallback
          aValue = a.title.toLowerCase()
          bValue = b.title.toLowerCase()
      }
      
      if (sortOrder === 'desc') {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0
      } else {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0
      }
    })
    
    return sorted
  }

  useEffect(() => {
    fetchListings()
  }, [location.search, currentPage, sortBy, sortOrder])

  const fetchListings = async () => {
    try {
      setLoading(true)
      
      // Build query object from URL params
      const query = {}
      searchParams.forEach((value, key) => {
        if (value) query[key] = value
      })
      
      // Add pagination and sorting
      query.page = currentPage
      query.limit = limit
      query.sortBy = sortBy
      query.sortOrder = sortOrder

      try {
        const response = await listingsAPI.getListings(query)
        setListings(response.data.listings || [])
        setTotalCount(response.data.total || 0)
      } catch (apiError) {
        console.log('🏠 API unavailable, using sample data for search results')
        
        // Use sample data as fallback
        const sampleData = getSampleListings()
        const currentFilters = {}
        searchParams.forEach((value, key) => {
          currentFilters[key] = value
        })
        
        // Filter and sort sample data
        let filteredData = filterSampleListings(sampleData, currentFilters)
        filteredData = sortSampleListings(filteredData, sortBy, sortOrder)
        
        // Apply pagination to sample data
        const startIndex = (currentPage - 1) * limit
        const endIndex = startIndex + limit
        const paginatedData = filteredData.slice(startIndex, endIndex)
        
        setListings(paginatedData)
        setTotalCount(filteredData.length)
      }
    } catch (error) {
      console.error('Error fetching listings:', error)
      setListings([])
      setTotalCount(0)
    } finally {
      setLoading(false)
    }
  }

  const handleSortChange = (newSortBy, newSortOrder) => {
    setSortBy(newSortBy)
    setSortOrder(newSortOrder)
    setCurrentPage(1)
  }

  const handlePageChange = (page) => {
    setCurrentPage(page)
    window.scrollTo(0, 0)
  }

  // Get current filters from URL
  const currentFilters = {}
  searchParams.forEach((value, key) => {
    currentFilters[key] = value
  })

  const totalPages = Math.ceil(totalCount / limit)

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Search Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {currentFilters.location ? `Stays in ${currentFilters.location}` : 'Search Results'}
          </h1>
          {!loading && (
            <p className="text-gray-600">
              {totalCount} {totalCount === 1 ? 'property' : 'properties'} found
            </p>
          )}
        </div>

        {/* Search Filter */}
        <div className="mb-8">
          <SearchFilter initialFilters={currentFilters} />
        </div>

        {/* Sort Options */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 bg-white p-4 rounded-lg shadow-sm">
          <div className="flex items-center space-x-4 mb-4 sm:mb-0">
            <span className="text-sm font-medium text-gray-700">Sort by:</span>
            <select
              value={`${sortBy}-${sortOrder}`}
              onChange={(e) => {
                const [newSortBy, newSortOrder] = e.target.value.split('-')
                handleSortChange(newSortBy, newSortOrder)
              }}
              className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="createdAt-desc">Newest First</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="rating.average-desc">Highest Rated</option>
              <option value="title-asc">Name: A to Z</option>
            </select>
          </div>

          <div className="flex items-center space-x-4">
            <div className="flex items-center bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setShowMapView(false)}
                className={`flex items-center space-x-2 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                  !showMapView 
                    ? 'bg-white text-gray-900 shadow-sm' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Grid3X3 className="w-4 h-4" />
                <span>List</span>
              </button>
              <button
                onClick={() => setShowMapView(true)}
                className={`flex items-center space-x-2 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                  showMapView 
                    ? 'bg-white text-gray-900 shadow-sm' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Map className="w-4 h-4" />
                <span>Map</span>
              </button>
            </div>
          </div>
        </div>

        {/* Results */}
        {loading ? (
          <div className="flex justify-center py-12">
            <LoadingSpinner />
          </div>
        ) : listings.length > 0 ? (
          <>
            {showMapView ? (
              /* Map View */
              <div className="mb-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[600px]">
                  {/* Map */}
                  <div className="lg:col-span-2">
                    <div className="h-full rounded-lg overflow-hidden">
                      <PropertyMap 
                        listing={listings[0]} 
                        height="100%" 
                        showControls={true} 
                      />
                    </div>
                  </div>
                  
                  {/* Property List Sidebar */}
                  <div className="lg:col-span-1 overflow-y-auto">
                    <div className="space-y-4 pr-2">
                      {listings.map((listing) => (
                        <div 
                          key={listing._id}
                          className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow cursor-pointer"
                          onClick={() => window.location.href = `/listing/${listing._id}`}
                        >
                          <div className="p-4">
                            <div className="flex space-x-3">
                              <img
                                src={listing.images?.[0]?.url || ''}
                                alt={listing.title}
                                className="w-20 h-20 object-cover rounded-lg flex-shrink-0"
                              />
                              <div className="flex-1 min-w-0">
                                <h3 className="text-sm font-semibold text-gray-900 line-clamp-2 mb-1">
                                  {listing.title}
                                </h3>
                                <p className="text-xs text-gray-600 mb-2">
                                  {listing.location?.city}, {listing.location?.state}
                                </p>
                                <div className="flex items-center justify-between">
                                  {listing.rating?.average && (
                                    <div className="flex items-center">
                                      <svg className="w-3 h-3 text-yellow-400 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                      </svg>
                                      <span className="text-xs font-medium">{listing.rating.average.toFixed(1)}</span>
                                    </div>
                                  )}
                                  <div className="text-right">
                                    <span className="text-sm font-bold text-primary-600">
                                      ${listing.pricing?.basePrice}
                                    </span>
                                    <span className="text-xs text-gray-500">/night</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              /* Grid View */
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
                {listings.map((listing) => (
                  <PropertyCard key={listing._id} listing={listing} />
                ))}
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center space-x-2">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="px-3 py-2 rounded-md border border-gray-300 text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>

                {/* Page numbers */}
                {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                  let pageNum
                  if (totalPages <= 5) {
                    pageNum = i + 1
                  } else if (currentPage <= 3) {
                    pageNum = i + 1
                  } else if (currentPage >= totalPages - 2) {
                    pageNum = totalPages - 4 + i
                  } else {
                    pageNum = currentPage - 2 + i
                  }

                  return (
                    <button
                      key={pageNum}
                      onClick={() => handlePageChange(pageNum)}
                      className={`px-3 py-2 rounded-md text-sm font-medium ${
                        currentPage === pageNum
                          ? 'bg-primary-600 text-white'
                          : 'border border-gray-300 text-gray-700 bg-white hover:bg-gray-50'
                      }`}
                    >
                      {pageNum}
                    </button>
                  )
                })}

                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="px-3 py-2 rounded-md border border-gray-300 text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            )}
          </>
        ) : (
          /* No Results */
          <div className="text-center py-12">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">No properties found</h3>
            <p className="mt-1 text-sm text-gray-500">
              Try adjusting your search criteria or browse all properties.
            </p>
            <div className="mt-6">
              <button
                onClick={() => window.location.href = '/search'}
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700"
              >
                Clear filters
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default SearchResults 