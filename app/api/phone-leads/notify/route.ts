import { NextRequest, NextResponse } from 'next/server'
import { createServiceRoleClient } from '@/lib/supabase'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(request: NextRequest) {
  try {
    const { phone_number, source = 'tiktok_learn_more' } = await request.json()

    if (!phone_number) {
      return NextResponse.json(
        { error: 'Phone number is required' },
        { status: 400 }
      )
    }

    // Store lead in leads table
    const supabase = createServiceRoleClient()
    const { data, error } = await supabase
      .from('leads')
      .insert([
        {
          phone: phone_number,
          lead_source: source,
          lead_status: 'new'
        }
      ])
      .select()
      .single()

    if (error) {
      console.error('Database error:', error)
      return NextResponse.json(
        { error: 'Failed to store phone number' },
        { status: 500 }
      )
    }

    console.log('📱 New phone lead stored:', {
      id: data.id,
      phone: phone_number,
      source,
      timestamp: new Date().toISOString()
    })

    // Send email notification to Chris
    try {
      await sendEmailNotification(phone_number, source, data.id)
      console.log('✅ Email notification sent for new phone lead')
    } catch (emailError) {
      console.error('❌ Failed to send email notification:', emailError)
      // Don't fail the whole request if email fails
    }

    console.log('New phone lead:', {
      id: data.id,
      phone: phone_number,
      source,
      timestamp: new Date().toISOString()
    })

    return NextResponse.json({
      success: true,
      message: 'Phone number collected successfully',
      id: data.id
    })

  } catch (error) {
    console.error('Phone lead notification error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// Helper functions
async function sendEmailNotification(phoneNumber: string, source: string, leadId: string) {
  if (!process.env.RESEND_API_KEY || !process.env.MYDATADAY_FROM_EMAIL) {
    console.log('📧 Resend not configured, skipping email notification')
    return
  }

  const emailHtml = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>New TikTok Lead - ${phoneNumber}</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
      <!-- Main Container -->
      <div style="min-height: 100vh; background: linear-gradient(135deg, #0f172a 0%, #1e3a8a 50%, #0f172a 100%); padding: 20px;">

        <!-- Card Container -->
        <div style="max-width: 500px; margin: 0 auto; background: rgba(255, 255, 255, 0.1); backdrop-filter: blur(10px); border: 1px solid rgba(255, 255, 255, 0.2); border-radius: 12px; padding: 32px; box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);">

          <!-- Header Icon -->
          <div style="text-align: center; margin-bottom: 24px;">
            <div style="width: 64px; height: 64px; background-color: #2563eb; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; margin-bottom: 16px;">
              <span style="font-size: 32px; color: white;">📱</span>
            </div>
            <h1 style="color: white; margin: 0; font-size: 28px; font-weight: bold; line-height: 1.2;">
              New TikTok Lead!
            </h1>
          </div>

          <!-- Phone Number with Copy Button -->
          <div style="background: rgba(255, 255, 255, 0.1); border: 1px solid rgba(255, 255, 255, 0.2); border-radius: 8px; padding: 16px; margin-bottom: 24px;">
            <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 12px;">
              <div>
                <p style="color: #94a3b8; margin: 0; font-size: 14px;">Phone Number</p>
                <p style="color: white; margin: 4px 0 0 0; font-size: 20px; font-weight: 600;" id="phoneNumber">${phoneNumber}</p>
              </div>
              <button onclick="copyToClipboard('${phoneNumber}')" style="background-color: #3b82f6; color: white; border: none; padding: 8px 16px; border-radius: 6px; font-size: 12px; font-weight: 600; cursor: pointer; white-space: nowrap;">
                📋 Copy
              </button>
            </div>
          </div>

          <!-- Lead Details -->
          <div style="margin-bottom: 32px;">
            <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 16px;">
              <span style="color: #3b82f6; font-size: 20px;">🎯</span>
              <div>
                <span style="color: #94a3b8; font-size: 14px;">Source: </span>
                <span style="color: white; font-weight: 500;">${source}</span>
              </div>
            </div>
            <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 16px;">
              <span style="color: #3b82f6; font-size: 20px;">🕒</span>
              <div>
                <span style="color: #94a3b8; font-size: 14px;">Time: </span>
                <span style="color: white; font-weight: 500;">${new Date().toLocaleString()}</span>
              </div>
            </div>
            <div style="display: flex; align-items: center; gap: 12px;">
              <span style="color: #3b82f6; font-size: 20px;">🆔</span>
              <div>
                <span style="color: #94a3b8; font-size: 14px;">Lead ID: </span>
                <span style="color: white; font-weight: 500; font-family: monospace; font-size: 12px;">${leadId}</span>
              </div>
            </div>
          </div>

          <!-- Action Buttons -->
          <div style="margin-bottom: 24px;">
            <a href="tel:${phoneNumber}" style="display: block; width: 100%; background-color: #16a34a; color: white; padding: 14px; text-decoration: none; border-radius: 8px; font-weight: 600; text-align: center; margin-bottom: 12px; font-size: 16px;">
              📞 Call Now
            </a>
            <a href="https://www.fastbackgroundcheck.com/phone" target="_blank" style="display: block; width: 100%; background-color: #2563eb; color: white; padding: 14px; text-decoration: none; border-radius: 8px; font-weight: 600; text-align: center; font-size: 16px;">
              🔍 Background Check
            </a>
          </div>

          <!-- Admin Dashboard Link -->
          <div style="text-align: center; margin-bottom: 24px;">
            <a href="https://mydataday.app/admin/dashboard" style="color: #3b82f6; text-decoration: none; font-size: 14px;">
              View in Admin Dashboard →
            </a>
          </div>

          <!-- Footer -->
          <div style="text-align: center; padding-top: 20px; border-top: 1px solid rgba(255, 255, 255, 0.1);">
            <p style="color: #64748b; font-size: 12px; margin: 0;">
              MyDataDay • TikTok Lead Notification
            </p>
          </div>
        </div>
      </div>

      <!-- JavaScript for Copy Function -->
      <script>
        function copyToClipboard(text) {
          if (navigator.clipboard && window.isSecureContext) {
            navigator.clipboard.writeText(text).then(function() {
              // Change button text temporarily
              const button = event.target;
              const originalText = button.innerHTML;
              button.innerHTML = '✅ Copied!';
              button.style.backgroundColor = '#16a34a';
              setTimeout(function() {
                button.innerHTML = originalText;
                button.style.backgroundColor = '#3b82f6';
              }, 2000);
            });
          } else {
            // Fallback for older browsers
            const textArea = document.createElement('textarea');
            textArea.value = text;
            document.body.appendChild(textArea);
            textArea.focus();
            textArea.select();
            try {
              document.execCommand('copy');
              const button = event.target;
              const originalText = button.innerHTML;
              button.innerHTML = '✅ Copied!';
              button.style.backgroundColor = '#16a34a';
              setTimeout(function() {
                button.innerHTML = originalText;
                button.style.backgroundColor = '#3b82f6';
              }, 2000);
            } catch (err) {
              console.error('Failed to copy text: ', err);
            }
            document.body.removeChild(textArea);
          }
        }
      </script>
    </body>
    </html>
  `

  const result = await resend.emails.send({
    from: process.env.MYDATADAY_FROM_EMAIL,
    to: 'christopher.j.loy@gmail.com', // Your email
    subject: `🚨 New TikTok Lead: ${phoneNumber}`,
    html: emailHtml
  })

  return result
}

async function sendSMSNotification(phoneNumber: string) {
  // TODO: Implement SMS notification using Twilio
  console.log(`Would send SMS notification for phone: ${phoneNumber}`)
}
