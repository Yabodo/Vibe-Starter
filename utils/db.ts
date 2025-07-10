import { PrismaClient } from '@prisma/client'

// Global variable to hold the Prisma client instance
declare global {
  var __prisma: PrismaClient | undefined
}

// Create a single instance of Prisma client
let prisma: PrismaClient

if (process.env.NODE_ENV === 'production') {
  // In production, always create a new instance
  prisma = new PrismaClient()
} else {
  // In development, use global variable to prevent multiple instances
  if (!global.__prisma) {
    global.__prisma = new PrismaClient({
      log: ['query', 'error', 'warn'],
    })
  }
  prisma = global.__prisma
}

// Ensure the client disconnects when the process exits
process.on('beforeExit', async () => {
  await prisma.$disconnect()
})

export { prisma }
export default prisma