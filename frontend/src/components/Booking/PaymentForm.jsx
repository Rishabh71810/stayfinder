import React, { useState } from 'react'
import { useUser } from '@clerk/clerk-react'
import { CreditCard, Lock, AlertCircle } from 'lucide-react'
import { bookingsAPI } from '../../services/api'
import toast from 'react-hot-toast'
import LoadingSpinner from '../UI/LoadingSpinner'

const PaymentForm = ({ bookingData, onSuccess, onCancel }) => {
  const [loading, setLoading] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState('card')
  const { user } = useUser()

  // Mock payment form state
  const [paymentForm, setPaymentForm] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardholderName: '',
    billingAddress: {
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: 'US'
    }
  })

  const handleInputChange = (field, value) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.')
      setPaymentForm(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }))
    } else {
      setPaymentForm(prev => ({
        ...prev,
        [field]: value
      }))
    }
  }

  const formatCardNumber = (value) => {
    // Remove all non-digits
    const digits = value.replace(/\D/g, '')
    // Add spaces every 4 digits
    return digits.replace(/(\d{4})(?=\d)/g, '$1 ')
  }

  const formatExpiryDate = (value) => {
    const digits = value.replace(/\D/g, '')
    if (digits.length >= 2) {
      return digits.substring(0, 2) + '/' + digits.substring(2, 4)
    }
    return digits
  }

  const validateForm = () => {
    const { cardNumber, expiryDate, cvv, cardholderName } = paymentForm
    
    if (!cardNumber || !expiryDate || !cvv || !cardholderName) {
      toast.error('Please fill in all required payment fields')
      return false
    }

    if (cardNumber.replace(/\s/g, '').length < 13) {
      toast.error('Please enter a valid card number')
      return false
    }

    if (cvv.length < 3) {
      toast.error('Please enter a valid CVV')
      return false
    }

    return true
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) return

    setLoading(true)

    try {
      // In a real implementation, you would integrate with Clerk's payment processing
      // For now, we'll simulate the payment process
      
      // Step 1: Create the booking
      const response = await bookingsAPI.createBooking({
        ...bookingData,
        paymentMethod: paymentMethod,
        paymentStatus: 'pending'
      })

      // Step 2: Process payment (simulated)
      // In reality, this would use Clerk's payment API
      await new Promise(resolve => setTimeout(resolve, 2000)) // Simulate API call

      // Step 3: Update booking status
      await bookingsAPI.updateBookingStatus(response.data.booking._id, {
        status: 'confirmed',
        paymentStatus: 'completed'
      })

      toast.success('Payment successful! Your booking is confirmed.')
      onSuccess(response.data.booking)

    } catch (error) {
      console.error('Payment error:', error)
      toast.error(error.response?.data?.message || 'Payment failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg p-6">
      <div className="flex items-center space-x-2 mb-6">
        <Lock className="w-5 h-5 text-green-600" />
        <h2 className="text-xl font-semibold text-gray-900">Secure Payment</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Payment Method Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Payment Method
          </label>
          <div className="flex space-x-4">
            <label className="flex items-center">
              <input
                type="radio"
                value="card"
                checked={paymentMethod === 'card'}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="w-4 h-4 text-primary-600 focus:ring-primary-500"
              />
              <CreditCard className="w-4 h-4 ml-2 mr-1" />
              <span className="text-sm">Credit Card</span>
            </label>
          </div>
        </div>

        {/* Cardholder Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Cardholder Name
          </label>
          <input
            type="text"
            required
            value={paymentForm.cardholderName}
            onChange={(e) => handleInputChange('cardholderName', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            placeholder="John Doe"
          />
        </div>

        {/* Card Number */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Card Number
          </label>
          <input
            type="text"
            required
            maxLength="19"
            value={paymentForm.cardNumber}
            onChange={(e) => handleInputChange('cardNumber', formatCardNumber(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            placeholder="1234 5678 9012 3456"
          />
        </div>

        {/* Expiry Date and CVV */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Expiry Date
            </label>
            <input
              type="text"
              required
              maxLength="5"
              value={paymentForm.expiryDate}
              onChange={(e) => handleInputChange('expiryDate', formatExpiryDate(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="MM/YY"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              CVV
            </label>
            <input
              type="text"
              required
              maxLength="4"
              value={paymentForm.cvv}
              onChange={(e) => handleInputChange('cvv', e.target.value.replace(/\D/g, ''))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="123"
            />
          </div>
        </div>

        {/* Security Notice */}
        <div className="flex items-start space-x-2 p-3 bg-blue-50 rounded-md">
          <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
          <div className="text-sm text-blue-800">
            <p className="font-medium">Your payment is secure</p>
            <p>We use industry-standard encryption to protect your payment information.</p>
          </div>
        </div>

        {/* Booking Summary */}
        <div className="border-t pt-4">
          <h3 className="font-medium text-gray-900 mb-2">Booking Summary</h3>
          <div className="space-y-1 text-sm">
            <div className="flex justify-between">
              <span>Total Amount:</span>
              <span className="font-medium">${bookingData.pricing?.totalAmount?.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Check-in:</span>
              <span>{new Date(bookingData.dates?.checkIn).toLocaleDateString()}</span>
            </div>
            <div className="flex justify-between">
              <span>Check-out:</span>
              <span>{new Date(bookingData.dates?.checkOut).toLocaleDateString()}</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-3 pt-4">
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors disabled:opacity-50 flex items-center justify-center"
          >
            {loading ? (
              <LoadingSpinner size="sm" />
            ) : (
              `Pay $${bookingData.pricing?.totalAmount?.toFixed(2)}`
            )}
          </button>
        </div>
      </form>
    </div>
  )
}

export default PaymentForm 