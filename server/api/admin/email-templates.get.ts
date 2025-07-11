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

    // Get all email templates
    const templates = await prisma.emailTemplate.findMany({
      orderBy: {
        name: 'asc'
      }
    })

    return {
      success: true,
      data: templates
    }
  } catch (error) {
    if (error.statusCode) {
      throw error
    }
    
    console.error('Failed to fetch email templates:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch email templates'
    })
  }
})