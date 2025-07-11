#!/usr/bin/env node

/**
 * Database setup script for different environments
 * Usage: 
 *   npm run db:setup:dev - Sets up SQLite for development
 *   npm run db:setup:prod - Sets up PostgreSQL for production
 */

import fs from 'fs'
import path from 'path'
import { execSync } from 'child_process'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const environment = process.argv[2] || 'dev'

const schemaPath = path.join(__dirname, '../prisma/schema.prisma')
const prodSchemaPath = path.join(__dirname, '../prisma/schema.production.prisma')

console.log(`🔧 Setting up database for ${environment} environment...`)

if (environment === 'prod' || environment === 'production') {
  // Copy production schema to main schema file
  const prodSchema = fs.readFileSync(prodSchemaPath, 'utf8')
  fs.writeFileSync(schemaPath, prodSchema)
  console.log('✅ Production schema (PostgreSQL) configured')
} else {
  // Development already has SQLite configured
  console.log('✅ Development schema (SQLite) already configured')
}

try {
  // Generate Prisma client
  console.log('📦 Generating Prisma client...')
  execSync('npx prisma generate', { stdio: 'inherit' })
  
  if (environment === 'dev' || environment === 'development') {
    // Run migrations for development
    console.log('🔄 Running database migrations...')
    execSync('npx prisma db push --accept-data-loss', { stdio: 'inherit' })
  }
  
  console.log('✅ Database setup complete!')
} catch (error) {
  console.error('❌ Database setup failed:', error.message)
  process.exit(1)
}