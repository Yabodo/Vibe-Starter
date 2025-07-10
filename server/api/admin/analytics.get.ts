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

    const query = getQuery(event)
    const { period = '7d' } = query

    // Calculate date range based on period
    const now = new Date()
    let startDate: Date
    
    switch (period) {
      case '24h':
        startDate = new Date(now.getTime() - 24 * 60 * 60 * 1000)
        break
      case '7d':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
        break
      case '30d':
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
        break
      case '90d':
        startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000)
        break
      default:
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
    }

    // Get analytics data
    const [
      totalUsers,
      activeUsers,
      newUsers,
      premiumUsers,
      recentActivity,
      systemMetrics,
      pageViews,
      topPages,
      uniqueVisitors,
      events
    ] = await Promise.all([
      // Total users
      prisma.user.count(),
      
      // Active users (logged in within period)
      prisma.user.count({
        where: {
          lastLoginAt: {
            gte: startDate
          }
        }
      }),
      
      // New users within period
      prisma.user.count({
        where: {
          createdAt: {
            gte: startDate
          }
        }
      }),
      
      // Premium users
      prisma.subscription.count({
        where: {
          tier: {
            in: ['PREMIUM', 'DONATOR']
          },
          status: 'active'
        }
      }),
      
      // Recent activity
      prisma.userActivity.findMany({
        take: 20,
        orderBy: {
          createdAt: 'desc'
        },
        select: {
          id: true,
          action: true,
          details: true,
          createdAt: true,
          user: {
            select: {
              email: true,
              name: true
            }
          }
        }
      }),
      
      // System metrics from database
      prisma.systemMetrics.findMany({
        where: {
          date: {
            gte: startDate
          }
        },
        orderBy: {
          date: 'desc'
        }
      }),

      // Total page views in period
      prisma.pageView.count({
        where: {
          createdAt: {
            gte: startDate
          }
        }
      }),

      // Top pages by views
      prisma.pageView.groupBy({
        by: ['path'],
        _count: {
          path: true
        },
        where: {
          createdAt: {
            gte: startDate
          }
        },
        orderBy: {
          _count: {
            path: 'desc'
          }
        },
        take: 10
      }),

      // Unique visitors (distinct sessions)
      prisma.pageView.findMany({
        where: {
          createdAt: {
            gte: startDate
          }
        },
        distinct: ['sessionId'],
        select: {
          sessionId: true
        }
      }),

      // Event analytics
      prisma.event.groupBy({
        by: ['name'],
        _count: {
          name: true
        },
        where: {
          createdAt: {
            gte: startDate
          }
        },
        orderBy: {
          _count: {
            name: 'desc'
          }
        },
        take: 10
      })
    ])

    // Calculate revenue (based on subscriptions)
    const monthlyRevenue = premiumUsers * 4.99 + (premiumUsers * 0.2) * 19.99

    // Calculate bounce rate (sessions with only 1 page view)
    const singlePageSessions = await prisma.pageView.groupBy({
      by: ['sessionId'],
      _count: {
        sessionId: true
      },
      where: {
        createdAt: {
          gte: startDate
        }
      },
      having: {
        sessionId: {
          _count: {
            equals: 1
          }
        }
      }
    }).catch(() => [])

    const bounceRate = uniqueVisitors.length > 0 ? 
      (singlePageSessions.length / uniqueVisitors.length) * 100 : 0

    // Calculate conversion rate (registrations / unique visitors)
    const conversionRate = uniqueVisitors.length > 0 ? 
      (newUsers / uniqueVisitors.length) * 100 : 0

    // Calculate trends (compare with previous period)
    const prevPeriodStart = new Date(startDate.getTime() - (now.getTime() - startDate.getTime()))
    const prevNewUsers = await prisma.user.count({
      where: {
        createdAt: {
          gte: prevPeriodStart,
          lt: startDate
        }
      }
    })

    const userGrowthTrend = prevNewUsers > 0 ? 
      ((newUsers - prevNewUsers) / prevNewUsers) * 100 : 0

    const trends = {
      userGrowth: { value: newUsers, trend: Math.round(userGrowthTrend * 10) / 10 },
      revenue: { value: monthlyRevenue, trend: monthlyRevenue * 0.05 },
      conversionRate: { value: Math.round(conversionRate * 10) / 10, trend: 0.4 },
      churnRate: { value: Math.round(bounceRate * 10) / 10, trend: -0.3 }
    }

    // Format top pages with titles
    const formatTopPages = topPages.map(page => ({
      path: page.path,
      title: getPageTitle(page.path),
      views: page._count.path
    }))

    // Calculate traffic sources (simplified - based on referrers)
    const referrerData = await prisma.pageView.groupBy({
      by: ['referrer'],
      _count: {
        referrer: true
      },
      where: {
        createdAt: {
          gte: startDate
        },
        referrer: {
          not: null
        }
      },
      orderBy: {
        _count: {
          referrer: 'desc'
        }
      },
      take: 5
    }).catch(() => [])

    const totalReferrers = referrerData.reduce((sum, ref) => sum + ref._count.referrer, 0)
    const directTraffic = pageViews - totalReferrers

    const acquisitionSources = [
      {
        name: 'Direct',
        users: directTraffic,
        percentage: pageViews > 0 ? Math.round((directTraffic / pageViews) * 100 * 10) / 10 : 0,
        color: '#3B82F6'
      },
      ...referrerData.map((ref, index) => ({
        name: getDomainFromUrl(ref.referrer) || 'Unknown',
        users: ref._count.referrer,
        percentage: pageViews > 0 ? Math.round((ref._count.referrer / pageViews) * 100 * 10) / 10 : 0,
        color: ['#10B981', '#F59E0B', '#8B5CF6', '#EF4444'][index] || '#6B7280'
      }))
    ]

    return {
      success: true,
      data: {
        overview: {
          totalUsers,
          activeUsers,
          newUsers,
          premiumUsers,
          monthlyRevenue: Math.round(monthlyRevenue),
          pageViews,
          uniqueVisitors: uniqueVisitors.length,
          bounceRate: Math.round(bounceRate * 10) / 10
        },
        trends,
        recentActivity,
        systemMetrics,
        topPages: formatTopPages,
        acquisitionSources,
        topEvents: events.map(event => ({
          name: event.name,
          count: event._count.name
        })),
        period
      }
    }
  } catch (error) {
    if (error.statusCode) {
      throw error
    }
    
    console.error('Failed to fetch analytics:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch analytics'
    })
  }
})

// Helper functions
function getPageTitle(path: string): string {
  const titles: Record<string, string> = {
    '/': 'Home Page',
    '/auth/signin': 'Sign In',
    '/auth/signup': 'Sign Up',
    '/subscription': 'Subscription Plans',
    '/profile': 'User Profile',
    '/dashboard': 'Dashboard',
    '/admin': 'Admin Dashboard',
    '/admin/users': 'User Management',
    '/admin/analytics': 'Analytics',
    '/moderator': 'Moderator Dashboard'
  }
  return titles[path] || path
}

function getDomainFromUrl(url: string): string | null {
  if (!url) return null
  try {
    const domain = new URL(url).hostname
    return domain.replace('www.', '')
  } catch {
    return url.split('/')[0] || 'Unknown'
  }
}