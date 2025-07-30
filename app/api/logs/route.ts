import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

const createLogSchema = z.object({
  goal_id: z.string().uuid('Invalid goal ID'),
  log_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format (YYYY-MM-DD)'),
  completed: z.boolean(),
  notes: z.string().optional(),
  photo_url: z.string().url().optional(),
  video_url: z.string().url().optional(),
  voice_url: z.string().url().optional(),
})

export async function GET(request: NextRequest) {
  const cookieStore = cookies()
  const supabase = createRouteHandlerClient({ cookies: () => cookieStore })
  const { searchParams } = new URL(request.url)
  
  const goalId = searchParams.get('goal_id')
  const startDate = searchParams.get('start_date')
  const endDate = searchParams.get('end_date')
  const limit = parseInt(searchParams.get('limit') || '50')

  try {
    // Reason: Get authenticated user
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Reason: Build query for user's logs
    let query = supabase
      .from('daily_logs')
      .select(`
        *,
        goals (
          id,
          title,
          target_frequency
        )
      `)
      .eq('user_id', user.id)
      .order('log_date', { ascending: false })
      .limit(limit)

    // Reason: Apply filters if provided
    if (goalId) {
      query = query.eq('goal_id', goalId)
    }
    
    if (startDate) {
      query = query.gte('log_date', startDate)
    }
    
    if (endDate) {
      query = query.lte('log_date', endDate)
    }

    const { data: logs, error } = await query

    if (error) {
      console.error('Error fetching logs:', error)
      return NextResponse.json({ error: 'Failed to fetch logs' }, { status: 500 })
    }

    return NextResponse.json({ logs })
  } catch (error) {
    console.error('Logs API error:', error)
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  const cookieStore = cookies()
  const supabase = createRouteHandlerClient({ cookies: () => cookieStore })

  try {
    // Reason: Get authenticated user
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Reason: Parse and validate request body
    const body = await request.json()
    const validatedData = createLogSchema.parse(body)

    // Reason: Verify goal belongs to user
    const { data: goal, error: goalError } = await supabase
      .from('goals')
      .select('id')
      .eq('id', validatedData.goal_id)
      .eq('user_id', user.id)
      .single()

    if (goalError || !goal) {
      return NextResponse.json({ error: 'Goal not found' }, { status: 404 })
    }

    // Reason: Check if log already exists for this date
    const { data: existingLog, error: existingError } = await supabase
      .from('daily_logs')
      .select('id')
      .eq('user_id', user.id)
      .eq('goal_id', validatedData.goal_id)
      .eq('log_date', validatedData.log_date)
      .single()

    if (existingLog) {
      return NextResponse.json(
        { error: 'Log already exists for this date' },
        { status: 409 }
      )
    }

    // Reason: Create new log
    const { data: log, error } = await supabase
      .from('daily_logs')
      .insert({
        ...validatedData,
        user_id: user.id,
        created_at: new Date().toISOString(),
      })
      .select(`
        *,
        goals (
          id,
          title,
          target_frequency
        )
      `)
      .single()

    if (error) {
      console.error('Error creating log:', error)
      return NextResponse.json({ error: 'Failed to create log' }, { status: 500 })
    }

    // TODO: Trigger streak calculation and escalation check
    // TODO: Send notifications if needed

    return NextResponse.json({ log }, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Create log API error:', error)
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    )
  }
}
