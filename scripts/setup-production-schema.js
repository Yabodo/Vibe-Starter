#!/usr/bin/env node

/**
 * Production schema setup for Vercel deployment
 * Automatically switches to PostgreSQL schema during build
 */

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const schemaPath = path.join(__dirname, '../prisma/schema.prisma')
const prodSchemaPath = path.join(__dirname, '../prisma/schema.production.prisma')

console.log('🚀 Setting up PostgreSQL schema for production build...')

try {
  // Copy production schema (PostgreSQL) to main schema file
  const prodSchema = fs.readFileSync(prodSchemaPath, 'utf8')
  fs.writeFileSync(schemaPath, prodSchema)
  console.log('✅ PostgreSQL schema configured for production')
} catch (error) {
  console.error('❌ Failed to setup production schema:', error.message)
  process.exit(1)
}