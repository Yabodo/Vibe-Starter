import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    const { path, title, referrer, userId, timestamp } = body

    // Get client information
    const userAgent = getHeader(event, 'user-agent') || ''
    const forwarded = getHeader(event, 'x-forwarded-for')
    const ipAddress = forwarded ? forwarded.split(',')[0] : 
                     getClientIP(event) || 'unknown'

    // Generate session ID
    const sessionId = `session_${Buffer.from(ipAddress + userAgent + Date.now().toString()).toString('base64').slice(0, 16)}`

    // Store the page view
    await prisma.pageView.create({
      data: {
        path,
        title,
        referrer,
        userId,
        sessionId,
        ipAddress,
        userAgent,
        createdAt: timestamp ? new Date(timestamp) : new Date()
      }
    })

    // Update daily page views metric
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const existingMetric = await prisma.systemMetrics.findFirst({
      where: {
        metricType: 'daily_pageviews',
        date: {
          gte: today,
          lt: new Date(today.getTime() + 24 * 60 * 60 * 1000)
        }
      }
    })

    if (existingMetric) {
      await prisma.systemMetrics.update({
        where: { id: existingMetric.id },
        data: { value: existingMetric.value + 1 }
      })
    } else {
      await prisma.systemMetrics.create({
        data: {
          metricType: 'daily_pageviews',
          value: 1,
          date: today
        }
      })
    }

    return { success: true }
  } catch (error) {
    console.error('Pageview tracking error:', error)
    return { success: false, error: error.message }
  }
})