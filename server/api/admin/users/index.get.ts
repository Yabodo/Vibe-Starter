import jwt from 'jsonwebtoken'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  try {
    // Check authorization
    const authHeader = getHeader(event, 'authorization')
    if (!authHeader?.startsWith('Bearer ')) {
      throw createError({
        statusCode: 401,
        statusMessage: 'Authorization required'
      })
    }

    const token = authHeader.substring(7)
    const config = useRuntimeConfig()
    const decoded = jwt.verify(token, config.jwtSecret) as { userId: string, role: string }
    
    // Check if user is admin
    if (decoded.role !== 'ADMIN') {
      throw createError({
        statusCode: 403,
        statusMessage: 'Admin access required'
      })
    }

    // Get query parameters
    const query = getQuery(event)
    const { search, role, status, page = 1, limit = 10 } = query

    const skip = (Number(page) - 1) * Number(limit)
    const take = Number(limit)

    // Build where clause
    const where: any = {}
    
    if (search) {
      where.OR = [
        { email: { contains: search as string, mode: 'insensitive' } },
        { name: { contains: search as string, mode: 'insensitive' } }
      ]
    }
    
    if (role) {
      where.role = role
    }
    
    if (status === 'active') {
      where.isActive = true
    } else if (status === 'inactive') {
      where.isActive = false
    }

    // Get users with pagination
    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        skip,
        take,
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          isActive: true,
          lastLoginAt: true,
          createdAt: true,
          profileImage: true,
          subscription: {
            select: {
              tier: true,
              status: true
            }
          }
        },
        orderBy: {
          createdAt: 'desc'
        }
      }),
      prisma.user.count({ where })
    ])

    return {
      success: true,
      data: {
        users,
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total,
          pages: Math.ceil(total / Number(limit))
        }
      }
    }
  } catch (error) {
    if (error.statusCode) {
      throw error
    }
    
    console.error('Failed to fetch users:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch users'
    })
  }
})