# 🚀 PostHog Setup Guide

This guide will help you set up PostHog analytics for comprehensive user behavior tracking, feature flags, and A/B testing.

## 🌐 Option 1: PostHog Cloud (Recommended)

### Step 1: Create PostHog Account

1. **Go to [PostHog Cloud](https://app.posthog.com/signup)**
2. **Sign up** with your email
3. **Create a new project** - name it "Vibe Starter" or your app name
4. **Choose your data location** (US or EU)

### Step 2: Get Your Project API Key

1. **After account creation**, you'll see your project dashboard
2. **Copy your Project API Key** (starts with `phc_`)
3. **Note your PostHog Host** (usually `https://app.posthog.com`)

### Step 3: Configure Environment Variables

Add these to your `.env` file:

```env
# PostHog Analytics
POSTHOG_KEY=phc_your_project_api_key_here
POSTHOG_HOST=https://app.posthog.com

# For production (add to Vercel environment variables)
# POSTHOG_KEY=phc_your_project_api_key_here
# POSTHOG_HOST=https://app.posthog.com
```

### Step 4: Update Nuxt Config

Your `nuxt.config.ts` is already configured! The PostHog integration will automatically activate when you add the environment variables.

### Step 5: Test the Integration

1. **Start your development server:**
   ```bash
   npm run dev
   ```

2. **Visit your app** at `http://localhost:3000`

3. **Check PostHog dashboard** - you should see events coming in within a few minutes

---

## 🏠 Option 2: Self-Hosted PostHog (Advanced)

If you prefer full control over your data, you can self-host PostHog.

### Requirements
- Docker and Docker Compose
- 4GB+ RAM recommended
- External server or VPS

### Step 1: Set Up PostHog Server

1. **Create a new server** (DigitalOcean, AWS, etc.)

2. **Install Docker:**
   ```bash
   curl -fsSL https://get.docker.com -o get-docker.sh
   sh get-docker.sh
   ```

3. **Clone PostHog:**
   ```bash
   git clone https://github.com/PostHog/posthog.git
   cd posthog
   ```

4. **Start PostHog:**
   ```bash
   docker compose -f docker-compose.yml up -d
   ```

5. **Access PostHog** at `http://your-server-ip:8000`

### Step 2: Configure Your App

```env
# Self-hosted PostHog
POSTHOG_KEY=your_project_api_key_from_self_hosted_instance
POSTHOG_HOST=http://your-server-ip:8000
```

---

## 🎯 What You Get with PostHog

### **Automatic Event Tracking**
Your app now automatically tracks:
- Page views with full URL and referrer data
- User registrations and logins
- Subscription upgrades and cancellations
- Admin actions and feature usage
- 2FA setup and security events
- Profile updates and settings changes

### **PostHog Dashboard Features**
1. **Events** - See all tracked events in real-time
2. **Insights** - Create custom charts and funnels
3. **Users** - View individual user journeys
4. **Feature Flags** - A/B test features (we'll set this up next)
5. **Session Recordings** - Watch user sessions (privacy-friendly)
6. **Cohorts** - Group users by behavior

### **Advanced Analytics**
- **Funnel Analysis** - Track conversion funnels
- **Retention Analysis** - See how often users return
- **Path Analysis** - Understand user journeys
- **Correlation Analysis** - Find what drives conversions

---

## 🔧 Custom Event Examples

Your app is already tracking events! Here are examples of what's being sent to PostHog:

### **User Registration**
```json
{
  "event": "User Registered",
  "properties": {
    "method": "email",
    "timestamp": "2024-01-15T10:30:00Z"
  }
}
```

### **Subscription Upgrade**
```json
{
  "event": "Subscription Upgrade",
  "properties": {
    "tier": "PREMIUM",
    "amount": 4.99,
    "currency": "USD"
  }
}
```

### **Feature Usage**
```json
{
  "event": "Feature Used",
  "properties": {
    "feature": "2FA Setup",
    "timestamp": "2024-01-15T10:30:00Z"
  }
}
```

---

## 🎨 Adding Custom Events

Use the analytics composable to track custom events:

```vue
<script setup>
const analytics = useAnalytics()

// Track when user watches a video
const trackVideoWatch = () => {
  analytics.trackCustomEvent('Video Watched', {
    videoId: 'intro-tutorial',
    duration: 120,
    completionRate: 0.85
  })
}

// Track when user uses search
const trackSearch = (query: string, results: number) => {
  analytics.trackUserSearch(query, results)
}
</script>
```

---

## 🔒 Privacy Configuration

PostHog respects user privacy. Configure these settings in your PostHog dashboard:

### **Recommended Privacy Settings**
1. **Data Retention** - Set to 1 year maximum
2. **Session Recordings** - Mask sensitive inputs
3. **IP Masking** - Enable for GDPR compliance
4. **Cookie-less Tracking** - Enable for privacy
5. **Autocapture** - Disabled (we track manually for better control)

### **GDPR Compliance**
- PostHog supports GDPR data deletion requests
- IP addresses can be automatically masked
- Users can opt-out of tracking
- Data processing agreements available

---

## 📊 Vercel Deployment

### Add Environment Variables to Vercel

1. **Go to your Vercel project dashboard**
2. **Settings** → **Environment Variables**
3. **Add these variables:**

| Name | Value |
|------|-------|
| `POSTHOG_KEY` | `phc_your_project_api_key_here` |
| `POSTHOG_HOST` | `https://app.posthog.com` |

4. **Redeploy your app** - PostHog will start tracking automatically

---

## 🚀 What's Next?

### **Feature Flags Setup**
PostHog includes powerful feature flags for A/B testing:

```vue
<script setup>
const { $posthog } = useNuxtApp()

// Check if user should see new feature
const showNewFeature = computed(() => {
  return $posthog?.isFeatureEnabled('new-dashboard-design')
})
</script>

<template>
  <div v-if="showNewFeature">
    <!-- New feature content -->
  </div>
  <div v-else>
    <!-- Old feature content -->
  </div>
</template>
```

### **Session Recordings**
Enable session recordings to watch user interactions:
1. Go to PostHog → Settings → Project
2. Enable "Session recordings"
3. Configure privacy settings (mask passwords, etc.)

### **Cohort Analysis**
Create user cohorts based on behavior:
- Users who completed onboarding
- Premium subscribers
- Power users (high engagement)

---

## 🎉 You're All Set!

Your Vibe Starter now has **enterprise-grade analytics** with:
- ✅ Real-time event tracking
- ✅ User journey analysis  
- ✅ Conversion funnel tracking
- ✅ A/B testing capabilities
- ✅ Privacy-compliant data collection
- ✅ Custom dashboards and insights

Visit your PostHog dashboard to explore your data! 🚀