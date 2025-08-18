import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { createServerClient } from '@/lib/supabase'

// POST /api/offer/log { offer: string }
// If user is signed in, saves the offer to users table metadata; otherwise no-op.
export async function POST(request: NextRequest) {
  try {
    const { offer } = await request.json()
    if (!offer) return NextResponse.json({ ok: true })

    const cookieStore = cookies()
    const supabase = createServerClient(cookieStore)
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ ok: true })

    await supabase
      .from('users')
      .update({ notification_preferences: { offer } as any, updated_at: new Date().toISOString() })
      .eq('id', user.id)

    return NextResponse.json({ ok: true })
  } catch (e) {
    return NextResponse.json({ ok: true })
  }
}

