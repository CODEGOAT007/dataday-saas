import { NextRequest, NextResponse } from 'next/server'
import { createServiceRoleClient, createServerClient } from '@/lib/supabase'
import { cookies } from 'next/headers'

// GET /api/intro-sessions/signed-url?path=voice-notes/filename
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const path = searchParams.get('path')
    if (!path) return NextResponse.json({ error: 'path is required' }, { status: 400 })

    // Ensure requester is authenticated (user or admin)
    const cookieStore = cookies()
    const supabase = createServerClient(cookieStore)
    const { data: auth } = await supabase.auth.getUser()
    if (!auth?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const svc = createServiceRoleClient()
    const { data, error } = await svc.storage.from('voice-notes').createSignedUrl(path, 3600)
    if (error || !data?.signedUrl) return NextResponse.json({ error: error?.message || 'Failed to sign' }, { status: 500 })

    return NextResponse.json({ signedUrl: data.signedUrl })
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || 'Internal error' }, { status: 500 })
  }
}

