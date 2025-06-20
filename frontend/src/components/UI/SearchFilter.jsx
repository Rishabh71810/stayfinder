import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, MapPin, Calendar, Users, Home, DollarSign, Filter, X } from 'lucide-react'

const SearchFilter = ({ initialFilters = {} }) => {
  const navigate = useNavigate()
  const [filters, setFilters] = useState({
    location: initialFilters.location || '',
    checkIn: initialFilters.checkIn || '',
    checkOut: initialFilters.checkOut || '',
    guests: initialFilters.guests || 1,
    propertyType: initialFilters.propertyType || '',
    minPrice: initialFilters.minPrice || '',
    maxPrice: initialFilters.maxPrice || '',
    ...initialFilters
  })

  const propertyTypes = [
    { value: 'apartment', label: 'Apartment', icon: '🏢' },
    { value: 'house', label: 'House', icon: '🏠' },
    { value: 'condo', label: 'Condo', icon: '🏘️' },
    { value: 'villa', label: 'Villa', icon: '🏖️' },
    { value: 'cabin', label: 'Cabin', icon: '🏕️' },
    { value: 'loft', label: 'Loft', icon: '🏭' },
    { value: 'townhouse', label: 'Townhouse', icon: '🏘️' },
    { value: 'studio', label: 'Studio', icon: '🏠' }
  ]

  const handleInputChange = (name, value) => {
    setFilters(prev => ({ ...prev, [name]: value }))
  }

  const handleSearch = (e) => {
    e.preventDefault()
    
    // Build query string
    const queryParams = new URLSearchParams()
    Object.entries(filters).forEach(([key, value]) => {
      if (value) {
        queryParams.append(key, value)
      }
    })
    
    // Navigate to search results
    navigate(`/search?${queryParams.toString()}`)
  }

  const clearFilters = () => {
    setFilters({
      location: '',
      checkIn: '',
      checkOut: '',
      guests: 1,
      propertyType: '',
      minPrice: '',
      maxPrice: ''
    })
  }

  const hasFilters = Object.values(filters).some(value => 
    value && value !== 1 && value !== ''
  )

  // Get today's date for date input min attribute
  const today = new Date().toISOString().split('T')[0]

  return (
    <div className="bg-white/90 backdrop-blur-md p-8 rounded-3xl shadow-strong border border-white/50 hover:shadow-glow transition-all duration-500">
      <form onSubmit={handleSearch} className="space-y-8">
        {/* Main Search Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Location */}
          <div className="group">
            <label className="flex items-center text-sm font-semibold text-gray-700 mb-3">
              <MapPin className="w-4 h-4 mr-2 text-primary-500" />
              Where
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search destinations"
                value={filters.location}
                onChange={(e) => handleInputChange('location', e.target.value)}
                className="w-full px-4 py-4 bg-white/80 backdrop-blur-sm border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-primary-500/25 focus:border-primary-400 transition-all duration-300 placeholder-gray-400 group-hover:border-gray-300"
              />
            </div>
          </div>

          {/* Check-in */}
          <div className="group">
            <label className="flex items-center text-sm font-semibold text-gray-700 mb-3">
              <Calendar className="w-4 h-4 mr-2 text-primary-500" />
              Check-in
            </label>
            <input
              type="date"
              value={filters.checkIn}
              min={today}
              onChange={(e) => handleInputChange('checkIn', e.target.value)}
              className="w-full px-4 py-4 bg-white/80 backdrop-blur-sm border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-primary-500/25 focus:border-primary-400 transition-all duration-300 group-hover:border-gray-300"
            />
          </div>

          {/* Check-out */}
          <div className="group">
            <label className="flex items-center text-sm font-semibold text-gray-700 mb-3">
              <Calendar className="w-4 h-4 mr-2 text-primary-500" />
              Check-out
            </label>
            <input
              type="date"
              value={filters.checkOut}
              min={filters.checkIn || today}
              onChange={(e) => handleInputChange('checkOut', e.target.value)}
              className="w-full px-4 py-4 bg-white/80 backdrop-blur-sm border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-primary-500/25 focus:border-primary-400 transition-all duration-300 group-hover:border-gray-300"
            />
          </div>

          {/* Guests */}
          <div className="group">
            <label className="flex items-center text-sm font-semibold text-gray-700 mb-3">
              <Users className="w-4 h-4 mr-2 text-primary-500" />
              Guests
            </label>
            <select
              value={filters.guests}
              onChange={(e) => handleInputChange('guests', parseInt(e.target.value))}
              className="w-full px-4 py-4 bg-white/80 backdrop-blur-sm border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-primary-500/25 focus:border-primary-400 transition-all duration-300 group-hover:border-gray-300"
            >
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(num => (
                <option key={num} value={num}>
                  {num} guest{num > 1 ? 's' : ''}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Advanced Filters */}
        <div className="border-t border-gray-200/50 pt-8">
          <h3 className="flex items-center text-lg font-semibold text-gray-900 mb-6">
            <Filter className="w-5 h-5 mr-2 text-primary-500" />
            Advanced Filters
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Property Type */}
            <div className="group">
              <label className="flex items-center text-sm font-semibold text-gray-700 mb-3">
                <Home className="w-4 h-4 mr-2 text-primary-500" />
                Property Type
              </label>
              <select
                value={filters.propertyType}
                onChange={(e) => handleInputChange('propertyType', e.target.value)}
                className="w-full px-4 py-4 bg-white/80 backdrop-blur-sm border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-primary-500/25 focus:border-primary-400 transition-all duration-300 group-hover:border-gray-300"
              >
                <option value="">Any type</option>
                {propertyTypes.map(type => (
                  <option key={type.value} value={type.value}>
                    {type.icon} {type.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Min Price */}
            <div className="group">
              <label className="flex items-center text-sm font-semibold text-gray-700 mb-3">
                <DollarSign className="w-4 h-4 mr-2 text-primary-500" />
                Min Price
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 font-medium">$</span>
                <input
                  type="number"
                  placeholder="0"
                  value={filters.minPrice}
                  onChange={(e) => handleInputChange('minPrice', e.target.value)}
                  className="w-full pl-8 pr-4 py-4 bg-white/80 backdrop-blur-sm border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-primary-500/25 focus:border-primary-400 transition-all duration-300 placeholder-gray-400 group-hover:border-gray-300"
                />
              </div>
            </div>

            {/* Max Price */}
            <div className="group">
              <label className="flex items-center text-sm font-semibold text-gray-700 mb-3">
                <DollarSign className="w-4 h-4 mr-2 text-primary-500" />
                Max Price
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 font-medium">$</span>
                <input
                  type="number"
                  placeholder="1000"
                  value={filters.maxPrice}
                  onChange={(e) => handleInputChange('maxPrice', e.target.value)}
                  className="w-full pl-8 pr-4 py-4 bg-white/80 backdrop-blur-sm border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-primary-500/25 focus:border-primary-400 transition-all duration-300 placeholder-gray-400 group-hover:border-gray-300"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Quick Price Filters */}
        <div>
          <h4 className="text-sm font-semibold text-gray-700 mb-4">Quick Price Ranges</h4>
          <div className="flex flex-wrap gap-3">
            {[
              { label: 'Under $100', min: '', max: '100' },
              { label: '$100 - $250', min: '100', max: '250' },
              { label: '$250 - $500', min: '250', max: '500' },
              { label: '$500+', min: '500', max: '' }
            ].map((range, index) => (
              <button
                key={index}
                type="button"
                onClick={() => {
                  handleInputChange('minPrice', range.min)
                  handleInputChange('maxPrice', range.max)
                }}
                className={`px-4 py-2 rounded-xl border-2 transition-all duration-300 text-sm font-medium hover:scale-105 ${
                  filters.minPrice === range.min && filters.maxPrice === range.max
                    ? 'border-primary-500 bg-primary-50 text-primary-700'
                    : 'border-gray-200 text-gray-600 hover:border-primary-300 hover:bg-primary-50/50'
                }`}
              >
                {range.label}
              </button>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-gray-200/50">
          <button
            type="submit"
            className="flex-1 flex items-center justify-center space-x-3 bg-gradient-to-r from-primary-600 to-primary-700 text-white py-4 px-8 rounded-xl hover:from-primary-700 hover:to-primary-800 transition-all duration-300 font-semibold text-lg hover:scale-[1.02] hover:shadow-lg group"
          >
            <Search className="w-5 h-5 group-hover:scale-110 transition-transform" />
            <span>Search Properties</span>
          </button>
          
          {hasFilters && (
            <button
              type="button"
              onClick={clearFilters}
              className="flex items-center justify-center space-x-2 px-8 py-4 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 hover:border-gray-400 transition-all duration-300 font-semibold hover:scale-[1.02] group"
            >
              <X className="w-5 h-5 group-hover:rotate-90 transition-transform" />
              <span>Clear Filters</span>
            </button>
          )}
        </div>
      </form>
    </div>
  )
}

export default SearchFilter 