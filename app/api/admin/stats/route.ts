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

    console.log('📊 Admin fetching dashboard stats')
    
    const supabase = createServiceRoleClient()

    // Get total users
    const { count: totalUsers } = await supabase
      .from('users')
      .select('*', { count: 'exact', head: true })

    // Get paying users (active subscriptions with paid tiers)
    const { count: payingUsers } = await supabase
      .from('users')
      .select('*', { count: 'exact', head: true })
      .eq('subscription_status', 'active')
      .in('subscription_tier', ['pro', 'premium', 'enterprise'])

    // Get free users (including active free tier)
    const { count: freeUsers } = await supabase
      .from('users')
      .select('*', { count: 'exact', head: true })
      .or('subscription_status.is.null,subscription_status.eq.free,subscription_status.eq.trial,subscription_tier.eq.free')

    // Get active goals
    const { count: activeGoals } = await supabase
      .from('goals')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'active')

    // Get users who completed onboarding
    const { count: completedOnboarding } = await supabase
      .from('users')
      .select('*', { count: 'exact', head: true })
      .not('onboarding_completed_at', 'is', null)

    // Get total support circle members
    const { count: supportCircleMembers } = await supabase
      .from('support_circle')
      .select('*', { count: 'exact', head: true })

    // Get phone leads from leads table
    const { count: totalPhoneLeads } = await supabase
      .from('leads')
      .select('*', { count: 'exact', head: true })

    const { count: newPhoneLeads } = await supabase
      .from('leads')
      .select('*', { count: 'exact', head: true })
      .eq('lead_status', 'new')

    const stats = {
      total_users: totalUsers || 0,
      paying_users: payingUsers || 0,
      free_users: freeUsers || 0,
      active_goals: activeGoals || 0,
      completed_onboarding: completedOnboarding || 0,
      support_circle_members: supportCircleMembers || 0,
      total_phone_leads: totalPhoneLeads || 0,
      new_phone_leads: newPhoneLeads || 0
    }

    console.log('✅ Dashboard stats:', stats)

    return NextResponse.json({
      success: true,
      stats
    })

  } catch (error) {
    console.error('❌ Admin stats fetch error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
