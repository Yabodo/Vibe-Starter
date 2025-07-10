# 📊 Analytics System Guide

Vibe Starter includes a comprehensive, production-ready analytics system that works entirely within your database. No external dependencies or Docker containers required!

## 🚀 Features

### **Database-Native Analytics**
- **Page View Tracking** - Automatic page view collection with referrer data
- **Event Tracking** - Custom business events (registrations, subscriptions, etc.)
- **User Journey Analytics** - Track user behavior and conversion funnels
- **Real-time Metrics** - Live dashboard with actual data from your database

### **Business Intelligence**
- **Conversion Tracking** - Registration rates, subscription conversions
- **Bounce Rate Analysis** - Single-page session detection
- **Traffic Source Attribution** - Referrer-based source tracking
- **User Growth Metrics** - Period-over-period growth analysis
- **Revenue Analytics** - Subscription revenue tracking

### **Privacy-First**
- **GDPR Compliant** - All data stays in your database
- **No External Tracking** - No third-party cookies or scripts
- **User Control** - Full data ownership and control

## 🔧 How It Works

### **Automatic Tracking**
The system automatically tracks:
- All page views with referrer information
- User registrations and login events
- Subscription upgrades and cancellations
- Admin actions and feature usage
- 2FA setup and security events

### **Database Models**
```typescript
// Page view tracking
model PageView {
  id        String   @id @default(cuid())
  path      String
  title     String?
  referrer  String?
  userAgent String?
  userId    String?
  sessionId String?
  createdAt DateTime @default(now())
}

// Custom event tracking
model Event {
  id         String   @id @default(cuid())
  name       String
  properties String?  // JSON
  userId     String?
  sessionId  String?
  createdAt  DateTime @default(now())
}

// System metrics aggregation
model SystemMetrics {
  id          String   @id @default(cuid())
  metricType  String
  value       Float
  date        DateTime @default(now())
  metadata    String?  // JSON
}
```

## 📈 Admin Dashboard

Access comprehensive analytics at `/admin/analytics`:

### **Key Metrics**
- **User Growth** - New registrations with trend analysis
- **Revenue Tracking** - Subscription revenue with projections
- **Conversion Rate** - Visitors to registrations ratio
- **Bounce Rate** - Single-page session percentage

### **Detailed Reports**
- **Top Pages** - Most visited pages with view counts
- **Traffic Sources** - Referrer breakdown with percentages
- **User Activity** - Recent user actions and events
- **Time Period Filters** - 24h, 7d, 30d, 90d views

## 🔌 Optional Integrations

### **Mixpanel Integration**
Add professional analytics with Mixpanel:

```env
# Add to your .env file
MIXPANEL_TOKEN=your_mixpanel_project_token
```

### **PostHog Integration**
Self-hostable analytics with PostHog:

```env
# Add to your .env file
POSTHOG_KEY=your_posthog_api_key
POSTHOG_HOST=https://app.posthog.com  # or your self-hosted instance
```

When these are configured, events are sent to both your database AND the external service for enhanced analytics.

## 🛠️ Custom Event Tracking

### **Using the Analytics Composable**
```vue
<script setup>
const analytics = useAnalytics()

// Track user actions
analytics.trackUserRegistration('email')
analytics.trackSubscriptionUpgrade('PREMIUM', 4.99)
analytics.trackFeatureUsage('2FA Setup')

// Track custom events
analytics.trackCustomEvent('Video Watched', {
  videoId: 'abc123',
  duration: 120,
  completionRate: 0.85
})
</script>
```

### **Available Tracking Methods**
```typescript
// User actions
trackUserRegistration(method: string)
trackUserLogin(method: string)
trackSubscriptionUpgrade(tier: string, amount?: number)
trackSubscriptionCancel(tier: string)

// Admin actions
trackAdminUserEdit(action: string)
trackAdminRoleChange(fromRole: string, toRole: string)
trackAdminDataExport(dataType: string)

// Feature usage
track2FASetup()
trackProfileUpdate(fields: string[])
trackThemeToggle(theme: string)
trackLanguageChange(fromLang: string, toLang: string)

// Custom tracking
trackCustomEvent(eventName: string, properties?: object)
identifyUser(userId: string, traits?: object)
```

## 📊 Analytics API

### **Track Events**
```typescript
POST /api/analytics/track
{
  "event": "User Registered",
  "properties": { "method": "email" },
  "userId": "user_123"
}
```

### **Track Page Views**
```typescript
POST /api/analytics/pageview
{
  "path": "/subscription",
  "title": "Subscription Plans",
  "referrer": "https://google.com",
  "userId": "user_123"
}
```

### **Get Analytics Data**
```typescript
GET /api/admin/analytics?period=7d
// Returns comprehensive analytics data
```

## 🎯 Performance Optimized

### **Efficient Database Queries**
- Indexed fields for fast lookups
- Aggregated metrics to reduce computation
- Batched inserts for high-traffic sites

### **Vercel/Edge Compatible**
- Serverless-friendly architecture
- No background processes required
- Scales automatically with your app

## 🔒 Privacy & Compliance

### **Data Minimization**
- Only collects necessary analytics data
- No personal information in page views
- IP addresses hashed for privacy

### **User Rights**
- GDPR Article 17 (Right to Erasure) support
- Data portability through admin export
- Transparent data collection practices

## 🚀 Production Deployment

The analytics system deploys automatically with your Nuxt app:

1. **Vercel**: Zero additional configuration
2. **Digital Ocean**: Works with standard Nuxt droplets
3. **Self-hosted**: Compatible with any Node.js hosting

### **Database Migration**
Run Prisma migrations to add analytics tables:

```bash
npx prisma generate
npx prisma db push  # Development
npx prisma migrate deploy  # Production
```

## 📝 Analytics Reports

### **Daily Metrics**
- User registrations
- Page views
- Conversion events
- Revenue tracking

### **Trend Analysis**
- Period-over-period comparisons
- Growth rate calculations
- Seasonal pattern detection

### **Export Capabilities**
- CSV export of user data
- Analytics report generation
- Custom date range exports

---

## 🎉 Result

You now have a **production-ready analytics system** that:
- ✅ Tracks all important business metrics
- ✅ Provides real-time insights in admin dashboard
- ✅ Scales with your application growth
- ✅ Maintains user privacy and compliance
- ✅ Deploys seamlessly to any platform
- ✅ Requires zero external dependencies

Your analytics are now as robust as your application! 🚀