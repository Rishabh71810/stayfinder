import React, { useState, useEffect } from 'react'
import { Calendar, MapPin, User } from 'lucide-react'
import LoadingSpinner from '../../components/UI/LoadingSpinner'

const UserBookings = () => {
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')

  const sampleBookings = [
    {
      _id: '1',
      listing: {
        title: 'Modern Downtown Apartment with City Views',
        images: [{ url: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800' }],
        location: { city: 'New York', state: 'NY' }
      },
      dates: { checkIn: '2024-03-15', checkOut: '2024-03-18' },
      guests: { total: 2 },
      pricing: { totalAmount: 574 },
      status: 'confirmed'
    },
    {
      _id: '2',
      listing: {
        title: 'Cozy Beachfront Villa with Ocean Views',
        images: [{ url: 'https://images.unsplash.com/photo-1505142468610-359e7d316be0?w=800' }],
        location: { city: 'Miami', state: 'FL' }
      },
      dates: { checkIn: '2024-01-10', checkOut: '2024-01-15' },
      guests: { total: 4 },
      pricing: { totalAmount: 1250 },
      status: 'completed'
    }
  ]

  useEffect(() => {
    const fetchBookings = async () => {
      setLoading(true)
      await new Promise(resolve => setTimeout(resolve, 1000))
      setBookings(sampleBookings)
      setLoading(false)
    }
    fetchBookings()
  }, [])

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed': return 'bg-green-100 text-green-800'
      case 'completed': return 'bg-blue-100 text-blue-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short', day: 'numeric', year: 'numeric'
    })
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">My Bookings</h1>
      
      {bookings.length === 0 ? (
        <div className="text-center py-12">
          <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No bookings found</h3>
          <p className="text-gray-600">You haven't made any bookings yet.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {bookings.map(booking => (
            <div key={booking._id} className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="md:flex">
                <div className="md:w-64 h-48 md:h-auto">
                  <img src={booking.listing.images[0]?.url} alt={booking.listing.title} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">{booking.listing.title}</h3>
                      <div className="flex items-center text-gray-600 mb-2">
                        <MapPin className="w-4 h-4 mr-1" />
                        <span>{booking.listing.location.city}, {booking.listing.location.state}</span>
                      </div>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(booking.status)}`}>
                      {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                    </span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div className="flex items-center text-gray-600">
                      <Calendar className="w-4 h-4 mr-2" />
                      <div>
                        <p className="font-medium">Check-in</p>
                        <p className="text-sm">{formatDate(booking.dates.checkIn)}</p>
                      </div>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <Calendar className="w-4 h-4 mr-2" />
                      <div>
                        <p className="font-medium">Check-out</p>
                        <p className="text-sm">{formatDate(booking.dates.checkOut)}</p>
                      </div>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <User className="w-4 h-4 mr-2" />
                      <div>
                        <p className="font-medium">Guests</p>
                        <p className="text-sm">{booking.guests.total} guest{booking.guests.total > 1 ? 's' : ''}</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm text-gray-600">Total Amount</p>
                      <p className="text-xl font-bold text-gray-900">${booking.pricing.totalAmount}</p>
                    </div>
                    <div className="flex space-x-2">
                      <button className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors">
                        View Details
                      </button>
                      {booking.status === 'completed' && (
                        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                          Leave Review
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default UserBookings 