import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  try {
    console.log('Testing database connection...')
    
    // Test user count
    const userCount = await prisma.user.count()
    console.log('User count:', userCount)
    
    // Test if email templates table exists
    try {
      const templateCount = await prisma.emailTemplate.count()
      console.log('Email template count:', templateCount)
    } catch (templateError) {
      console.log('Email template table error:', templateError.message)
    }
    
    // Test if email log table exists
    try {
      const logCount = await prisma.emailLog.count()
      console.log('Email log count:', logCount)
    } catch (logError) {
      console.log('Email log table error:', logError.message)
    }
    
    return {
      success: true,
      userCount,
      message: 'Database connection working'
    }
  } catch (error) {
    console.error('Database test error:', error)
    return {
      error: error.message,
      details: error
    }
  }
})