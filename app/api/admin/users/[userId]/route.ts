import { NextRequest, NextResponse } from 'next/server'
import { createServiceRoleClient } from '@/lib/supabase'
import { cookies } from 'next/headers'

export async function GET(
  request: NextRequest,
  { params }: { params: { userId: string } }
) {
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

    const { userId } = params
    console.log('👤 Admin fetching user:', userId)
    
    const supabase = createServiceRoleClient()

    // Fetch specific user with detailed information
    const { data: user, error } = await supabase
      .from('users')
      .select(`
        id,
        email,
        full_name,
        created_at,
        updated_at,
        subscription_status,
        subscription_tier,
        onboarding_completed_at,
        timezone,
        bio,
        location,
        website,
        avatar_url,
        preferred_notification_time,
        notification_preferences
      `)
      .eq('id', userId)
      .single()

    if (error) {
      console.error('❌ Error fetching user:', error)
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    // Also fetch user's goals and support circle
    const [goalsResponse, supportCircleResponse] = await Promise.all([
      supabase
        .from('goals')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false }),
      
      supabase
        .from('support_circle')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
    ])

    console.log(`✅ Found user: ${user.email}`)

    return NextResponse.json({
      success: true,
      user,
      goals: goalsResponse.data || [],
      supportCircle: supportCircleResponse.data || []
    })

  } catch (error) {
    console.error('❌ Admin user fetch error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
