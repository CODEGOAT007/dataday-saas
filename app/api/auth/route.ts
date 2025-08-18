import { NextRequest, NextResponse } from 'next/server'
import { createServerClient, type CookieOptions } from '@supabase/ssr'

// Reason: Use @supabase/ssr everywhere (middleware + API) so cookies are consistent
export async function POST(request: NextRequest) {
  let response = NextResponse.json({ ok: true })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          response.cookies.set({ name, value, ...options })
        },
        remove(name: string, options: CookieOptions) {
          response.cookies.set({ name, value: '', ...options })
        },
      },
    }
  )

  try {
    const contentType = request.headers.get('content-type') || ''

    // Reason: JSON payload from client onAuthStateChange with session tokens
    if (contentType.includes('application/json')) {
      const { session } = (await request.json()) as any
      if (session?.access_token && session?.refresh_token) {
        const { error } = await supabase.auth.setSession({
          access_token: session.access_token,
          refresh_token: session.refresh_token,
        })
        if (error) return NextResponse.json({ error: error.message }, { status: 400 })
        return response
      }
      return NextResponse.json({ error: 'Invalid session payload' }, { status: 400 })
    }

    // Reason: Fallback to legacy form-based actions
    const requestUrl = new URL(request.url)
    const formData = await request.formData()
    const email = String(formData.get('email') || '')
    const password = String(formData.get('password') || '')
    const action = String(formData.get('action') || '') // 'sign-in' or 'sign-up'

    if (action === 'sign-up') {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${requestUrl.origin}/auth/callback`,
        },
      })
      if (error) return NextResponse.json({ error: error.message }, { status: 400 })
      return NextResponse.json({ message: 'Check your email for the confirmation link', user: data.user })
    }

    if (action === 'sign-in') {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) return NextResponse.json({ error: error.message }, { status: 400 })
      return NextResponse.json({ message: 'Successfully signed in', user: data.user })
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
  } catch (error) {
    console.error('Auth error:', error)
    return NextResponse.json({ error: 'An unexpected error occurred' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  let response = NextResponse.json({ message: 'Successfully signed out' })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          response.cookies.set({ name, value, ...options })
        },
        remove(name: string, options: CookieOptions) {
          response.cookies.set({ name, value: '', ...options })
        },
      },
    }
  )

  try {
    const { error } = await supabase.auth.signOut()
    if (error) return NextResponse.json({ error: error.message }, { status: 400 })
    return response
  } catch (error) {
    console.error('Logout error:', error)
    return NextResponse.json({ error: 'An unexpected error occurred' }, { status: 500 })
  }
}
