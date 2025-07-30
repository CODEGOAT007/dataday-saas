import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'
import { OpenAI } from 'openai'
import { z } from 'zod'

const chatSchema = z.object({
  message: z.string().min(1, 'Message is required').max(1000, 'Message too long'),
  context: z.object({
    goal_id: z.string().uuid().optional(),
    persona: z.enum(['coach', 'friend', 'mentor']).default('coach'),
  }).optional(),
})

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

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
    const { message, context } = chatSchema.parse(body)

    // Reason: Get user profile and goals for context
    const { data: profile } = await supabase
      .from('users')
      .select('name, preferences')
      .eq('id', user.id)
      .single()

    const { data: goals } = await supabase
      .from('goals')
      .select(`
        id,
        title,
        description,
        target_frequency,
        status,
        created_at,
        daily_logs (
          log_date,
          completed,
          notes
        )
      `)
      .eq('user_id', user.id)
      .eq('status', 'active')

    // Reason: Build AI persona and context
    const persona = getPersonaPrompt(context?.persona || 'coach')
    const userContext = buildUserContext(profile, goals || [], context?.goal_id)

    // Reason: Generate AI response
    const completion = await openai.chat.completions.create({
      model: 'gpt-4-turbo-preview',
      messages: [
        {
          role: 'system',
          content: `${persona}\n\nUser Context:\n${userContext}`
        },
        {
          role: 'user',
          content: message
        }
      ],
      max_tokens: 500,
      temperature: 0.7,
    })

    const aiResponse = completion.choices[0]?.message?.content

    if (!aiResponse) {
      return NextResponse.json(
        { error: 'Failed to generate response' },
        { status: 500 }
      )
    }

    // Reason: Log the interaction
    await supabase
      .from('interactions')
      .insert({
        user_id: user.id,
        type: 'progress_team_ai',
        content: aiResponse,
        ai_persona_name: context?.persona || 'coach',
        metadata: {
          user_message: message,
          goal_id: context?.goal_id,
        },
        created_at: new Date().toISOString(),
      })

    return NextResponse.json({ 
      response: aiResponse,
      persona: context?.persona || 'coach'
    })

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      )
    }

    console.error('AI Chat API error:', error)
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    )
  }
}

function getPersonaPrompt(persona: string): string {
  const prompts = {
    coach: `You are an encouraging and knowledgeable life coach. You help users achieve their goals through positive reinforcement, practical advice, and accountability. Be supportive but direct, and always focus on actionable next steps.`,
    
    friend: `You are a supportive and understanding friend. You listen empathetically, offer encouragement, and help users see the bright side while being realistic about challenges. Use a warm, conversational tone.`,
    
    mentor: `You are a wise and experienced mentor. You provide thoughtful guidance, share insights from experience, and help users develop long-term strategies. Be patient, thoughtful, and focus on growth and learning.`
  }
  
  return prompts[persona as keyof typeof prompts] || prompts.coach
}

function buildUserContext(profile: any, goals: any[], goalId?: string): string {
  let context = `User: ${profile?.name || 'User'}\n`
  
  if (goals && goals.length > 0) {
    context += `\nActive Goals:\n`
    goals.forEach(goal => {
      const recentLogs = goal.daily_logs?.slice(0, 7) || []
      const completedCount = recentLogs.filter((log: any) => log.completed).length
      
      context += `- ${goal.title} (${goal.target_frequency}): ${completedCount}/${recentLogs.length} completed in last 7 days\n`
      
      if (goalId === goal.id) {
        context += `  ^ This is the goal the user is asking about\n`
      }
    })
  }
  
  return context
}
