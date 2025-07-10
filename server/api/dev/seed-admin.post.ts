import { prisma } from '~/utils/db'
import bcrypt from 'bcryptjs'

export default defineEventHandler(async (event) => {
  // Only allow in development
  if (process.env.NODE_ENV !== 'development') {
    throw createError({
      statusCode: 403,
      statusMessage: 'Not available in production'
    })
  }

  try {
    // Create admin user
    const hashedPassword = await bcrypt.hash('admin123', 12)
    
    const adminUser = await prisma.user.create({
      data: {
        email: 'admin@example.com',
        name: 'Admin User',
        password: hashedPassword,
        role: 'ADMIN',
        isActive: true,
        lastLoginAt: new Date(),
        twoFactorEnabled: false
      }
    })

    // Create a premium subscription for the admin
    await prisma.subscription.create({
      data: {
        userId: adminUser.id,
        tier: 'PREMIUM',
        status: 'active',
        startDate: new Date(),
        endDate: null
      }
    })

    // Also create a moderator user for testing
    const modPassword = await bcrypt.hash('mod123', 12)
    const modUser = await prisma.user.create({
      data: {
        email: 'moderator@example.com',
        name: 'Moderator User',
        password: modPassword,
        role: 'MODERATOR',
        isActive: true,
        lastLoginAt: new Date(),
        twoFactorEnabled: false
      }
    })

    return {
      success: true,
      message: 'Admin and moderator users created successfully',
      users: [
        {
          email: 'admin@example.com',
          password: 'admin123',
          role: 'ADMIN',
          name: 'Admin User'
        },
        {
          email: 'moderator@example.com', 
          password: 'mod123',
          role: 'MODERATOR',
          name: 'Moderator User'
        }
      ]
    }
  } catch (error) {
    console.error('Failed to seed admin user:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to create admin user'
    })
  }
})