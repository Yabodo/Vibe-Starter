// Import PrismaClient - this should work in both environments
import { PrismaClient } from '@prisma/client'

// Check if we should use mock (development with no real DB)
const shouldUseMock = 
  process.env.NODE_ENV === 'development' && 
  (!process.env.DATABASE_URL || 
   process.env.DATABASE_URL.includes('placeholder') ||
   process.env.FORCE_MOCK_DB === 'true')

// Global variable to hold the Prisma client instance
declare global {
  var __prisma: any | undefined
}

let prisma: any

if (shouldUseMock) {
  console.log('🎭 Using Mock Database for Development')
  
  // Enhanced Mock Client with in-memory storage
  class SmartMockClient {
    private mockData = new Map()
    
    constructor() {
      console.log('🎭 Mock Prisma Client initialized')
    }
    
    async $connect() { return Promise.resolve() }
    async $disconnect() { return Promise.resolve() }
    
    user = {
      findUnique: ({ where }: any) => {
        const key = where.email ? `user:email:${where.email}` : `user:id:${where.id}`
        const user = this.mockData.get(key)
        console.log(`🔍 Mock findUnique user: ${key} -> ${!!user}`)
        return Promise.resolve(user || null)
      },
      
      create: ({ data }: any) => {
        const user = { 
          id: 'mock-' + Date.now() + Math.random().toString(36).slice(2), 
          createdAt: new Date(),
          updatedAt: new Date(),
          twoFactorEnabled: false,
          ...data 
        }
        this.mockData.set(`user:email:${data.email}`, user)
        this.mockData.set(`user:id:${user.id}`, user)
        console.log(`✅ Mock created user: ${data.email}`)
        return Promise.resolve(user)
      },
      
      update: ({ where, data }: any) => {
        const key = where.email ? `user:email:${where.email}` : `user:id:${where.id}`
        const existingUser = this.mockData.get(key)
        if (existingUser) {
          const updatedUser = { ...existingUser, ...data, updatedAt: new Date() }
          this.mockData.set(key, updatedUser)
          // Update both keys if email changed
          if (data.email && data.email !== existingUser.email) {
            this.mockData.delete(`user:email:${existingUser.email}`)
            this.mockData.set(`user:email:${data.email}`, updatedUser)
          }
          return Promise.resolve(updatedUser)
        }
        return Promise.resolve(null)
      },
      
      delete: ({ where }: any) => {
        const key = where.email ? `user:email:${where.email}` : `user:id:${where.id}`
        const user = this.mockData.get(key)
        if (user) {
          this.mockData.delete(`user:email:${user.email}`)
          this.mockData.delete(`user:id:${user.id}`)
        }
        return Promise.resolve(user || null)
      }
    }
    
    subscription = {
      findUnique: ({ where }: any) => {
        const sub = this.mockData.get(`subscription:${where.userId || where.id}`)
        return Promise.resolve(sub || null)
      },
      
      create: ({ data }: any) => {
        const subscription = { 
          id: 'mock-sub-' + Date.now(), 
          createdAt: new Date(),
          updatedAt: new Date(),
          startDate: new Date(),
          endDate: null,
          ...data 
        }
        this.mockData.set(`subscription:${data.userId}`, subscription)
        return Promise.resolve(subscription)
      },
      
      update: ({ where, data }: any) => {
        const key = `subscription:${where.userId || where.id}`
        const existing = this.mockData.get(key)
        if (existing) {
          const updated = { ...existing, ...data, updatedAt: new Date() }
          this.mockData.set(key, updated)
          return Promise.resolve(updated)
        }
        return Promise.resolve(null)
      },
      
      delete: ({ where }: any) => {
        const key = `subscription:${where.userId || where.id}`
        const sub = this.mockData.get(key)
        if (sub) this.mockData.delete(key)
        return Promise.resolve(sub || null)
      }
    }
    
    account = {
      findUnique: () => Promise.resolve(null),
      findMany: () => Promise.resolve([]),
      create: (data: any) => Promise.resolve({ id: 'mock-account-' + Date.now(), ...data }),
      update: () => Promise.resolve({}),
      delete: () => Promise.resolve({})
    }
  }
  
  prisma = new SmartMockClient()
  
} else {
  console.log('🗄️ Using Real Database Connection')
  
  // Check if we have a valid database URL
  const isDatabaseAvailable = () => {
    const dbUrl = process.env.DATABASE_URL
    return dbUrl && dbUrl !== 'postgresql://placeholder:placeholder@placeholder:5432/placeholder'
  }

  if (process.env.NODE_ENV === 'production') {
    // In production, always create a new instance
    prisma = new PrismaClient()
  } else {
    // In development, use global variable to prevent multiple instances
    if (!global.__prisma && isDatabaseAvailable()) {
      global.__prisma = new PrismaClient({
        log: ['query', 'error', 'warn'],
      })
    }
    prisma = global.__prisma || new PrismaClient()
  }
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