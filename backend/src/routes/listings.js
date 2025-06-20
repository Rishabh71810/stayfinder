const express = require('express');
const { body, validationResult } = require('express-validator');
const Listing = require('../models/Listing');
const { protect, authorize, optionalAuth } = require('../middleware/auth');

const router = express.Router();

// @desc    Get all listings with search and filtering
// @route   GET /api/listings
// @access  Public
router.get('/', optionalAuth, async (req, res) => {
  try {
    let query = {};
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 12;
    const skip = (page - 1) * limit;

    // Search by location
    if (req.query.location) {
      query.$or = [
        { 'location.city': { $regex: req.query.location, $options: 'i' } },
        { 'location.state': { $regex: req.query.location, $options: 'i' } },
        { 'location.country': { $regex: req.query.location, $options: 'i' } },
        { 'location.address': { $regex: req.query.location, $options: 'i' } }
      ];
    }

    // Text search
    if (req.query.search) {
      query.$text = { $search: req.query.search };
    }

    // Property type filter
    if (req.query.propertyType) {
      query.propertyType = req.query.propertyType;
    }

    // Room type filter
    if (req.query.roomType) {
      query.roomType = req.query.roomType;
    }

    // Price range filter
    if (req.query.minPrice || req.query.maxPrice) {
      query['pricing.basePrice'] = {};
      if (req.query.minPrice) {
        query['pricing.basePrice'].$gte = parseInt(req.query.minPrice);
      }
      if (req.query.maxPrice) {
        query['pricing.basePrice'].$lte = parseInt(req.query.maxPrice);
      }
    }

    // Guests filter
    if (req.query.guests) {
      query['capacity.guests'] = { $gte: parseInt(req.query.guests) };
    }

    // Bedrooms filter
    if (req.query.bedrooms) {
      query['capacity.bedrooms'] = { $gte: parseInt(req.query.bedrooms) };
    }

    // Bathrooms filter
    if (req.query.bathrooms) {
      query['capacity.bathrooms'] = { $gte: parseInt(req.query.bathrooms) };
    }

    // Amenities filter
    if (req.query.amenities) {
      const amenities = req.query.amenities.split(',');
      query.amenities = { $all: amenities };
    }

    // Date availability filter
    if (req.query.checkIn && req.query.checkOut) {
      const checkIn = new Date(req.query.checkIn);
      const checkOut = new Date(req.query.checkOut);
      
      query['availability.blockedDates'] = {
        $not: {
          $elemMatch: {
            $or: [
              {
                startDate: { $lte: checkIn },
                endDate: { $gte: checkIn }
              },
              {
                startDate: { $lte: checkOut },
                endDate: { $gte: checkOut }
              },
              {
                startDate: { $gte: checkIn },
                endDate: { $lte: checkOut }
              }
            ]
          }
        }
      };
    }

    // Geographic search (near coordinates)
    if (req.query.lat && req.query.lng) {
      const lat = parseFloat(req.query.lat);
      const lng = parseFloat(req.query.lng);
      const radius = parseFloat(req.query.radius) || 10; // 10km default

      query['location.coordinates'] = {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [lng, lat]
          },
          $maxDistance: radius * 1000 // Convert km to meters
        }
      };
    }

    // Only show active listings
    query.status = 'active';

    // Sort options
    let sort = {};
    switch (req.query.sort) {
      case 'price_asc':
        sort = { 'pricing.basePrice': 1 };
        break;
      case 'price_desc':
        sort = { 'pricing.basePrice': -1 };
        break;
      case 'rating':
        sort = { 'statistics.averageRating': -1 };
        break;
      case 'newest':
        sort = { createdAt: -1 };
        break;
      default:
        sort = { createdAt: -1 };
    }

    const listings = await Listing.find(query)
      .populate('host', 'name avatar hostProfile')
      .sort(sort)
      .skip(skip)
      .limit(limit);

    const total = await Listing.countDocuments(query);

    // Update view count for listings
    if (listings.length > 0) {
      await Listing.updateMany(
        { _id: { $in: listings.map(l => l._id) } },
        { $inc: { 'statistics.viewCount': 1 } }
      );
    }

    res.status(200).json({
      success: true,
      count: listings.length,
      total,
      pages: Math.ceil(total / limit),
      currentPage: page,
      listings
    });
  } catch (error) {
    console.error('Get listings error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error getting listings'
    });
  }
});

// @desc    Get single listing
// @route   GET /api/listings/:id
// @access  Public
router.get('/:id', optionalAuth, async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id)
      .populate('host', 'name avatar hostProfile bio phone email createdAt')
      .populate({
        path: 'reviews.guest',
        select: 'name avatar'
      });

    if (!listing) {
      return res.status(404).json({
        success: false,
        message: 'Listing not found'
      });
    }

    // Update view count
    listing.statistics.viewCount += 1;
    await listing.save();

    res.status(200).json({
      success: true,
      listing
    });
  } catch (error) {
    console.error('Get listing error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error getting listing'
    });
  }
});

// @desc    Create new listing
// @route   POST /api/listings
// @access  Private (Hosts only)
router.post('/', protect, authorize('host', 'admin'), [
  body('title').trim().isLength({ min: 5, max: 100 }).withMessage('Title must be between 5 and 100 characters'),
  body('description').trim().isLength({ min: 50, max: 2000 }).withMessage('Description must be between 50 and 2000 characters'),
  body('propertyType').isIn(['apartment', 'house', 'villa', 'condo', 'townhouse', 'loft', 'cabin', 'cottage', 'castle', 'boat', 'camper', 'treehouse', 'other']).withMessage('Invalid property type'),
  body('roomType').isIn(['entire_place', 'private_room', 'shared_room']).withMessage('Invalid room type'),
  body('pricing.basePrice').isFloat({ min: 1 }).withMessage('Base price must be at least $1'),
  body('capacity.guests').isInt({ min: 1 }).withMessage('Must accommodate at least 1 guest'),
  body('capacity.bedrooms').isInt({ min: 0 }).withMessage('Invalid number of bedrooms'),
  body('capacity.beds').isInt({ min: 1 }).withMessage('Must have at least 1 bed'),
  body('capacity.bathrooms').isFloat({ min: 0.5 }).withMessage('Must have at least 0.5 bathroom')
], async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    // Add host to listing
    req.body.host = req.user.id;

    // Create listing
    const listing = await Listing.create(req.body);

    await listing.populate('host', 'name avatar hostProfile');

    res.status(201).json({
      success: true,
      message: 'Listing created successfully',
      listing
    });
  } catch (error) {
    console.error('Create listing error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error creating listing'
    });
  }
});

// @desc    Update listing
// @route   PUT /api/listings/:id
// @access  Private (Owner only)
router.put('/:id', protect, async (req, res) => {
  try {
    let listing = await Listing.findById(req.params.id);

    if (!listing) {
      return res.status(404).json({
        success: false,
        message: 'Listing not found'
      });
    }

    // Check if user owns the listing
    if (listing.host.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this listing'
      });
    }

    // Don't allow updating host
    delete req.body.host;

    listing = await Listing.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('host', 'name avatar hostProfile');

    res.status(200).json({
      success: true,
      message: 'Listing updated successfully',
      listing
    });
  } catch (error) {
    console.error('Update listing error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error updating listing'
    });
  }
});

// @desc    Delete listing
// @route   DELETE /api/listings/:id
// @access  Private (Owner only)
router.delete('/:id', protect, async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id);

    if (!listing) {
      return res.status(404).json({
        success: false,
        message: 'Listing not found'
      });
    }

    // Check if user owns the listing
    if (listing.host.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this listing'
      });
    }

    await listing.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Listing deleted successfully'
    });
  } catch (error) {
    console.error('Delete listing error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error deleting listing'
    });
  }
});

// @desc    Get host's listings
// @route   GET /api/listings/host/my-listings
// @access  Private (Hosts only)
router.get('/host/my-listings', protect, authorize('host', 'admin'), async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const query = { host: req.user.id };
    
    // Status filter
    if (req.query.status) {
      query.status = req.query.status;
    }

    const listings = await Listing.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Listing.countDocuments(query);

    res.status(200).json({
      success: true,
      count: listings.length,
      total,
      pages: Math.ceil(total / limit),
      currentPage: page,
      listings
    });
  } catch (error) {
    console.error('Get host listings error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error getting your listings'
    });
  }
});

// @desc    Add review to listing
// @route   POST /api/listings/:id/reviews
// @access  Private
router.post('/:id/reviews', protect, [
  body('rating.overall').isInt({ min: 1, max: 5 }).withMessage('Overall rating must be between 1 and 5'),
  body('comment').optional().isLength({ max: 1000 }).withMessage('Comment cannot exceed 1000 characters')
], async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const listing = await Listing.findById(req.params.id);

    if (!listing) {
      return res.status(404).json({
        success: false,
        message: 'Listing not found'
      });
    }

    // Check if user has already reviewed this listing
    const existingReview = listing.reviews.find(
      review => review.guest.toString() === req.user.id
    );

    if (existingReview) {
      return res.status(400).json({
        success: false,
        message: 'You have already reviewed this listing'
      });
    }

    // Add review
    const review = {
      guest: req.user.id,
      rating: req.body.rating,
      comment: req.body.comment,
      booking: req.body.booking // Optional booking reference
    };

    listing.reviews.push(review);
    await listing.updateStatistics();

    await listing.populate({
      path: 'reviews.guest',
      select: 'name avatar'
    });

    res.status(201).json({
      success: true,
      message: 'Review added successfully',
      review: listing.reviews[listing.reviews.length - 1]
    });
  } catch (error) {
    console.error('Add review error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error adding review'
    });
  }
});

// @desc    Get similar listings
// @route   GET /api/listings/:id/similar
// @access  Public
router.get('/:id/similar', async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id);

    if (!listing) {
      return res.status(404).json({
        success: false,
        message: 'Listing not found'
      });
    }

    // Find similar listings based on location, property type, and price range
    const priceRange = listing.pricing.basePrice * 0.3; // 30% price range
    
    const similarListings = await Listing.find({
      _id: { $ne: listing._id },
      status: 'active',
      propertyType: listing.propertyType,
      'location.city': listing.location.city,
      'pricing.basePrice': {
        $gte: listing.pricing.basePrice - priceRange,
        $lte: listing.pricing.basePrice + priceRange
      }
    })
    .populate('host', 'name avatar hostProfile')
    .limit(6)
    .sort({ 'statistics.averageRating': -1 });

    res.status(200).json({
      success: true,
      count: similarListings.length,
      listings: similarListings
    });
  } catch (error) {
    console.error('Get similar listings error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error getting similar listings'
    });
  }
});

module.exports = router;