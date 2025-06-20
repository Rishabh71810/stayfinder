import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useUser } from '@clerk/clerk-react'
import BookingCalendar from '../components/Booking/BookingCalendar'
import LoadingSpinner from '../components/UI/LoadingSpinner'
import PropertyMap from '../components/UI/PropertyMap'
import { listingsAPI, bookingsAPI } from '../services/api'

const ListingDetails = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user, isSignedIn } = useUser()
  
  const [listing, setListing] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)
  const [showAllPhotos, setShowAllPhotos] = useState(false)
  const [selectedCheckIn, setSelectedCheckIn] = useState(null)
  const [selectedCheckOut, setSelectedCheckOut] = useState(null)
  const [guests, setGuests] = useState(1)
  const [bookingLoading, setBookingLoading] = useState(false)
  const [showReviews, setShowReviews] = useState(false)

  useEffect(() => {
    if (id) {
      fetchListing()
    }
  }, [id])

  const fetchListing = async () => {
    try {
      setLoading(true)
      
      // Try to fetch from API, fall back to sample data
      try {
        const response = await listingsAPI.getListing(id)
        setListing(response.data)
      } catch (apiError) {
        // Fallback to sample data based on ID - comprehensive sample listings
        const sampleListings = {
          // New York listings
          '507f1f77bcf86cd799439001': {
            _id: '507f1f77bcf86cd799439001',
            title: 'Modern Downtown Manhattan Apartment',
            description: 'Stylish apartment in the heart of Manhattan with stunning city views, floor-to-ceiling windows, and contemporary design. Walking distance to subway, restaurants, and major attractions. Perfect for business travelers and tourists alike.',
            images: [
              { url: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&h=600&fit=crop&crop=center', caption: 'Living room', isMain: true },
              { url: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800&h=600&fit=crop&crop=center', caption: 'Kitchen' },
              { url: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=600&fit=crop&crop=center', caption: 'Bedroom' },
              { url: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&h=600&fit=crop&crop=center', caption: 'City View' }
            ],
            location: { 
              address: '123 Broadway', 
              city: 'New York', 
              state: 'NY', 
              country: 'United States',
              neighborhood: 'Financial District',
              zipCode: '10001'
            },
            capacity: { guests: 4, bedrooms: 2, beds: 2, bathrooms: 2 },
            pricing: { basePrice: 180, cleaningFee: 30, serviceFee: 20 },
            propertyType: 'apartment',
            amenities: ['WiFi', 'Kitchen', 'Air Conditioning', 'Elevator', 'Dishwasher', 'TV', 'City View', 'Washer/Dryer'],
            rating: { average: 4.8, count: 124 },
            host: { 
              firstName: 'Emma', 
              lastName: 'Thompson', 
              createdAt: '2020-01-15T00:00:00Z',
              bio: 'Experienced host with a passion for hospitality. I love meeting new people and sharing my local knowledge.'
            },
            reviews: [
              {
                rating: 5,
                comment: 'Amazing place! Perfect location and very clean. Emma was a fantastic host.',
                user: { firstName: 'Sarah' },
                createdAt: '2024-01-15T00:00:00Z'
              },
              {
                rating: 4,
                comment: 'Great apartment with stunning views. Highly recommend for NYC stay!',
                user: { firstName: 'Mike' },
                createdAt: '2024-01-10T00:00:00Z'
              }
            ]
          },
          '507f1f77bcf86cd799439002': {
            _id: '507f1f77bcf86cd799439002',
            title: 'Brooklyn Heights Historic Brownstone',
            description: 'Charming historic brownstone with stunning Brooklyn Bridge views, original hardwood floors, and spacious rooms. Perfect for families exploring NYC. Located in the heart of Brooklyn Heights with easy access to Manhattan.',
            images: [
              { url: 'https://images.unsplash.com/photo-1549517045-bc93de075e53?w=800&h=600&fit=crop&crop=center', caption: 'Brownstone exterior', isMain: true },
              { url: 'https://images.unsplash.com/photo-1581858726788-75bc0f6a952d?w=800&h=600&fit=crop&crop=center', caption: 'Living room' },
              { url: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&h=600&fit=crop&crop=center', caption: 'Kitchen' },
              { url: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=800&h=600&fit=crop&crop=center', caption: 'Bedroom' }
            ],
            location: { 
              address: '456 Remsen Street', 
              city: 'New York', 
              state: 'NY', 
              country: 'United States',
              neighborhood: 'Brooklyn Heights',
              zipCode: '11201'
            },
            capacity: { guests: 6, bedrooms: 3, beds: 4, bathrooms: 2 },
            pricing: { basePrice: 220, cleaningFee: 45, serviceFee: 25 },
            propertyType: 'house',
            amenities: ['WiFi', 'Kitchen', 'Heating', 'Garden', 'Fireplace', 'Washer/Dryer', 'Bridge View', 'Historic Character'],
            rating: { average: 4.9, count: 89 },
            host: { 
              firstName: 'David', 
              lastName: 'Miller', 
              createdAt: '2019-06-20T00:00:00Z',
              bio: 'Local Brooklyn resident who loves sharing the neighborhood with visitors.'
            },
            reviews: [
              {
                rating: 5,
                comment: 'Absolutely beautiful historic home with incredible views of the Brooklyn Bridge!',
                user: { firstName: 'Emma' },
                createdAt: '2024-02-01T00:00:00Z'
              }
            ]
          },
          '507f1f77bcf86cd799439003': {
            _id: '507f1f77bcf86cd799439003',
            title: 'Times Square Studio Loft',
            description: 'Modern studio in the heart of Times Square, perfect for city exploration. Steps away from Broadway shows, restaurants, and shopping. Ideal for solo travelers or couples wanting to be in the center of the action.',
            images: [
              { url: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=600&fit=crop&crop=center', caption: 'Studio loft', isMain: true },
              { url: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&h=600&fit=crop&crop=center', caption: 'Living space' },
              { url: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800&h=600&fit=crop&crop=center', caption: 'Kitchen area' }
            ],
            location: { 
              address: '789 Broadway', 
              city: 'New York', 
              state: 'NY', 
              country: 'United States',
              neighborhood: 'Times Square',
              zipCode: '10036'
            },
            capacity: { guests: 2, bedrooms: 1, beds: 1, bathrooms: 1 },
            pricing: { basePrice: 120, cleaningFee: 20, serviceFee: 15 },
            propertyType: 'studio',
            amenities: ['WiFi', 'Kitchen', 'Air Conditioning', 'TV', 'City View'],
            rating: { average: 4.6, count: 67 },
            host: { 
              firstName: 'Lisa', 
              lastName: 'Chen', 
              createdAt: '2021-03-10T00:00:00Z',
              bio: 'NYC native who loves helping visitors experience the best of the city.'
            },
            reviews: []
          },
          // Los Angeles listings
          '507f1f77bcf86cd799439004': {
            _id: '507f1f77bcf86cd799439004',
            title: 'Hollywood Hills Luxury Villa with Infinity Pool',
            description: 'Stunning modern villa in the Hollywood Hills featuring an infinity pool, panoramic city views, and designer furnishings. Perfect for celebrities and luxury seekers. The villa offers privacy and luxury with all modern amenities.',
            images: [
              { url: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&h=600&fit=crop&crop=center', caption: 'Villa exterior', isMain: true },
              { url: 'https://images.unsplash.com/photo-1602002418082-a4443e081dd1?w=800&h=600&fit=crop&crop=center', caption: 'Pool area' },
              { url: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&h=600&fit=crop&crop=center', caption: 'Living room' },
              { url: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800&h=600&fit=crop&crop=center', caption: 'Master bedroom' }
            ],
            location: { 
              address: '123 Mulholland Drive', 
              city: 'Los Angeles', 
              state: 'CA', 
              country: 'United States',
              neighborhood: 'Hollywood Hills',
              zipCode: '90046'
            },
            capacity: { guests: 8, bedrooms: 4, beds: 5, bathrooms: 3 },
            pricing: { basePrice: 450, cleaningFee: 85, serviceFee: 45 },
            propertyType: 'villa',
            amenities: ['WiFi', 'Pool', 'City View', 'Parking', 'Kitchen', 'Hot Tub', 'BBQ Grill', 'Security System', 'Gym'],
            rating: { average: 4.9, count: 156 },
            host: { 
              firstName: 'Sophia', 
              lastName: 'Martinez', 
              createdAt: '2018-08-15T00:00:00Z',
              bio: 'Luxury property specialist with years of experience in premium hospitality.'
            },
            reviews: [
              {
                rating: 5,
                comment: 'Absolutely incredible villa! The views and pool are spectacular. Perfect for our group vacation.',
                user: { firstName: 'James' },
                createdAt: '2024-01-20T00:00:00Z'
              }
            ]
          },
          '507f1f77bcf86cd799439005': {
            _id: '507f1f77bcf86cd799439005',
            title: 'Venice Beach Apartment',
            description: 'Trendy beachfront apartment just steps from the Venice Boardwalk. Perfect for those who want to experience the unique culture of Venice Beach with easy access to the beach, restaurants, and nightlife.',
            images: [
              { url: 'https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800&h=600&fit=crop&crop=center', caption: 'Beach apartment', isMain: true },
              { url: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800&h=600&fit=crop&crop=center', caption: 'Living room' },
              { url: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=600&fit=crop&crop=center', caption: 'Bedroom' }
            ],
            location: { 
              address: '456 Abbot Kinney Blvd', 
              city: 'Los Angeles', 
              state: 'CA', 
              country: 'United States',
              neighborhood: 'Venice Beach',
              zipCode: '90291'
            },
            capacity: { guests: 4, bedrooms: 2, beds: 2, bathrooms: 2 },
            pricing: { basePrice: 200, cleaningFee: 35, serviceFee: 20 },
            propertyType: 'apartment',
            amenities: ['WiFi', 'Kitchen', 'Air Conditioning', 'Beach Access', 'Balcony'],
            rating: { average: 4.7, count: 98 },
            host: { 
              firstName: 'Alex', 
              lastName: 'Johnson', 
              createdAt: '2020-05-15T00:00:00Z',
              bio: 'Venice Beach local who loves sharing the bohemian spirit of our neighborhood.'
            },
            reviews: []
          },
          '507f1f77bcf86cd799439006': {
            _id: '507f1f77bcf86cd799439006',
            title: 'Beverly Hills Luxury Condo',
            description: 'Upscale condominium in prestigious Beverly Hills with concierge service. Located in the heart of luxury shopping and dining, perfect for those seeking a high-end Los Angeles experience.',
            images: [
              { url: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&h=600&fit=crop&crop=center', caption: 'Luxury condo', isMain: true },
              { url: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&h=600&fit=crop&crop=center', caption: 'Living area' },
              { url: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&h=600&fit=crop&crop=center', caption: 'Master bedroom' }
            ],
            location: { 
              address: '321 N Beverly Dr', 
              city: 'Los Angeles', 
              state: 'CA', 
              country: 'United States',
              neighborhood: 'Beverly Hills',
              zipCode: '90210'
            },
            capacity: { guests: 6, bedrooms: 3, beds: 3, bathrooms: 3 },
            pricing: { basePrice: 350, cleaningFee: 60, serviceFee: 35 },
            propertyType: 'condo',
            amenities: ['WiFi', 'Kitchen', 'Air Conditioning', 'Concierge', 'Gym', 'Pool', 'Parking'],
            rating: { average: 4.8, count: 134 },
            host: { 
              firstName: 'Michael', 
              lastName: 'Roberts', 
              createdAt: '2019-03-20T00:00:00Z',
              bio: 'Beverly Hills resident specializing in luxury accommodations.'
            },
            reviews: []
          },
          // Miami listings
          '507f1f77bcf86cd799439007': {
            _id: '507f1f77bcf86cd799439007',
            title: 'South Beach Art Deco Apartment',
            description: 'Stylish apartment in iconic Art Deco building steps from South Beach. Experience the vibrant nightlife and beautiful beaches of Miami Beach in this perfectly located apartment.',
            images: [
              { url: 'https://images.unsplash.com/photo-1505142468610-359e7d316be0?w=800&h=600&fit=crop&crop=center', caption: 'Art Deco apartment', isMain: true },
              { url: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800&h=600&fit=crop&crop=center', caption: 'Living room' },
              { url: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&h=600&fit=crop&crop=center', caption: 'Bedroom' }
            ],
            location: { 
              address: '123 Ocean Drive', 
              city: 'Miami', 
              state: 'FL', 
              country: 'United States',
              neighborhood: 'South Beach',
              zipCode: '33139'
            },
            capacity: { guests: 4, bedrooms: 2, beds: 2, bathrooms: 2 },
            pricing: { basePrice: 180, cleaningFee: 30, serviceFee: 20 },
            propertyType: 'apartment',
            amenities: ['WiFi', 'Kitchen', 'Air Conditioning', 'Beach Access', 'Balcony'],
            rating: { average: 4.7, count: 112 },
            host: { 
              firstName: 'Carlos', 
              lastName: 'Rodriguez', 
              createdAt: '2020-01-10T00:00:00Z',
              bio: 'Miami Beach local with deep knowledge of the area.'
            },
            reviews: []
          },
          '507f1f77bcf86cd799439008': {
            _id: '507f1f77bcf86cd799439008',
            title: 'Miami Beach Oceanfront Villa with Private Beach',
            description: 'Luxury beachfront villa with private beach access, stunning ocean views, and resort-style amenities. Perfect for large groups and special celebrations. Experience Miami Beach luxury at its finest.',
            images: [
              { url: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800&h=600&fit=crop&crop=center', caption: 'Villa exterior', isMain: true },
              { url: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&h=600&fit=crop&crop=center', caption: 'Ocean view' },
              { url: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&h=600&fit=crop&crop=center', caption: 'Pool area' },
              { url: 'https://images.unsplash.com/photo-1505142468610-359e7d316be0?w=800&h=600&fit=crop&crop=center', caption: 'Living space' }
            ],
            location: { 
              address: '789 Ocean Drive', 
              city: 'Miami', 
              state: 'FL', 
              country: 'United States',
              neighborhood: 'South Beach',
              zipCode: '33139'
            },
            capacity: { guests: 10, bedrooms: 5, beds: 6, bathrooms: 4 },
            pricing: { basePrice: 600, cleaningFee: 120, serviceFee: 60 },
            propertyType: 'villa',
            amenities: ['WiFi', 'Beach Access', 'Pool', 'Ocean View', 'BBQ Grill', 'Parking', 'Kitchen', 'Hot Tub', 'Butler Service'],
            rating: { average: 4.9, count: 89 },
            host: { 
              firstName: 'Isabella', 
              lastName: 'Rodriguez', 
              createdAt: '2017-05-15T00:00:00Z',
              bio: 'Luxury hospitality specialist with properties across Miami Beach.'
            },
            reviews: [
              {
                rating: 5,
                comment: 'Absolutely perfect! The beach access was incredible and the amenities were top-notch.',
                user: { firstName: 'Emma' },
                createdAt: '2024-02-01T00:00:00Z'
              }
            ]
          },
          // Paris listings
          '507f1f77bcf86cd799439011': {
            _id: '507f1f77bcf86cd799439011',
            title: 'Montmartre Artist Studio',
            description: 'Charming artist studio in historic Montmartre with Sacré-Cœur views. Experience the bohemian charm of Paris in this authentic artist space, perfect for couples or solo travelers seeking inspiration.',
            images: [
              { url: 'https://images.unsplash.com/photo-1502602898536-47ad22581b52?w=800&h=600&fit=crop&crop=center', caption: 'Studio view', isMain: true },
              { url: 'https://images.unsplash.com/photo-1549638441-b787d2e11f14?w=800&h=600&fit=crop&crop=center', caption: 'Living space' },
              { url: 'https://images.unsplash.com/photo-1523906834658-6e24ef2386f9?w=800&h=600&fit=crop&crop=center', caption: 'Bedroom area' }
            ],
            location: { 
              address: '12 Rue des Abbesses', 
              city: 'Paris', 
              state: '', 
              country: 'France',
              neighborhood: 'Montmartre',
              zipCode: '75018'
            },
            capacity: { guests: 2, bedrooms: 1, beds: 1, bathrooms: 1 },
            pricing: { basePrice: 120, cleaningFee: 25, serviceFee: 15 },
            propertyType: 'studio',
            amenities: ['WiFi', 'Kitchen', 'Heating', 'City View', 'Historic Character'],
            rating: { average: 4.8, count: 78 },
            host: { 
              firstName: 'Pierre', 
              lastName: 'Dubois', 
              createdAt: '2019-08-20T00:00:00Z',
              bio: 'Local Parisian artist who loves sharing the magic of Montmartre with visitors.'
            },
            reviews: [
              {
                rating: 5,
                comment: 'Absolutely magical place! Pierre was a wonderful host and the location is perfect for exploring Montmartre.',
                user: { firstName: 'Sophie' },
                createdAt: '2024-01-25T00:00:00Z'
              }
            ]
          },
          '507f1f77bcf86cd799439012': {
            _id: '507f1f77bcf86cd799439012',
            title: 'Champs-Élysées Elegant Haussmann Apartment',
            description: 'Elegant Haussmann-style apartment near the Champs-Élysées with classic French architecture, high ceilings, and modern amenities. Walking distance to Arc de Triomphe and luxury shopping. Perfect for families or groups.',
            images: [
              { url: 'https://images.unsplash.com/photo-1549638441-b787d2e11f14?w=800&h=600&fit=crop&crop=center', caption: 'Living room', isMain: true },
              { url: 'https://images.unsplash.com/photo-1523906834658-6e24ef2386f9?w=800&h=600&fit=crop&crop=center', caption: 'Bedroom' },
              { url: 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=800&h=600&fit=crop&crop=center', caption: 'Kitchen' },
              { url: 'https://images.unsplash.com/photo-1502602898536-47ad22581b52?w=800&h=600&fit=crop&crop=center', caption: 'Dining area' }
            ],
            location: { 
              address: '123 Avenue des Champs-Élysées', 
              city: 'Paris', 
              state: '', 
              country: 'France',
              neighborhood: '8th Arrondissement',
              zipCode: '75008'
            },
            capacity: { guests: 6, bedrooms: 3, beds: 3, bathrooms: 2 },
            pricing: { basePrice: 280, cleaningFee: 50, serviceFee: 30 },
            propertyType: 'apartment',
            amenities: ['WiFi', 'Kitchen', 'Heating', 'Classic Architecture', 'City View', 'Concierge', 'Elevator', 'Balcony'],
            rating: { average: 4.9, count: 156 },
            host: { 
              firstName: 'Philippe', 
              lastName: 'Dubois', 
              createdAt: '2018-03-15T00:00:00Z',
              bio: 'Parisian property specialist with extensive knowledge of luxury accommodations.'
            },
            reviews: [
              {
                rating: 5,
                comment: 'Stunning Haussmann apartment with incredible location. Philippe was extremely helpful throughout our stay.',
                user: { firstName: 'Marie' },
                createdAt: '2024-02-05T00:00:00Z'
              }
            ]
          },
          // London listings
          '507f1f77bcf86cd799439013': {
            _id: '507f1f77bcf86cd799439013',
            title: 'Covent Garden Victorian Townhouse',
            description: 'Beautiful Victorian townhouse in the heart of Covent Garden with original features, period charm, and modern amenities. Perfect location for exploring London theaters, restaurants, and shopping.',
            images: [
              { url: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=800&h=600&fit=crop&crop=center', caption: 'Victorian exterior', isMain: true },
              { url: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=800&h=600&fit=crop&crop=center', caption: 'Living room' },
              { url: 'https://images.unsplash.com/photo-1585129777188-94600bc7096e?w=800&h=600&fit=crop&crop=center', caption: 'Bedroom' }
            ],
            location: { 
              address: '12 King Street', 
              city: 'London', 
              state: '', 
              country: 'United Kingdom',
              neighborhood: 'Covent Garden',
              zipCode: 'WC2E 8JD'
            },
            capacity: { guests: 8, bedrooms: 4, beds: 4, bathrooms: 3 },
            pricing: { basePrice: 320, cleaningFee: 65, serviceFee: 40 },
            propertyType: 'townhouse',
            amenities: ['WiFi', 'Kitchen', 'Heating', 'Historic Character', 'Garden', 'Fireplace'],
            rating: { average: 4.8, count: 142 },
            host: { 
              firstName: 'James', 
              lastName: 'Watson', 
              createdAt: '2019-04-10T00:00:00Z',
              bio: 'London local with extensive knowledge of the city and passion for historic properties.'
            },
            reviews: []
          },
          '507f1f77bcf86cd799439014': {
            _id: '507f1f77bcf86cd799439014',
            title: 'Thames View Modern Apartment',
            description: 'Contemporary apartment with stunning Thames and city skyline views. Located in a luxury development with concierge service and premium amenities. Perfect for business travelers and luxury seekers.',
            images: [
              { url: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=800&h=600&fit=crop&crop=center', caption: 'Thames view', isMain: true },
              { url: 'https://images.unsplash.com/photo-1585129777188-94600bc7096e?w=800&h=600&fit=crop&crop=center', caption: 'Living space' },
              { url: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=800&h=600&fit=crop&crop=center', caption: 'Modern kitchen' }
            ],
            location: { 
              address: '45 Thames Embankment', 
              city: 'London', 
              state: '', 
              country: 'United Kingdom',
              neighborhood: 'South Bank',
              zipCode: 'SE1 9PP'
            },
            capacity: { guests: 4, bedrooms: 2, beds: 2, bathrooms: 2 },
            pricing: { basePrice: 280, cleaningFee: 50, serviceFee: 30 },
            propertyType: 'apartment',
            amenities: ['WiFi', 'Kitchen', 'Air Conditioning', 'Thames View', 'Concierge', 'Gym'],
            rating: { average: 4.7, count: 98 },
            host: { 
              firstName: 'Emily', 
              lastName: 'Harris', 
              createdAt: '2020-02-15T00:00:00Z',
              bio: 'Property specialist focused on luxury London accommodations.'
            },
            reviews: []
          },
          // Tokyo listings
          '507f1f77bcf86cd799439015': {
            _id: '507f1f77bcf86cd799439015',
            title: 'Shibuya Modern Studio',
            description: 'Ultra-modern studio in the heart of Shibuya with city views and easy access to Tokyo entertainment district. Perfect for experiencing the energy of modern Tokyo.',
            images: [
              { url: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800&h=600&fit=crop&crop=center', caption: 'Modern studio', isMain: true },
              { url: 'https://images.unsplash.com/photo-1555636222-cae831e670b3?w=800&h=600&fit=crop&crop=center', caption: 'City view' },
              { url: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&h=600&fit=crop&crop=center', caption: 'Living space' }
            ],
            location: { 
              address: '2-1-1 Shibuya', 
              city: 'Tokyo', 
              state: '', 
              country: 'Japan',
              neighborhood: 'Shibuya',
              zipCode: '150-0002'
            },
            capacity: { guests: 2, bedrooms: 1, beds: 1, bathrooms: 1 },
            pricing: { basePrice: 100, cleaningFee: 20, serviceFee: 15 },
            propertyType: 'studio',
            amenities: ['WiFi', 'Kitchen', 'Air Conditioning', 'City View', 'Modern Design'],
            rating: { average: 4.6, count: 87 },
            host: { 
              firstName: 'Yuki', 
              lastName: 'Tanaka', 
              createdAt: '2021-01-20T00:00:00Z',
              bio: 'Tokyo local who loves sharing the best of Japanese culture with visitors.'
            },
            reviews: []
          },
          '507f1f77bcf86cd799439016': {
            _id: '507f1f77bcf86cd799439016',
            title: 'Traditional Ryokan Experience in Historic Asakusa',
            description: 'Authentic Japanese ryokan experience in the traditional Asakusa district with tatami floors, futon beds, and traditional architecture. Near Senso-ji Temple and traditional markets.',
            images: [
              { url: 'https://images.unsplash.com/photo-1555636222-cae831e670b3?w=800&h=600&fit=crop&crop=center', caption: 'Ryokan interior', isMain: true },
              { url: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800&h=600&fit=crop&crop=center', caption: 'Traditional room' },
              { url: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&h=600&fit=crop&crop=center', caption: 'Garden view' }
            ],
            location: { 
              address: '3-15-2 Asakusa', 
              city: 'Tokyo', 
              state: '', 
              country: 'Japan',
              neighborhood: 'Asakusa',
              zipCode: '111-0032'
            },
            capacity: { guests: 4, bedrooms: 2, beds: 2, bathrooms: 1 },
            pricing: { basePrice: 150, cleaningFee: 25, serviceFee: 20 },
            propertyType: 'ryokan',
            amenities: ['WiFi', 'Traditional Experience', 'Tatami Floors', 'Tea Ceremony', 'Garden'],
            rating: { average: 4.9, count: 234 },
            host: { 
              firstName: 'Hiroshi', 
              lastName: 'Yamamoto', 
              createdAt: '2018-09-15T00:00:00Z',
              bio: 'Traditional ryokan keeper with generations of hospitality experience.'
            },
            reviews: []
          },
          // Barcelona listings
          '507f1f77bcf86cd799439017': {
            _id: '507f1f77bcf86cd799439017',
            title: 'Gothic Quarter Penthouse',
            description: 'Stunning penthouse in the historic Gothic Quarter with terrace views over Barcelona old town. Combines medieval charm with modern luxury amenities.',
            images: [
              { url: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=800&h=600&fit=crop&crop=center', caption: 'Penthouse terrace', isMain: true },
              { url: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&h=600&fit=crop&crop=center', caption: 'Living room' },
              { url: 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=800&h=600&fit=crop&crop=center', caption: 'Kitchen' }
            ],
            location: { 
              address: 'Carrer del Call 15', 
              city: 'Barcelona', 
              state: '', 
              country: 'Spain',
              neighborhood: 'Gothic Quarter',
              zipCode: '08002'
            },
            capacity: { guests: 6, bedrooms: 3, beds: 3, bathrooms: 2 },
            pricing: { basePrice: 180, cleaningFee: 35, serviceFee: 25 },
            propertyType: 'apartment',
            amenities: ['WiFi', 'Kitchen', 'Air Conditioning', 'Terrace', 'Historic Location', 'City View'],
            rating: { average: 4.8, count: 123 },
            host: { 
              firstName: 'Carlos', 
              lastName: 'Martinez', 
              createdAt: '2020-03-05T00:00:00Z',
              bio: 'Barcelona local passionate about sharing the city`s history and culture.'
            },
            reviews: []
          },
          '507f1f77bcf86cd799439018': {
            _id: '507f1f77bcf86cd799439018',
            title: 'Park Güell Artist Loft',
            description: 'Artistic loft near Park Güell with unique Gaudí-inspired design elements and creative atmosphere. Perfect for artists and design enthusiasts visiting Barcelona.',
            images: [
              { url: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&h=600&fit=crop&crop=center', caption: 'Artist loft', isMain: true },
              { url: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=800&h=600&fit=crop&crop=center', caption: 'Creative space' },
              { url: 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=800&h=600&fit=crop&crop=center', caption: 'Gaudí-inspired details' }
            ],
            location: { 
              address: 'Carrer de Verdi 25', 
              city: 'Barcelona', 
              state: '', 
              country: 'Spain',
              neighborhood: 'Gràcia',
              zipCode: '08012'
            },
            capacity: { guests: 4, bedrooms: 2, beds: 2, bathrooms: 1 },
            pricing: { basePrice: 140, cleaningFee: 30, serviceFee: 20 },
            propertyType: 'loft',
            amenities: ['WiFi', 'Kitchen', 'Artistic Design', 'Near Park Güell', 'Creative Space'],
            rating: { average: 4.7, count: 89 },
            host: { 
              firstName: 'Maria', 
              lastName: 'Garcia', 
              createdAt: '2019-11-20T00:00:00Z',
              bio: 'Local artist who loves connecting visitors with Barcelona`s creative spirit.'
            },
            reviews: []
          },
          // Sydney listings
          '507f1f77bcf86cd799439019': {
            _id: '507f1f77bcf86cd799439019',
            title: 'Bondi Beach Oceanfront Apartment',
            description: 'Stunning beachfront apartment with direct access to famous Bondi Beach. Wake up to ocean views and the sound of waves. Perfect for beach lovers and surfers.',
            images: [
              { url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop&crop=center', caption: 'Ocean view', isMain: true },
              { url: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&h=600&fit=crop&crop=center', caption: 'Beach apartment' },
              { url: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=800&h=600&fit=crop&crop=center', caption: 'Living space' }
            ],
            location: { 
              address: '123 Campbell Parade', 
              city: 'Sydney', 
              state: 'NSW', 
              country: 'Australia',
              neighborhood: 'Bondi Beach',
              zipCode: '2026'
            },
            capacity: { guests: 6, bedrooms: 3, beds: 3, bathrooms: 2 },
            pricing: { basePrice: 250, cleaningFee: 45, serviceFee: 30 },
            propertyType: 'apartment',
            amenities: ['WiFi', 'Kitchen', 'Beach Access', 'Ocean View', 'Surfboard Storage'],
            rating: { average: 4.9, count: 167 },
            host: { 
              firstName: 'Jake', 
              lastName: 'Thompson', 
              createdAt: '2019-07-15T00:00:00Z',
              bio: 'Bondi local and surf instructor who loves sharing the beach lifestyle.'
            },
            reviews: []
          },
          '507f1f77bcf86cd799439020': {
            _id: '507f1f77bcf86cd799439020',
            title: 'Sydney Harbour Bridge View Penthouse',
            description: 'Luxurious penthouse with breathtaking views of Sydney Harbour Bridge and Opera House. Premium location in Circular Quay with world-class dining and attractions nearby.',
            images: [
              { url: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&h=600&fit=crop&crop=center', caption: 'Harbour Bridge view', isMain: true },
              { url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop&crop=center', caption: 'Penthouse living' },
              { url: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=800&h=600&fit=crop&crop=center', caption: 'Luxury interior' }
            ],
            location: { 
              address: '88 Cumberland Street', 
              city: 'Sydney', 
              state: 'NSW', 
              country: 'Australia',
              neighborhood: 'The Rocks',
              zipCode: '2000'
            },
            capacity: { guests: 8, bedrooms: 4, beds: 4, bathrooms: 3 },
            pricing: { basePrice: 450, cleaningFee: 80, serviceFee: 50 },
            propertyType: 'penthouse',
            amenities: ['WiFi', 'Kitchen', 'Harbour View', 'Opera House View', 'Concierge', 'Gym', 'Pool'],
            rating: { average: 4.9, count: 203 },
            host: { 
              firstName: 'Sophie', 
              lastName: 'Wilson', 
              createdAt: '2018-01-10T00:00:00Z',
              bio: 'Sydney luxury property specialist with extensive harbor knowledge.'
            },
            reviews: []
          }
        }
        
        const sampleListing = sampleListings[id]
        if (sampleListing) {
          setListing(sampleListing)
        } else {
          setError('Property not found')
        }
      }
    } catch (error) {
      console.error('Error fetching listing:', error)
      setError(error.response?.data?.message || 'Failed to load listing')
    } finally {
      setLoading(false)
    }
  }

  const handleDateSelect = ({ checkIn, checkOut }) => {
    setSelectedCheckIn(checkIn)
    setSelectedCheckOut(checkOut)
  }

  const calculateTotalPrice = () => {
    if (!selectedCheckIn || !selectedCheckOut || !listing) return 0
    const nights = Math.ceil((selectedCheckOut - selectedCheckIn) / (1000 * 60 * 60 * 24))
    return nights * (listing.price || listing.pricing?.basePrice || 0)
  }

  const handleBooking = async () => {
    if (!isSignedIn) {
      navigate('/sign-in')
      return
    }

    if (!selectedCheckIn || !selectedCheckOut) {
      alert('Please select check-in and check-out dates')
      return
    }

    try {
      setBookingLoading(true)
      const bookingData = {
        listing: listing._id,
        checkIn: selectedCheckIn.toISOString(),
        checkOut: selectedCheckOut.toISOString(),
        guests,
        totalPrice: calculateTotalPrice()
      }

      const response = await bookingsAPI.createBooking(bookingData)
      
      // Redirect to booking confirmation or payment
      navigate(`/booking/${response.data._id}`)
    } catch (error) {
      console.error('Error creating booking:', error)
      alert(error.response?.data?.message || 'Failed to create booking')
    } finally {
      setBookingLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner />
      </div>
    )
  }

  if (error || !listing) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">Property not found</h3>
          <p className="mt-1 text-sm text-gray-500">{error || 'This property may have been removed or does not exist.'}</p>
          <div className="mt-6">
            <button
              onClick={() => navigate('/search')}
              className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700"
            >
              Browse other properties
            </button>
          </div>
        </div>
      </div>
    )
  }

  const averageRating = listing.rating?.average || listing.averageRating || 0
  const totalReviews = listing.rating?.count || listing.reviewCount || 0
  const nights = selectedCheckIn && selectedCheckOut ? 
    Math.ceil((selectedCheckOut - selectedCheckIn) / (1000 * 60 * 60 * 24)) : 0

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-gray-600 hover:text-gray-900 mb-6"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to search
        </button>

        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{listing.title}</h1>
          <div className="flex flex-wrap items-center gap-4 text-sm">
            <div className="flex items-center">
              <svg className="w-4 h-4 mr-1 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              <span className="font-medium">{averageRating.toFixed(1)}</span>
              <span className="text-gray-500 ml-1">({totalReviews} reviews)</span>
            </div>
            <div className="flex items-center">
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span>{listing.location?.city}, {listing.location?.state}, {listing.location?.country}</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Images and Details */}
          <div className="lg:col-span-2 space-y-8">
            {/* Image Gallery */}
            <div className="relative">
              {listing.images && listing.images.length > 0 ? (
                <div className="grid grid-cols-4 gap-2 h-96 rounded-lg overflow-hidden">
                  {/* Main Image */}
                  <div className="col-span-2 row-span-2">
                    <img
                      src={listing.images[selectedImageIndex]?.url || listing.images[selectedImageIndex] || listing.images[0]?.url || listing.images[0]}
                      alt={listing.title}
                      className="w-full h-full object-cover cursor-pointer hover:opacity-95 transition-opacity"
                      onClick={() => setShowAllPhotos(true)}
                    />
                  </div>
                  
                  {/* Thumbnail Grid */}
                  {listing.images.slice(1, 5).map((image, index) => (
                    <div key={index} className="relative overflow-hidden">
                      <img
                        src={image?.url || image}
                        alt={`${listing.title} ${index + 2}`}
                        className="w-full h-full object-cover cursor-pointer hover:opacity-75 transition-opacity"
                        onClick={() => setSelectedImageIndex(index + 1)}
                      />
                      {index === 3 && listing.images.length > 5 && (
                        <div 
                          className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center cursor-pointer hover:bg-opacity-40 transition-all"
                          onClick={() => setShowAllPhotos(true)}
                        >
                          <span className="text-white font-medium">+{listing.images.length - 5} more</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="h-96 bg-gray-200 rounded-lg flex items-center justify-center">
                  <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
              )}
            </div>

            {/* Property Details */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="border-b border-gray-200 pb-6 mb-6">
                <h2 className="text-xl font-semibold mb-2 text-gray-900">About this place</h2>
                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-4">
                  <span className="capitalize font-medium">{listing.propertyType}</span>
                  <span>{listing.bedrooms || listing.capacity?.bedrooms} bedroom{(listing.bedrooms || listing.capacity?.bedrooms) !== 1 ? 's' : ''}</span>
                  <span>{listing.bathrooms || listing.capacity?.bathrooms} bathroom{(listing.bathrooms || listing.capacity?.bathrooms) !== 1 ? 's' : ''}</span>
                  <span>Max {listing.maxGuests || listing.capacity?.guests} guests</span>
                </div>
                <p className="text-gray-700 leading-relaxed text-base">{listing.description}</p>
              </div>

              {/* Amenities */}
              {listing.amenities && listing.amenities.length > 0 && (
                <div className="border-b border-gray-200 pb-6 mb-6">
                  <h3 className="text-lg font-semibold mb-4">Amenities</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {listing.amenities.map((amenity, index) => (
                      <div key={index} className="flex items-center">
                        <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span className="text-gray-700 capitalize">{amenity}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Host Information */}
              {listing.host && (
                <div className="border-b border-gray-200 pb-6 mb-6">
                  <h3 className="text-lg font-semibold mb-4">Meet your host</h3>
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                      <span className="text-primary-600 font-semibold">
                        {listing.host.firstName?.charAt(0)}{listing.host.lastName?.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium">{listing.host.firstName} {listing.host.lastName}</p>
                      <p className="text-sm text-gray-600">Host since {new Date(listing.host.createdAt).getFullYear()}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Location & Map Section */}
              <div className="border-b border-gray-200 pb-6 mb-6">
                <h3 className="text-lg font-semibold mb-4">Where you'll be</h3>
                <div className="mb-4">
                  <PropertyMap listing={listing} height="350px" />
                </div>
                <div className="text-sm text-gray-600">
                  <p className="font-medium text-gray-900 mb-1">
                    {listing.location?.city}, {listing.location?.state}, {listing.location?.country}
                  </p>
                  {listing.location?.address && (
                    <p>{listing.location.address}</p>
                  )}
                  {listing.location?.neighborhood && (
                    <p className="mt-2">
                      📍 Located in {listing.location.neighborhood} neighborhood
                    </p>
                  )}
                </div>
              </div>

              {/* Reviews Section */}
              {totalReviews > 0 && (
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">
                      Reviews ({totalReviews})
                    </h3>
                    <button
                      onClick={() => setShowReviews(!showReviews)}
                      className="text-primary-600 hover:text-primary-700 text-sm font-medium"
                    >
                      {showReviews ? 'Show less' : 'Show all reviews'}
                    </button>
                  </div>
                  
                  {listing.reviews && listing.reviews.length > 0 && (
                    <div className="space-y-4">
                      {(showReviews ? listing.reviews : listing.reviews.slice(0, 3)).map((review, index) => (
                        <div key={index} className="border-b border-gray-100 pb-4 last:border-b-0">
                          <div className="flex items-center space-x-3 mb-2">
                            <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                              <span className="text-xs font-medium">
                                {review.user?.firstName?.charAt(0) || 'U'}
                              </span>
                            </div>
                            <div>
                              <p className="font-medium text-sm">{review.user?.firstName || 'Anonymous'}</p>
                              <div className="flex items-center">
                                {[...Array(5)].map((_, i) => (
                                  <svg
                                    key={i}
                                    className={`w-4 h-4 ${i < review.rating ? 'text-yellow-400' : 'text-gray-300'}`}
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                  >
                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                  </svg>
                                ))}
                              </div>
                            </div>
                          </div>
                          <p className="text-gray-700 text-sm leading-relaxed">{review.comment}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Booking Card */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-6 sticky top-8 z-10">
              <div className="mb-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <span className="text-2xl font-bold">${listing.price || listing.pricing?.basePrice}</span>
                    <span className="text-gray-600">/night</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <svg className="w-4 h-4 text-yellow-400 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    <span>{averageRating.toFixed(1)} ({totalReviews})</span>
                  </div>
                </div>

                {/* Guests Selection */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Guests
                  </label>
                  <select
                    value={guests}
                    onChange={(e) => setGuests(parseInt(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    {Array.from({ length: listing.maxGuests || listing.capacity?.guests || 8 }, (_, i) => i + 1).map(num => (
                      <option key={num} value={num}>
                        {num} guest{num > 1 ? 's' : ''}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Calendar */}
              <div className="mb-6">
                <BookingCalendar
                  unavailableDates={listing.unavailableDates || []}
                  onDateSelect={handleDateSelect}
                  selectedCheckIn={selectedCheckIn}
                  selectedCheckOut={selectedCheckOut}
                />
              </div>

              {/* Price Breakdown */}
              {selectedCheckIn && selectedCheckOut && (
                <div className="border-t border-gray-200 pt-4 mb-6">
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>${listing.price || listing.pricing?.basePrice} x {nights} nights</span>
                      <span>${(listing.price || listing.pricing?.basePrice) * nights}</span>
                    </div>
                    <div className="flex justify-between font-semibold text-base">
                      <span>Total</span>
                      <span>${calculateTotalPrice()}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Book Button */}
              <button
                onClick={handleBooking}
                disabled={!selectedCheckIn || !selectedCheckOut || bookingLoading}
                className="w-full bg-primary-600 text-white py-3 px-4 rounded-md font-medium hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {bookingLoading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Processing...
                  </div>
                ) : selectedCheckIn && selectedCheckOut ? (
                  `Book for $${calculateTotalPrice()}`
                ) : (
                  'Select dates to book'
                )}
              </button>

              {!isSignedIn && (
                <p className="text-xs text-gray-500 text-center mt-2">
                  You'll be redirected to sign in
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Photo Modal */}
        {showAllPhotos && listing.images && (
          <div className="fixed inset-0 z-50 bg-black bg-opacity-90 flex items-center justify-center p-4">
            <div className="max-w-4xl w-full max-h-full overflow-auto">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-white text-lg font-medium">All Photos</h3>
                <button
                  onClick={() => setShowAllPhotos(false)}
                  className="text-white hover:text-gray-300"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {listing.images.map((image, index) => (
                  <img
                    key={index}
                    src={image?.url || image}
                    alt={`${listing.title} ${index + 1}`}
                    className="w-full h-auto rounded-lg"
                  />
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default ListingDetails