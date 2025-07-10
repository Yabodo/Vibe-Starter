import { prisma } from '~/utils/db'
import jwt from 'jsonwebtoken'
import { writeFile, mkdir } from 'fs/promises'
import { existsSync } from 'fs'
import path from 'path'

export default defineEventHandler(async (event) => {
  const authHeader = getHeader(event, 'authorization')
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Authorization token required'
    })
  }

  const token = authHeader.substring(7)

  try {
    const config = useRuntimeConfig()
    const jwtSecret = config.jwtSecret || config.authSecret || 'your-secret-key'
    const decoded = jwt.verify(token, jwtSecret) as any
    
    const body = await readBody(event)
    const { imageData } = body
    
    if (!imageData) {
      throw createError({
        statusCode: 400,
        statusMessage: 'No image data provided'
      })
    }

    // Validate base64 format
    if (!imageData.startsWith('data:image/')) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Invalid image format'
      })
    }

    // Extract base64 data and file type
    const matches = imageData.match(/^data:image\/(png|jpeg|jpg|webp);base64,(.+)$/)
    if (!matches) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Invalid image data format'
      })
    }

    const [, fileType, base64Data] = matches
    const imageBuffer = Buffer.from(base64Data, 'base64')

    // Create uploads directory if it doesn't exist
    const uploadsDir = path.join(process.cwd(), 'public', 'uploads', 'avatars')
    if (!existsSync(uploadsDir)) {
      await mkdir(uploadsDir, { recursive: true })
    }

    // Generate unique filename
    const fileName = `${decoded.userId}-${Date.now()}.${fileType}`
    const filePath = path.join(uploadsDir, fileName)

    // Save the image
    await writeFile(filePath, imageBuffer)

    // Update user's profile image in database
    const imageUrl = `/uploads/avatars/${fileName}`
    
    const updatedUser = await prisma.user.update({
      where: { id: decoded.userId },
      data: { profileImage: imageUrl },
      include: {
        subscription: true
      }
    })

    return {
      message: 'Profile picture updated successfully',
      user: {
        id: updatedUser.id,
        email: updatedUser.email,
        name: updatedUser.name,
        role: updatedUser.role,
        profileImage: updatedUser.profileImage,
        createdAt: updatedUser.createdAt.toISOString(),
        subscription: updatedUser.subscription
      }
    }
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      throw createError({
        statusCode: 401,
        statusMessage: 'Invalid token'
      })
    }
    
    if (error.statusCode) {
      throw error
    }
    
    console.error('Avatar upload error:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to upload avatar'
    })
  }
})