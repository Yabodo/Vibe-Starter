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
          isActive: true,
          lastLoginAt: null,
          role: 'USER',
          ...data 
        }
        this.mockData.set(`user:email:${data.email}`, user)
        this.mockData.set(`user:id:${user.id}`, user)
        console.log(`✅ Mock created user: ${data.email} with role: ${user.role}`)
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
      },
      
      findMany: ({ where, skip, take, select, orderBy }: any) => {
        const users = Array.from(this.mockData.values()).filter((data: any) => 
          data.email && data.id && data.id.startsWith('mock-')
        )
        
        let filteredUsers = users
        
        // Apply filters
        if (where) {
          filteredUsers = users.filter((user: any) => {
            let matches = true
            
            if (where.OR) {
              matches = where.OR.some((condition: any) => {
                if (condition.email?.contains) {
                  return user.email.toLowerCase().includes(condition.email.contains.toLowerCase())
                }
                if (condition.name?.contains) {
                  return user.name?.toLowerCase().includes(condition.name.contains.toLowerCase())
                }
                return false
              })
            }
            
            if (where.role) {
              matches = matches && user.role === where.role
            }
            
            if (where.isActive !== undefined) {
              matches = matches && user.isActive === where.isActive
            }
            
            return matches
          })
        }
        
        // Apply ordering
        if (orderBy?.createdAt === 'desc') {
          filteredUsers.sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        }
        
        // Apply pagination
        if (skip || take) {
          const start = skip || 0
          const end = take ? start + take : filteredUsers.length
          filteredUsers = filteredUsers.slice(start, end)
        }
        
        // Apply selection
        if (select) {
          filteredUsers = filteredUsers.map((user: any) => {
            const selectedUser: any = {}
            Object.keys(select).forEach(key => {
              if (select[key] === true) {
                selectedUser[key] = user[key]
              } else if (typeof select[key] === 'object' && key === 'subscription') {
                const sub = this.mockData.get(`subscription:${user.id}`)
                if (sub && select[key].select) {
                  selectedUser[key] = {}
                  Object.keys(select[key].select).forEach(subKey => {
                    selectedUser[key][subKey] = sub[subKey]
                  })
                } else {
                  selectedUser[key] = sub
                }
              }
            })
            return selectedUser
          })
        }
        
        return Promise.resolve(filteredUsers)
      },
      
      count: ({ where }: any) => {
        const users = Array.from(this.mockData.values()).filter((data: any) => 
          data.email && data.id && data.id.startsWith('mock-')
        )
        
        if (!where) return Promise.resolve(users.length)
        
        const filteredUsers = users.filter((user: any) => {
          let matches = true
          
          if (where.OR) {
            matches = where.OR.some((condition: any) => {
              if (condition.email?.contains) {
                return user.email.toLowerCase().includes(condition.email.contains.toLowerCase())
              }
              if (condition.name?.contains) {
                return user.name?.toLowerCase().includes(condition.name.contains.toLowerCase())
              }
              return false
            })
          }
          
          if (where.role) {
            matches = matches && user.role === where.role
          }
          
          if (where.isActive !== undefined) {
            matches = matches && user.isActive === where.isActive
          }
          
          if (where.lastLoginAt?.gte) {
            matches = matches && user.lastLoginAt && new Date(user.lastLoginAt) >= new Date(where.lastLoginAt.gte)
          }
          
          if (where.createdAt?.gte) {
            matches = matches && new Date(user.createdAt) >= new Date(where.createdAt.gte)
          }
          
          return matches
        })
        
        return Promise.resolve(filteredUsers.length)
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
    
    userActivity = {
      findMany: ({ take, orderBy, select }: any) => {
        // Mock activity data
        const activities = [
          {
            id: 'activity-1',
            action: 'user_login',
            details: '{"ip": "192.168.1.1"}',
            createdAt: new Date(Date.now() - 1000 * 60 * 15),
            user: { email: 'user@example.com', name: 'Test User' }
          },
          {
            id: 'activity-2', 
            action: 'subscription_upgrade',
            details: '{"from": "FREE", "to": "PREMIUM"}',
            createdAt: new Date(Date.now() - 1000 * 60 * 30),
            user: { email: 'premium@example.com', name: 'Premium User' }
          }
        ].slice(0, take || 20)
        return Promise.resolve(activities)
      },
      
      create: ({ data }: any) => {
        const activity = {
          id: 'activity-' + Date.now(),
          createdAt: new Date(),
          ...data
        }
        return Promise.resolve(activity)
      }
    }
    
    systemMetrics = {
      findMany: () => {
        return Promise.resolve([
          { metricType: 'page_views', value: 15640, date: new Date() },
          { metricType: 'conversion_rate', value: 3.2, date: new Date() },
          { metricType: 'avg_session_time', value: 272, date: new Date() }
        ])
      }
    }
  }
  
  prisma = new SmartMockClient()
  
} else {
  console.log('🗄️ Using Real Database Connection')
  
  // Lazy-load PrismaClient to avoid bundling issues
  let PrismaClient: any = null
  let clientInstance: any = null
  
  const getPrismaClient = async () => {
    if (!PrismaClient) {
      try {
        const prismaModule = await import('@prisma/client')
        PrismaClient = prismaModule.PrismaClient
      } catch (error) {
        console.error('Failed to import Prisma Client:', error)
        throw error
      }
    }
    
    if (!clientInstance) {
      // Check if we have a valid database URL
      const isDatabaseAvailable = () => {
        const dbUrl = process.env.DATABASE_URL
        return dbUrl && dbUrl !== 'postgresql://placeholder:placeholder@placeholder:5432/placeholder'
      }

      if (process.env.NODE_ENV === 'production') {
        // In production, always create a new instance
        clientInstance = new PrismaClient()
      } else {
        // In development, use global variable to prevent multiple instances
        if (!global.__prisma && isDatabaseAvailable()) {
          global.__prisma = new PrismaClient({
            log: ['query', 'error', 'warn'],
          })
        }
        clientInstance = global.__prisma || new PrismaClient()
      }
    }
    
    return clientInstance
  }
  
  // Create a proxy object that lazy-loads the real client and forwards all methods
  prisma = new Proxy({}, {
    get(target, prop) {
      return new Proxy({}, {
        get(modelTarget, method) {
          return async (...args: any[]) => {
            const client = await getPrismaClient()
            return client[prop][method](...args)
          }
        }
      })
    }
  })
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