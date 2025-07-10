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

    const userId = getRouterParam(event, 'id')
    const body = await readBody(event)
    
    const { name, email, role, isActive } = body

    // Validate role
    if (role && !['USER', 'MODERATOR', 'ADMIN'].includes(role)) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Invalid role'
      })
    }

    // Update user
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        ...(name !== undefined && { name }),
        ...(email !== undefined && { email }),
        ...(role !== undefined && { role }),
        ...(isActive !== undefined && { isActive })
      },
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
      }
    })

    // Log the activity
    await prisma.userActivity.create({
      data: {
        userId: decoded.userId,
        action: 'admin_user_updated',
        details: JSON.stringify({
          targetUserId: userId,
          changes: body
        })
      }
    })

    return {
      success: true,
      data: { user: updatedUser }
    }
  } catch (error) {
    if (error.statusCode) {
      throw error
    }
    
    console.error('Failed to update user:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to update user'
    })
  }
})