import React, { useEffect, useRef, useState } from 'react'
import { MapPin, Navigation, ToggleLeft, ToggleRight, ExternalLink } from 'lucide-react'

const PropertyListMap = ({ listings = [], onMarkerClick, height = '500px' }) => {
  const mapRef = useRef(null)
  const [map, setMap] = useState(null)
  const [markers, setMarkers] = useState([])
  const [isLoaded, setIsLoaded] = useState(false)
  const [error, setError] = useState(null)
  const [activeInfoWindow, setActiveInfoWindow] = useState(null)
  const [showSatellite, setShowSatellite] = useState(false)

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

      script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places,geometry`
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

  const getCoordinates = (listing) => {
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
    const baseCoords = cityCoordinates[city] || cityCoordinates['New York']
    
    // Add small random offset for properties in same city
    const randomOffset = () => (Math.random() - 0.5) * 0.01
    return {
      lat: baseCoords.lat + randomOffset(),
      lng: baseCoords.lng + randomOffset()
    }
  }

  const calculateMapBounds = (coordinates) => {
    if (!window.google || coordinates.length === 0) return null
    
    const bounds = new window.google.maps.LatLngBounds()
    coordinates.forEach(coord => bounds.extend(coord))
    return bounds
  }

  const createCustomMarker = (googleMaps, listing, coordinates) => {
    const price = listing.pricing?.basePrice || 0
    const markerIcon = {
      url: "data:image/svg+xml;charset=UTF-8," + encodeURIComponent(`
        <svg width="80" height="40" viewBox="0 0 80 40" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="2" y="2" width="76" height="36" rx="18" fill="white" stroke="#E5E7EB" stroke-width="2"/>
          <rect x="4" y="4" width="72" height="32" rx="16" fill="#3B82F6"/>
          <text x="40" y="26" text-anchor="middle" fill="white" font-family="Arial, sans-serif" font-size="14" font-weight="600">$${price}</text>
        </svg>
      `),
      scaledSize: new googleMaps.Size(80, 40),
      anchor: new googleMaps.Point(40, 40)
    }

    const marker = new googleMaps.Marker({
      position: coordinates,
      map: map,
      icon: markerIcon,
      title: listing.title,
      animation: googleMaps.Animation.DROP
    })

    // Create info window content
    const infoContent = `
      <div style="max-width: 280px; padding: 12px;">
        <img src="${listing.images?.[0]?.url || ''}" 
             style="width: 100%; height: 150px; object-fit: cover; border-radius: 8px; margin-bottom: 12px;" 
             alt="${listing.title}" />
        <h3 style="margin: 0 0 8px 0; font-size: 18px; font-weight: 600; color: #1f2937; line-height: 1.3;">${listing.title}</h3>
        <div style="display: flex; align-items: center; margin-bottom: 8px;">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#6b7280" stroke-width="2" style="margin-right: 8px;">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
            <circle cx="12" cy="10" r="3"></circle>
          </svg>
          <p style="margin: 0; font-size: 14px; color: #6b7280;">
            ${listing.location?.city}, ${listing.location?.state}
          </p>
        </div>
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
          <div style="display: flex; align-items: center;">
            ${listing.rating?.average ? `
              <svg width="16" height="16" viewBox="0 0 24 24" fill="#FCD34D" stroke="#FCD34D" stroke-width="2" style="margin-right: 4px;">
                <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"></polygon>
              </svg>
              <span style="font-size: 14px; font-weight: 600; color: #1f2937;">${listing.rating.average.toFixed(1)}</span>
            ` : ''}
          </div>
          <div style="display: flex; align-items: center;">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#6b7280" stroke-width="2" style="margin-right: 4px;">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
              <circle cx="12" cy="7" r="4"></circle>
            </svg>
            <span style="font-size: 14px; color: #6b7280;">${listing.capacity?.guests || 1} guests</span>
          </div>
        </div>
        <div style="display: flex; justify-content: space-between; align-items: center;">
          <div>
            <span style="font-size: 20px; font-weight: 700; color: #3b82f6;">$${price}</span>
            <span style="font-size: 14px; color: #6b7280;">/night</span>
          </div>
          <button onclick="window.viewPropertyDetails('${listing._id}')" 
                  style="background: #3b82f6; color: white; border: none; padding: 8px 16px; border-radius: 6px; font-weight: 600; cursor: pointer; font-size: 14px;">
            View Details
          </button>
        </div>
      </div>
    `

    const infoWindow = new googleMaps.InfoWindow({
      content: infoContent
    })

    marker.addListener('click', () => {
      // Close any active info window
      if (activeInfoWindow) {
        activeInfoWindow.close()
      }
      
      // Open new info window
      infoWindow.open(map, marker)
      setActiveInfoWindow(infoWindow)
      
      // Call external click handler if provided
      if (onMarkerClick) {
        onMarkerClick(listing)
      }
    })

    return { marker, infoWindow }
  }

  useEffect(() => {
    if (listings.length === 0) return

    loadGoogleMaps()
      .then((googleMaps) => {
        initializeMap(googleMaps)
        setIsLoaded(true)
      })
      .catch((err) => {
        console.error('Error loading Google Maps:', err)
        setError(err.message)
      })

    // Global function for info window buttons
    window.viewPropertyDetails = (listingId) => {
      window.location.href = `/listing/${listingId}`
    }

    return () => {
      // Cleanup markers
      markers.forEach(({ marker }) => {
        marker.setMap(null)
      })
      if (activeInfoWindow) {
        activeInfoWindow.close()
      }
      // Cleanup global function
      delete window.viewPropertyDetails
    }
  }, [listings])

  const initializeMap = (googleMaps) => {
    if (!mapRef.current) return

    // Get coordinates for all listings
    const coordinates = listings.map(listing => getCoordinates(listing))
    const bounds = calculateMapBounds(coordinates)

    const mapOptions = {
      center: coordinates[0] || { lat: 40.7128, lng: -74.0060 },
      zoom: 10,
      styles: [
        {
          "featureType": "poi",
          "elementType": "labels.text",
          "stylers": [{"visibility": "off"}]
        },
        {
          "featureType": "poi.business",
          "stylers": [{"visibility": "off"}]
        }
      ],
      mapTypeControl: true,
      streetViewControl: true,
      fullscreenControl: true,
      zoomControl: true,
      gestureHandling: 'cooperative',
      mapTypeId: showSatellite ? googleMaps.MapTypeId.SATELLITE : googleMaps.MapTypeId.ROADMAP
    }

    const newMap = new googleMaps.Map(mapRef.current, mapOptions)
    setMap(newMap)

    // Create markers for all listings
    const newMarkers = listings.map((listing, index) => {
      const coordinates = getCoordinates(listing)
      return createCustomMarker(googleMaps, listing, coordinates)
    })
    setMarkers(newMarkers)

    // Fit map to show all markers
    if (bounds && listings.length > 1) {
      newMap.fitBounds(bounds)
      // Ensure minimum zoom level
      const listener = googleMaps.event.addListener(newMap, 'idle', () => {
        if (newMap.getZoom() > 15) newMap.setZoom(15)
        googleMaps.event.removeListener(listener)
      })
    }
  }

  const toggleMapType = () => {
    if (map) {
      const newType = showSatellite ? window.google.maps.MapTypeId.ROADMAP : window.google.maps.MapTypeId.SATELLITE
      map.setMapTypeId(newType)
      setShowSatellite(!showSatellite)
    }
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
          map.setZoom(12)
          
          // Add user location marker
          const userMarker = new window.google.maps.Marker({
            position: userLocation,
            map: map,
            icon: {
              url: "data:image/svg+xml;charset=UTF-8," + encodeURIComponent(`
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="12" cy="12" r="8" fill="#10B981" stroke="white" stroke-width="4"/>
                  <circle cx="12" cy="12" r="3" fill="white"/>
                </svg>
              `),
              scaledSize: new window.google.maps.Size(24, 24),
              anchor: new window.google.maps.Point(12, 12)
            },
            title: 'Your Location',
            zIndex: 1000
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
          <p className="text-sm text-gray-500">Properties will still be displayed in the list view.</p>
        </div>
      </div>
    )
  }

  if (listings.length === 0) {
    return (
      <div 
        className="bg-gray-100 rounded-lg flex items-center justify-center"
        style={{ height }}
      >
        <div className="text-center p-6">
          <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No Properties to Display</h3>
          <p className="text-gray-600">Add some search results to see them on the map.</p>
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
            <p className="text-gray-600">Loading map with {listings.length} properties...</p>
          </div>
        </div>
      )}

      {isLoaded && (
        <div className="absolute top-4 right-4 flex flex-col gap-2">
          <button
            onClick={toggleMapType}
            className="bg-white p-2 rounded-lg shadow-md hover:shadow-lg transition-shadow flex items-center gap-2"
            title={showSatellite ? 'Switch to Road View' : 'Switch to Satellite View'}
          >
            {showSatellite ? (
              <ToggleRight className="w-5 h-5 text-primary-600" />
            ) : (
              <ToggleLeft className="w-5 h-5 text-gray-600" />
            )}
          </button>
          <button
            onClick={getCurrentLocation}
            className="bg-white p-2 rounded-lg shadow-md hover:shadow-lg transition-shadow"
            title="Get Current Location"
          >
            <Navigation className="w-5 h-5 text-gray-700" />
          </button>
        </div>
      )}

      <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm p-3 rounded-lg shadow-md">
        <div className="flex items-center gap-2">
          <MapPin className="w-4 h-4 text-primary-600" />
          <span className="text-sm font-semibold text-gray-900">
            {listings.length} {listings.length === 1 ? 'property' : 'properties'} shown
          </span>
        </div>
      </div>
    </div>
  )
}

export default PropertyListMap 