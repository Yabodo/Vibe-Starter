import { prisma } from '~/utils/db'
import bcrypt from 'bcryptjs'

export default defineEventHandler(async (event) => {
  try {
    const { email, password } = await readBody(event)
    
    console.log('Testing login for:', email)
    
    // Step 1: Check if user exists
    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        name: true,
        password: true,
        role: true,
        isActive: true
      }
    })
    
    if (!user) {
      return { 
        error: 'User not found',
        step: 'user_lookup'
      }
    }
    
    console.log('User found:', {
      id: user.id,
      email: user.email,
      role: user.role,
      isActive: user.isActive,
      hasPassword: !!user.password
    })
    
    // Step 2: Test password comparison
    const isPasswordValid = await bcrypt.compare(password, user.password)
    
    console.log('Password comparison result:', isPasswordValid)
    
    if (!isPasswordValid) {
      return {
        error: 'Password mismatch',
        step: 'password_verification',
        passwordProvided: password,
        passwordLength: password.length
      }
    }
    
    // Step 3: Test JWT secret
    const config = useRuntimeConfig()
    const jwtSecret = config.jwtSecret || config.authSecret
    
    console.log('JWT Secret exists:', !!jwtSecret)
    
    return {
      success: true,
      message: 'Login test successful',
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        isActive: user.isActive
      },
      config: {
        hasJwtSecret: !!jwtSecret
      }
    }
  } catch (error) {
    console.error('Login test error:', error)
    return {
      error: error.message,
      details: error
    }
  }
})