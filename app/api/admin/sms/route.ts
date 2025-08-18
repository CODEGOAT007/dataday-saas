import { NextRequest, NextResponse } from 'next/server'
import { NotificationService } from '@/lib/services/notification-service'

// Ensure Node.js runtime (Twilio requires Node, not Edge)
export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const debugBypass = request.headers.get('x-vercel-protection-bypass') ? true : false
    const { searchParams } = new URL(request.url)
    const sid = searchParams.get('sid')
    if (!sid) return NextResponse.json({ error: 'Missing sid' }, { status: 400 })

    // Use NotificationService internals to get client via dynamic import
    const anySvc: any = (NotificationService as any)
    const twilio = await anySvc?.__proto__?.constructor?.prototype?.getTwilioClient?.() || null
    // Fallback if method not exposed; import directly
    const client = twilio || (await (async () => {
      try {
        const mod: any = await import('twilio')
        const init = mod?.default || mod
        if (process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN) {
          return init(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN)
        }
      } catch {}
      return null
    })())

    if (!client) {
      const body = debugBypass ? { error: 'Twilio not configured', env: {
        hasSid: !!process.env.TWILIO_ACCOUNT_SID,
        hasToken: !!process.env.TWILIO_AUTH_TOKEN,
        hasFrom: !!process.env.TWILIO_PHONE_NUMBER,
        nodeEnv: process.env.NODE_ENV
      }} : { error: 'Twilio not configured' }
      return NextResponse.json(body, { status: 500 })
    }

    const msg = await client.messages(sid).fetch()
    return NextResponse.json({
      sid: msg.sid,
      status: msg.status,
      to: msg.to,
      from: msg.from,
      errorCode: msg.errorCode,
      errorMessage: msg.errorMessage
    })
  } catch (err: any) {
    const debugBypass = request.headers.get('x-vercel-protection-bypass') ? true : false
    const msg = typeof err?.message === 'string' ? err.message : 'Internal server error'
    const body = debugBypass ? { error: msg } : { error: msg }
    return NextResponse.json(body, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const debugBypass = request.headers.get('x-vercel-protection-bypass') ? true : false

    const { to, message, forceSend } = await request.json()
    if (!to || !message) {
      return NextResponse.json({ error: 'Missing to or message' }, { status: 400 })
    }

    const result = await NotificationService.sendSMS(to, message, { forceSend: !!forceSend })
    if (!result.success) {
      const body = debugBypass ? { error: result.error || 'SMS failed', env: {
        hasSid: !!process.env.TWILIO_ACCOUNT_SID,
        hasToken: !!process.env.TWILIO_AUTH_TOKEN,
        hasFrom: !!process.env.TWILIO_PHONE_NUMBER,
        nodeEnv: process.env.NODE_ENV
      }} : { error: result.error || 'SMS failed' }
      return NextResponse.json(body, { status: 500 })
    }

    return NextResponse.json({ success: true, id: result.messageId })
  } catch (err: any) {
    const debugBypass = request.headers.get('x-vercel-protection-bypass') ? true : false
    console.error('SMS API error', err)
    const msg = typeof err?.message === 'string' ? err.message : 'Internal server error'
    const body = debugBypass ? { error: msg, env: {
      hasSid: !!process.env.TWILIO_ACCOUNT_SID,
      hasToken: !!process.env.TWILIO_AUTH_TOKEN,
      hasFrom: !!process.env.TWILIO_PHONE_NUMBER,
      nodeEnv: process.env.NODE_ENV
    }} : { error: msg }
    return NextResponse.json(body, { status: 500 })
  }
}

