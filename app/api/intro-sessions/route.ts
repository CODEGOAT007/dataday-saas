import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase'
import { cookies } from 'next/headers'

// POST /api/intro-sessions -> disabled for public creation (use /api/admin/intro-sessions)
export async function POST(request: NextRequest) {
  return NextResponse.json({ error: 'Use admin endpoint for session creation' }, { status: 403 })
}

// GET /api/intro-sessions?id=... -> fetch a session (authenticated user/admin)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    if (!id) return NextResponse.json({ error: 'id is required' }, { status: 400 })

    const cookieStore = cookies()
    const supabase = createServerClient(cookieStore)

    const { data, error } = await supabase.from('intro_sessions').select('*').eq('id', id).single()
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })

    return NextResponse.json({ session: data })
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || 'Internal error' }, { status: 500 })
  }
}

// PATCH /api/intro-sessions -> update fields (current_step, voice_note_url, presence, etc.)
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}))
    const { id, ...updates } = body || {}
    if (!id) return NextResponse.json({ error: 'id is required' }, { status: 400 })

    const cookieStore = cookies()
    const supabase = createServerClient(cookieStore)

    // Add updated_by if not provided
    const payload = { ...updates }
    if (!('updated_by' in payload)) payload.updated_by = 'user'

    const { data, error } = await supabase
      .from('intro_sessions')
      .update(payload)
      .eq('id', id)
      .select()
      .single()

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })

    return NextResponse.json({ session: data })
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || 'Internal error' }, { status: 500 })
  }
}

