import { NextRequest, NextResponse } from 'next/server'
import { createServiceRoleClient } from '@/lib/supabase'

// GET /api/admin/preferences?email=...
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const email = searchParams.get('email')
    if (!email) return NextResponse.json({ error: 'email required' }, { status: 400 })

    const supabase = createServiceRoleClient()

    // Try to fetch summary_collapsed and display_name; fall back if column doesn't exist yet
    let data: any = null
    let error: any = null
    try {
      const resp = await supabase
        .from('admin_preferences')
        .select('summary_collapsed, display_name')
        .eq('email', email)
        .single()
      data = resp.data
      error = resp.error
    } catch (e) {
      error = e
    }

    // If display_name column doesn't exist yet, retry selecting only summary_collapsed
    if (error && (error.code === '42703' || (error.message && error.message.includes('display_name')))) {
      const resp2 = await supabase
        .from('admin_preferences')
        .select('summary_collapsed')
        .eq('email', email)
        .single()
      data = resp2.data
      error = resp2.error
    }

    if (error && error.code !== 'PGRST116') {
      console.error('Preferences fetch error:', error)
      return NextResponse.json({ error: 'Failed to load preferences' }, { status: 500 })
    }

    return NextResponse.json({
      summary_collapsed: data?.summary_collapsed ?? true,
      display_name: data?.display_name || null
    })
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}

// PATCH /api/admin/preferences
// { email, summary_collapsed?, display_name? }
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json()
    const { email } = body || {}
    const hasSummary = typeof body?.summary_collapsed === 'boolean'
    const hasDisplayName = typeof body?.display_name === 'string'
    if (!email || (!hasSummary && !hasDisplayName)) {
      return NextResponse.json({ error: 'Invalid payload' }, { status: 400 })
    }

    const payload: any = { email, updated_at: new Date().toISOString() }
    if (hasSummary) payload.summary_collapsed = body.summary_collapsed
    if (hasDisplayName) payload.display_name = body.display_name

    const supabase = createServiceRoleClient()
    const { data, error } = await supabase
      .from('admin_preferences')
      .upsert(payload, { onConflict: 'email' })
      .select('summary_collapsed, display_name')
      .single()

    if (error) {
      console.error('Preferences save error:', error)
      // Helpful error if display_name column is missing
      if (hasDisplayName && (error.code === '42703' || (error.message && error.message.includes('display_name')))) {
        return NextResponse.json({ error: 'display_name column missing. Please add it in Supabase: ALTER TABLE admin_preferences ADD COLUMN display_name text;' }, { status: 400 })
      }
      return NextResponse.json({ error: 'Failed to save preferences' }, { status: 500 })
    }

    return NextResponse.json({ summary_collapsed: data?.summary_collapsed ?? true, display_name: data?.display_name || null })
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}

