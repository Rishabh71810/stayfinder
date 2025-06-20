const mongoose = require('mongoose');
const User = require('../models/User');
const Listing = require('../models/Listing');
const Booking = require('../models/Booking');
require('dotenv').config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/stayfinder');
    console.log('📦 Database connected for seeding...');
  } catch (error) {
    console.error('Database connection error:', error);
    process.exit(1);
  }
};

const seedUsers = async () => {
  const users = [
    {
      name: 'John Doe',
      email: 'john@example.com',
      password: 'password123',
      role: 'host',
      bio: 'Experienced host with a passion for hospitality. I love meeting new people and sharing my local knowledge.',
      phone: '+1-555-123-4567',
      hostProfile: {
        isHost: true,
        hostSince: new Date('2020-01-15'),
        responseRate: 95,
        responseTime: 'within an hour',
        superhost: true
      }
    },
    {
      name: 'Jane Smith',
      email: 'jane@example.com',
      password: 'password123',
      role: 'host',
      bio: 'Welcome to my beautiful home! I enjoy hosting guests and making sure they have an amazing stay.',
      phone: '+1-555-987-6543',
      hostProfile: {
        isHost: true,
        hostSince: new Date('2019-06-20'),
        responseRate: 98,
        responseTime: 'within a few hours',
        superhost: true
      }
    },
    {
      name: 'Alice Johnson',
      email: 'alice@example.com',
      password: 'password123',
      role: 'guest',
      bio: 'Travel enthusiast who loves exploring new places and meeting locals.',
      phone: '+1-555-456-7890'
    },
    {
      name: 'Bob Wilson',
      email: 'bob@example.com',
      password: 'password123',
      role: 'host',
      bio: 'Property investor and host. I maintain high standards for cleanliness and guest satisfaction.',
      phone: '+1-555-321-0987',
      hostProfile: {
        isHost: true,
        hostSince: new Date('2021-03-10'),
        responseRate: 92,
        responseTime: 'within a day'
      }
    }
  ];

  await User.deleteMany({});
  const createdUsers = await User.create(users);
  console.log('✅ Users seeded successfully');
  return createdUsers;
};

const seedListings = async (users) => {
  const listings = [
    {
      title: 'Modern Downtown Apartment with City Views',
      description: 'Beautiful modern apartment in the heart of downtown with stunning city views. Perfect for business travelers and tourists alike. The space features floor-to-ceiling windows, modern amenities, and is within walking distance of restaurants, shops, and public transportation.',
      host: users[0]._id,
      images: [
        {
          url: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800',
          caption: 'Living room with city view',
          isMain: true
        },
        {
          url: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800',
          caption: 'Modern kitchen'
        },
        {
          url: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=800',
          caption: 'Bedroom'
        }
      ],
      propertyType: 'apartment',
      roomType: 'entire_place',
      location: {
        address: '123 Main Street',
        city: 'New York',
        state: 'NY',
        country: 'United States',
        zipCode: '10001',
        coordinates: {
          type: 'Point',
          coordinates: [-74.0059, 40.7128]
        }
      },
      capacity: {
        guests: 4,
        bedrooms: 2,
        beds: 2,
        bathrooms: 2
      },
      amenities: ['wifi', 'kitchen', 'air_conditioning', 'heating', 'tv', 'elevator'],
      pricing: {
        basePrice: 150,
        cleaningFee: 25,
        serviceFee: 10
      },
      status: 'active'
    },
    {
      title: 'Cozy Beachfront Villa with Ocean Views',
      description: 'Escape to this stunning beachfront villa with panoramic ocean views. Perfect for families and groups looking for a relaxing getaway. The villa features a private beach access, outdoor deck, and all the amenities you need for a perfect vacation.',
      host: users[1]._id,
      images: [
        {
          url: 'https://images.unsplash.com/photo-1505142468610-359e7d316be0?w=800',
          caption: 'Villa exterior with ocean view',
          isMain: true
        },
        {
          url: 'https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?w=800',
          caption: 'Outdoor deck'
        },
        {
          url: 'https://images.unsplash.com/photo-1540518614846-7eded47432f5?w=800',
          caption: 'Master bedroom'
        }
      ],
      propertyType: 'villa',
      roomType: 'entire_place',
      location: {
        address: '456 Ocean Drive',
        city: 'Miami',
        state: 'FL',
        country: 'United States',
        zipCode: '33139',
        coordinates: {
          type: 'Point',
          coordinates: [-80.1918, 25.7617]
        }
      },
      capacity: {
        guests: 8,
        bedrooms: 4,
        beds: 4,
        bathrooms: 3
      },
      amenities: ['wifi', 'kitchen', 'air_conditioning', 'pool', 'parking', 'balcony', 'garden'],
      pricing: {
        basePrice: 350,
        cleaningFee: 75,
        serviceFee: 25
      },
      status: 'active'
    },
    {
      title: 'Charming Mountain Cabin Retreat',
      description: 'Nestled in the mountains, this charming cabin offers the perfect retreat from city life. Surrounded by nature, with hiking trails nearby and a cozy fireplace for cold evenings. Ideal for couples or small families seeking peace and tranquility.',
      host: users[3]._id,
      images: [
        {
          url: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=800',
          caption: 'Mountain cabin exterior',
          isMain: true
        },
        {
          url: 'https://images.unsplash.com/photo-1519999482648-25049ddd37b1?w=800',
          caption: 'Cozy living room with fireplace'
        },
        {
          url: 'https://images.unsplash.com/photo-1524634126442-357e0eac3c14?w=800',
          caption: 'Mountain view from deck'
        }
      ],
      propertyType: 'cabin',
      roomType: 'entire_place',
      location: {
        address: '789 Mountain Trail',
        city: 'Aspen',
        state: 'CO',
        country: 'United States',
        zipCode: '81611',
        coordinates: {
          type: 'Point',
          coordinates: [-106.8175, 39.1911]
        }
      },
      capacity: {
        guests: 6,
        bedrooms: 3,
        beds: 3,
        bathrooms: 2
      },
      amenities: ['wifi', 'kitchen', 'heating', 'fireplace', 'parking', 'garden'],
      pricing: {
        basePrice: 200,
        cleaningFee: 50,
        serviceFee: 15
      },
      status: 'active'
    }
  ];

  await Listing.deleteMany({});
  const createdListings = await Listing.create(listings);
  console.log('✅ Listings seeded successfully');
  return createdListings;
};

const seedBookings = async (users, listings) => {
  const bookings = [
    {
      listing: listings[0]._id,
      guest: users[2]._id,
      host: users[0]._id,
      dates: {
        checkIn: new Date('2024-03-15'),
        checkOut: new Date('2024-03-18'),
        nights: 3
      },
      guests: {
        adults: 2,
        children: 0,
        infants: 0,
        pets: 0,
        total: 2
      },
      pricing: {
        basePrice: 150,
        nights: 3,
        subtotal: 450,
        cleaningFee: 25,
        serviceFee: 63,
        taxes: 36,
        totalAmount: 574
      },
      payment: {
        method: 'stripe',
        status: 'completed'
      },
      status: 'confirmed'
    }
  ];

  await Booking.deleteMany({});
  await Booking.create(bookings);
  console.log('✅ Bookings seeded successfully');
};

const seedData = async () => {
  try {
    await connectDB();
    
    console.log('🌱 Starting database seeding...');
    
    const users = await seedUsers();
    const listings = await seedListings(users);
    await seedBookings(users, listings);
    
    console.log('🎉 Database seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
};

// Run seeding if called directly
if (require.main === module) {
  seedData();
}

module.exports = seedData; 