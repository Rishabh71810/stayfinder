# 🚀 Clerk Setup Guide for StayFinder

## 📋 Prerequisites
- Node.js installed
- MongoDB running
- Git repository cloned

## 🔑 Step 1: Get Clerk API Keys

### Create Clerk Account
1. **Visit**: [https://clerk.com](https://clerk.com)
2. **Click**: "Sign Up" or "Get Started for Free"
3. **Register** with email or OAuth provider

### Create New Application
1. **Click**: "+ Create Application" in Clerk Dashboard
2. **Name**: "StayFinder" (or your preferred name)
3. **Select Sign-in Methods**:
   - ✅ Email & Password
   - ✅ Google OAuth (recommended)
   - ✅ GitHub OAuth (optional)
   - ✅ Phone/SMS (optional)

### Get Your API Keys
In your Clerk Dashboard, go to **"API Keys"** section:

**Frontend (Publishable Key)**:
```
pk_test_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

**Backend (Secret Key)**:
```
sk_test_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

## 🛠️ Step 2: Configure Environment Files

### Frontend Environment (`frontend/.env`)
```env
# API Configuration
VITE_API_URL=http://localhost:5000/api

# Clerk Authentication
VITE_CLERK_PUBLISHABLE_KEY=pk_test_YOUR_PUBLISHABLE_KEY_HERE

# Google Maps (Optional)
VITE_GOOGLE_MAPS_API_KEY=your-google-maps-api-key

# App Configuration
VITE_APP_NAME=StayFinder
VITE_APP_URL=http://localhost:3000
```

### Backend Environment (`backend/.env`)
```env
# Server Configuration
NODE_ENV=development
PORT=5000

# Database
MONGODB_URI=mongodb://localhost:27017/stayfinder

# Clerk Authentication
CLERK_SECRET_KEY=sk_test_YOUR_SECRET_KEY_HERE
CLERK_PUBLISHABLE_KEY=pk_test_YOUR_PUBLISHABLE_KEY_HERE
CLERK_JWT_KEY=your-clerk-jwt-key

# Other configurations...
```

## 🎨 Step 3: Customize Clerk UI (Optional)

### In Clerk Dashboard:
1. Go to **"Customization"** → **"Appearance"**
2. **Theme**: Choose Light/Dark or Custom
3. **Colors**: Match your brand colors
   - Primary: `#2563eb` (StayFinder blue)
   - Background: `#ffffff`
4. **Logo**: Upload your app logo

### Advanced Customization:
```jsx
// In your components
<UserButton 
  appearance={{
    elements: {
      avatarBox: "w-10 h-10",
      userButtonPopoverCard: "bg-white shadow-lg border",
    }
  }}
/>
```

## 👥 Step 4: Configure User Roles

### Set Up Metadata Schema
1. **Clerk Dashboard** → **"Users"** → **"Metadata"**
2. **Add Public Metadata Schema**:
```json
{
  "role": {
    "type": "string",
    "enum": ["guest", "host", "admin"],
    "default": "guest"
  }
}
```

### Update User Roles
```javascript
// In your app, update user role to host:
await clerk.users.updateUserMetadata(userId, {
  publicMetadata: { role: 'host' }
})
```

## 🔒 Step 5: Configure Webhooks (Optional)

### For User Registration Events:
1. **Clerk Dashboard** → **"Webhooks"**
2. **Add Endpoint**: `https://yourapp.com/api/webhooks/clerk`
3. **Select Events**:
   - `user.created`
   - `user.updated`
   - `user.deleted`

### Webhook Handler Example:
```javascript
// backend/src/routes/webhooks.js
app.post('/api/webhooks/clerk', (req, res) => {
  const { type, data } = req.body
  
  switch (type) {
    case 'user.created':
      // Create user profile in your database
      break
    case 'user.updated':
      // Update user profile
      break
  }
  
  res.status(200).send('OK')
})
```

## 💳 Step 6: Payment Configuration

### Enable Payments in Clerk:
1. **Clerk Dashboard** → **"Payments"** (Pro plan required)
2. **Connect Stripe Account**
3. **Configure Payment Methods**

### Or Use Alternative Payment:
```javascript
// Use Stripe directly with Clerk user context
const { user } = useUser()

const handlePayment = async () => {
  // Process payment with user.id as customer reference
}
```

## 🚀 Step 7: Start Your Application

### Install Dependencies:
```bash
# Backend
cd backend
npm install

# Frontend  
cd frontend
npm install
```

### Start Development Servers:
```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
cd frontend
npm run dev
```

## 🔍 Step 8: Test Authentication

### Test Flow:
1. **Visit**: `http://localhost:3000`
2. **Click**: "Sign Up" button
3. **Complete**: Registration process
4. **Verify**: User appears in Clerk Dashboard
5. **Test**: Sign out and sign in

### Update User Role:
1. **Clerk Dashboard** → **"Users"**
2. **Select User** → **"Metadata"**
3. **Add**: `{"role": "host"}` to Public Metadata

## 🛡️ Security Best Practices

### Environment Security:
- ✅ Never commit `.env` files
- ✅ Use different keys for development/production
- ✅ Rotate keys regularly

### Clerk Security Settings:
1. **Dashboard** → **"Security"**
2. **Enable**: Multi-factor authentication
3. **Configure**: Session timeout
4. **Set**: Password requirements

## 📞 Support & Resources

### Clerk Documentation:
- **Main Docs**: [https://clerk.com/docs](https://clerk.com/docs)
- **React Guide**: [https://clerk.com/docs/quickstarts/react](https://clerk.com/docs/quickstarts/react)
- **Node.js Guide**: [https://clerk.com/docs/backend-requests/handling/nodejs](https://clerk.com/docs/backend-requests/handling/nodejs)

### Common Issues:
1. **"Clerk not loaded"** → Check publishable key
2. **Authentication fails** → Verify secret key
3. **CORS errors** → Check domain configuration

### Need Help?
- **Clerk Support**: [https://clerk.com/support](https://clerk.com/support)
- **Community Discord**: [https://clerk.com/discord](https://clerk.com/discord)

---

## 🎉 You're All Set!

Your StayFinder application now uses Clerk for:
- ✅ User authentication & registration
- ✅ Session management
- ✅ Role-based access control
- ✅ Profile management
- ✅ Password reset & security

Happy coding! 🚀 