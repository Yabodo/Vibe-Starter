import { PrismaClient } from '@prisma/client'
import crypto from 'crypto'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  try {
    const { email } = await readBody(event)
    console.log('Testing forgot password for email:', email)

    if (!email) {
      return { error: 'Email is required' }
    }

    // Step 1: Test user lookup
    console.log('Step 1: Looking up user...')
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() }
    })
    
    if (!user) {
      return { success: true, message: 'User not found (this is normal for security)' }
    }
    
    console.log('Step 2: User found:', user.email)
    
    // Step 2: Test token generation
    const resetToken = crypto.randomBytes(32).toString('hex')
    const resetTokenExpiry = new Date(Date.now() + 60 * 60 * 1000)
    
    console.log('Step 3: Generated token:', resetToken.substring(0, 10) + '...')
    
    // Step 3: Test database update
    console.log('Step 4: Updating user with reset token...')
    await prisma.user.update({
      where: { id: user.id },
      data: {
        resetToken,
        resetTokenExpiry
      }
    })
    
    console.log('Step 5: Database update successful')
    
    return {
      success: true,
      message: 'Test completed successfully',
      steps: [
        'User lookup: ✅',
        'Token generation: ✅', 
        'Database update: ✅',
        'Email sending: Skipped in test'
      ]
    }
  } catch (error) {
    console.error('Test forgot password error:', error)
    return {
      error: error.message,
      step: 'Failed during execution'
    }
  }
})