import { Resend } from 'resend'
import handlebars from 'handlebars'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

interface EmailOptions {
  to: string
  subject: string
  template?: string
  variables?: Record<string, any>
  html?: string
  text?: string
}

class EmailService {
  private resend: Resend
  private config: any

  constructor() {
    this.config = useRuntimeConfig()
    
    if (!this.config.resendApiKey) {
      throw new Error('RESEND_API_KEY environment variable is required')
    }
    
    this.resend = new Resend(this.config.resendApiKey)
  }

  async sendEmail(options: EmailOptions): Promise<{ success: boolean; messageId?: string; error?: string }> {
    try {
      let html = options.html
      let subject = options.subject

      // Use template if specified
      if (options.template) {
        const template = await this.getTemplate(options.template)
        if (template) {
          html = this.compileTemplate(template.htmlContent, options.variables || {})
          subject = this.compileTemplate(template.subject, options.variables || {})
        }
      }

      const emailData = {
        to: options.to,
        from: this.config.emailFrom || 'noreply@example.com',
        subject,
        html: html || options.text,
        text: options.text
      }

      // Send via Resend
      const response = await this.resend.emails.send(emailData)
      
      const result = {
        success: !!response.data,
        messageId: response.data?.id || '',
        error: response.error?.message || ''
      }

      // Log email attempt
      await this.logEmail({
        to: options.to,
        from: emailData.from,
        subject,
        template: options.template,
        status: result.success ? 'sent' : 'failed',
        error: result.error || null,
        sentAt: result.success ? new Date() : null
      })

      return result
    } catch (error) {
      console.error('Email service error:', error)
      
      // Log failed attempt
      await this.logEmail({
        to: options.to,
        from: this.config.emailFrom || 'noreply@example.com',
        subject: options.subject,
        template: options.template,
        status: 'failed',
        error: error.message,
        sentAt: null
      })
      
      return { success: false, error: error.message }
    }
  }

  private async getTemplate(name: string) {
    try {
      return await prisma.emailTemplate.findUnique({
        where: { name, isActive: true }
      })
    } catch (error) {
      console.error('Failed to get email template:', error)
      return null
    }
  }

  private compileTemplate(template: string, variables: Record<string, any>): string {
    try {
      const compiled = handlebars.compile(template)
      return compiled(variables)
    } catch (error) {
      console.error('Template compilation error:', error)
      return template
    }
  }

  private async logEmail(data: any) {
    try {
      await prisma.emailLog.create({ data })
    } catch (error) {
      console.error('Failed to log email:', error)
    }
  }

  // Convenience methods
  async sendWelcomeEmail(to: string, name: string) {
    return this.sendEmail({
      to,
      template: 'welcome',
      variables: { name, appName: 'Vibe Starter' }
    })
  }

  async sendPasswordResetEmail(to: string, name: string, resetToken: string) {
    const resetUrl = `${this.config.public.authUrl}/auth/reset-password?token=${resetToken}`
    return this.sendEmail({
      to,
      template: 'password-reset',
      variables: { 
        name, 
        resetUrl, 
        appName: 'Vibe Starter',
        expiryTime: '1 hour'
      }
    })
  }

  async sendEmailVerification(to: string, name: string, verificationToken: string) {
    const verifyUrl = `${this.config.public.authUrl}/auth/verify-email?token=${verificationToken}`
    return this.sendEmail({
      to,
      template: 'email-verification',
      variables: { 
        name, 
        verifyUrl, 
        appName: 'Vibe Starter'
      }
    })
  }

  async sendSubscriptionConfirmation(to: string, name: string, plan: string) {
    return this.sendEmail({
      to,
      template: 'subscription-confirmation',
      variables: { 
        name, 
        plan, 
        appName: 'Vibe Starter'
      }
    })
  }

  async send2FANotification(to: string, name: string) {
    return this.sendEmail({
      to,
      template: '2fa-enabled',
      variables: { 
        name, 
        appName: 'Vibe Starter',
        timestamp: new Date().toLocaleString()
      }
    })
  }
}

// Export singleton instance
export const emailService = new EmailService()

// Export types
export type { EmailOptions }