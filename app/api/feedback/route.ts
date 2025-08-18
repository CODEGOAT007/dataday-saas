import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { Resend } from 'resend'

// Reason: Accepts feedback from the in-app Feedback button and emails it to hello@mydataday.app without opening a mail client
export async function POST(request: NextRequest) {
  try {
    const { message, pageUrl, userAgent } = await request.json()
    if (!message || typeof message !== 'string' || message.trim().length < 2) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 })
    }

    // Try to get the current auth user (optional)
    const cookieStore = cookies()
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore })
    const { data: userData } = await supabase.auth.getUser()

    const userEmail = userData?.user?.email || ''
    const userId = userData?.user?.id || ''

    const subject = `[Feedback] ${pageUrl ? new URL(pageUrl).pathname : ''}`.trim()

    // Compose minimal, on-brand HTML (no support team fluff)
    const html = `
      <!doctype html>
      <html>
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>${subject}</title>
      </head>
      <body style="margin:0;padding:24px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Arial,sans-serif;background:#0b1020;color:#e5e7eb;">
        <div style="max-width:640px;margin:0 auto;background:#0f172a;border:1px solid #1f2937;border-radius:12px;padding:20px;">
          <h2 style="margin:0 0 12px 0;color:#ffffff;font-size:18px;">New Feedback</h2>
          ${userEmail ? `<p style='margin:0 0 16px 0;color:#a5b4fc;'>Reply directly to this email to reach the user: <strong style='color:#fff'>${userEmail}</strong></p>` : ''}
          <div style="white-space:pre-wrap;background:#111827;border:1px solid #374151;border-radius:8px;padding:12px;color:#e5e7eb;">${escapeHtml(message.trim())}</div>
          <div style="margin-top:16px;color:#9ca3af;font-size:12px;line-height:1.5;">
            <div>Page: ${pageUrl ? `<a href='${pageUrl}' style='color:#60a5fa;'>${pageUrl}</a>` : 'unknown'}</div>
            <div>User-Agent: ${escapeHtml(userAgent || 'unknown')}</div>
            <div>User: ${userEmail || 'Not Logged In'} ${userId ? `(${userId})` : ''}</div>
            <div>Time: ${new Date().toISOString()}</div>
          </div>
        </div>
      </body>
      </html>
    `

    const resend = new Resend(process.env.RESEND_API_KEY)
    const sendResult = await resend.emails.send({
      from: process.env.MYDATADAY_FROM_EMAIL || 'MyDataday <hello@mydataday.app>',
      to: 'hello@mydataday.app',
      subject: subject || 'Feedback',
      html,
      replyTo: userEmail || undefined,
    })

    if ((sendResult as any).error) {
      return NextResponse.json({ error: 'Failed to send feedback' }, { status: 500 })
    }

    return NextResponse.json({ ok: true, messageId: sendResult.data?.id })
  } catch (err) {
    console.error('❌ Feedback API error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// Simple HTML escape to avoid HTML injection from message/userAgent
function escapeHtml(input: string) {
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

