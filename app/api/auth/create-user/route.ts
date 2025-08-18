import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import type { Database } from '@/types/supabase'
import { createServiceRoleClient } from '@/lib/supabase'

// POST /api/auth/create-user
// Body: { email: string, password: string, fullName?: string }
// Server-only: creates an auth user as confirmed, creates profile row, returns minimal info
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const email = String(body?.email || '').trim().toLowerCase()
    const password = String(body?.password || '')
    const fullName = body?.fullName ? String(body.fullName).trim() : null

    if (!email || !password) {
      return NextResponse.json({ error: 'email and password are required' }, { status: 400 })
    }

    const url = process.env.NEXT_PUBLIC_SUPABASE_URL
    const serviceRole = process.env.SUPABASE_SERVICE_ROLE_KEY
    if (!url || !serviceRole) {
      console.error('Missing Supabase envs', { hasUrl: !!url, hasServiceRole: !!serviceRole })
      return NextResponse.json({ error: 'Server misconfigured' }, { status: 500 })
    }

    // Use admin client with service role (no cookies, no persistence)
    const admin = createClient<Database>(url, serviceRole, {
      auth: { autoRefreshToken: false, persistSession: false },
    })

    // 1) Create the auth user as confirmed so password sign-in is allowed immediately
    const { data: created, error: createErr } = await admin.auth.admin.createUser({
      email,
      password,
      email_confirm: true, // Reason: Allow immediate password sign-in per business flow
      user_metadata: fullName ? { full_name: fullName } : undefined,
    })
    if (createErr) {
      const msg = (createErr as any).message || 'Failed to create user'
      return NextResponse.json({ error: msg }, { status: 400 })
    }

    const user = created.user
    if (!user) return NextResponse.json({ error: 'Failed to create user' }, { status: 400 })

    // 2) Ensure profile row exists in public.users (use service role server client for DB)
    const supabase = createServiceRoleClient()
    const { error: upsertErr } = await supabase
      .from('users')
      .upsert({
        id: user.id,
        email,
        full_name: fullName || user.user_metadata?.full_name || email.split('@')[0] || null,
        onboarding_completed_at: new Date().toISOString(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }, { onConflict: 'id' })

    if (upsertErr) {
      console.error('Profile upsert error:', upsertErr)
      // Continue: profile will be created later if this fails; not blocking sign-in
    }

    return NextResponse.json({ ok: true, user: { id: user.id, email } })
  } catch (e: any) {
    console.error('create-user error:', e?.message || e)
    return NextResponse.json({ error: e?.message || 'Unexpected error' }, { status: 500 })
  }
}

