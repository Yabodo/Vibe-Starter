// Import PrismaClient directly
import { PrismaClient } from '@prisma/client'

// Global variable to hold the Prisma client instance
declare global {
  var __prisma: PrismaClient | undefined
}

// Create a single instance of Prisma client
let prisma: PrismaClient

// Check if we have a valid database URL
const isDatabaseAvailable = () => {
  const dbUrl = process.env.DATABASE_URL
  return dbUrl && dbUrl !== 'postgresql://placeholder:placeholder@placeholder:5432/placeholder'
}

if (process.env.NODE_ENV === 'production') {
  // In production, always create a new instance if database is available
  if (isDatabaseAvailable()) {
    prisma = new PrismaClient()
  } else {
    // Create a client with a placeholder - this will fail at runtime but allows build to succeed
    prisma = new PrismaClient()
  }
} else {
  // In development, use global variable to prevent multiple instances
  if (!global.__prisma && isDatabaseAvailable()) {
    global.__prisma = new PrismaClient({
      log: ['query', 'error', 'warn'],
    })
  }
  prisma = global.__prisma || new PrismaClient()
}

// Ensure the client disconnects when the process exits
process.on('beforeExit', async () => {
  try {
    await prisma.$disconnect()
  } catch (error) {
    // Ignore disconnect errors during shutdown
    console.warn('Error disconnecting from database:', error)
  }
})

export { prisma }
export default prisma