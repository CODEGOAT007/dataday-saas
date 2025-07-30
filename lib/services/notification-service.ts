// Reason: Service for sending notifications to Emergency Support Team members
// Integrates with Twilio (SMS) and Resend (Email) for production notifications

import { Resend } from 'resend'

interface NotificationResult {
  success: boolean
  messageId?: string
  error?: string
}

// Initialize services
const resend = new Resend(process.env.RESEND_API_KEY)

// Twilio client (lazy loaded to avoid issues if credentials not set)
let twilioClient: any = null
const getTwilioClient = () => {
  if (!twilioClient && process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN) {
    const twilio = require('twilio')
    twilioClient = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN)
  }
  return twilioClient
}

export class NotificationService {
  
  /**
   * Send SMS notification to Emergency Support Team member
   */
  static async sendSMS(phone: string, message: string): Promise<NotificationResult> {
    try {
      // Reason: In development, just log the message
      if (process.env.NODE_ENV === 'development') {
        console.log(`📱 SMS to ${phone}:`, message)
        return { success: true, messageId: `dev-sms-${Date.now()}` }
      }

      const twilio = getTwilioClient()
      if (!twilio) {
        console.warn('Twilio not configured, falling back to mock SMS')
        console.log(`📱 SMS to ${phone}:`, message)
        return { success: true, messageId: `mock-sms-${Date.now()}` }
      }

      if (!process.env.TWILIO_PHONE_NUMBER) {
        throw new Error('TWILIO_PHONE_NUMBER environment variable not set')
      }

      const result = await twilio.messages.create({
        body: message,
        from: process.env.TWILIO_PHONE_NUMBER,
        to: phone
      })

      console.log(`✅ SMS sent to ${phone}, SID: ${result.sid}`)
      return { success: true, messageId: result.sid }

    } catch (error) {
      console.error('Failed to send SMS:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown SMS error'
      }
    }
  }

  /**
   * Send email notification to Emergency Support Team member
   */
  static async sendEmail(email: string, subject: string, message: string): Promise<NotificationResult> {
    try {
      // Reason: In development, allow real emails for testing but with safety checks
      if (process.env.NODE_ENV === 'development' && !process.env.ALLOW_DEV_EMAILS) {
        console.log(`📧 [DEV MODE] Email to ${email}:`)
        console.log(`Subject: ${subject}`)
        console.log(`Message: ${message}`)
        console.log(`💡 To send real emails in development, set ALLOW_DEV_EMAILS=true`)
        return { success: true, messageId: `dev-email-${Date.now()}` }
      }

      if (!process.env.RESEND_API_KEY) {
        console.warn('Resend not configured, falling back to mock email')
        console.log(`📧 Email to ${email}: ${subject}`)
        return { success: true, messageId: `mock-email-${Date.now()}` }
      }

      if (!process.env.MYDATADAY_FROM_EMAIL) {
        throw new Error('MYDATADAY_FROM_EMAIL environment variable not set')
      }

      const result = await resend.emails.send({
        from: process.env.MYDATADAY_FROM_EMAIL,
        to: email,
        subject: subject,
        html: this.formatEmailHTML(message)
      })

      console.log(`✅ Email sent to ${email}, ID: ${result.data?.id}`)
      return { success: true, messageId: result.data?.id || 'unknown' }

    } catch (error) {
      console.error('Failed to send email:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown email error'
      }
    }
  }

  /**
   * Send voicemail (using Twilio Voice API)
   */
  static async sendVoicemail(phone: string, message: string): Promise<NotificationResult> {
    try {
      // Reason: In development, just log the message
      if (process.env.NODE_ENV === 'development') {
        console.log(`📞 Voicemail to ${phone}:`, message)
        return { success: true, messageId: `dev-voice-${Date.now()}` }
      }

      const twilio = getTwilioClient()
      if (!twilio) {
        console.warn('Twilio not configured, falling back to mock voicemail')
        console.log(`📞 Voicemail to ${phone}:`, message)
        return { success: true, messageId: `mock-voice-${Date.now()}` }
      }

      if (!process.env.TWILIO_PHONE_NUMBER) {
        throw new Error('TWILIO_PHONE_NUMBER environment variable not set')
      }

      // Create a simple TwiML response for voicemail
      const twiml = `<Response><Say voice="alice">${this.sanitizeForVoice(message)}</Say></Response>`

      const result = await twilio.calls.create({
        twiml: twiml,
        from: process.env.TWILIO_PHONE_NUMBER,
        to: phone
      })

      console.log(`✅ Voicemail sent to ${phone}, SID: ${result.sid}`)
      return { success: true, messageId: result.sid }

    } catch (error) {
      console.error('Failed to send voicemail:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown voice error'
      }
    }
  }

  /**
   * Send notification based on preferred contact method
   */
  static async sendNotification(
    contactMethod: 'text_voicemail' | 'text_only' | 'email' | 'sms' | 'both',
    phone: string | null,
    email: string | null,
    subject: string,
    message: string
  ): Promise<NotificationResult[]> {
    const results: NotificationResult[] = []

    switch (contactMethod) {
      case 'sms':
        // SMS temporarily disabled - A2P 10DLC registration pending
        console.log('📱 SMS temporarily disabled - using email fallback')
        if (email) {
          const emailResult = await this.sendEmail(email, subject, message + '\n\n(Note: SMS notifications temporarily unavailable - sent via email instead)')
          results.push(emailResult)
        }
        break

      case 'email':
        if (email) {
          const emailResult = await this.sendEmail(email, subject, message)
          results.push(emailResult)
        }
        break

      case 'both':
        // Send email only for now (SMS pending A2P 10DLC)
        console.log('📱 SMS temporarily disabled - sending email only')
        if (email) {
          const emailResult = await this.sendEmail(email, subject, message + '\n\n(Note: SMS notifications temporarily unavailable - sent via email instead)')
          results.push(emailResult)
        }
        break

      // Legacy support for old values
      case 'text_voicemail':
        if (phone) {
          const smsResult = await this.sendSMS(phone, message)
          results.push(smsResult)
          if (!smsResult.success) {
            const voiceResult = await this.sendVoicemail(phone, message)
            results.push(voiceResult)
          }
        }
        break

      case 'text_only':
        if (phone) {
          const smsResult = await this.sendSMS(phone, message)
          results.push(smsResult)
        }
        break
    }

    return results
  }

  /**
   * Format message as HTML for email
   */
  private static formatEmailHTML(message: string): string {
    // Convert line breaks to HTML
    const htmlMessage = message.replace(/\n/g, '<br>')

    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>MyDataday Emergency Support Team</title>
      </head>
      <body style="margin: 0; padding: 0; background-color: #f3f4f6;">
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; background-color: white;">
          <!-- Header -->
          <div style="background: linear-gradient(135deg, #ef4444, #f97316); padding: 30px 20px; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 28px; font-weight: bold;">🛡️ MyDataday Emergency Support Team</h1>
            <p style="color: rgba(255,255,255,0.9); margin: 8px 0 0 0; font-size: 16px;">Someone you care about needs your support</p>
          </div>

          <!-- Content -->
          <div style="padding: 40px 30px;">
            <div style="line-height: 1.6; color: #374151; font-size: 16px; margin-bottom: 30px;">
              ${htmlMessage}
            </div>

            <!-- Call to Action -->
            <div style="text-align: center; margin: 30px 0;">
              <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; border-left: 4px solid #ef4444;">
                <p style="margin: 0; color: #374151; font-weight: 500;">💪 A simple check-in from you could make all the difference!</p>
              </div>
            </div>
          </div>

          <!-- Footer -->
          <div style="background: #f9fafb; padding: 30px; border-top: 1px solid #e5e7eb; text-align: center;">
            <p style="color: #6b7280; font-size: 14px; margin: 0 0 10px 0;">
              This message was sent by MyDataday's Emergency Support Team system.
            </p>
            <p style="color: #6b7280; font-size: 14px; margin: 0;">
              Thank you for being an amazing support person! ❤️
            </p>
            <div style="margin-top: 20px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
              <p style="color: #9ca3af; font-size: 12px; margin: 0;">
                If you no longer wish to receive these notifications, please reply to this email.
              </p>
            </div>
          </div>
        </div>
      </body>
      </html>
    `
  }

  /**
   * Sanitize message for voice synthesis (remove special characters, etc.)
   */
  private static sanitizeForVoice(message: string): string {
    return message
      .replace(/[<>&"']/g, '') // Remove HTML/XML special characters
      .replace(/\n/g, '. ') // Convert line breaks to pauses
      .replace(/\s+/g, ' ') // Normalize whitespace
      .trim()
      .substring(0, 500) // Limit length for voice calls
  }

  /**
   * Test notification system (development only)
   */
  static async testNotifications(): Promise<void> {
    if (process.env.NODE_ENV !== 'development') {
      throw new Error('Test notifications only available in development')
    }

    console.log('🧪 Testing notification system...')

    // Test SMS
    await this.sendSMS('+1234567890', 'Test SMS from MyDataday Emergency Support Team')

    // Test Email
    await this.sendEmail(
      'test@example.com',
      'Test Email from MyDataday',
      'This is a test email from the MyDataday Emergency Support Team system.'
    )

    // Test Voicemail
    await this.sendVoicemail('+1234567890', 'This is a test voicemail from MyDataday.')

    console.log('✅ Notification system test completed')
  }
}
