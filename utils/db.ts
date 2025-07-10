// Try importing PrismaClient, fallback to mock if it fails
let PrismaClient: any

try {
  const { PrismaClient: Client } = require('@prisma/client')
  PrismaClient = Client
} catch (error) {
  console.warn('Prisma Client not available, using mock:', error.message)
  // Mock PrismaClient for environments where it's not available
  PrismaClient = class MockPrismaClient {
    constructor() {
      console.warn('Using mock Prisma client')
    }
    async $connect() { return Promise.resolve() }
    async $disconnect() { return Promise.resolve() }
    user = {
      findUnique: () => Promise.resolve(null),
      findMany: () => Promise.resolve([]),
      create: () => Promise.resolve({}),
      update: () => Promise.resolve({}),
      delete: () => Promise.resolve({})
    }
    subscription = {
      findUnique: () => Promise.resolve(null),
      create: () => Promise.resolve({}),
      update: () => Promise.resolve({}),
      delete: () => Promise.resolve({})
    }
    account = {
      findUnique: () => Promise.resolve(null),
      findMany: () => Promise.resolve([]),
      create: () => Promise.resolve({}),
      update: () => Promise.resolve({}),
      delete: () => Promise.resolve({})
    }
  }
}

// Global variable to hold the Prisma client instance
declare global {
  var __prisma: any | undefined
}

// Create a single instance of Prisma client
let prisma: any

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