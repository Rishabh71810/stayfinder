import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import PropertyCard from '../components/UI/PropertyCard'
import SearchFilter from '../components/UI/SearchFilter'
import LoadingSpinner from '../components/UI/LoadingSpinner'
import { listingsAPI } from '../services/api'

const Home = () => {
  const navigate = useNavigate()
  const [featuredListings, setFeaturedListings] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    fetchFeaturedListings()
  }, [])

  const fetchFeaturedListings = async () => {
    try {
      setLoading(true)
      // Try to fetch from API, but fall back to sample data
      try {
        const response = await listingsAPI.getListings({ limit: 8 })
        setFeaturedListings(response.data.listings || [])
      } catch (apiError) {
        // Fallback to sample data - use consistent IDs with SearchResults
        const sampleListings = [
          {
            _id: '507f1f77bcf86cd799439001',
            title: 'Modern Downtown Manhattan Apartment',
            description: 'Beautiful modern apartment in the heart of downtown with floor-to-ceiling windows, contemporary furnishings, and stunning city skyline views. Perfect for business travelers and urban explorers.',
            images: [
              { url: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800', isMain: true },
              { url: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800' },
              { url: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800' }
            ],
            location: { 
              city: 'New York', 
              state: 'NY', 
              country: 'United States',
              address: '123 Broadway',
              neighborhood: 'Financial District'
            },
            capacity: { guests: 4, bedrooms: 2, bathrooms: 2, beds: 2 },
            pricing: { basePrice: 180, cleaningFee: 25, serviceFee: 15 },
            propertyType: 'apartment',
            rating: { average: 4.8, count: 124 },
            amenities: ['WiFi', 'Kitchen', 'Air Conditioning', 'Heating', 'TV', 'Elevator', 'Washer/Dryer', 'City View'],
            host: { name: 'Sarah Mitchell', rating: 4.9, responseTime: '1 hour' }
          },
          {
            _id: '507f1f77bcf86cd799439008',
            title: 'Miami Beach Oceanfront Villa with Private Beach',
            description: 'Stunning beachfront villa with panoramic ocean views, private beach access, and expansive outdoor deck. Ideal for families and groups seeking a luxurious coastal getaway.',
            images: [
              { url: 'https://images.unsplash.com/photo-1505142468610-359e7d316be0?w=800', isMain: true },
              { url: 'https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?w=800' },
              { url: 'https://images.unsplash.com/photo-1540518614846-7eded47432f5?w=800' }
            ],
            location: { 
              city: 'Miami', 
              state: 'FL', 
              country: 'United States',
              address: '456 Ocean Drive',
              neighborhood: 'South Beach'
            },
            capacity: { guests: 8, bedrooms: 4, bathrooms: 3, beds: 5 },
            pricing: { basePrice: 420, cleaningFee: 75, serviceFee: 35 },
            propertyType: 'villa',
            rating: { average: 4.9, count: 89 },
            amenities: ['WiFi', 'Kitchen', 'Pool', 'Beach Access', 'Parking', 'BBQ Grill', 'Ocean View', 'Hot Tub', 'Garden'],
            host: { name: 'Carlos Rodriguez', rating: 4.8, responseTime: '30 minutes' }
          },
          {
            _id: '507f1f77bcf86cd799439011',
            title: 'Montmartre Artist Studio',
            description: 'Perfect retreat from city life nestled in the mountains with hiking trails nearby, cozy fireplace, and rustic charm. Ideal for nature lovers and adventure seekers.',
            images: [
              { url: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=800', isMain: true },
              { url: 'https://images.unsplash.com/photo-1519999482648-25049ddd37b1?w=800' },
              { url: 'https://images.unsplash.com/photo-1524634126442-357e0eac3c14?w=800' }
            ],
            location: { 
              city: 'Aspen', 
              state: 'CO', 
              country: 'United States',
              address: '789 Mountain Trail',
              neighborhood: 'Snowmass Village'
            },
            capacity: { guests: 6, bedrooms: 3, bathrooms: 2, beds: 4 },
            pricing: { basePrice: 280, cleaningFee: 50, serviceFee: 25 },
            propertyType: 'cabin',
            rating: { average: 4.7, count: 67 },
            amenities: ['WiFi', 'Kitchen', 'Fireplace', 'Heating', 'Parking', 'Mountain View', 'Hiking Trails', 'Ski Storage'],
            host: { name: 'Jennifer Walsh', rating: 4.9, responseTime: '2 hours' }
          },
          {
            _id: '507f1f77bcf86cd799439004',
            title: 'Hollywood Hills Luxury Villa with Infinity Pool',
            description: 'Experience ultimate luxury living in this stunning penthouse with 360-degree city views, private rooftop terrace, and premium amenities. Perfect for special occasions.',
            images: [
              { url: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800', isMain: true },
              { url: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800' },
              { url: 'https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800' }
            ],
            location: { 
              city: 'Los Angeles', 
              state: 'CA', 
              country: 'United States',
              address: '321 Sunset Boulevard',
              neighborhood: 'West Hollywood'
            },
            capacity: { guests: 6, bedrooms: 3, bathrooms: 3, beds: 3 },
            pricing: { basePrice: 650, cleaningFee: 100, serviceFee: 50 },
            propertyType: 'apartment',
            rating: { average: 4.9, count: 156 },
            amenities: ['WiFi', 'Kitchen', 'Pool', 'Gym', 'Balcony', 'City View', 'Concierge', 'Valet Parking', 'Rooftop Terrace'],
            host: { name: 'Michael Chen', rating: 5.0, responseTime: '15 minutes' }
          }
        ]
        console.log('🏠 Using sample listings:', sampleListings)
        setFeaturedListings(sampleListings)
      }
    } catch (error) {
      console.error('Error fetching featured listings:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleQuickSearch = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate(`/search?location=${encodeURIComponent(searchQuery)}`)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-primary-600 via-primary-700 to-primary-800 text-white overflow-hidden">
        {/* Background Pattern */}
        <div 
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Ccircle cx='30' cy='30' r='4'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
          }}
        ></div>
        
        <div className="relative max-w-7xl mx-auto container-padding section-padding">
          <div className="text-center">
            <h1 className="text-5xl md:text-7xl font-bold mb-8 animate-fade-in font-display">
              Find Your 
              <span className="block bg-gradient-to-r from-blue-200 to-cyan-200 bg-clip-text text-transparent">
                Perfect Stay
              </span>
            </h1>
            <p className="text-xl md:text-2xl mb-12 text-primary-100 max-w-2xl mx-auto animate-slide-up">
              Discover amazing places to stay around the world with the most trusted travel platform
            </p>
            
            {/* Enhanced Quick Search */}
            <div className="max-w-lg mx-auto animate-scale-in">
              <form onSubmit={handleQuickSearch} className="relative">
                <div className="flex bg-white/95 backdrop-blur-sm rounded-2xl shadow-strong p-2 hover:shadow-glow transition-all duration-300">
                  <input
                    type="text"
                    placeholder="Where are you going?"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="flex-1 px-6 py-4 text-gray-900 bg-transparent rounded-l-xl focus:outline-none placeholder-gray-500 text-lg"
                  />
                  <button 
                    type="submit"
                    className="px-8 py-4 bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-xl hover:from-primary-700 hover:to-primary-800 transition-all duration-300 font-semibold text-lg hover:scale-105 hover:shadow-lg"
                  >
                    Search
                  </button>
                </div>
              </form>
            </div>

            {/* Quick Stats */}
            <div className="mt-16 grid grid-cols-3 gap-8 max-w-md mx-auto">
              <div className="text-center animate-slide-up" style={{animationDelay: '0.2s'}}>
                <div className="text-3xl font-bold">10K+</div>
                <div className="text-sm text-primary-200">Properties</div>
              </div>
              <div className="text-center animate-slide-up" style={{animationDelay: '0.4s'}}>
                <div className="text-3xl font-bold">50K+</div>
                <div className="text-sm text-primary-200">Happy Guests</div>
              </div>
              <div className="text-center animate-slide-up" style={{animationDelay: '0.6s'}}>
                <div className="text-3xl font-bold">200+</div>
                <div className="text-sm text-primary-200">Cities</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Advanced Search Section */}
      <div className="section-padding bg-white relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-50/50 to-cyan-50/50"></div>
        <div className="relative max-w-7xl mx-auto container-padding">
          <div className="text-center mb-16 animate-fade-in">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 font-display">
              Find Your <span className="gradient-text">Perfect Match</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Use our advanced search to find exactly what you're looking for
            </p>
          </div>
          <div className="animate-slide-up">
            <SearchFilter />
          </div>
        </div>
      </div>

      {/* Featured Listings */}
      <div className="section-padding bg-gradient-to-br from-gray-50 to-white">
        <div className="max-w-7xl mx-auto container-padding">
          <div className="flex items-center justify-between mb-16 animate-fade-in">
            <div>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 font-display">
                Featured <span className="gradient-text">Stays</span>
              </h2>
              <p className="text-xl text-gray-600 mt-4">Handpicked properties just for you</p>
            </div>
            <button 
              onClick={() => navigate('/search')}
              className="group flex items-center text-primary-600 hover:text-primary-700 font-semibold text-lg hover-lift"
            >
              <span>View all</span>
              <svg className="w-5 h-5 ml-2 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </button>
          </div>
          
          {loading ? (
            <div className="flex justify-center py-20">
              <LoadingSpinner size="xl" showText text="Finding amazing properties..." />
            </div>
          ) : featuredListings.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 animate-fade-in">
              {featuredListings.map((listing, index) => (
                <div key={listing._id} className="animate-slide-up" style={{animationDelay: `${index * 0.1}s`}}>
                  <PropertyCard listing={listing} />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 animate-fade-in">
              <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-primary-100 to-primary-200 rounded-2xl flex items-center justify-center">
                <svg className="w-12 h-12 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-4m-5 0H9m0 0H5m0 0h2M7 7h10M7 11h6m-6 4h6" />
                </svg>
              </div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-2">No listings available</h3>
              <p className="text-lg text-gray-500">Get started by adding some properties.</p>
            </div>
          )}
        </div>
      </div>

      {/* Features Section */}
      <div className="section-padding bg-white relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary-50/30 to-blue-50/30"></div>
        <div className="relative max-w-7xl mx-auto container-padding">
          <div className="text-center mb-20 animate-fade-in">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 font-display mb-6">
              Why Choose <span className="gradient-text">StayFinder?</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Experience the best in travel accommodation with our premium features
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              {
                icon: (
                  <svg className="w-10 h-10 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                  </svg>
                ),
                title: "Best Prices",
                description: "Find the best deals and lowest prices guaranteed with our price matching policy"
              },
              {
                icon: (
                  <svg className="w-10 h-10 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                ),
                title: "Verified Hosts",
                description: "All our hosts are verified for your safety and peace of mind with background checks"
              },
              {
                icon: (
                  <svg className="w-10 h-10 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                ),
                title: "24/7 Support",
                description: "Round-the-clock customer support whenever you need it, available in multiple languages"
              }
            ].map((feature, index) => (
              <div key={index} className="text-center group animate-slide-up hover-lift" style={{animationDelay: `${index * 0.2}s`}}>
                <div className="w-20 h-20 bg-gradient-to-br from-primary-100 to-primary-200 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:shadow-glow transition-all duration-300 group-hover:scale-110">
                  {feature.icon}
                </div>
                <h3 className="text-2xl font-bold mb-4 group-hover:text-primary-600 transition-colors">{feature.title}</h3>
                <p className="text-gray-600 text-lg leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Popular Destinations */}
      <div className="section-padding bg-gradient-to-br from-gray-50 via-white to-primary-50/30">
        <div className="max-w-7xl mx-auto container-padding">
          <div className="text-center mb-20 animate-fade-in">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 font-display mb-6">
              Popular <span className="gradient-text">Destinations</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Explore the most loved destinations by travelers worldwide
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { name: 'New York', image: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=400&h=300&fit=crop&crop=center', properties: '150+ properties' },
              { name: 'Paris', image: 'https://images.unsplash.com/photo-1549638441-b787d2e11f14?w=400&h=300&fit=crop&crop=center', properties: '200+ properties' },
              { name: 'Tokyo', image: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=400&h=300&fit=crop&crop=center', properties: '120+ properties' },
              { name: 'London', image: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=400&h=300&fit=crop&crop=center', properties: '180+ properties' }
            ].map((destination, index) => (
              <button
                key={index}
                onClick={() => navigate(`/search?location=${encodeURIComponent(destination.name)}`)}
                className="group relative overflow-hidden rounded-2xl shadow-medium hover:shadow-strong transition-all duration-500 hover-lift animate-slide-up"
                style={{animationDelay: `${index * 0.1}s`}}
              >
                <div className="relative w-full h-64 overflow-hidden">
                  <img
                    src={destination.image}
                    alt={destination.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
                <div className="absolute inset-0 bg-gradient-to-t from-primary-900/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                  <h3 className="text-2xl font-bold mb-2 group-hover:scale-105 transition-transform">{destination.name}</h3>
                  <p className="text-sm opacity-90 group-hover:opacity-100 transition-opacity">{destination.properties}</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="section-padding bg-gradient-to-r from-primary-600 via-primary-700 to-primary-800 text-white relative overflow-hidden">
        <div 
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Ccircle cx='30' cy='30' r='4'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
          }}
        ></div>
        <div className="relative max-w-4xl mx-auto container-padding text-center animate-fade-in">
          <h2 className="text-4xl md:text-6xl font-bold mb-8 font-display">
            Ready to Start Your 
            <span className="block bg-gradient-to-r from-blue-200 to-cyan-200 bg-clip-text text-transparent">
              Journey?
            </span>
          </h2>
          <p className="text-xl md:text-2xl mb-12 text-primary-100 max-w-2xl mx-auto">
            Join thousands of travelers who have found their perfect stay with StayFinder
          </p>
          <button 
            onClick={() => navigate('/search')}
            className="inline-flex items-center px-12 py-6 bg-white text-primary-700 rounded-2xl hover:bg-gray-50 transition-all duration-300 font-bold text-xl hover-lift hover:shadow-glow group"
          >
            <span>Explore Properties</span>
            <svg className="w-6 h-6 ml-3 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  )
}

export default Home 