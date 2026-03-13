# 📊 Google Analytics Setup Guide

## 🚀 Quick Setup Steps

### 1. Create Google Analytics Account
1. Go to [Google Analytics](https://analytics.google.com/)
2. Sign in with your Google account
3. Click "Start measuring"
4. Create an account (name it something like "Ohako Links")

### 2. Set up a Property
1. Property name: "Ohako Link Page"
2. Time zone: Select your timezone
3. Currency: Select your currency

### 3. Set up Data Stream
1. Choose "Web"
2. Website URL: Your domain (e.g., `https://yourdomain.com`)
3. Stream name: "Ohako Links Website"

### 4. Get Your Measurement ID
1. After creating the data stream, you'll see a **Measurement ID**
2. It looks like: `G-XXXXXXXXXX`
3. Copy this ID

### 5. Update Your Website
1. Open `/Users/Apple/linkpage/index.html`
2. Find this line: `<script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>`
3. Replace `GA_MEASUREMENT_ID` with your actual Measurement ID (both places)

**Example:**
```html
<!-- Replace GA_MEASUREMENT_ID with your actual ID -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-ABC123XYZ"></script>
<script>
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', 'G-ABC123XYZ'); <!-- Replace this too -->
</script>
```

## 📈 What You'll Track

### Automatic Tracking
- **Page views**: Every time someone visits your page
- **Sessions**: How long people stay on your page  
- **User demographics**: Age, gender, location (anonymized)
- **Device info**: Mobile vs desktop, browser types

### Custom Event Tracking
- **Link clicks**: Every click on your social media links
- **Event details**: Which link was clicked, when, and by whom
- **Click frequency**: Which links are most popular

## 📊 Viewing Your Data

### Real-time Reports
1. Go to Google Analytics
2. Navigate to "Reports" → "Realtime"
3. See live visitors and link clicks

### Link Click Events
1. Go to "Reports" → "Engagement" → "Events"
2. Look for events with name "click"
3. See detailed breakdown by link title

### Popular Links Report
1. Events → "click" event
2. Add secondary dimension "Event label"
3. See which social media links are clicked most

## 🔧 Testing Your Setup

1. **Deploy your website** with the updated code
2. **Visit your page** from a different device/browser
3. **Click some links**
4. **Check Google Analytics Real-time reports** (data appears within minutes)

## 📱 Advanced Features Available

### Enhanced Tracking (Optional)
- **Scroll tracking**: See how far people scroll
- **Time on page**: Detailed engagement metrics
- **Click heatmaps**: Visual representation of clicks
- **Conversion goals**: Track specific actions as goals

### Privacy Compliance
- Google Analytics is GDPR compliant
- No personal data is stored without consent
- All data is anonymized by default

## 🎯 Success Indicators

You'll know it's working when you see:
- ✅ Page views in real-time reports
- ✅ "click" events appearing in Events reports  
- ✅ Event labels showing your link titles (Email, Instagram, YouTube, TikTok)
- ✅ Console logs showing "Event sent to Google Analytics"

---

**Need help?** Check the browser console for any error messages, or verify your Measurement ID is correct.