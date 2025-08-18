import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase'
import { cookies } from 'next/headers'

export async function DELETE(request: NextRequest) {
  try {
    console.log('🗑️ Goals reset request received')
    
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

    console.log('👤 Resetting goals for user:', user.id)

    // First, get count of goals and logs for reporting
    const { data: goals, error: goalsCountError } = await supabase
      .from('goals')
      .select('id')
      .eq('user_id', user.id)

    if (goalsCountError) {
      console.error('❌ Error counting goals:', goalsCountError)
    }

    const { data: logs, error: logsCountError } = await supabase
      .from('daily_logs')
      .select('id')
      .eq('user_id', user.id)

    if (logsCountError) {
      console.error('❌ Error counting logs:', logsCountError)
    }

    const goalCount = goals?.length || 0
    const logCount = logs?.length || 0

    console.log(`🗑️ Found ${goalCount} goals and ${logCount} daily logs to delete`)

    // Delete daily logs first (due to foreign key constraints)
    const { error: deleteLogsError } = await supabase
      .from('daily_logs')
      .delete()
      .eq('user_id', user.id)

    if (deleteLogsError) {
      console.error('❌ Error deleting daily logs:', deleteLogsError)
      return NextResponse.json(
        { error: 'Failed to delete daily logs' },
        { status: 500 }
      )
    }

    console.log(`✅ Deleted ${logCount} daily logs`)

    // Delete goals
    const { error: deleteGoalsError } = await supabase
      .from('goals')
      .delete()
      .eq('user_id', user.id)

    if (deleteGoalsError) {
      console.error('❌ Error deleting goals:', deleteGoalsError)
      return NextResponse.json(
        { error: 'Failed to delete goals' },
        { status: 500 }
      )
    }

    console.log(`✅ Deleted ${goalCount} goals`)

    // TODO: Also delete voice notes from storage
    // This would require fetching all voice_note_urls and deleting from Supabase storage
    // For now, we'll leave the voice files (they'll be orphaned but not taking up much space)

    console.log('✅ Goals reset completed successfully')

    return NextResponse.json({
      success: true,
      message: 'All goals and daily logs have been deleted',
      deletedCount: goalCount,
      deletedLogs: logCount
    })

  } catch (error) {
    console.error('❌ Goals reset error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
