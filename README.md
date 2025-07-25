# 🏠 StayFinder - Airbnb Clone

A full-stack web application for property listings and bookings, built with modern technologies including React, Node.js, MongoDB, and Clerk authentication.

![StayFinder](https://img.shields.io/badge/StayFinder-v1.0.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)
![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)
![React](https://img.shields.io/badge/React-18.2+-blue.svg)

## 🌟 Features

### 🏡 Property Management
- **Property Listings**: Create, edit, and manage property listings
- **Image Upload**: Multiple property images with Cloudinary integration
- **Property Details**: Comprehensive property information and amenities
- **Search & Filter**: Advanced search with location, dates, and price filters
- **Interactive Maps**: Property locations with Leaflet integration

### 👥 User Management
- **Authentication**: Secure authentication with Clerk
- **User Profiles**: Comprehensive user profiles and preferences
- **Host Dashboard**: Dedicated dashboard for property hosts
- **Guest Experience**: Streamlined booking experience for guests
- **Role Management**: Support for guests, hosts, and admins

### 📅 Booking System
- **Real-time Availability**: Live booking calendar
- **Payment Integration**: Secure payment processing
- **Booking Management**: View and manage bookings
- **Email Notifications**: Automated booking confirmations
- **Reviews & Ratings**: Post-stay review system

### 🎨 Modern UI/UX
- **Responsive Design**: Mobile-first responsive design
- **Dark/Light Mode**: Theme switching support
- **Smooth Animations**: Framer Motion animations
- **Interactive Components**: Rich user interactions
- **Loading States**: Smooth loading experiences

## 🛠️ Tech Stack

### Frontend
- **React 18.2** - Modern React with hooks
- **Vite** - Fast build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **React Router DOM** - Client-side routing
- **React Query** - Server state management
- **Framer Motion** - Animation library
- **React Hook Form** - Form management
- **Leaflet & React Leaflet** - Interactive maps
- **Axios** - HTTP client
- **React Hot Toast** - Toast notifications

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **MongoDB & Mongoose** - Database and ODM
- **Clerk** - Authentication and user management
- **Cloudinary** - Image upload and management
- **Nodemailer** - Email notifications
- **Redis** - Caching and session management
- **JWT** - Token-based authentication
- **Express Rate Limit** - API rate limiting
- **Helmet** - Security middleware

### Development Tools
- **Concurrently** - Run multiple npm scripts
- **Nodemon** - Development auto-restart
- **Jest** - Testing framework
- **ESLint** - Code linting
- **Prettier** - Code formatting

## 🚀 Quick Start

### Prerequisites
- **Node.js** (v18 or higher)
- **MongoDB** (local or cloud instance)
- **Git** for version control
- **npm** or **yarn** package manager

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/stayfinder.git
cd stayfinder
```

### 2. Install Dependencies
```bash
# Install all dependencies (root, backend, and frontend)
npm run install-deps

# Or install manually:
# npm install
# cd backend && npm install
# cd ../frontend && npm install
```

### 3. Environment Setup

#### Backend Environment (`backend/.env`)
```env
# Server Configuration
NODE_ENV=development
PORT=5000

# Database
MONGODB_URI=mongodb://localhost:27017/stayfinder

# Clerk Authentication
CLERK_SECRET_KEY=your_clerk_secret_key
CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_JWT_KEY=your_clerk_jwt_key

# Email Configuration
EMAIL_FROM=noreply@stayfinder.com
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-email-password

# Cloudinary (Image Upload)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Redis (Optional - for caching)
REDIS_URL=redis://localhost:6379

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX=100
```

#### Frontend Environment (`frontend/.env`)
```env
# API Configuration
VITE_API_URL=http://localhost:5000/api

# Clerk Authentication
VITE_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key

# Google Maps (Optional)
VITE_GOOGLE_MAPS_API_KEY=your_google_maps_api_key

# App Configuration
VITE_APP_NAME=StayFinder
VITE_APP_URL=http://localhost:3000
```

### 4. Database Setup
```bash
# Start MongoDB (if running locally)
mongod

# Seed the database with sample data
cd backend
npm run seed
```

### 5. Start Development Servers
```bash
# Start both backend and frontend concurrently
npm run dev

# Or start individually:
# Backend: npm run server
# Frontend: npm run client
```

### 6. Access the Application
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **API Documentation**: http://localhost:5000/api/docs

## 📚 Setup Guides

For detailed setup instructions for external services:

- **[🔐 Clerk Authentication Setup](./CLERK_SETUP_GUIDE.md)**
- **[📧 Email Configuration Setup](./EMAIL_SETUP_GUIDE.md)**
- **[🗺️ Maps Integration Setup](./MAPS_SETUP_GUIDE.md)**

## 🏗️ Project Structure

```
stayfinder/
├── backend/                 # Node.js/Express API
│   ├── src/
│   │   ├── config/         # Database and app configuration
│   │   ├── middleware/     # Express middleware
│   │   ├── models/         # Mongoose models
│   │   ├── routes/         # API routes
│   │   ├── utils/          # Utility functions
│   │   └── server.js       # Express server setup
│   ├── .env.example        # Environment variables template
│   └── package.json
├── frontend/               # React/Vite application
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── pages/          # Page components
│   │   ├── services/       # API services
│   │   ├── contexts/       # React contexts
│   │   ├── utils/          # Utility functions
│   │   └── App.jsx         # Main App component
│   ├── public/             # Static assets
│   └── package.json
├── docs/                   # Documentation
├── .gitignore
├── package.json            # Root package.json
└── README.md
```

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/profile` - Update user profile

### Listings
- `GET /api/listings` - Get all listings (with filters)
- `GET /api/listings/:id` - Get single listing
- `POST /api/listings` - Create new listing (host only)
- `PUT /api/listings/:id` - Update listing (host only)
- `DELETE /api/listings/:id` - Delete listing (host only)

### Bookings
- `GET /api/bookings` - Get user bookings
- `POST /api/bookings` - Create new booking
- `GET /api/bookings/:id` - Get booking details
- `PUT /api/bookings/:id` - Update booking
- `DELETE /api/bookings/:id` - Cancel booking

### Users
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile
- `GET /api/users/favorites` - Get user favorites
- `POST /api/users/favorites/:listingId` - Add to favorites

## 🧪 Testing

```bash
# Run backend tests
cd backend
npm test

# Run tests in watch mode
npm run test:watch

# Run frontend tests
cd frontend
npm test
```

## 🏗️ Building for Production

```bash
# Build frontend
npm run build

# Start production server
npm start
```

## 📦 Deployment

### Frontend (Vercel/Netlify)
1. Connect your repository to Vercel/Netlify
2. Set environment variables in the dashboard
3. Deploy automatically on git push

### Backend (Heroku/Railway/DigitalOcean)
1. Create a new app on your hosting platform
2. Set environment variables
3. Connect your repository
4. Deploy

### Database (MongoDB Atlas)
1. Create a MongoDB Atlas cluster
2. Update `MONGODB_URI` in your environment variables
3. Configure network access and database users

## 🤝 Contributing

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/amazing-feature`)
3. **Commit** your changes (`git commit -m 'Add amazing feature'`)
4. **Push** to the branch (`git push origin feature/amazing-feature`)
5. **Open** a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Authors

- **StayFinder Team** - *Initial work*

## 🙏 Acknowledgments

- **Airbnb** for inspiration
- **Clerk** for authentication services
- **Cloudinary** for image management
- **MongoDB** for database solutions
- **React & Node.js** communities

## 📞 Support

If you have any questions or need help:

1. Check the setup guides in the `/docs` folder
2. Create an issue on GitHub
3. Join our Discord community
4. Email us at support@stayfinder.com

---

**Happy Coding! 🚀**

Made with ❤️ by the StayFinder Team