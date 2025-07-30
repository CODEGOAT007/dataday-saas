import { createBrowserClient, createServerClient as createSupabaseServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import type { Database } from '@/types/supabase'

// Reason: Client-side Supabase client for use in components
export const createClient = () => {
  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}

// Reason: Server-side Supabase client for use in server components and API routes
export const createServerClient = (cookieStore: any) => {
  return createSupabaseServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
        set(name: string, value: string, options: any) {
          cookieStore.set({ name, value, ...options })
        },
        remove(name: string, options: any) {
          cookieStore.set({ name, value: '', ...options })
        },
      },
    }
  )
}

// Reason: Helper function to get authenticated user on server
export async function getUser() {
  const cookieStore = cookies()
  const supabase = createServerClient(cookieStore)
  
  try {
    const { data: { user }, error } = await supabase.auth.getUser()
    
    if (error) {
      console.error('Error getting user:', error)
      return null
    }
    
    return user
  } catch (error) {
    console.error('Unexpected error getting user:', error)
    return null
  }
}

// Reason: Helper function to get user profile with additional data
export async function getUserProfile(userId?: string) {
  const cookieStore = cookies()
  const supabase = createServerClient(cookieStore)
  
  try {
    let targetUserId = userId
    
    if (!targetUserId) {
      const user = await getUser()
      if (!user) return null
      targetUserId = user.id
    }
    
    const { data: profile, error } = await supabase
      .from('users')
      .select(`
        *,
        goals (
          id,
          title,
          status,
          target_frequency,
          created_at
        ),
        emergency_support_team (
          id,
          name,
          relationship,
          is_active
        )
      `)
      .eq('id', targetUserId)
      .single()
    
    if (error) {
      console.error('Error getting user profile:', error)
      return null
    }
    
    return profile
  } catch (error) {
    console.error('Unexpected error getting user profile:', error)
    return null
  }
}

// Reason: Helper function to check if user has completed onboarding
export async function checkOnboardingStatus(userId?: string) {
  const cookieStore = cookies()
  const supabase = createServerClient(cookieStore)
  
  try {
    let targetUserId = userId
    
    if (!targetUserId) {
      const user = await getUser()
      if (!user) return false
      targetUserId = user.id
    }
    
    const { data: profile, error } = await supabase
      .from('users')
      .select('onboarding_completed_at')
      .eq('id', targetUserId)
      .single()
    
    if (error) {
      console.error('Error checking onboarding status:', error)
      return false
    }
    
    return !!profile?.onboarding_completed_at
  } catch (error) {
    console.error('Unexpected error checking onboarding status:', error)
    return false
  }
}

// Reason: Helper function to get user's active goals with recent logs
export async function getUserGoalsWithLogs(userId?: string, limit = 10) {
  const cookieStore = cookies()
  const supabase = createServerClient(cookieStore)
  
  try {
    let targetUserId = userId
    
    if (!targetUserId) {
      const user = await getUser()
      if (!user) return []
      targetUserId = user.id
    }
    
    const { data: goals, error } = await supabase
      .from('goals')
      .select(`
        *,
        daily_logs (
          id,
          log_date,
          completed,
          notes,
          created_at
        )
      `)
      .eq('user_id', targetUserId)
      .eq('status', 'active')
      .order('created_at', { ascending: false })
      .limit(limit)
    
    if (error) {
      console.error('Error getting user goals:', error)
      return []
    }
    
    return goals || []
  } catch (error) {
    console.error('Unexpected error getting user goals:', error)
    return []
  }
}
