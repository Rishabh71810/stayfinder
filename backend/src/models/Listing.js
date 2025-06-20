const mongoose = require('mongoose');

const listingSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please provide a title for the listing'],
    trim: true,
    maxlength: [100, 'Title cannot be more than 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Please provide a description'],
    maxlength: [2000, 'Description cannot be more than 2000 characters']
  },
  host: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  images: [{
    url: {
      type: String,
      required: true
    },
    caption: String,
    isMain: {
      type: Boolean,
      default: false
    }
  }],
  propertyType: {
    type: String,
    required: [true, 'Please specify the property type'],
    enum: [
      'apartment',
      'house',
      'villa',
      'condo',
      'townhouse',
      'loft',
      'cabin',
      'cottage',
      'castle',
      'boat',
      'camper',
      'treehouse',
      'other'
    ]
  },
  roomType: {
    type: String,
    required: [true, 'Please specify the room type'],
    enum: ['entire_place', 'private_room', 'shared_room']
  },
  location: {
    address: {
      type: String,
      required: [true, 'Please provide an address']
    },
    city: {
      type: String,
      required: [true, 'Please provide a city']
    },
    state: {
      type: String,
      required: [true, 'Please provide a state/province']
    },
    country: {
      type: String,
      required: [true, 'Please provide a country']
    },
    zipCode: {
      type: String,
      required: [true, 'Please provide a zip code']
    },
    coordinates: {
      type: {
        type: String,
        enum: ['Point'],
        default: 'Point'
      },
      coordinates: {
        type: [Number], // [longitude, latitude]
        required: true
      }
    },
    neighborhood: String
  },
  capacity: {
    guests: {
      type: Number,
      required: [true, 'Please specify maximum number of guests'],
      min: [1, 'Must accommodate at least 1 guest']
    },
    bedrooms: {
      type: Number,
      required: [true, 'Please specify number of bedrooms'],
      min: [0, 'Number of bedrooms cannot be negative']
    },
    beds: {
      type: Number,
      required: [true, 'Please specify number of beds'],
      min: [1, 'Must have at least 1 bed']
    },
    bathrooms: {
      type: Number,
      required: [true, 'Please specify number of bathrooms'],
      min: [0.5, 'Must have at least 0.5 bathroom']
    }
  },
  amenities: [{
    type: String,
    enum: [
      'wifi',
      'kitchen',
      'washer',
      'dryer',
      'air_conditioning',
      'heating',
      'parking',
      'pool',
      'hot_tub',
      'gym',
      'tv',
      'fireplace',
      'balcony',
      'garden',
      'pets_allowed',
      'smoking_allowed',
      'events_allowed',
      'elevator',
      'wheelchair_accessible',
      'first_aid_kit',
      'fire_extinguisher',
      'smoke_detector',
      'carbon_monoxide_detector'
    ]
  }],
  pricing: {
    basePrice: {
      type: Number,
      required: [true, 'Please provide a base price per night'],
      min: [1, 'Price must be at least $1']
    },
    currency: {
      type: String,
      default: 'USD'
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
    weeklyDiscount: {
      type: Number,
      default: 0,
      min: [0, 'Weekly discount cannot be negative'],
      max: [100, 'Weekly discount cannot exceed 100%']
    },
    monthlyDiscount: {
      type: Number,
      default: 0,
      min: [0, 'Monthly discount cannot be negative'],
      max: [100, 'Monthly discount cannot exceed 100%']
    }
  },
  availability: {
    minNights: {
      type: Number,
      default: 1,
      min: [1, 'Minimum nights must be at least 1']
    },
    maxNights: {
      type: Number,
      default: 365,
      min: [1, 'Maximum nights must be at least 1']
    },
    instantBook: {
      type: Boolean,
      default: false
    },
    checkIn: {
      type: String,
      default: '15:00'
    },
    checkOut: {
      type: String,
      default: '11:00'
    },
    blockedDates: [{
      startDate: {
        type: Date,
        required: true
      },
      endDate: {
        type: Date,
        required: true
      },
      reason: {
        type: String,
        enum: ['booked', 'blocked', 'maintenance'],
        default: 'blocked'
      }
    }]
  },
  houseRules: {
    checkInTime: String,
    checkOutTime: String,
    smokingAllowed: {
      type: Boolean,
      default: false
    },
    petsAllowed: {
      type: Boolean,
      default: false
    },
    partiesAllowed: {
      type: Boolean,
      default: false
    },
    quietHours: {
      start: String,
      end: String
    },
    additionalRules: [String]
  },
  status: {
    type: String,
    enum: ['draft', 'active', 'inactive', 'suspended'],
    default: 'draft'
  },
  reviews: [{
    guest: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    booking: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Booking',
      required: true
    },
    rating: {
      overall: {
        type: Number,
        required: true,
        min: 1,
        max: 5
      },
      cleanliness: {
        type: Number,
        min: 1,
        max: 5
      },
      accuracy: {
        type: Number,
        min: 1,
        max: 5
      },
      communication: {
        type: Number,
        min: 1,
        max: 5
      },
      location: {
        type: Number,
        min: 1,
        max: 5
      },
      checkIn: {
        type: Number,
        min: 1,
        max: 5
      },
      value: {
        type: Number,
        min: 1,
        max: 5
      }
    },
    comment: {
      type: String,
      maxlength: [1000, 'Review comment cannot exceed 1000 characters']
    },
    response: {
      text: String,
      date: Date
    },
    date: {
      type: Date,
      default: Date.now
    }
  }],
  statistics: {
    totalBookings: {
      type: Number,
      default: 0
    },
    totalRevenue: {
      type: Number,
      default: 0
    },
    averageRating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5
    },
    totalReviews: {
      type: Number,
      default: 0
    },
    viewCount: {
      type: Number,
      default: 0
    },
    favoriteCount: {
      type: Number,
      default: 0
    }
  }
}, {
  timestamps: true
});

// Create geospatial index for location-based queries
listingSchema.index({ 'location.coordinates': '2dsphere' });

// Index for search queries
listingSchema.index({ 
  title: 'text', 
  description: 'text',
  'location.city': 'text',
  'location.state': 'text',
  'location.country': 'text'
});

// Index for filtering
listingSchema.index({ propertyType: 1, roomType: 1, 'pricing.basePrice': 1 });
listingSchema.index({ status: 1, createdAt: -1 });

// Calculate average rating when reviews are updated
listingSchema.methods.calculateAverageRating = function() {
  if (this.reviews.length === 0) {
    this.statistics.averageRating = 0;
    this.statistics.totalReviews = 0;
    return;
  }

  const totalRating = this.reviews.reduce((sum, review) => sum + review.rating.overall, 0);
  this.statistics.averageRating = Math.round((totalRating / this.reviews.length) * 10) / 10;
  this.statistics.totalReviews = this.reviews.length;
};

// Update statistics
listingSchema.methods.updateStatistics = function() {
  this.calculateAverageRating();
  return this.save();
};

// Check if listing is available for given dates
listingSchema.methods.isAvailable = function(checkIn, checkOut) {
  const checkInDate = new Date(checkIn);
  const checkOutDate = new Date(checkOut);
  
  // Check against blocked dates
  return !this.availability.blockedDates.some(blocked => {
    const blockedStart = new Date(blocked.startDate);
    const blockedEnd = new Date(blocked.endDate);
    
    return (checkInDate >= blockedStart && checkInDate <= blockedEnd) ||
           (checkOutDate >= blockedStart && checkOutDate <= blockedEnd) ||
           (checkInDate <= blockedStart && checkOutDate >= blockedEnd);
  });
};

module.exports = mongoose.model('Listing', listingSchema);