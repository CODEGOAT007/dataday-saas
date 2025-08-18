import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { createServiceRoleClient } from '@/lib/supabase'

async function requireAdmin() {
  const cookieStore = cookies()
  const adminSessionCookie = cookieStore.get('admin_session')
  if (!adminSessionCookie) return null
  try {
    const session = JSON.parse(adminSessionCookie.value)
    const loginTime = new Date(session.loginTime)
    const daysDiff = (Date.now() - loginTime.getTime()) / (1000 * 60 * 60 * 24)
    if (daysDiff > 7) return null
    return session
  } catch {
    return null
  }
}

// Admin POST: create a new Intro Session
export async function POST(request: NextRequest) {
  const admin = await requireAdmin()
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  try {
    const body = await request.json().catch(() => ({}))
    const { user_id, initial_step = 'voice-message', goal_title, frequency, duration } = body || {}
    if (!user_id) return NextResponse.json({ error: 'user_id is required' }, { status: 400 })

    const supabase = createServiceRoleClient()
    const { data, error } = await supabase
      .from('intro_sessions')
      .insert({ user_id, admin_id: null, current_step: initial_step, goal_title, frequency, duration, updated_by: 'admin' })
      .select()
      .single()

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ session: data })
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || 'Internal error' }, { status: 500 })
  }
}

// Admin GET: /api/admin/intro-sessions?id=...
export async function GET(request: NextRequest) {
  const admin = await requireAdmin()
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { searchParams } = new URL(request.url)
  const id = searchParams.get('id')
  if (!id) return NextResponse.json({ error: 'id is required' }, { status: 400 })

  const supabase = createServiceRoleClient()
  const { data, error } = await supabase.from('intro_sessions').select('*').eq('id', id).single()
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ session: data })
}

// Admin PATCH: /api/admin/intro-sessions
export async function PATCH(request: NextRequest) {
  const admin = await requireAdmin()
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const body = await request.json().catch(() => ({}))
  const { id, ...updates } = body || {}
  if (!id) return NextResponse.json({ error: 'id is required' }, { status: 400 })

  const supabase = createServiceRoleClient()
  const { data, error } = await supabase
    .from('intro_sessions')
    .update({ ...updates, updated_by: 'admin', updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ session: data })
}

