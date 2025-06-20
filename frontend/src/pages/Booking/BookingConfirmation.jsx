import React, { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useUser } from '@clerk/clerk-react'
import LoadingSpinner from '../../components/UI/LoadingSpinner'
import { bookingsAPI } from '../../services/api'

const BookingConfirmation = () => {
  const { id } = useParams()
  const { user } = useUser()
  const [booking, setBooking] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (id) {
      fetchBooking()
    }
  }, [id])

  const fetchBooking = async () => {
    try {
      setLoading(true)
      const response = await bookingsAPI.getBooking(id)
      setBooking(response.data)
    } catch (error) {
      console.error('Error fetching booking:', error)
      setError(error.response?.data?.message || 'Failed to load booking')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner />
      </div>
    )
  }

  if (error || !booking) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">Booking not found</h3>
          <p className="mt-1 text-sm text-gray-500">{error || 'This booking may have been removed or does not exist.'}</p>
          <div className="mt-6">
            <Link
              to="/dashboard"
              className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700"
            >
              Go to Dashboard
            </Link>
          </div>
        </div>
      </div>
    )
  }

  const checkInDate = new Date(booking.checkIn)
  const checkOutDate = new Date(booking.checkOut)
  const nights = Math.ceil((checkOutDate - checkInDate) / (1000 * 60 * 60 * 24))

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800'
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      case 'cancelled':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'confirmed':
        return (
          <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        )
      case 'pending':
        return (
          <svg className="w-5 h-5 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        )
      case 'cancelled':
        return (
          <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        )
      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
            {getStatusIcon(booking.status)}
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {booking.status === 'confirmed' ? 'Booking Confirmed!' : 'Booking Details'}
          </h1>
          <p className="text-gray-600">
            {booking.status === 'confirmed' 
              ? 'Your reservation has been confirmed. Check your email for details.'
              : 'Here are the details of your booking.'}
          </p>
        </div>

        {/* Booking Details Card */}
        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
          {/* Status Banner */}
          <div className={`px-6 py-3 ${getStatusColor(booking.status)}`}>
            <div className="flex items-center">
              {getStatusIcon(booking.status)}
              <span className="ml-2 text-sm font-medium capitalize">
                {booking.status} Booking
              </span>
            </div>
          </div>

          <div className="px-6 py-6">
            {/* Booking ID */}
            <div className="mb-6">
              <div className="text-sm text-gray-500">Booking ID</div>
              <div className="font-mono text-sm">{booking._id}</div>
            </div>

            {/* Property Info */}
            {booking.listing && (
              <div className="border-b border-gray-200 pb-6 mb-6">
                <h3 className="text-lg font-semibold mb-4">Property Details</h3>
                <div className="flex space-x-4">
                  {booking.listing.images && booking.listing.images[0] && (
                    <img
                      src={booking.listing.images[0]}
                      alt={booking.listing.title}
                      className="w-20 h-20 object-cover rounded-lg"
                    />
                  )}
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">{booking.listing.title}</h4>
                    <p className="text-sm text-gray-600 mt-1">
                      {booking.listing.location?.city}, {booking.listing.location?.state}
                    </p>
                    <p className="text-sm text-gray-600">
                      {booking.listing.propertyType} • {booking.listing.bedrooms} bed • {booking.listing.bathrooms} bath
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Stay Details */}
            <div className="border-b border-gray-200 pb-6 mb-6">
              <h3 className="text-lg font-semibold mb-4">Stay Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <div className="text-sm text-gray-500">Check-in</div>
                  <div className="font-medium">{checkInDate.toLocaleDateString('en-US', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}</div>
                  <div className="text-sm text-gray-500">After 3:00 PM</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">Check-out</div>
                  <div className="font-medium">{checkOutDate.toLocaleDateString('en-US', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}</div>
                  <div className="text-sm text-gray-500">Before 11:00 AM</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">Guests</div>
                  <div className="font-medium">{booking.guests} guest{booking.guests !== 1 ? 's' : ''}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">Nights</div>
                  <div className="font-medium">{nights} night{nights !== 1 ? 's' : ''}</div>
                </div>
              </div>
            </div>

            {/* Payment Details */}
            <div className="border-b border-gray-200 pb-6 mb-6">
              <h3 className="text-lg font-semibold mb-4">Payment Details</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">${booking.listing?.price || 0} x {nights} nights</span>
                  <span>${(booking.listing?.price || 0) * nights}</span>
                </div>
                <div className="flex justify-between font-semibold text-lg border-t border-gray-200 pt-2">
                  <span>Total</span>
                  <span>${booking.totalPrice}</span>
                </div>
              </div>
            </div>

            {/* Contact Info */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-4">Contact Information</h3>
              <div className="text-gray-700">
                <p><span className="font-medium">Email:</span> {user?.emailAddresses?.[0]?.emailAddress}</p>
                <p><span className="font-medium">Booking Date:</span> {new Date(booking.createdAt).toLocaleDateString()}</p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                to={`/listing/${booking.listing?._id}`}
                className="flex-1 bg-primary-600 text-white text-center py-3 px-4 rounded-md font-medium hover:bg-primary-700 transition-colors"
              >
                View Property
              </Link>
              <Link
                to="/dashboard"
                className="flex-1 border border-gray-300 text-gray-700 text-center py-3 px-4 rounded-md font-medium hover:bg-gray-50 transition-colors"
              >
                My Bookings
              </Link>
              {booking.status === 'confirmed' && (
                <button
                  onClick={() => window.print()}
                  className="flex-1 border border-gray-300 text-gray-700 py-3 px-4 rounded-md font-medium hover:bg-gray-50 transition-colors"
                >
                  Print Details
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Additional Info */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h4 className="text-lg font-semibold text-blue-900 mb-2">Important Information</h4>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Check-in time is after 3:00 PM</li>
            <li>• Check-out time is before 11:00 AM</li>
            <li>• Please bring a valid ID for check-in</li>
            <li>• Contact the host for any special requests</li>
            <li>• Cancellation policy applies as per booking terms</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default BookingConfirmation 