import { createServerClient } from '@/lib/supabase'
import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const redirectTo = requestUrl.searchParams.get('redirectTo') || '/today'
  const isJourneyFlow = redirectTo.startsWith('/journey/live/')

  if (code) {
    const cookieStore = cookies()
    const supabase = createServerClient(cookieStore)
    
    try {
      // Reason: Exchange the auth code for a session
      await supabase.auth.exchangeCodeForSession(code)
      
      // Reason: Get the authenticated user
      const { data: { user }, error: userError } = await supabase.auth.getUser()
      
      if (userError || !user) {
        console.error('Error getting user:', userError)
        return NextResponse.redirect(new URL('/auth/login?error=auth_failed', request.url))
      }

      // Reason: Check if user profile exists, create if not
      const { data: profile, error: profileError } = await supabase
        .from('users')
        .select('*')
        .eq('id', user.id)
        .single()

      if (profileError && profileError.code === 'PGRST116') {
        // Reason: User doesn't exist, create profile with correct schema
        const { error: insertError } = await supabase
          .from('users')
          .insert({
            id: user.id,
            email: user.email!,
            full_name: user.user_metadata?.full_name || user.email?.split('@')[0] || null,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          })

        if (insertError) {
          console.error('Error creating user profile:', insertError)
          return NextResponse.redirect(new URL('/auth/login?error=profile_creation_failed', request.url))
        }

        // Reason: If this is the guided journey flow, go there first; otherwise onboarding
        if (isJourneyFlow) {
          return NextResponse.redirect(new URL(redirectTo, request.url))
        }
        return NextResponse.redirect(new URL('/onboarding', request.url))
      } else if (profileError) {
        console.error('Error fetching user profile:', profileError)
        return NextResponse.redirect(new URL('/auth/login?error=profile_fetch_failed', request.url))
      }

      // Reason: If this is the guided journey flow, honor it regardless of onboarding
      if (isJourneyFlow) {
        return NextResponse.redirect(new URL(redirectTo, request.url))
      }

      // Reason: Otherwise, check onboarding status
      if (!profile?.onboarding_completed_at) {
        return NextResponse.redirect(new URL('/onboarding', request.url))
      }

      // Reason: User exists and has completed onboarding, redirect to intended destination
      return NextResponse.redirect(new URL(redirectTo, request.url))
      
    } catch (error) {
      console.error('Auth callback error:', error)
      return NextResponse.redirect(new URL('/auth/login?error=callback_failed', request.url))
    }
  }

  // Reason: No code provided, redirect to login
  return NextResponse.redirect(new URL('/auth/login?error=no_code', request.url))
}
