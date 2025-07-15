# Production Deployment Guide

## Database Configuration Fix

The production 500 errors were caused by database provider mismatch. Here's how to fix it:

### For Vercel Deployment:

1. **Set Environment Variables in Vercel Dashboard:**
   ```
   DATABASE_PROVIDER=postgresql
   DATABASE_URL=your_postgresql_connection_string
   RESEND_API_KEY=your_resend_api_key
   EMAIL_FROM=your_email_address
   NUXT_AUTH_SECRET=your_auth_secret_key
   JWT_SECRET=your_jwt_secret_key
   ```

2. **Deploy with Production Schema:**
   ```bash
   # Copy production schema before deployment
   cp prisma/schema.production.prisma prisma/schema.prisma
   git add .
   git commit -m "Configure PostgreSQL for production"
   git push
   ```

3. **⚠️ REQUIRED: Initial Database Setup**
   After your first deployment, you MUST create the database tables:
   
   ```bash
   # Install Vercel CLI if not already installed
   npm install -g vercel
   
   # Link your local project to Vercel
   vercel link
   
   # Pull production environment variables
   vercel env pull .env.production
   
   # Set the production DATABASE_URL and create tables
   # Replace with your actual DATABASE_URL from Vercel dashboard
   $env:DATABASE_URL="your_production_postgresql_url_here"
   npx prisma db push --accept-data-loss --schema=prisma/schema.production.prisma
   ```
   
   **⚠️ Important**: 
   - This step is **required** for the initial deployment only
   - Use `--accept-data-loss` flag only for the first migration
   - Future schema changes should use proper migrations without this flag

### Development vs Production:

- **Development**: Uses SQLite (`provider = "sqlite"`, `DATABASE_URL="file:./dev.db"`)
- **Production**: Uses PostgreSQL (`provider = "postgresql"`, `DATABASE_URL=postgres://...`)

### Automated Setup:

Use the provided scripts:
```bash
# For development (SQLite)
npm run db:setup:dev

# For production setup (PostgreSQL) 
npm run db:setup:prod
```

## Next Steps After Database Fix:

1. Test admin login at `/auth/signin` with:
   - Email: `admin@example.com`
   - Password: `admin123`

2. Access admin analytics at `/admin/analytics`

3. Test password reset functionality

4. Continue with next item in STEPS.md roadmap