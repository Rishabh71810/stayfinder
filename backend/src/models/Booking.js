const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  listing: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Listing',
    required: [true, 'Booking must belong to a listing']
  },
  guest: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Booking must have a guest']
  },
  host: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Booking must have a host']
  },
  dates: {
    checkIn: {
      type: Date,
      required: [true, 'Please provide check-in date']
    },
    checkOut: {
      type: Date,
      required: [true, 'Please provide check-out date']
    },
    nights: {
      type: Number,
      required: true
    }
  },
  guests: {
    adults: {
      type: Number,
      required: [true, 'Please specify number of adult guests'],
      min: [1, 'Must have at least 1 adult guest']
    },
    children: {
      type: Number,
      default: 0,
      min: [0, 'Number of children cannot be negative']
    },
    infants: {
      type: Number,
      default: 0,
      min: [0, 'Number of infants cannot be negative']
    },
    pets: {
      type: Number,
      default: 0,
      min: [0, 'Number of pets cannot be negative']
    },
    total: {
      type: Number,
      required: true
    }
  },
  pricing: {
    basePrice: {
      type: Number,
      required: true,
      min: [0, 'Base price cannot be negative']
    },
    nights: {
      type: Number,
      required: true
    },
    subtotal: {
      type: Number,
      required: true
    },
    cleaningFee: {
      type: Number,
      default: 0,
      min: [0, 'Cleaning fee cannot be negative']
    },
    serviceFee: {
      type: Number,
      default: 0,
      min: [0, 'Service fee cannot be negative']
    },
    taxes: {
      type: Number,
      default: 0,
      min: [0, 'Taxes cannot be negative']
    },
    discounts: {
      weeklyDiscount: {
        type: Number,
        default: 0
      },
      monthlyDiscount: {
        type: Number,
        default: 0
      },
      couponDiscount: {
        type: Number,
        default: 0
      }
    },
    totalAmount: {
      type: Number,
      required: true,
      min: [0, 'Total amount cannot be negative']
    },
    currency: {
      type: String,
      default: 'USD'
    }
  },
  payment: {
    method: {
      type: String,
      enum: ['credit_card', 'debit_card', 'paypal', 'stripe'],
      required: [true, 'Please specify payment method']
    },
    status: {
      type: String,
      enum: ['pending', 'completed', 'failed', 'refunded', 'partially_refunded'],
      default: 'pending'
    },
    transactionId: String,
    stripePaymentIntentId: String,
    paidAt: Date,
    refundedAt: Date,
    refundAmount: {
      type: Number,
      default: 0,
      min: [0, 'Refund amount cannot be negative']
    },
    refundReason: String
  },
  status: {
    type: String,
    enum: [
      'pending',           // Awaiting host approval
      'confirmed',         // Confirmed by host
      'cancelled_by_guest', // Cancelled by guest
      'cancelled_by_host', // Cancelled by host
      'completed',         // Stay completed
      'no_show',          // Guest didn't show up
      'in_progress'       // Currently staying
    ],
    default: 'pending'
  },
  specialRequests: {
    type: String,
    maxlength: [500, 'Special requests cannot exceed 500 characters']
  },
  guestInfo: {
    phone: String,
    purpose: {
      type: String,
      enum: ['leisure', 'business', 'other'],
      default: 'leisure'
    },
    arrivalTime: String,
    specialNeeds: String
  },
  communication: [{
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    message: {
      type: String,
      required: true,
      maxlength: [1000, 'Message cannot exceed 1000 characters']
    },
    timestamp: {
      type: Date,
      default: Date.now
    },
    read: {
      type: Boolean,
      default: false
    }
  }],
  cancellation: {
    cancelledBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    cancelledAt: Date,
    reason: String,
    refundPolicy: {
      type: String,
      enum: ['flexible', 'moderate', 'strict', 'super_strict'],
      default: 'moderate'
    },
    refundAmount: {
      type: Number,
      default: 0
    }
  },
  review: {
    hasGuestReviewed: {
      type: Boolean,
      default: false
    },
    hasHostReviewed: {
      type: Boolean,
      default: false
    },
    guestReview: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Review'
    },
    hostReview: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Review'
    }
  },
  metadata: {
    source: {
      type: String,
      enum: ['web', 'mobile', 'api'],
      default: 'web'
    },
    userAgent: String,
    ipAddress: String,
    referrer: String
  }
}, {
  timestamps: true
});

// Indexes for efficient queries
bookingSchema.index({ guest: 1, createdAt: -1 });
bookingSchema.index({ host: 1, createdAt: -1 });
bookingSchema.index({ listing: 1, 'dates.checkIn': 1 });
bookingSchema.index({ status: 1, createdAt: -1 });
bookingSchema.index({ 'payment.status': 1 });

// Calculate number of nights before saving
bookingSchema.pre('save', function(next) {
  if (this.dates.checkIn && this.dates.checkOut) {
    const checkIn = new Date(this.dates.checkIn);
    const checkOut = new Date(this.dates.checkOut);
    const timeDiff = checkOut.getTime() - checkIn.getTime();
    this.dates.nights = Math.ceil(timeDiff / (1000 * 3600 * 24));
    
    // Calculate total guests
    this.guests.total = this.guests.adults + this.guests.children + this.guests.infants;
  }
  next();
});

// Validate check-in date is before check-out date
bookingSchema.pre('save', function(next) {
  if (this.dates.checkIn >= this.dates.checkOut) {
    next(new Error('Check-out date must be after check-in date'));
  }
  next();
});

// Method to check if booking can be cancelled
bookingSchema.methods.canBeCancelled = function() {
  const now = new Date();
  const checkIn = new Date(this.dates.checkIn);
  
  // Can't cancel if already started or completed
  if (['completed', 'in_progress', 'no_show'].includes(this.status)) {
    return false;
  }
  
  // Can't cancel if already cancelled
  if (this.status.includes('cancelled')) {
    return false;
  }
  
  return checkIn > now;
};

// Method to calculate refund amount based on policy
bookingSchema.methods.calculateRefundAmount = function(cancellationPolicy = 'moderate') {
  const now = new Date();
  const checkIn = new Date(this.dates.checkIn);
  const daysUntilCheckIn = Math.ceil((checkIn - now) / (1000 * 60 * 60 * 24));
  
  let refundPercentage = 0;
  
  switch (cancellationPolicy) {
    case 'flexible':
      refundPercentage = daysUntilCheckIn >= 1 ? 100 : 0;
      break;
    case 'moderate':
      if (daysUntilCheckIn >= 5) refundPercentage = 100;
      else if (daysUntilCheckIn >= 1) refundPercentage = 50;
      else refundPercentage = 0;
      break;
    case 'strict':
      if (daysUntilCheckIn >= 7) refundPercentage = 100;
      else if (daysUntilCheckIn >= 1) refundPercentage = 50;
      else refundPercentage = 0;
      break;
    case 'super_strict':
      if (daysUntilCheckIn >= 14) refundPercentage = 100;
      else if (daysUntilCheckIn >= 7) refundPercentage = 50;
      else refundPercentage = 0;
      break;
  }
  
  const refundAmount = (this.pricing.totalAmount * refundPercentage) / 100;
  return Math.round(refundAmount * 100) / 100; // Round to 2 decimal places
};

// Method to add message to communication
bookingSchema.methods.addMessage = function(senderId, message) {
  this.communication.push({
    sender: senderId,
    message: message
  });
  return this.save();
};

// Method to mark messages as read
bookingSchema.methods.markMessagesAsRead = function(userId) {
  this.communication.forEach(msg => {
    if (msg.sender.toString() !== userId.toString()) {
      msg.read = true;
    }
  });
  return this.save();
};

module.exports = mongoose.model('Booking', bookingSchema);