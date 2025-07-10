import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    const { userId, traits, timestamp } = body

    // Create user activity record for identification
    await prisma.userActivity.create({
      data: {
        userId,
        action: 'identify',
        details: traits ? JSON.stringify(traits) : null,
        ipAddress: getClientIP(event) || 'unknown',
        userAgent: getHeader(event, 'user-agent') || '',
        createdAt: timestamp ? new Date(timestamp) : new Date()
      }
    })

    return { success: true }
  } catch (error) {
    console.error('Analytics identify error:', error)
    return { success: false, error: error.message }
  }
})