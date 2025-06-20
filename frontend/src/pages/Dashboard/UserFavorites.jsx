import React, { useState, useEffect } from 'react'
import { Heart, MapPin, Star, Users, Bed, Bath } from 'lucide-react'
import LoadingSpinner from '../../components/UI/LoadingSpinner'
import PropertyCard from '../../components/UI/PropertyCard'

const UserFavorites = () => {
  const [favorites, setFavorites] = useState([])
  const [loading, setLoading] = useState(true)

  const sampleFavorites = [
    {
      _id: '1',
      title: 'Modern Downtown Apartment with City Views',
      description: 'Beautiful modern apartment in the heart of downtown with stunning city views.',
      images: [{ url: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800', isMain: true }],
      location: { address: '123 Main Street', city: 'New York', state: 'NY', country: 'United States' },
      capacity: { guests: 4, bedrooms: 2, bathrooms: 2 },
      pricing: { basePrice: 150 },
      propertyType: 'apartment',
      rating: { average: 4.8, count: 124 },
      host: { name: 'John Doe', avatar: null }
    },
    {
      _id: '2',
      title: 'Cozy Beachfront Villa with Ocean Views',
      description: 'Escape to this stunning beachfront villa with panoramic ocean views.',
      images: [{ url: 'https://images.unsplash.com/photo-1505142468610-359e7d316be0?w=800', isMain: true }],
      location: { address: '456 Ocean Drive', city: 'Miami', state: 'FL', country: 'United States' },
      capacity: { guests: 8, bedrooms: 4, bathrooms: 3 },
      pricing: { basePrice: 350 },
      propertyType: 'villa',
      rating: { average: 4.9, count: 89 },
      host: { name: 'Jane Smith', avatar: null }
    },
    {
      _id: '3',
      title: 'Charming Mountain Cabin Retreat',
      description: 'Nestled in the mountains, this charming cabin offers the perfect retreat from city life.',
      images: [{ url: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=800', isMain: true }],
      location: { address: '789 Mountain Trail', city: 'Aspen', state: 'CO', country: 'United States' },
      capacity: { guests: 6, bedrooms: 3, bathrooms: 2 },
      pricing: { basePrice: 200 },
      propertyType: 'cabin',
      rating: { average: 4.7, count: 67 },
      host: { name: 'Bob Wilson', avatar: null }
    },
    {
      _id: '4',
      title: 'Luxury City Penthouse',
      description: 'Experience luxury living in this stunning penthouse with panoramic city views.',
      images: [{ url: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800', isMain: true }],
      location: { address: '321 Sky Tower', city: 'Los Angeles', state: 'CA', country: 'United States' },
      capacity: { guests: 6, bedrooms: 3, bathrooms: 3 },
      pricing: { basePrice: 500 },
      propertyType: 'apartment',
      rating: { average: 4.9, count: 156 },
      host: { name: 'Sarah Johnson', avatar: null }
    },
    {
      _id: '5',
      title: 'Historic Brownstone in Brooklyn',
      description: 'Stay in this beautifully restored historic brownstone in trendy Brooklyn.',
      images: [{ url: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=800', isMain: true }],
      location: { address: '654 Brooklyn Ave', city: 'Brooklyn', state: 'NY', country: 'United States' },
      capacity: { guests: 5, bedrooms: 3, bathrooms: 2 },
      pricing: { basePrice: 180 },
      propertyType: 'house',
      rating: { average: 4.6, count: 92 },
      host: { name: 'Michael Brown', avatar: null }
    }
  ]

  useEffect(() => {
    const fetchFavorites = async () => {
      setLoading(true)
      await new Promise(resolve => setTimeout(resolve, 1000))
      setFavorites(sampleFavorites)
      setLoading(false)
    }
    fetchFavorites()
  }, [])

  const removeFavorite = (propertyId) => {
    setFavorites(favorites.filter(fav => fav._id !== propertyId))
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">My Favorites</h1>
        <p className="text-gray-600">{favorites.length} saved {favorites.length === 1 ? 'property' : 'properties'}</p>
      </div>

      {favorites.length === 0 ? (
        <div className="text-center py-12">
          <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No favorites yet</h3>
          <p className="text-gray-600 mb-4">Start exploring and save properties you love!</p>
          <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">
            Explore Properties
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {favorites.map(property => (
            <div key={property._id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
              <div className="relative">
                <img
                  src={property.images[0]?.url}
                  alt={property.title}
                  className="w-full h-48 object-cover"
                />
                <button
                  onClick={() => removeFavorite(property._id)}
                  className="absolute top-3 right-3 p-2 bg-white rounded-full shadow-md hover:bg-gray-50 transition-colors"
                >
                  <Heart className="w-5 h-5 text-red-500 fill-current" />
                </button>
              </div>
              
              <div className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-500 capitalize">{property.propertyType}</span>
                  <div className="flex items-center">
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    <span className="text-sm text-gray-600 ml-1">
                      {property.rating.average} ({property.rating.count})
                    </span>
                  </div>
                </div>
                
                <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                  {property.title}
                </h3>
                
                <div className="flex items-center text-gray-600 mb-3">
                  <MapPin className="w-4 h-4 mr-1" />
                  <span className="text-sm">{property.location.city}, {property.location.state}</span>
                </div>
                
                <div className="flex items-center text-gray-600 text-sm mb-3 space-x-4">
                  <div className="flex items-center">
                    <Users className="w-4 h-4 mr-1" />
                    <span>{property.capacity.guests} guests</span>
                  </div>
                  <div className="flex items-center">
                    <Bed className="w-4 h-4 mr-1" />
                    <span>{property.capacity.bedrooms} bed{property.capacity.bedrooms > 1 ? 's' : ''}</span>
                  </div>
                  <div className="flex items-center">
                    <Bath className="w-4 h-4 mr-1" />
                    <span>{property.capacity.bathrooms} bath{property.capacity.bathrooms > 1 ? 's' : ''}</span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-xl font-bold text-gray-900">${property.pricing.basePrice}</span>
                    <span className="text-gray-600"> / night</span>
                  </div>
                  <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm">
                    View Details
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default UserFavorites 