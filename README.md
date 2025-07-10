# 🚀 Modern User Management & Subscription Boilerplate

**Nuxt 3 + Prisma + TypeScript + Tailwind CSS**

A comprehensive, production-ready boilerplate for building modern web applications with user authentication, subscription management, and two-factor authentication. Built with the latest technologies and best practices.

[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Nuxt 3](https://img.shields.io/badge/Nuxt-00C58E?style=for-the-badge&logo=nuxt.js&logoColor=white)](https://nuxt.com/)
[![Prisma](https://img.shields.io/badge/Prisma-3982CE?style=for-the-badge&logo=Prisma&logoColor=white)](https://prisma.io/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)

## ✨ Features

### 🔐 **Complete Authentication System**
- **User Registration & Login** - Secure JWT-based authentication
- **Two-Factor Authentication (2FA)** - TOTP with QR codes and backup codes
- **Password Management** - Secure password hashing with bcrypt
- **Auto-redirect Logic** - Smart redirects for authenticated users
- **Session Management** - Persistent login with secure token handling

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
- **Responsive Design** - Mobile-first approach with Tailwind CSS
- **Smooth Animations** - Polished transitions and interactions
- **Accessibility** - WCAG compliant with proper ARIA labels
- **Component Library** - Reusable, consistent components

### 🛡️ **Security & Best Practices**
- **Input Validation** - Server and client-side validation
- **CSRF Protection** - Cross-site request forgery prevention
- **Rate Limiting** - Built-in API rate limiting
- **Secure Headers** - Security headers configuration
- **Environment Variables** - Secure configuration management

## 🚀 Quick Start

### Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js 18+** ([Download](https://nodejs.org/))
- **npm** or **yarn** (comes with Node.js)
- **SQLite** (for development) or **PostgreSQL** (for production)

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/user-management-boilerplate.git
cd user-management-boilerplate
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

🎉 **Your app is now running at [http://localhost:3000](http://localhost:3000)**

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
│   ├── ThemeToggle.vue     # Dark/light mode toggle
│   └── SparkleEffect.vue   # Animation components
├── 📁 composables/         # Vue composables
│   └── useTheme.ts         # Theme management logic
├── 📁 middleware/          # Route middleware
│   └── auth.ts             # Authentication guard
├── 📁 pages/               # File-based routing
│   ├── index.vue           # Landing page
│   ├── dashboard.vue       # User dashboard
│   ├── profile.vue         # User profile settings
│   ├── subscription.vue    # Subscription management
│   ├── auth/
│   │   ├── signin.vue      # Login page
│   │   └── signup.vue      # Registration page
│   └── security/
│       └── 2fa-setup.vue   # Two-factor auth setup
├── 📁 server/              # Server-side API
│   └── api/
│       ├── auth/           # Authentication endpoints
│       │   ├── login.post.ts
│       │   └── 2fa/
│       │       ├── setup.post.ts
│       │       ├── verify.post.ts
│       │       └── disable.post.ts
│       ├── users/          # User management
│       │   ├── profile.get.ts
│       │   ├── profile.put.ts
│       │   ├── profile.delete.ts
│       │   ├── register.post.ts
│       │   └── upload-avatar.post.ts
│       └── subscriptions/  # Subscription management
│           ├── index.get.ts
│           ├── upgrade.post.ts
│           └── cancel.post.ts
├── 📁 prisma/              # Database configuration
│   ├── schema.prisma       # Database schema
│   ├── dev.db              # SQLite database (development)
│   └── migrations/         # Database migrations
├── 📁 utils/               # Utility functions
│   └── twoFactor.ts        # 2FA utilities
├── 📁 public/              # Static assets
│   └── uploads/            # User uploaded files
├── nuxt.config.ts          # Nuxt configuration
├── tailwind.config.js      # Tailwind CSS config
└── package.json            # Dependencies
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
  role         String   @default("USER")
  profileImage String?
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt
  
  // 2FA fields
  twoFactorEnabled Boolean @default(false)
  twoFactorSecret  String?
  backupCodes      String? // JSON array
  
  subscription Subscription?
  sessions     Session[]
  accounts     Account[]
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

### Common Issues

**"Invalid token" errors:**
- Check JWT_SECRET is set correctly
- Ensure environment variables are loaded
- Try signing out and back in

**Database connection issues:**
- Verify DATABASE_URL format
- Check database is running
- Run `npx prisma generate`

**2FA setup problems:**
- Clear browser localStorage
- Check time sync on authenticator device
- Use backup codes if available

**Build errors:**
- Clear `.nuxt` folder: `rm -rf .nuxt`
- Reinstall dependencies: `npm install`
- Check Node.js version compatibility

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

*Get your user management system up and running in minutes, not hours.*

## 🔗 Links

- [Live Demo](https://your-demo-url.com) - See it in action
- [Documentation](https://your-docs-url.com) - Detailed guides
- [GitHub Issues](https://github.com/yourusername/repo/issues) - Report bugs
- [GitHub Discussions](https://github.com/yourusername/repo/discussions) - Ask questions

---

*Happy coding! 🚀*