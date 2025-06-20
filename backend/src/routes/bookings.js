const express = require('express');
const { body, validationResult } = require('express-validator');
const Booking = require('../models/Booking');
const Listing = require('../models/Listing');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// @desc    Create new booking
// @route   POST /api/bookings
// @access  Private
router.post('/', protect, [
  body('listing').isMongoId().withMessage('Valid listing ID is required'),
  body('dates.checkIn').isISO8601().withMessage('Valid check-in date is required'),
  body('dates.checkOut').isISO8601().withMessage('Valid check-out date is required'),
  body('guests.adults').isInt({ min: 1 }).withMessage('At least 1 adult guest is required'),
  body('payment.method').isIn(['credit_card', 'debit_card', 'paypal', 'stripe']).withMessage('Valid payment method is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { listing: listingId, dates, guests, specialRequests, payment } = req.body;

    // Get listing details
    const listing = await Listing.findById(listingId).populate('host');
    if (!listing) {
      return res.status(404).json({
        success: false,
        message: 'Listing not found'
      });
    }

    // Check if listing is available for selected dates
    const isAvailable = listing.isAvailable(dates.checkIn, dates.checkOut);
    if (!isAvailable) {
      return res.status(400).json({
        success: false,
        message: 'Listing is not available for selected dates'
      });
    }

    // Calculate nights and total guests
    const checkIn = new Date(dates.checkIn);
    const checkOut = new Date(dates.checkOut);
    const nights = Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24));
    const totalGuests = guests.adults + (guests.children || 0) + (guests.infants || 0);

    // Check guest capacity
    if (totalGuests > listing.capacity.guests) {
      return res.status(400).json({
        success: false,
        message: `This listing can accommodate maximum ${listing.capacity.guests} guests`
      });
    }

    // Calculate pricing
    const basePrice = listing.pricing.basePrice;
    const subtotal = basePrice * nights;
    const cleaningFee = listing.pricing.cleaningFee || 0;
    const serviceFee = subtotal * 0.14; // 14% service fee
    const taxes = subtotal * 0.08; // 8% taxes
    const totalAmount = subtotal + cleaningFee + serviceFee + taxes;

    // Create booking
    const booking = await Booking.create({
      listing: listingId,
      guest: req.user.id,
      host: listing.host._id,
      dates: {
        checkIn: dates.checkIn,
        checkOut: dates.checkOut,
        nights
      },
      guests: {
        adults: guests.adults,
        children: guests.children || 0,
        infants: guests.infants || 0,
        pets: guests.pets || 0,
        total: totalGuests
      },
      pricing: {
        basePrice,
        nights,
        subtotal,
        cleaningFee,
        serviceFee,
        taxes,
        totalAmount
      },
      payment,
      specialRequests,
      guestInfo: req.body.guestInfo
    });

    // Block dates in listing
    listing.availability.blockedDates.push({
      startDate: dates.checkIn,
      endDate: dates.checkOut,
      reason: 'booked'
    });
    await listing.save();

    await booking.populate([
      { path: 'listing', select: 'title images location pricing' },
      { path: 'guest', select: 'name email avatar' },
      { path: 'host', select: 'name email avatar' }
    ]);

    res.status(201).json({
      success: true,
      message: 'Booking created successfully',
      booking
    });
  } catch (error) {
    console.error('Create booking error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error creating booking'
    });
  }
});

// @desc    Get user's bookings
// @route   GET /api/bookings
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const query = { guest: req.user.id };
    
    // Status filter
    if (req.query.status) {
      query.status = req.query.status;
    }

    const bookings = await Booking.find(query)
      .populate('listing', 'title images location pricing host')
      .populate('host', 'name avatar hostProfile')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Booking.countDocuments(query);

    res.status(200).json({
      success: true,
      count: bookings.length,
      total,
      pages: Math.ceil(total / limit),
      currentPage: page,
      bookings
    });
  } catch (error) {
    console.error('Get bookings error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error getting bookings'
    });
  }
});

// @desc    Get single booking
// @route   GET /api/bookings/:id
// @access  Private
router.get('/:id', protect, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('listing')
      .populate('guest', 'name email avatar phone')
      .populate('host', 'name email avatar phone hostProfile');

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    // Check if user is guest or host
    if (booking.guest._id.toString() !== req.user.id && 
        booking.host._id.toString() !== req.user.id && 
        req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this booking'
      });
    }

    res.status(200).json({
      success: true,
      booking
    });
  } catch (error) {
    console.error('Get booking error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error getting booking'
    });
  }
});

// @desc    Update booking status
// @route   PUT /api/bookings/:id/status
// @access  Private
router.put('/:id/status', protect, [
  body('status').isIn(['confirmed', 'cancelled_by_guest', 'cancelled_by_host']).withMessage('Invalid status')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    const { status } = req.body;

    // Check authorization for status changes
    if (status === 'confirmed' && booking.host.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Only the host can confirm bookings'
      });
    }

    if (status === 'cancelled_by_guest' && booking.guest.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Only the guest can cancel their booking'
      });
    }

    if (status === 'cancelled_by_host' && booking.host.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Only the host can cancel bookings'
      });
    }

    // Handle cancellation
    if (status.includes('cancelled')) {
      const refundAmount = booking.calculateRefundAmount();
      booking.cancellation = {
        cancelledBy: req.user.id,
        cancelledAt: new Date(),
        reason: req.body.reason,
        refundAmount
      };
      booking.payment.refundAmount = refundAmount;
    }

    booking.status = status;
    await booking.save();

    res.status(200).json({
      success: true,
      message: 'Booking status updated successfully',
      booking
    });
  } catch (error) {
    console.error('Update booking status error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error updating booking status'
    });
  }
});

module.exports = router; 