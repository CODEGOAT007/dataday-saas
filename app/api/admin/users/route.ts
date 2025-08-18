import { NextRequest, NextResponse } from 'next/server'
import { createServiceRoleClient } from '@/lib/supabase'
import { cookies } from 'next/headers'

export async function GET(request: NextRequest) {
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

    console.log('📊 Admin fetching all users')
    
    const supabase = createServiceRoleClient()

    // Fetch all users with relevant information
    const { data: users, error } = await supabase
      .from('users')
      .select(`
        id,
        email,
        full_name,
        created_at,
        subscription_status,
        subscription_tier,
        onboarding_completed_at,
        timezone,
        bio,
        location
      `)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('❌ Error fetching users:', error)
      return NextResponse.json(
        { error: 'Failed to fetch users' },
        { status: 500 }
      )
    }

    console.log(`✅ Found ${users?.length || 0} users`)

    return NextResponse.json({
      success: true,
      users: users || []
    })

  } catch (error) {
    console.error('❌ Admin users fetch error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
