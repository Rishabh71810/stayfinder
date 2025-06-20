import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { Heart, MapPin, Star, Users, Bed, Bath } from 'lucide-react'

const PropertyCard = ({ listing }) => {
  const [isLiked, setIsLiked] = useState(false)
  const {
    _id,
    title,
    description,
    images,
    location,
    pricing,
    rating,
    capacity,
    propertyType,
    amenities
  } = listing

  console.log('🏠 PropertyCard data:', { _id, title, images, pricing })

  const averageRating = rating?.average || 0
  const totalReviews = rating?.count || 0
  const price = pricing?.basePrice || 0

  // Enhanced image debugging
  console.log('🖼️ Image debugging for', title, ':', {
    hasImages: !!images,
    imagesLength: images?.length,
    firstImageUrl: images?.[0]?.url,
    firstImageObject: images?.[0]
  })

  const handleLikeClick = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setIsLiked(!isLiked)
  }

  const handleImageError = (e) => {
    console.error(`❌ Image failed to load for ${title}:`, {
      src: e.target.src,
      listing: _id,
      originalImages: images
    })
    e.target.style.display = 'none'
  }

  const handleImageLoad = (e) => {
    console.log(`✅ Image loaded successfully for ${title}:`, e.target.src)
  }

  return (
    <Link to={`/listing/${_id}`} className="block group">
      <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-soft overflow-hidden hover:shadow-strong transition-all duration-500 hover:-translate-y-2 border border-gray-100/50 hover:border-primary-200/50">
        {/* Image Container */}
        <div className="relative h-64 bg-gradient-to-br from-gray-200 to-gray-300 overflow-hidden">
          {images && images.length > 0 ? (
            <>
              <img
                src={images[0]?.url || images[0]}
                alt={title}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                onError={handleImageError}
                onLoad={handleImageLoad}
              />
              {/* Image Overlay Gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </>
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-gray-300 to-gray-400 flex items-center justify-center">
              <svg className="w-16 h-16 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          )}
          
          {/* Wishlist Button */}
          <button 
            onClick={handleLikeClick}
            className="absolute top-4 right-4 p-3 bg-white/90 backdrop-blur-sm rounded-full shadow-medium hover:bg-white hover:scale-110 transition-all duration-300 group-hover:shadow-lg z-10"
          >
            <Heart 
              className={`w-5 h-5 transition-all duration-300 ${
                isLiked 
                  ? 'text-red-500 fill-current' 
                  : 'text-gray-600 hover:text-red-500'
              }`} 
            />
          </button>

          {/* Property Type Badge */}
          <div className="absolute top-4 left-4 px-3 py-1.5 bg-primary-600/90 backdrop-blur-sm text-white text-sm font-semibold rounded-full capitalize">
            {propertyType}
          </div>

          {/* Rating Badge */}
          {averageRating > 0 && (
            <div className="absolute bottom-4 left-4 flex items-center bg-white/95 backdrop-blur-sm rounded-full px-3 py-1.5 shadow-medium">
              <Star className="w-4 h-4 text-yellow-400 fill-current mr-1" />
              <span className="text-sm font-semibold text-gray-900">
                {averageRating.toFixed(1)}
              </span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Location */}
          <div className="flex items-center text-sm text-gray-500 mb-3">
            <MapPin className="w-4 h-4 mr-2 text-primary-500" />
            <span className="font-medium">
              {location?.city}
              {location?.state && `, ${location?.state}`}
              {location?.country && location?.country !== 'United States' && `, ${location?.country}`}
            </span>
          </div>

          {/* Title */}
          <h3 className="font-bold text-xl text-gray-900 mb-3 group-hover:text-primary-600 transition-colors line-clamp-2 leading-tight">
            {title}
          </h3>

          {/* Capacity Info */}
          <div className="flex items-center space-x-4 text-sm text-gray-600 mb-4">
            <div className="flex items-center">
              <Users className="w-4 h-4 mr-1" />
              <span>{capacity?.guests || 0}</span>
            </div>
            <div className="flex items-center">
              <Bed className="w-4 h-4 mr-1" />
              <span>{capacity?.bedrooms || 0}</span>
            </div>
            <div className="flex items-center">
              <Bath className="w-4 h-4 mr-1" />
              <span>{capacity?.bathrooms || 0}</span>
            </div>
          </div>

          {/* Amenities Preview */}
          {amenities && amenities.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {amenities.slice(0, 2).map((amenity, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-primary-50 text-primary-700 text-xs font-medium rounded-full border border-primary-100"
                >
                  {amenity}
                </span>
              ))}
              {amenities.length > 2 && (
                <span className="px-3 py-1 bg-gray-100 text-gray-600 text-xs font-medium rounded-full">
                  +{amenities.length - 2} more
                </span>
              )}
            </div>
          )}

          {/* Rating and Price */}
          <div className="flex items-center justify-between pt-4 border-t border-gray-100">
            <div className="flex items-center space-x-1">
              {averageRating > 0 ? (
                <>
                  <Star className="w-4 h-4 text-yellow-400 fill-current" />
                  <span className="text-sm font-semibold text-gray-900">
                    {averageRating.toFixed(1)}
                  </span>
                  <span className="text-sm text-gray-500">
                    ({totalReviews})
                  </span>
                </>
              ) : (
                <span className="text-sm text-gray-400">No reviews yet</span>
              )}
            </div>
            
            <div className="text-right">
              <div className="flex items-baseline">
                <span className="text-2xl font-bold text-gray-900">${price}</span>
                <span className="text-sm text-gray-500 ml-1">/night</span>
              </div>
            </div>
          </div>
        </div>

        {/* Hover Effect Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-primary-600/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-3xl pointer-events-none"></div>
      </div>
    </Link>
  )
}

export default PropertyCard 