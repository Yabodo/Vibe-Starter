import { Resend } from 'resend'

export default defineEventHandler(async (event) => {
  try {
    const config = useRuntimeConfig()
    
    console.log('Testing email configuration...')
    console.log('RESEND_API_KEY exists:', !!config.resendApiKey)
    console.log('EMAIL_FROM:', config.emailFrom)
    
    if (!config.resendApiKey) {
      return { error: 'RESEND_API_KEY not configured' }
    }
    
    const resend = new Resend(config.resendApiKey)
    
    // Test sending a simple email
    const result = await resend.emails.send({
      from: config.emailFrom || 'noreply@example.com',
      to: 'test@example.com', // This won't actually send
      subject: 'Test Email',
      html: '<p>This is a test</p>'
    })
    
    return {
      success: true,
      config: {
        hasApiKey: !!config.resendApiKey,
        emailFrom: config.emailFrom
      },
      result
    }
  } catch (error) {
    console.error('Email test error:', error)
    return {
      error: error.message,
      details: error
    }
  }
})