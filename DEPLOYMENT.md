# Production Deployment Guide

## Database Configuration Fix

The production 500 errors were caused by database provider mismatch. Here's how to fix it:

### For Vercel Deployment:

1. **Set Environment Variables in Vercel Dashboard:**
   ```
   DATABASE_PROVIDER=postgresql
   DATABASE_URL=postgres://neondb_owner:npg_wu8zM1WSBrIO@ep-flat-surf-a2zj3swy-pooler.eu-central-1.aws.neon.tech/neondb?sslmode=require
   RESEND_API_KEY=re_CJtRxZye_QCoZc5p4LEd8GacuCTKo62LD
   EMAIL_FROM=noreply@synctuition.ee
   NUXT_AUTH_SECRET=wer5tyuiookjhgfdefvbnmkju65rfvbnji876t5r43edfvghjui876t54re3wsxcfghuio0oikjhbgfTYHGVCFRERTY
   JWT_SECRET=wer5tyuiookjhgfdefvbnmkju65rfvbnji876t5r43edfvghjui876t54re3wsxcfghuio0oikjhbgfTYHGVCFRERTY
   ```

2. **Deploy with Production Schema:**
   ```bash
   # Copy production schema before deployment
   cp prisma/schema.production.prisma prisma/schema.prisma
   git add .
   git commit -m "Configure PostgreSQL for production"
   git push
   ```

3. **Run Database Migration in Production:**
   After deployment, you may need to run:
   ```bash
   # In Vercel Functions tab, or via Vercel CLI
   npx prisma db push
   ```

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