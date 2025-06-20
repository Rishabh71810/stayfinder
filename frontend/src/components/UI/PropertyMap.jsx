import React, { useEffect, useRef, useState } from 'react'
import { MapPin, Navigation, ExternalLink } from 'lucide-react'

const PropertyMap = ({ listing, showControls = true, height = '400px' }) => {
  const mapRef = useRef(null)
  const [map, setMap] = useState(null)
  const [marker, setMarker] = useState(null)
  const [infoWindow, setInfoWindow] = useState(null)
  const [isLoaded, setIsLoaded] = useState(false)
  const [error, setError] = useState(null)

  // Default coordinates (fallback)
  const getCoordinates = () => {
    if (listing?.location?.coordinates) {
      return {
        lat: listing.location.coordinates.coordinates[1],
        lng: listing.location.coordinates.coordinates[0]
      }
    }
    
    // Fallback coordinates based on city
    const cityCoordinates = {
      'New York': { lat: 40.7128, lng: -74.0060 },
      'Los Angeles': { lat: 34.0522, lng: -118.2437 },
      'Miami': { lat: 25.7617, lng: -80.1918 },
      'Paris': { lat: 48.8566, lng: 2.3522 },
      'London': { lat: 51.5074, lng: -0.1278 },
      'Tokyo': { lat: 35.6762, lng: 139.6503 },
      'Barcelona': { lat: 41.3851, lng: 2.1734 },
      'Aspen': { lat: 39.1911, lng: -106.8175 },
      'Lake Tahoe': { lat: 39.0968, lng: -120.0324 }
    }
    
    const city = listing?.location?.city || 'New York'
    return cityCoordinates[city] || cityCoordinates['New York']
  }

  const loadGoogleMaps = () => {
    return new Promise((resolve, reject) => {
      if (window.google && window.google.maps) {
        resolve(window.google.maps)
        return
      }

      const script = document.createElement('script')
      const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY
      
      if (!apiKey) {
        reject(new Error('Google Maps API key not found. Please add VITE_GOOGLE_MAPS_API_KEY to your environment variables.'))
        return
      }

      script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`
      script.async = true
      script.defer = true
      
      script.onload = () => {
        if (window.google && window.google.maps) {
          resolve(window.google.maps)
        } else {
          reject(new Error('Google Maps failed to load'))
        }
      }
      
      script.onerror = () => {
        reject(new Error('Failed to load Google Maps script'))
      }
      
      document.head.appendChild(script)
    })
  }

  useEffect(() => {
    if (!listing) return

    loadGoogleMaps()
      .then((googleMaps) => {
        initializeMap(googleMaps)
        setIsLoaded(true)
      })
      .catch((err) => {
        console.error('Error loading Google Maps:', err)
        setError(err.message)
      })

    return () => {
      if (marker) {
        marker.setMap(null)
      }
      if (infoWindow) {
        infoWindow.close()
      }
    }
  }, [listing])

  const initializeMap = (googleMaps) => {
    if (!mapRef.current) return

    const coordinates = getCoordinates()
    
    const mapOptions = {
      center: coordinates,
      zoom: 15,
      styles: [
        {
          "featureType": "poi",
          "elementType": "labels.text",
          "stylers": [{"visibility": "off"}]
        },
        {
          "featureType": "poi.business",
          "stylers": [{"visibility": "off"}]
        },
        {
          "featureType": "road",
          "elementType": "labels.icon",
          "stylers": [{"visibility": "off"}]
        }
      ],
      mapTypeControl: showControls,
      streetViewControl: showControls,
      fullscreenControl: showControls,
      zoomControl: showControls,
      gestureHandling: 'cooperative',
      mapTypeId: googleMaps.MapTypeId.ROADMAP
    }

    const newMap = new googleMaps.Map(mapRef.current, mapOptions)
    setMap(newMap)

    // Custom marker icon
    const markerIcon = {
      url: "data:image/svg+xml;charset=UTF-8," + encodeURIComponent(`
        <svg width="40" height="50" viewBox="0 0 40 50" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M20 0C8.954 0 0 8.954 0 20c0 11.046 20 30 20 30s20-18.954 20-30C40 8.954 31.046 0 20 0z" fill="#3B82F6"/>
          <circle cx="20" cy="20" r="8" fill="white"/>
          <path d="M20 14v12m-6-6h12" stroke="#3B82F6" stroke-width="2" stroke-linecap="round"/>
        </svg>
      `),
      scaledSize: new googleMaps.Size(40, 50),
      anchor: new googleMaps.Point(20, 50)
    }

    // Create marker
    const newMarker = new googleMaps.Marker({
      position: coordinates,
      map: newMap,
      icon: markerIcon,
      title: listing.title,
      animation: googleMaps.Animation.DROP
    })
    setMarker(newMarker)

    // Create info window
    const infoContent = `
      <div style="max-width: 250px; padding: 8px;">
        <img src="${listing.images?.[0]?.url || ''}" 
             style="width: 100%; height: 120px; object-fit: cover; border-radius: 8px; margin-bottom: 8px;" 
             alt="${listing.title}" />
        <h3 style="margin: 0 0 8px 0; font-size: 16px; font-weight: 600; color: #1f2937;">${listing.title}</h3>
        <p style="margin: 0 0 8px 0; font-size: 14px; color: #6b7280;">
          ${listing.location?.address || ''}<br/>
          ${listing.location?.city}, ${listing.location?.state}
        </p>
        <p style="margin: 0; font-size: 16px; font-weight: 600; color: #3b82f6;">
          $${listing.pricing?.basePrice || 0}/night
        </p>
      </div>
    `

    const newInfoWindow = new googleMaps.InfoWindow({
      content: infoContent
    })
    setInfoWindow(newInfoWindow)

    // Show info window on marker click
    newMarker.addListener('click', () => {
      newInfoWindow.open(newMap, newMarker)
    })

    // Auto-open info window for single property view
    if (showControls) {
      setTimeout(() => {
        newInfoWindow.open(newMap, newMarker)
      }, 500)
    }
  }

  const openInGoogleMaps = () => {
    const coordinates = getCoordinates()
    const url = `https://www.google.com/maps/search/?api=1&query=${coordinates.lat},${coordinates.lng}`
    window.open(url, '_blank')
  }

  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by this browser.')
      return
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const userLocation = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        }
        
        if (map) {
          map.panTo(userLocation)
          
          // Add user location marker
          const userMarker = new window.google.maps.Marker({
            position: userLocation,
            map: map,
            icon: {
              url: "data:image/svg+xml;charset=UTF-8," + encodeURIComponent(`
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="10" cy="10" r="8" fill="#10B981" stroke="white" stroke-width="3"/>
                </svg>
              `),
              scaledSize: new window.google.maps.Size(20, 20),
              anchor: new window.google.maps.Point(10, 10)
            },
            title: 'Your Location'
          })
        }
      },
      (error) => {
        console.error('Error getting location:', error)
        alert('Unable to get your location. Please check your browser settings.')
      }
    )
  }

  if (error) {
    return (
      <div 
        className="bg-gray-100 rounded-lg flex items-center justify-center"
        style={{ height }}
      >
        <div className="text-center p-6">
          <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Map Unavailable</h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={openInGoogleMaps}
            className="inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
          >
            <ExternalLink className="w-4 h-4 mr-2" />
            Open in Google Maps
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="relative rounded-lg overflow-hidden shadow-lg">
      <div
        ref={mapRef}
        style={{ height }}
        className="w-full bg-gray-100"
      />
      
      {!isLoaded && (
        <div className="absolute inset-0 bg-gray-100 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading map...</p>
          </div>
        </div>
      )}

      {showControls && isLoaded && (
        <div className="absolute top-4 right-4 flex flex-col gap-2">
          <button
            onClick={getCurrentLocation}
            className="bg-white p-2 rounded-lg shadow-md hover:shadow-lg transition-shadow"
            title="Get Current Location"
          >
            <Navigation className="w-5 h-5 text-gray-700" />
          </button>
          <button
            onClick={openInGoogleMaps}
            className="bg-white p-2 rounded-lg shadow-md hover:shadow-lg transition-shadow"
            title="Open in Google Maps"
          >
            <ExternalLink className="w-5 h-5 text-gray-700" />
          </button>
        </div>
      )}

      {listing?.location && (
        <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm p-3 rounded-lg shadow-md">
          <div className="flex items-start gap-2">
            <MapPin className="w-4 h-4 text-primary-600 mt-0.5 flex-shrink-0" />
            <div className="text-sm">
              <div className="font-semibold text-gray-900">
                {listing.location.city}, {listing.location.state}
              </div>
              {listing.location.address && (
                <div className="text-gray-600 text-xs">
                  {listing.location.address}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default PropertyMap 