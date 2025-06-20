# 📧 Email Configuration Setup Guide

## 🚀 Quick Setup with Gmail (Recommended for Development)

### Step 1: Prepare Your Gmail Account
1. **Go to**: [Google Account Settings](https://myaccount.google.com/)
2. **Click**: "Security" in the left sidebar
3. **Enable**: 2-Step Verification (if not already enabled)
4. **Wait**: 5-10 minutes for it to activate

### Step 2: Generate App Password
1. **Go back to**: Security settings
2. **Find**: "2-Step Verification" section
3. **Click**: "App passwords"
4. **Select**: 
   - App: "Mail"
   - Device: "Other" → Type "StayFinder"
5. **Copy**: The 16-character password (e.g., `abcd efgh ijkl mnop`)

### Step 3: Configure Your Backend
Create/update `backend/.env`:

```env
# Email Configuration (Gmail)
EMAIL_FROM=your-email@gmail.com
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=abcd efgh ijkl mnop
```

**⚠️ Important**: Use the 16-character app password, NOT your regular Gmail password!

---

## 🏢 Production Email Services

### 📨 SendGrid (Best for Production)

#### Why SendGrid?
- ✅ 100 emails/day free
- ✅ High deliverability rates
- ✅ Analytics and tracking
- ✅ Professional email templates

#### Setup:
1. **Sign up**: [https://app.sendgrid.com/signup](https://app.sendgrid.com/signup)
2. **Verify email** and complete onboarding
3. **Get API Key**:
   - Settings → API Keys → Create API Key
   - Name: "StayFinder"
   - Permissions: "Full Access"
4. **Configure**:

```env
# SendGrid Configuration
EMAIL_FROM=noreply@yourdomain.com
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_USER=apikey
SMTP_PASS=SG.your-actual-sendgrid-api-key-here
```

### 📬 Mailgun (Developer Favorite)

#### Why Mailgun?
- ✅ 5,000 emails/month free (3 months)
- ✅ Powerful API
- ✅ Email validation
- ✅ Detailed analytics

#### Setup:
1. **Sign up**: [https://signup.mailgun.com/new/signup](https://signup.mailgun.com/new/signup)
2. **Add domain** (or use sandbox domain for testing)
3. **Get credentials**:
   - Sending → Domain settings → SMTP credentials

```env
# Mailgun Configuration
EMAIL_FROM=noreply@your-sandbox-domain.mailgun.org
SMTP_HOST=smtp.mailgun.org
SMTP_PORT=587
SMTP_USER=postmaster@your-sandbox-domain.mailgun.org
SMTP_PASS=your-mailgun-smtp-password
```

### 📧 Resend (Modern Alternative)

#### Why Resend?
- ✅ 3,000 emails/month free
- ✅ Modern developer experience
- ✅ React email templates
- ✅ Built for developers

#### Setup:
1. **Sign up**: [https://resend.com](https://resend.com)
2. **Get API Key**: API Keys → Create API Key
3. **Configure**:

```env
# Resend Configuration (using API, not SMTP)
RESEND_API_KEY=re_your-resend-api-key
EMAIL_FROM=noreply@yourdomain.com
```

---

## 🔧 Backend Email Service Implementation

### Update your email service (`backend/src/utils/email.js`):

```javascript
const nodemailer = require('nodemailer')

// Create transporter based on environment
const createTransporter = () => {
  if (process.env.RESEND_API_KEY) {
    // Resend configuration
    return nodemailer.createTransporter({
      host: 'smtp.resend.com',
      port: 587,
      auth: {
        user: 'resend',
        pass: process.env.RESEND_API_KEY
      }
    })
  }
  
  // Traditional SMTP configuration
  return nodemailer.createTransporter({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    }
  })
}

const sendEmail = async (options) => {
  const transporter = createTransporter()
  
  const message = {
    from: process.env.EMAIL_FROM,
    to: options.email,
    subject: options.subject,
    html: options.html,
    text: options.text
  }
  
  const info = await transporter.sendMail(message)
  console.log('Email sent:', info.messageId)
  return info
}

module.exports = { sendEmail }
```

---

## 📋 Testing Your Email Configuration

### Test Script (`backend/test-email.js`):

```javascript
require('dotenv').config()
const { sendEmail } = require('./src/utils/email')

const testEmail = async () => {
  try {
    await sendEmail({
      email: 'your-test-email@gmail.com',
      subject: 'StayFinder Email Test',
      html: '<h1>Email working!</h1><p>Your email configuration is working correctly.</p>',
      text: 'Email working! Your email configuration is working correctly.'
    })
    console.log('✅ Email sent successfully!')
  } catch (error) {
    console.error('❌ Email failed:', error.message)
  }
}

testEmail()
```

**Run test**:
```bash
cd backend
node test-email.js
```

---

## 🎯 Email Templates for StayFinder

### Welcome Email Template:
```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Welcome to StayFinder</title>
</head>
<body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
  <div style="background: #2563eb; color: white; padding: 20px; text-align: center;">
    <h1>Welcome to StayFinder! 🏠</h1>
  </div>
  <div style="padding: 20px;">
    <h2>Hi {{userName}}!</h2>
    <p>Thanks for joining StayFinder. You're now ready to discover amazing stays around the world.</p>
    <a href="{{appUrl}}" style="background: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
      Start Exploring
    </a>
  </div>
</body>
</html>
```

### Booking Confirmation Template:
```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Booking Confirmed - StayFinder</title>
</head>
<body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
  <div style="background: #10b981; color: white; padding: 20px; text-align: center;">
    <h1>Booking Confirmed! ✅</h1>
  </div>
  <div style="padding: 20px;">
    <h2>Hi {{guestName}}!</h2>
    <p>Your booking has been confirmed. Here are the details:</p>
    
    <div style="background: #f9fafb; padding: 15px; border-radius: 8px; margin: 20px 0;">
      <h3>{{listingTitle}}</h3>
      <p><strong>Check-in:</strong> {{checkInDate}}</p>
      <p><strong>Check-out:</strong> {{checkOutDate}}</p>
      <p><strong>Guests:</strong> {{guestCount}}</p>
      <p><strong>Total:</strong> ${{totalAmount}}</p>
    </div>
    
    <a href="{{bookingUrl}}" style="background: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
      View Booking Details
    </a>
  </div>
</body>
</html>
```

---

## 🔒 Security Best Practices

### Environment Variables:
```env
# ✅ Good - Using app passwords
SMTP_PASS=abcd efgh ijkl mnop

# ❌ Bad - Using actual password
SMTP_PASS=myactualpassword123
```

### Email Validation:
- Always validate email addresses
- Use email verification for new accounts
- Implement rate limiting for email sending
- Never expose email credentials in client-side code

---

## 🆘 Common Issues & Solutions

### Gmail "Less Secure Apps" Error:
- **Solution**: Use App Passwords (not regular password)
- **Enable**: 2-Factor Authentication first

### SendGrid "Authentication Failed":
- **Check**: API key is correct
- **Verify**: From email is verified in SendGrid
- **Ensure**: Using "apikey" as username

### Emails Going to Spam:
- **Use**: Professional email service (SendGrid/Mailgun)
- **Set up**: SPF, DKIM, DMARC records
- **Avoid**: Spam trigger words in subject/content

### Connection Timeout:
- **Check**: SMTP host and port are correct
- **Try**: Different ports (25, 465, 587, 2525)
- **Verify**: Network/firewall not blocking

---

## 📞 Support Resources

### Gmail Issues:
- [Google App Passwords Help](https://support.google.com/accounts/answer/185833)

### SendGrid Support:
- [SendGrid Documentation](https://docs.sendgrid.com/)
- [SMTP Integration Guide](https://docs.sendgrid.com/for-developers/sending-email/integrating-with-the-smtp-api)

### Mailgun Support:
- [Mailgun Documentation](https://documentation.mailgun.com/)
- [SMTP Guide](https://documentation.mailgun.com/en/latest/user_manual.html#sending-via-smtp)

---

## 🎉 You're All Set!

Your StayFinder application can now send:
- ✅ Welcome emails to new users
- ✅ Booking confirmations
- ✅ Password reset emails
- ✅ Host notifications
- ✅ Review requests

Choose the email service that best fits your needs and budget! 🚀 