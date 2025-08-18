import { NextRequest, NextResponse } from 'next/server'
import { createServiceRoleClient } from '@/lib/supabase'

// GET /api/admin/call-template -> { live_pickup: string }
export async function GET() {
  try {
    const supabase = createServiceRoleClient()
    const { data, error } = await supabase
      .from('app_settings')
      .select('value')
      .eq('key', 'call_template_live_pickup')
      .single()

    if (error && (error as any).code !== 'PGRST116') {
      console.error('Fetch template error:', error)
      return NextResponse.json({ error: 'Failed to load template' }, { status: 500 })
    }

    const fallback = "Hey, it's Chris from the livestream. I got your request for a 1-on-1 call, who am I speaking with?\n\nI'm glad you see the potential value of seomthing like this.. I'm super super excited what we're doing. let me start by just getting at least a quick overview/ or understanding of where you're at."

    return NextResponse.json({ live_pickup: data?.value ?? fallback })
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}

// PATCH /api/admin/call-template -> { live_pickup: string }
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json()
    const { live_pickup } = body || {}
    if (!live_pickup || typeof live_pickup !== 'string') {
      return NextResponse.json({ error: 'Invalid payload' }, { status: 400 })
    }

    const supabase = createServiceRoleClient()

    const { error } = await supabase
      .from('app_settings')
      .upsert({ key: 'call_template_live_pickup', value: live_pickup, updated_at: new Date().toISOString() }, { onConflict: 'key' })

    if (error) {
      console.error('Save template error:', error)
      return NextResponse.json({ error: 'Failed to save template' }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}

