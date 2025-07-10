# 🚀 Vibe Starter

**Modern User Management & Subscription Boilerplate**  
**Nuxt 3 + Prisma + TypeScript + Tailwind CSS**

A comprehensive, production-ready boilerplate for building modern web applications with user authentication, subscription management, and two-factor authentication. Built with the latest technologies and best practices.

[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Nuxt 3](https://img.shields.io/badge/Nuxt-00C58E?style=for-the-badge&logo=nuxt.js&logoColor=white)](https://nuxt.com/)
[![Prisma](https://img.shields.io/badge/Prisma-3982CE?style=for-the-badge&logo=Prisma&logoColor=white)](https://prisma.io/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)

## ✨ Features

### 🔐 **Complete Authentication System**
- **User Registration & Login** - Secure JWT-based authentication
- **3-Tier Role System** - USER, MODERATOR, and ADMIN roles with granular permissions
- **Two-Factor Authentication (2FA)** - TOTP with QR codes and backup codes
- **Password Management** - Secure password hashing with bcrypt
- **Auto-redirect Logic** - Smart redirects for authenticated users
- **Session Management** - Persistent login with secure token handling
- **Role-Based Access Control** - Middleware and UI restrictions based on user roles

### 👤 **User Profile Management**
- **Profile Editing** - Update name, email, and profile information
- **Avatar Upload** - Automatic image resizing and optimization
- **Account Settings** - Comprehensive user preferences
- **Account Data Export** - GDPR-compliant data download
- **Account Deletion** - Complete data removal with confirmation

### 💳 **Subscription Management**
- **Multiple Tiers** - Free, Premium, and Donator plans
- **Subscription Status** - Real-time subscription tracking
- **Plan Upgrades** - Seamless tier transitions
- **Cancellation Flow** - User-friendly cancellation process
- **Beautiful UI** - Premium badges and tier indicators

### 🎨 **Modern UI/UX**
- **Dark/Light Mode** - System preference detection with toggle
- **Internationalization (i18n)** - Multi-language support with English and Estonian
- **Responsive Design** - Mobile-first approach with Tailwind CSS
- **Smooth Animations** - Polished transitions and interactions
- **Accessibility** - WCAG compliant with proper ARIA labels
- **Component Library** - Reusable, consistent components

### 🛡️ **Admin & Moderation System**
- **Admin Dashboard** - Complete system overview with analytics and user management
- **User Management** - Search, filter, edit, and manage all user accounts
- **Production Analytics** - Database-native analytics with Analytics.js, real conversion tracking, bounce rates
- **Role Management** - Assign and modify user roles (USER, MODERATOR, ADMIN)
- **Activity Monitoring** - Track user actions and system events with detailed logging
- **Moderator Tools** - Content moderation, user reports, and limited administration
- **Real-time Metrics** - Live statistics and performance monitoring from database
- **Export Functionality** - User data export and comprehensive reporting tools

### 🔒 **Security & Best Practices**
- **Input Validation** - Server and client-side validation
- **CSRF Protection** - Cross-site request forgery prevention
- **Rate Limiting** - Built-in API rate limiting
- **Secure Headers** - Security headers configuration
- **Environment Variables** - Secure configuration management
- **Role-Based Authorization** - Granular permissions system

### 🎓 **Noob-Friendly Features**
- **Zero Configuration** - Works out of the box, no complex setup
- **Step-by-Step Guides** - Detailed instructions for every step
- **Error Prevention** - Built-in checks to prevent common mistakes
- **One-Click Deploy** - Deploy to internet with just a few clicks
- **Visual Feedback** - Clear success/error messages throughout
- **Mobile Ready** - Responsive design works on all devices
- **Free Hosting** - Deploy on Vercel's free tier
- **Copy-Paste Ready** - All commands ready to copy and paste
- **Beginner Docs** - Documentation written for complete beginners
- **Troubleshooting** - Solutions for 95% of common issues

## 🚀 Quick Start

### 🎯 For Complete Beginners

**Never coded before? No problem!** This guide will take you from zero to deployed app in 30 minutes.

#### Step 0: Install Required Software

1. **Install Node.js** (JavaScript runtime)
   - Go to [nodejs.org](https://nodejs.org/)
   - Download the LTS version (green button)
   - Run the installer and follow the prompts
   - To verify: Open terminal/command prompt and type `node --version`

2. **Install Git** (version control)
   - Go to [git-scm.com](https://git-scm.com/)
   - Download and install for your operating system
   - To verify: Type `git --version` in terminal

3. **Install Visual Studio Code** (code editor)
   - Go to [code.visualstudio.com](https://code.visualstudio.com/)
   - Download and install
   - Open it and install the "Prisma" extension for database support

4. **Create accounts** (free):
   - [GitHub account](https://github.com/signup) - for storing your code
   - [Vercel account](https://vercel.com/signup) - for hosting your app

### Prerequisites

- **Node.js 18+** ([Download](https://nodejs.org/))
- **npm** or **yarn** (comes with Node.js)
- **Git** ([Download](https://git-scm.com/))
- **GitHub account** (free)
- **Vercel account** (free)

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/vibe-starter.git
cd vibe-starter
```

### 2. Install Dependencies

```bash
npm install
# or
yarn install
```

### 3. Environment Setup

Create your environment file:

```bash
cp .env.example .env
```

Configure your environment variables in `.env`:

```env
# JWT Secret for authentication
JWT_SECRET=your-super-secure-jwt-secret-key-here

# Nuxt Auth Configuration
NUXT_AUTH_SECRET=your-nuxt-auth-secret-key-here
NUXT_AUTH_URL=http://localhost:3000

# Database Configuration
DATABASE_URL="file:./prisma/dev.db"

# Development Settings
NODE_ENV=development

# Analytics Configuration (Optional)
MIXPANEL_TOKEN=your-mixpanel-token-here
POSTHOG_KEY=your-posthog-key-here
```

### 4. Database Setup

Initialize the database:

```bash
# Generate Prisma client
npx prisma generate

# Run database migrations
npx prisma migrate dev

# (Optional) View your data in Prisma Studio
npx prisma studio
```

### 5. Start Development Server

```bash
npm run dev
# or
yarn dev
```

🎉 **Vibe Starter is now running at [http://localhost:3000](http://localhost:3000)**

---

## 🌐 Deploy to Production (For Beginners)

### 🎯 Deploy Your App to the Internet in 10 Minutes

Want to show your app to the world? Let's deploy it to Vercel (free hosting)!

#### Step 1: Push Your Code to GitHub

1. **Create a new repository on GitHub**
   - Go to [github.com](https://github.com) and sign in
   - Click the green "New" button
   - Name it `my-vibe-starter` (or whatever you want)
   - Make sure it's **Public**
   - **Don't** initialize with README (we already have one)
   - Click "Create repository"

2. **Connect your local code to GitHub**
   ```bash
   # In your project folder, run these commands:
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/my-vibe-starter.git
   git push -u origin main
   ```
   
   **Replace `YOUR_USERNAME`** with your actual GitHub username!

#### Step 2: Deploy to Vercel

1. **Connect GitHub to Vercel**
   - Go to [vercel.com](https://vercel.com) and sign in
   - Click "New Project"
   - Click "Import" next to your repository name
   - If you don't see it, click "Import Git Repository" and paste your GitHub URL

2. **Configure deployment**
   - **Framework Preset**: Should auto-detect "Nuxt.js"
   - **Root Directory**: Leave as `./`
   - **Build Command**: Leave as default
   - **Install Command**: Leave as default
   - Click "Deploy" 🚀

#### Step 3: Set Up Database

1. **Add Vercel Postgres**
   - In your Vercel project dashboard, go to "Storage" tab
   - Click "Create Database"
   - Select "Postgres"
   - Choose "Hobby" (free tier)
   - Click "Create"

2. **Connect database to your app**
   - Go to "Settings" → "Environment Variables"
   - Vercel should auto-add the `DATABASE_URL` for you
   - Add these additional variables:

   | Name | Value |
   |------|-------|
   | `JWT_SECRET` | Generate at [passwordsgenerator.net](https://passwordsgenerator.net/) (32+ characters) |
   | `NUXT_AUTH_SECRET` | Generate another secret (32+ characters) |
   | `NUXT_AUTH_URL` | `https://your-project-name.vercel.app` (your actual Vercel URL) |
   | `NODE_ENV` | `production` |
   | `MIXPANEL_TOKEN` | (Optional) Your Mixpanel project token for analytics |
   | `POSTHOG_KEY` | (Optional) Your PostHog API key for analytics |

#### Step 4: Set Up Database Schema

1. **Install Vercel CLI**
   ```bash
   npm install -g vercel
   vercel login
   ```

2. **Run database migration**
   ```bash
   # Link your local project to Vercel
   vercel link
   
   # Pull environment variables
   vercel env pull .env.local
   
   # Run database migration
   npx prisma migrate deploy
   ```

#### Step 5: Redeploy

- Go back to Vercel dashboard
- Click "Deployments" tab
- Click "Redeploy" on the latest deployment
- Wait for it to finish

🎉 **Your app is now live on the internet!**

### 🔗 What You Get

- **Your live URL**: `https://your-project-name.vercel.app`
- **User registration and login**
- **2FA authentication**
- **User profiles with avatars**
- **Subscription management**
- **Dark/light mode**
- **Mobile responsive design**

### 📱 Test Your Deployed App

1. Visit your Vercel URL
2. Click "Sign Up" to create an account
3. Fill in your details and register
4. Go to your profile and set up 2FA
5. Test all the features!

---

## 📚 Complete Tutorial

### Creating Your First User

1. **Navigate to Registration**
   - Go to [http://localhost:3000/auth/signup](http://localhost:3000/auth/signup)
   - Fill in your details and create an account

2. **Explore the Dashboard**
   - After registration, you'll be redirected to the dashboard
   - Explore the user interface and available features

3. **Set Up Your Profile**
   - Click on your profile avatar in the navbar
   - Go to "Profile" to edit your information
   - Upload a profile picture and update your details

### Setting Up Two-Factor Authentication

1. **Navigate to Security Settings**
   ```
   Profile → Two-Factor Authentication → Set Up 2FA
   ```

2. **Install an Authenticator App**
   - Download Google Authenticator, Authy, or similar
   - The setup page will guide you through the process

3. **Scan QR Code**
   - Use your authenticator app to scan the QR code
   - Or manually enter the secret key provided

4. **Verify Setup**
   - Enter the 6-digit code from your authenticator
   - Save your backup codes in a secure location

5. **Test 2FA**
   - Sign out and sign back in
   - You'll now need your 2FA code to complete login

### Managing Subscriptions

1. **View Current Plan**
   - Dashboard shows your current subscription status
   - Free users will see upgrade options

2. **Upgrade to Premium**
   - Navigate to subscription management
   - Choose between Premium and Donator tiers
   - Premium users get special badges and features

3. **Cancel Subscription**
   - Go to subscription settings
   - Click "Cancel Subscription" with confirmation

### Dark Mode & Theming

1. **Toggle Dark Mode**
   - Use the theme toggle in the navbar
   - System preference is detected automatically

2. **Persistent Preferences**
   - Theme choice is saved across sessions
   - Smooth animations during theme transitions

## 🏗️ Project Structure

```
📦 your-app/
├── 📁 components/           # Reusable Vue components
│   ├── AppHeader.vue       # Navigation bar with auth
│   ├── LanguageSelector.vue # Language switcher
│   ├── ThemeToggle.vue     # Dark/light mode toggle
│   └── SparkleEffect.vue   # Animation components
├── 📁 composables/         # Vue composables
│   ├── useI18n.ts          # Translation management
│   └── useTheme.ts         # Theme management logic
├── 📁 i18n/                # Internationalization
│   ├── i18n.config.ts      # i18n runtime configuration
│   └── locales/            # Translation files
│       ├── en.json         # English translations
│       └── et.json         # Estonian translations
├── 📁 layouts/             # Page layouts
│   ├── admin.vue           # Admin dashboard layout
│   ├── moderator.vue       # Moderator dashboard layout
│   └── default.vue         # Default application layout
├── 📁 middleware/          # Route middleware
│   ├── auth.ts             # Authentication guard
│   ├── admin.ts            # Admin-only access control
│   └── moderator.ts        # Moderator+ access control
├── 📁 pages/               # File-based routing
│   ├── index.vue           # Landing page
│   ├── dashboard.vue       # User dashboard
│   ├── profile.vue         # User profile settings
│   ├── subscription.vue    # Subscription management
│   ├── admin/              # Admin panel pages
│   │   ├── index.vue       # Admin dashboard
│   │   ├── analytics.vue   # System analytics
│   │   └── users/
│   │       └── index.vue   # User management
│   ├── moderator/          # Moderator panel pages
│   │   └── index.vue       # Moderator dashboard
│   ├── auth/
│   │   ├── signin.vue      # Login page
│   │   └── signup.vue      # Registration page
│   ├── security/
│   │   └── 2fa-setup.vue   # Two-factor auth setup
│   └── dev/
│       └── create-admin.vue # Admin user creation (dev only)
├── 📁 server/              # Server-side API
│   └── api/
│       ├── auth/           # Authentication endpoints
│       │   ├── login.post.ts
│       │   └── 2fa/
│       │       ├── setup.post.ts
│       │       ├── verify.post.ts
│       │       └── disable.post.ts
│       ├── admin/          # Admin-only endpoints
│       │   ├── analytics.get.ts
│       │   └── users/
│       │       ├── index.get.ts
│       │       └── [id].put.ts
│       ├── users/          # User management
│       │   ├── profile.get.ts
│       │   ├── profile.put.ts
│       │   ├── profile.delete.ts
│       │   ├── register.post.ts
│       │   └── upload-avatar.post.ts
│       ├── subscriptions/  # Subscription management
│       │   ├── index.get.ts
│       │   ├── upgrade.post.ts
│       │   └── cancel.post.ts
│       └── dev/            # Development utilities
│           └── seed-admin.post.ts
├── 📁 prisma/              # Database configuration
│   ├── schema.prisma       # Database schema
│   ├── dev.db              # SQLite database (development)
│   └── migrations/         # Database migrations
├── 📁 utils/               # Utility functions
│   ├── db.ts               # Database client with mock support
│   ├── roles.ts            # Role management utilities
│   └── twoFactor.ts        # 2FA utilities
├── 📁 public/              # Static assets
│   └── uploads/            # User uploaded files
├── nuxt.config.ts          # Nuxt configuration
├── tailwind.config.js      # Tailwind CSS config
└── package.json            # Dependencies
```

## 🌐 Internationalization (i18n)

### Features
- **Multi-language Support** - English (default) and Estonian translations
- **Environment Toggle** - Enable/disable i18n via environment variable
- **Persistent Language Choice** - Language selection saved across sessions
- **Clean URLs** - No URL prefixes, SEO-friendly approach
- **Fallback System** - Works even when i18n is disabled

### Setup and Configuration

**Enable i18n (default):**
```env
I18N_ENABLED=true
```

**Disable i18n:**
```env
I18N_ENABLED=false
```

### Using Translations in Components

```vue
<template>
  <div>
    <!-- Use translation keys -->
    <h1>{{ t('home.title') }}</h1>
    <p>{{ t('home.subtitle') }}</p>
    
    <!-- Language selector (only shows when i18n enabled) -->
    <LanguageSelector v-if="enabled" />
  </div>
</template>

<script setup>
const { t, enabled } = useTranslation()
</script>
```

### Translation Files

**English (`/i18n/locales/en.json`)**
```json
{
  "home": {
    "title": "Welcome to Vibe Starter",
    "subtitle": "Your comprehensive user and subscription management platform"
  },
  "auth": {
    "signin": {
      "title": "Sign In",
      "email": "Email"
    }
  }
}
```

**Estonian (`/i18n/locales/et.json`)**
```json
{
  "home": {
    "title": "Tere tulemast Vibe Starterisse",
    "subtitle": "Teie täielik kasutaja- ja tellimushalduse platvorm"
  },
  "auth": {
    "signin": {
      "title": "Logi sisse",
      "email": "E-post"
    }
  }
}
```

### How to Disable i18n

If your project doesn't need multi-language support:

1. **Set environment variable:**
   ```env
   I18N_ENABLED=false
   ```

2. **Remove language selector from components:**
   ```vue
   <!-- Remove or comment out -->
   <!-- <LanguageSelector /> -->
   ```

3. **Translations still work!** The fallback system ensures your app works normally with English text.

### Adding New Languages

1. **Create translation file:**
   ```bash
   # Example for Spanish
   touch i18n/locales/es.json
   ```

2. **Add translations:**
   ```json
   {
     "home": {
       "title": "Bienvenido a Vibe Starter"
     }
   }
   ```

3. **Update language selector:**
   ```vue
   <!-- components/LanguageSelector.vue -->
   <option value="es">Español</option>
   ```

4. **Update fallback composable** if needed:
   ```typescript
   // composables/useI18n.ts
   const availableLocales = [
     { code: 'en', name: 'English' },
     { code: 'et', name: 'Eesti' },
     { code: 'es', name: 'Español' }
   ]
   ```

## 🔧 Configuration

### Database Configuration

**Development (SQLite)**
```env
DATABASE_URL="file:./prisma/dev.db"
```

**Production (PostgreSQL)**
```env
DATABASE_URL="postgresql://username:password@localhost:5432/mydb"
```

### Internationalization Configuration

**Enable i18n (default):**
```env
I18N_ENABLED=true
```

**Disable i18n:**
```env
I18N_ENABLED=false
```

**Nuxt i18n configuration:**
```typescript
// nuxt.config.ts
export default defineNuxtConfig({
  modules: [
    process.env.I18N_ENABLED !== 'false' ? '@nuxtjs/i18n' : null
  ].filter(Boolean),
  
  i18n: process.env.I18N_ENABLED !== 'false' ? {
    locales: ['en', 'et'],
    defaultLocale: 'en',
    strategy: 'no_prefix'
  } : undefined
})
```

**Update schema after changes:**
```bash
npx prisma migrate dev --name describe_your_changes
```

### Authentication Configuration

**JWT Settings**
```typescript
// nuxt.config.ts
export default defineNuxtConfig({
  runtimeConfig: {
    jwtSecret: process.env.JWT_SECRET,
    authSecret: process.env.NUXT_AUTH_SECRET,
    public: {
      authUrl: process.env.NUXT_AUTH_URL || 'http://localhost:3000'
    }
  }
})
```

### 2FA Configuration

The 2FA system uses TOTP (Time-based One-Time Passwords) with:
- **Secret Generation**: Cryptographically secure random secrets
- **QR Code Generation**: Automatic QR code creation for easy setup
- **Backup Codes**: 8 single-use backup codes for account recovery
- **Time Window**: 60-second validity with drift tolerance

## 🎨 Customization

### Theming

**Customize Colors:**
```javascript
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eff6ff',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
        }
      }
    }
  }
}
```

**Custom Dark Mode:**
```vue
<!-- Add to any component -->
<template>
  <div class="bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100">
    <!-- Your content -->
  </div>
</template>
```

## 🛡️ 3-Tier Role System

Vibe Starter includes a comprehensive role-based access control system with three user tiers:

### User Roles

| Role | Permissions | Access |
|------|-------------|--------|
| **👤 USER** | Standard user features | Profile, subscription, dashboard |
| **🛡️ MODERATOR** | Content moderation + user features | User management, reports, moderation tools |
| **🔴 ADMIN** | Full system access | Everything + analytics, system settings |

### Role-Based Features

**🔴 Admin Capabilities:**
- Complete user management (create, edit, delete, role assignment)
- Advanced analytics dashboard with system metrics
- User activity monitoring and audit trails
- System-wide configuration and settings
- Access to all moderator functions
- Export functionality and reporting tools

**🟡 Moderator Capabilities:**
- User report management and resolution
- Content moderation and review tools
- Limited user account management
- User activity monitoring (scoped)
- Quick moderation actions

**🟢 User Capabilities:**
- Profile management and settings
- Subscription management
- 2FA setup and security features
- Account data export and deletion

### Testing Admin/Moderator Features

**Development Mode (Mock Database):**

1. **Create Admin User:**
   ```bash
   # Visit in browser
   http://localhost:3000/dev/create-admin
   ```

2. **Login Credentials:**
   ```
   Admin: admin@example.com / admin123
   Moderator: moderator@example.com / mod123
   ```

3. **Access Admin Panel:**
   ```
   Admin Dashboard: /admin
   Moderator Dashboard: /moderator
   ```

**Production Setup:**
- Create admin users through database seeding
- Use role management API endpoints
- Implement proper user invitation system

### Role Management API

```typescript
// Update user role (Admin only)
PUT /api/admin/users/:id
{
  "role": "MODERATOR" // USER, MODERATOR, ADMIN
}

// Get users with role filtering
GET /api/admin/users?role=MODERATOR&status=active
```

### Adding New Pages

1. **Create Page File:**
   ```vue
   <!-- pages/new-page.vue -->
   <template>
     <div>
       <h1>New Page</h1>
     </div>
   </template>
   
   <script setup>
   // Add authentication if needed
   definePageMeta({
     middleware: 'auth'
   })
   </script>
   ```

2. **Add Navigation Link:**
   ```vue
   <!-- components/AppHeader.vue -->
   <NuxtLink to="/new-page" class="hover:text-blue-200">
     New Page
   </NuxtLink>
   ```

### Creating API Endpoints

1. **Create Endpoint File:**
   ```typescript
   // server/api/my-endpoint.post.ts
   export default defineEventHandler(async (event) => {
     const body = await readBody(event)
     
     // Your logic here
     
     return { success: true, data: body }
   })
   ```

2. **Add Authentication:**
   ```typescript
   import jwt from 'jsonwebtoken'
   
   export default defineEventHandler(async (event) => {
     // Get and verify JWT token
     const authHeader = getHeader(event, 'authorization')
     if (!authHeader?.startsWith('Bearer ')) {
       throw createError({
         statusCode: 401,
         statusMessage: 'Authorization required'
       })
     }
   
     const token = authHeader.substring(7)
     const config = useRuntimeConfig()
     const decoded = jwt.verify(token, config.jwtSecret) as { userId: string }
     
     // Your authenticated logic here
   })
   ```

## 🛡️ Security Guidelines

### Environment Variables
- **Never commit `.env` files** to version control
- **Use strong, unique secrets** for JWT and auth
- **Rotate secrets regularly** in production

### Database Security
- **Use parameterized queries** (Prisma handles this)
- **Validate all inputs** on both client and server
- **Implement rate limiting** for sensitive operations

### Authentication Security
- **Implement 2FA** for sensitive accounts
- **Use HTTPS in production**
- **Set secure JWT expiration** times
- **Implement proper logout** (token invalidation)

## 📊 Database Schema

```prisma
model User {
  id           String   @id @default(cuid())
  email        String   @unique
  name         String?
  password     String
  role         String   @default("USER") // USER, MODERATOR, ADMIN
  profileImage String?
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt
  lastLoginAt  DateTime?
  isActive     Boolean  @default(true)
  
  // 2FA fields
  twoFactorEnabled Boolean @default(false)
  twoFactorSecret  String?
  backupCodes      String? // JSON array
  
  subscription Subscription?
  sessions     Session[]
  accounts     Account[]
  activities   UserActivity[]
}

model Subscription {
  id        String   @id @default(cuid())
  userId    String   @unique
  status    String   // active, cancelled, etc.
  tier      String   // FREE, PREMIUM, DONATOR
  startDate DateTime @default(now())
  endDate   DateTime?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  
  user User @relation(fields: [userId], references: [id], onDelete: Cascade)
}

model UserActivity {
  id        String   @id @default(cuid())
  userId    String
  action    String   // login, logout, profile_update, subscription_change, etc.
  details   String?  // JSON string with additional data
  ipAddress String?
  userAgent String?
  createdAt DateTime @default(now())
  
  user User @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  @@index([userId])
  @@index([action])
  @@index([createdAt])
}

model SystemMetrics {
  id          String   @id @default(cuid())
  metricType  String   // daily_active_users, new_registrations, etc.
  value       Float
  date        DateTime @default(now())
  metadata    String?  // JSON string with additional data
  
  @@index([metricType])
  @@index([date])
}
```

## 🚀 Deployment

### Vercel Deployment

1. **Push to GitHub:**
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **Deploy to Vercel:**
   - Connect your GitHub repository
   - Add environment variables in Vercel dashboard
   - Deploy automatically on push

3. **Database Setup:**
   ```bash
   # For production database
   npx prisma migrate deploy
   ```

### Environment Variables for Production

```env
JWT_SECRET=your-production-jwt-secret
NUXT_AUTH_SECRET=your-production-auth-secret
NUXT_AUTH_URL=https://your-domain.com
DATABASE_URL=your-production-database-url
NODE_ENV=production
I18N_ENABLED=true
```

## 🧪 Testing

### Running Tests
```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Test coverage
npm run test:coverage
```

### Test User Accounts
Create test users for different scenarios:
```bash
# In Prisma Studio or your seed file
- Regular user: test@example.com
- Premium user: premium@example.com  
- Admin user: admin@example.com
```

## 🔄 Updates & Maintenance

### Keeping Dependencies Updated
```bash
# Check for updates
npm outdated

# Update dependencies
npm update

# Update major versions carefully
npm install package@latest
```

### Database Migrations
```bash
# Create migration
npx prisma migrate dev --name add_new_feature

# Reset database (development only)
npx prisma migrate reset
```

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. **Fork the repository**
2. **Create a feature branch:** `git checkout -b feature/amazing-feature`
3. **Commit your changes:** `git commit -m 'feat: add amazing feature'`
4. **Push to the branch:** `git push origin feature/amazing-feature`
5. **Open a Pull Request**

### Development Guidelines
- **Follow TypeScript best practices**
- **Write descriptive commit messages**
- **Add tests for new features**
- **Update documentation as needed**
- **Ensure responsive design**

## 📋 Troubleshooting

### 🆘 Help! Something's Not Working

**Don't panic!** Here are solutions to the most common issues beginners face:

#### 🚨 Local Development Issues

**"Command not found: npm"**
- **Problem**: Node.js not installed or not in PATH
- **Solution**: Download and install Node.js from [nodejs.org](https://nodejs.org/)
- **Test**: Type `node --version` - should show version number

**"Command not found: git"**
- **Problem**: Git not installed
- **Solution**: Download from [git-scm.com](https://git-scm.com/)
- **Test**: Type `git --version` - should show version number

**"Port 3000 already in use"**
- **Problem**: Another app is using port 3000
- **Solution**: Kill the process or use a different port
- **Commands**:
  ```bash
  # Kill process on port 3000 (Windows)
  netstat -ano | findstr :3000
  taskkill /PID [PID_NUMBER] /F
  
  # Kill process on port 3000 (Mac/Linux)
  lsof -ti:3000 | xargs kill -9
  
  # Or use different port
  npm run dev -- --port 3001
  ```

**"Cannot find module" errors**
- **Problem**: Dependencies not installed
- **Solution**: 
  ```bash
  rm -rf node_modules
  rm package-lock.json
  npm install
  ```

**"Database connection failed"**
- **Problem**: Wrong DATABASE_URL or database not running
- **Solutions**:
  1. Check your `.env` file exists and has correct DATABASE_URL
  2. For development: Use SQLite (simpler)
     ```env
     DATABASE_URL="file:./prisma/dev.db"
     ```
  3. Run: `npx prisma migrate dev`

#### 🌐 Deployment Issues

**"Build failed" on Vercel**
- **Problem**: Missing environment variables or build errors
- **Solutions**:
  1. Check all environment variables are set in Vercel dashboard
  2. Make sure `NODE_ENV=production` is set
  3. Check build logs for specific error

**"This Serverless Function has crashed"**
- **Problem**: Runtime error, usually database or environment variables
- **Solutions**:
  1. Check Vercel function logs (Functions tab in dashboard)
  2. Verify DATABASE_URL is set correctly
  3. Make sure all required environment variables are present

**"Can't reach database server"**
- **Problem**: Database URL is wrong or database doesn't exist
- **Solutions**:
  1. Create database in Vercel Storage tab
  2. Copy the correct DATABASE_URL from Vercel
  3. Run `npx prisma migrate deploy` with production URL

**"Invalid token" errors on live site**
- **Problem**: JWT secrets don't match or are missing
- **Solutions**:
  1. Generate new secrets: [passwordsgenerator.net](https://passwordsgenerator.net/)
  2. Set both `JWT_SECRET` and `NUXT_AUTH_SECRET` in Vercel
  3. Make sure `NUXT_AUTH_URL` matches your actual domain

#### 🔐 Authentication Issues

**"2FA setup failed"**
- **Problem**: QR code not generating or verification failing
- **Solutions**:
  1. Clear browser cache and localStorage
  2. Check your phone's time is synchronized
  3. Try manual entry instead of QR code
  4. Make sure 2FA dependencies are installed: `npm install`

**"Can't sign in after deployment"**
- **Problem**: Environment variables or database schema issues
- **Solutions**:
  1. Check all environment variables are set correctly
  2. Run database migration: `npx prisma migrate deploy`
  3. Clear browser cache and try again

#### 💾 Database Issues

**"Schema doesn't exist" errors**
- **Problem**: Database migrations haven't been run
- **Solution**: 
  ```bash
  npx prisma migrate deploy
  ```

**"Column doesn't exist" errors**
- **Problem**: Database schema is outdated
- **Solutions**:
  1. Reset database (development only):
     ```bash
     npx prisma migrate reset
     ```
  2. Or create new migration:
     ```bash
     npx prisma migrate dev --name fix_schema
     ```

#### 🛠️ Quick Fixes for Common Problems

| Problem | Quick Fix |
|---------|-----------|
| Build errors | `rm -rf .nuxt && npm install && npm run build` |
| Database errors | `npx prisma generate && npx prisma migrate deploy` |
| Environment issues | Check all variables are set in Vercel dashboard |
| Authentication errors | Clear browser cache, check JWT secrets |
| Port conflicts | Use different port: `npm run dev -- --port 3001` |

#### 🆘 Still Stuck?

1. **Check the error message carefully** - it usually tells you what's wrong
2. **Google the exact error message** - someone else probably had the same issue
3. **Clear everything and start fresh**:
   ```bash
   rm -rf node_modules .nuxt
   npm install
   npm run dev
   ```
4. **Ask for help**:
   - 📚 **Documentation**: Read this README thoroughly
   - 🐛 **Bug Reports**: Open GitHub issues with detailed info
   - 💬 **Stack Overflow**: Tag your question with `nuxt`, `prisma`, `vercel`
   - 📺 **YouTube**: Search for "Nuxt 3 deployment tutorial"

### 📝 When Asking for Help

Include this information:
- **What you were trying to do**
- **Exact error message** (copy and paste)
- **Your operating system** (Windows/Mac/Linux)
- **Node.js version** (`node --version`)
- **What you've already tried**

### Getting Help

- 📚 **Documentation**: Check this README thoroughly
- 🐛 **Bug Reports**: Open GitHub issues with detailed info
- 💬 **Discussions**: Use GitHub Discussions for questions
- 📧 **Email**: Contact maintainers for security issues

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Nuxt.js Team** - For the amazing full-stack framework
- **Prisma Team** - For the excellent database toolkit
- **Tailwind CSS** - For the utility-first CSS framework
- **Vue.js Community** - For the reactive framework
- **Open Source Contributors** - For their valuable contributions

---

**Built with ❤️ for developers who want to ship fast**

*Get your user management system up and running in minutes, not hours with Vibe Starter.*

## 🔗 Links

- [Live Demo](https://your-demo-url.com) - See it in action
- [Documentation](https://your-docs-url.com) - Detailed guides
- [GitHub Issues](https://github.com/yourusername/repo/issues) - Report bugs
- [GitHub Discussions](https://github.com/yourusername/repo/discussions) - Ask questions

---

*Happy coding! 🚀*