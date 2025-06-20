# 🗺️ Google Maps API Setup Guide for StayFinder

## 📋 Overview
This guide will help you set up Google Maps integration for StayFinder, enabling property location display and interactive maps in the application.

## 🔑 Step 1: Get Google Maps API Key

### Create Google Cloud Project
1. **Go to**: [Google Cloud Console](https://console.cloud.google.com/)
2. **Sign in** with your Google account
3. **Create a new project** or select an existing one
4. **Project Name**: "StayFinder Maps" (or your preferred name)

### Enable Maps JavaScript API
1. **Navigate to**: APIs & Services → Library
2. **Search for**: "Maps JavaScript API"
3. **Click**: "Maps JavaScript API" from results
4. **Click**: "Enable"

### Enable Additional APIs (Optional)
For enhanced functionality, also enable:
- **Places API** (for location search and autocomplete)
- **Geocoding API** (for address to coordinates conversion)
- **Directions API** (for route planning)

### Create API Key
1. **Navigate to**: APIs & Services → Credentials
2. **Click**: "+ CREATE CREDENTIALS" → "API key"
3. **Copy** the generated API key
4. **Click**: "RESTRICT KEY" (recommended for security)

### Restrict API Key (Security Best Practice)
1. **Application restrictions**:
   - Select "HTTP referrers (web sites)"
   - Add your domains:
     - `localhost:3000/*` (for development)
     - `yourdomain.com/*` (for production)

2. **API restrictions**:
   - Select "Restrict key"
   - Choose the APIs you enabled:
     - Maps JavaScript API
     - Places API (if enabled)
     - Geocoding API (if enabled)

3. **Click**: "Save"

## 🛠️ Step 2: Configure Environment Variables

### Create Frontend Environment File
Create `frontend/.env` with:

```env
# API Configuration
VITE_API_URL=http://localhost:5000/api

# Clerk Authentication
VITE_CLERK_PUBLISHABLE_KEY=pk_test_YOUR_PUBLISHABLE_KEY_HERE

# Google Maps API Key
VITE_GOOGLE_MAPS_API_KEY=AIzaSyC-YOUR-ACTUAL-GOOGLE-MAPS-API-KEY-HERE

# App Configuration
VITE_APP_NAME=StayFinder
VITE_APP_URL=http://localhost:3000
VITE_NODE_ENV=development
```

**⚠️ Important Notes:**
- Use the `VITE_` prefix for Vite environment variables
- Replace `YOUR-ACTUAL-GOOGLE-MAPS-API-KEY-HERE` with your real API key
- Keep this file secure and never commit it to version control

### Environment File Security
Add to your `.gitignore`:
```
# Environment files
.env
.env.local
.env.development
.env.production
```

## 📦 Step 3: Verify Dependencies

The required dependencies are already included in `package.json`:
```json
{
  "dependencies": {
    "react": "^18.2.0",
    "lucide-react": "^0.294.0"
  }
}
```

No additional packages are needed as we're using the native Google Maps JavaScript API.

## 🎨 Step 4: Available Map Components

### PropertyMap Component
Shows a single property location with custom markers and info windows.

**Usage:**
```jsx
import PropertyMap from '../components/UI/PropertyMap'

<PropertyMap 
  listing={propertyData} 
  height="400px" 
  showControls={true} 
/>
```

**Props:**
- `listing`: Property object with location data
- `height`: Map container height (default: '400px')
- `showControls`: Show map controls and buttons (default: true)

### PropertyListMap Component
Displays multiple properties on a single map (for search results).

**Usage:**
```jsx
import PropertyListMap from '../components/UI/PropertyListMap'

<PropertyListMap 
  listings={propertiesArray} 
  height="500px"
  onMarkerClick={handleMarkerClick} 
/>
```

**Props:**
- `listings`: Array of property objects
- `height`: Map container height (default: '500px')  
- `onMarkerClick`: Callback function when marker is clicked

## 🏗️ Step 5: Property Data Structure

For maps to work correctly, your property data should include location coordinates:

```javascript
const propertyExample = {
  _id: 'property-id',
  title: 'Amazing Property',
  location: {
    city: 'New York',
    state: 'NY', 
    country: 'United States',
    address: '123 Main Street',
    coordinates: {
      type: 'Point',
      coordinates: [-74.0060, 40.7128] // [longitude, latitude]
    }
  },
  pricing: { basePrice: 150 },
  images: [{ url: 'image-url', isMain: true }],
  // ... other property data
}
```

## 🚀 Step 6: Test the Integration

### Development Testing
1. **Start the development server**:
   ```bash
   cd frontend
   npm run dev
   ```

2. **Visit**: http://localhost:3000

3. **Test map features**:
   - Navigate to a property details page
   - Check if the map loads correctly
   - Verify marker placement and info windows
   - Test map controls (zoom, pan, etc.)

### Search Results Map Testing
1. **Go to search results page**
2. **Toggle between List and Map view**
3. **Verify multiple properties show on map**
4. **Test marker interactions**

## 🔧 Step 7: Troubleshooting

### Map Not Loading
1. **Check browser console** for errors
2. **Verify API key** is correct and unrestricted
3. **Check network requests** in Developer Tools
4. **Ensure domains are whitelisted** in Google Cloud Console

### Common Error Messages
- `"RefererNotAllowedMapError"`: Add your domain to API key restrictions
- `"InvalidKeyMapError"`: Check if API key is correct and APIs are enabled
- `"QuotaExceededError"`: Check your Google Cloud billing and quotas

### API Key Issues
1. **Billing account**: Ensure you have a valid billing account linked
2. **API quotas**: Check your daily usage limits
3. **Key restrictions**: Verify HTTP referrer settings

## 💰 Step 8: Pricing & Quotas

### Free Tier
Google Maps provides a generous free tier:
- **$200 monthly credit**
- **28,500+ map loads per month** (free)
- **100,000+ geocoding requests per month** (free)

### Cost Optimization
1. **Implement map lazy loading**
2. **Cache geocoding results**
3. **Use appropriate zoom levels**
4. **Implement map clustering for multiple markers**

## 🔒 Step 9: Security Best Practices

### API Key Security
1. **Never expose API keys** in client-side code repositories
2. **Use HTTP referrer restrictions**
3. **Monitor usage** in Google Cloud Console
4. **Rotate keys periodically**

### Environment Security
```bash
# Good: Environment variable
VITE_GOOGLE_MAPS_API_KEY=your-key-here

# Bad: Hardcoded in source
const API_KEY = 'AIzaSyC...' // Never do this!
```

## 📊 Step 10: Monitoring & Analytics

### Google Cloud Monitoring
1. **Navigate to**: Google Cloud Console → APIs & Services → Dashboard
2. **Monitor**: API usage, errors, and latency
3. **Set up alerts** for quota limits

### Application Monitoring
Track map performance in your application:
- Map load times
- User interactions with maps
- Error rates and fallbacks

## 🌐 Step 11: Production Deployment

### Environment Variables
Set production environment variables:
```env
VITE_GOOGLE_MAPS_API_KEY=your-production-api-key
VITE_API_URL=https://your-api-domain.com/api
```

### Domain Restrictions
Update API key restrictions with production domains:
- `yourdomain.com/*`
- `www.yourdomain.com/*`

## ✅ Step 12: Testing Checklist

- [ ] Google Maps API key is configured
- [ ] Maps load correctly on property details pages
- [ ] Custom markers display with property information
- [ ] Info windows show correct property data
- [ ] Map controls work (zoom, pan, satellite view)
- [ ] Search results map view toggles correctly
- [ ] Multiple properties display on search map
- [ ] Map is responsive on mobile devices
- [ ] Error handling works when API key is missing
- [ ] Performance is acceptable on slower connections

## 🆘 Support & Resources

### Documentation
- [Google Maps JavaScript API](https://developers.google.com/maps/documentation/javascript)
- [Places API](https://developers.google.com/maps/documentation/places/web-service)
- [Geocoding API](https://developers.google.com/maps/documentation/geocoding)

### Community
- [Stack Overflow](https://stackoverflow.com/questions/tagged/google-maps-api-3)
- [Google Maps Platform Community](https://developers.google.com/maps/premium/support)

### Sample Code
Check the `frontend/src/components/UI/PropertyMap.jsx` file for complete implementation examples.

---

**🎉 Congratulations!** You now have fully functional Google Maps integration in your StayFinder application. Users can view property locations, interact with maps, and enjoy a rich geographical experience while browsing accommodations. 