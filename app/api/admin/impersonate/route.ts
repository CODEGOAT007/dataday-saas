import { NextRequest, NextResponse } from 'next/server'
import { createServiceRoleClient } from '@/lib/supabase'
import { cookies } from 'next/headers'

export async function POST(request: NextRequest) {
  try {
    // Verify admin session
    const cookieStore = cookies()
    const adminSessionCookie = cookieStore.get('admin_session')
    
    if (!adminSessionCookie) {
      return NextResponse.json(
        { error: 'Admin authentication required' },
        { status: 401 }
      )
    }

    const { userId } = await request.json()
    
    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      )
    }

    console.log('🎭 Admin impersonating user:', userId)
    
    const supabase = createServiceRoleClient()

    // Verify the user exists
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('id, email, full_name')
      .eq('id', userId)
      .single()

    if (userError || !user) {
      console.error('❌ User not found for impersonation:', userId)
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    // Create impersonation session
    const impersonationData = {
      adminSession: JSON.parse(adminSessionCookie.value),
      impersonatedUser: {
        id: user.id,
        email: user.email,
        full_name: user.full_name
      },
      startTime: new Date().toISOString()
    }

    // Set impersonation cookie
    cookieStore.set('impersonation_session', JSON.stringify(impersonationData), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 4, // 4 hours
      path: '/'
    })

    console.log(`✅ Impersonation started: ${user.email}`)

    return NextResponse.json({
      success: true,
      message: `Now impersonating ${user.email}`,
      user: {
        id: user.id,
        email: user.email,
        full_name: user.full_name
      }
    })

  } catch (error) {
    console.error('❌ Impersonation error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
