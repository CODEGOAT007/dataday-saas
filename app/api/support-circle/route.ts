import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase'
import { cookies } from 'next/headers'

export async function GET(request: NextRequest) {
  try {
    console.log('👥 Support circle fetch request received')
    
    // Create server client with cookies for user authentication
    const cookieStore = cookies()
    const supabase = createServerClient(cookieStore)

    // Get the authenticated user
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      console.error('❌ Authentication error:', authError)
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    console.log('👤 Fetching support circle for user:', user.id)

    // Fetch the user's support circle members
    const { data: members, error: membersError } = await supabase
      .from('support_circle')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: true })

    if (membersError) {
      console.error('❌ Error fetching support circle:', membersError)
      return NextResponse.json(
        { error: 'Failed to fetch support circle' },
        { status: 500 }
      )
    }

    console.log(`✅ Found ${members?.length || 0} support circle members`)

    return NextResponse.json({
      success: true,
      members: members || []
    })

  } catch (error) {
    console.error('❌ Support circle fetch error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
