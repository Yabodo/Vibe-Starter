#!/usr/bin/env node

/**
 * Development schema setup
 * Ensures SQLite schema is used for local development
 */

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const schemaPath = path.join(__dirname, '../prisma/schema.prisma')
const currentSchema = fs.readFileSync(schemaPath, 'utf8')

console.log('🛠️ Checking development schema...')

// Check if we need to switch back to SQLite
if (currentSchema.includes('provider = "postgresql"')) {
  console.log('📝 Switching back to SQLite for development...')
  
  const sqliteSchema = currentSchema.replace(
    'provider = "postgresql"',
    'provider = "sqlite"'
  )
  
  fs.writeFileSync(schemaPath, sqliteSchema)
  console.log('✅ SQLite schema configured for development')
} else {
  console.log('✅ SQLite schema already configured')
}