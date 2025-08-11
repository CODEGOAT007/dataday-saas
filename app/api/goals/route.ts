import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

const createGoalSchema = z.object({
  title: z.string().min(1, 'Title is required').max(100, 'Title too long'),
  description: z.string().optional(),
  frequency: z.string().optional(),
  duration: z.string().optional(),
  voice_note_url: z.string().optional(),
  target_frequency: z.enum(['daily', 'weekly', 'monthly']).default('daily'),
  escalation_enabled: z.boolean().default(true),
})

export async function GET(request: NextRequest) {
  const cookieStore = cookies()
  const supabase = createRouteHandlerClient({ cookies: () => cookieStore })

  try {
    // Reason: Get authenticated user
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Reason: Fetch user's goals
    const { data: goals, error } = await supabase
      .from('goals')
      .select(`
        *,
        daily_logs (
          id,
          log_date,
          completed,
          created_at
        )
      `)
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching goals:', error)
      return NextResponse.json({ error: 'Failed to fetch goals' }, { status: 500 })
    }

    return NextResponse.json({ goals })
  } catch (error) {
    console.error('Goals API error:', error)
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
    const validatedData = createGoalSchema.parse(body)

    // Reason: Create new goal
    const goalData: any = {
      title: validatedData.title,
      description: validatedData.description,
      voice_note_url: validatedData.voice_note_url,
      user_id: user.id,
      created_at: new Date().toISOString(),
      status: 'active',
      start_date: new Date().toISOString().split('T')[0],
      difficulty_level: 1,
      is_public: false,
      escalation_enabled: validatedData.escalation_enabled
    }

    // Map frequency to target_frequency
    if (validatedData.frequency) {
      const frequencyMapping: { [key: string]: { target_frequency: number, frequency_type: string } } = {
        'daily': { target_frequency: 7, frequency_type: 'weekly' },
        'weekly': { target_frequency: 1, frequency_type: 'weekly' },
        '3x-week': { target_frequency: 3, frequency_type: 'weekly' },
        '5x-week': { target_frequency: 5, frequency_type: 'weekly' }
      }
      const freqData = frequencyMapping[validatedData.frequency] || { target_frequency: 7, frequency_type: 'weekly' }
      goalData.target_frequency = freqData.target_frequency
      goalData.frequency_type = freqData.frequency_type
    } else {
      goalData.target_frequency = validatedData.target_frequency === 'daily' ? 7 :
                                   validatedData.target_frequency === 'weekly' ? 1 : 4
      goalData.frequency_type = 'weekly'
    }

    const { data: goal, error } = await supabase
      .from('goals')
      .insert(goalData)
      .select()
      .single()

    if (error) {
      console.error('Error creating goal:', error)
      return NextResponse.json({ error: 'Failed to create goal' }, { status: 500 })
    }

    return NextResponse.json({ goal }, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Create goal API error:', error)
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    )
  }
}
