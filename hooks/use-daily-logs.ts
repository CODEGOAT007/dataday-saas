'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { createClient } from '@/lib/supabase-client'
import { useAuth } from '@/hooks/use-auth'
import type { Database } from '@/types/supabase'

type DailyLog = Database['public']['Tables']['daily_logs']['Row']
type DailyLogInsert = Database['public']['Tables']['daily_logs']['Insert']
type DailyLogUpdate = Database['public']['Tables']['daily_logs']['Update']

const supabase = createClient()

// Sample data for demo mode
const sampleDailyLogs: DailyLog[] = [
  {
    id: '1',
    user_id: 'demo-user',
    goal_id: '1',
    log_date: new Date().toISOString().split('T')[0],
    completed: true,
    completion_time: '07:30:00',
    progress_value: 1,
    progress_unit: 'session',
    notes: 'Great workout session at the gym!',
    mood_rating: 4,
    energy_level: 5,
    photo_url: null,
    video_url: null,
    voice_url: null,
    escalation_state: 'none',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: '2',
    user_id: 'demo-user',
    goal_id: '2',
    log_date: new Date().toISOString().split('T')[0],
    completed: true,
    completion_time: '20:15:00',
    progress_value: 1,
    progress_unit: 'session',
    notes: 'Read chapter 3 of Atomic Habits',
    mood_rating: 5,
    energy_level: 3,
    photo_url: null,
    video_url: null,
    voice_url: null,
    escalation_state: 'none',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: '3',
    user_id: 'demo-user',
    goal_id: '3',
    log_date: new Date().toISOString().split('T')[0],
    completed: false,
    completion_time: null,
    progress_value: 0.5,
    progress_unit: 'session',
    notes: 'Did 10 minutes, will complete later',
    mood_rating: 3,
    energy_level: 2,
    photo_url: null,
    video_url: null,
    voice_url: null,
    escalation_state: 'none',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
]

// Reason: Custom hook for daily logging with TanStack Query
export function useDailyLogs(date?: string) {
  const { user } = useAuth()
  const queryClient = useQueryClient()
  const targetDate = date || new Date().toISOString().split('T')[0] // Today by default

  // Reason: Query for user's daily logs for a specific date (with demo mode fallback)
  const {
    data: dailyLogs = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ['daily_logs', user?.id || 'demo', targetDate],
    queryFn: async (): Promise<DailyLog[]> => {
      // Reason: If no user, return sample data for demo
      if (!user) {
        await new Promise(resolve => setTimeout(resolve, 300))
        return sampleDailyLogs.filter(log => log.log_date === targetDate)
      }

      const { data, error } = await supabase
        .from('daily_logs')
        .select(`
          *,
          goals (
            id,
            title,
            target_frequency,
            frequency_type
          )
        `)
        .eq('user_id', user.id)
        .eq('log_date', targetDate)
        .order('created_at', { ascending: false })

      if (error) throw error
      return data || []
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  })

  // Reason: Query for today's logging summary (with demo mode fallback)
  const {
    data: todaySummary,
    isLoading: isSummaryLoading,
  } = useQuery({
    queryKey: ['daily_logs_summary', user?.id || 'demo', targetDate],
    queryFn: async () => {
      // Reason: If no user, return sample summary for demo
      if (!user) {
        await new Promise(resolve => setTimeout(resolve, 200))
        const todayLogs = sampleDailyLogs.filter(log => log.log_date === targetDate)
        return {
          totalGoals: 4,
          loggedGoals: 3,
          completedGoals: 2,
          progressPercentage: 75,
          goals: [
            { id: '1', title: 'Daily Exercise', target_frequency: 1, frequency_type: 'daily' },
            { id: '2', title: 'Read 30 Minutes', target_frequency: 1, frequency_type: 'daily' },
            { id: '3', title: 'Meditation', target_frequency: 1, frequency_type: 'daily' },
            { id: '4', title: 'Learn Spanish', target_frequency: 3, frequency_type: 'weekly' }
          ],
          logs: todayLogs.map(log => ({
            goal_id: log.goal_id,
            completed: log.completed,
            progress_value: log.progress_value
          }))
        }
      }

      // Get all active goals for the user
      const { data: goals, error: goalsError } = await supabase
        .from('goals')
        .select('id, title, target_frequency, frequency_type')
        .eq('user_id', user.id)
        .eq('status', 'active')

      if (goalsError) throw goalsError

      // Get today's logs
      const { data: logs, error: logsError } = await supabase
        .from('daily_logs')
        .select('goal_id, completed, progress_value')
        .eq('user_id', user.id)
        .eq('log_date', targetDate)

      if (logsError) throw logsError

      // Calculate summary
      const totalGoals = goals?.length || 0
      const loggedGoals = logs?.length || 0
      const completedGoals = logs?.filter(log => log.completed).length || 0
      const progressPercentage = totalGoals > 0 ? Math.round((loggedGoals / totalGoals) * 100) : 0

      return {
        totalGoals,
        loggedGoals,
        completedGoals,
        progressPercentage,
        goals: goals || [],
        logs: logs || []
      }
    },
    staleTime: 1000 * 60 * 2, // 2 minutes
  })

  // Reason: Mutation for creating/updating a daily log
  const logProgressMutation = useMutation({
    mutationFn: async ({
      goalId,
      completed,
      progressValue,
      notes,
      moodRating
    }: {
      goalId: string
      completed: boolean
      progressValue?: number
      notes?: string
      moodRating?: number
    }) => {
      if (!user) throw new Error('User not authenticated')

      // Check if log already exists for today
      const { data: existingLog, error: checkError } = await supabase
        .from('daily_logs')
        .select('id')
        .eq('user_id', user.id)
        .eq('goal_id', goalId)
        .eq('log_date', targetDate)
        .single()

      if (checkError && checkError.code !== 'PGRST116') {
        throw checkError
      }

      if (existingLog) {
        // Update existing log
        const { data, error } = await supabase
          .from('daily_logs')
          .update({
            completed,
            completion_time: completed ? new Date().toISOString() : null,
            progress_value: progressValue,
            notes,
            mood_rating: moodRating,
            updated_at: new Date().toISOString()
          })
          .eq('id', existingLog.id)
          .select()
          .single()

        if (error) throw error
        return data
      } else {
        // Create new log
        const { data, error } = await supabase
          .from('daily_logs')
          .insert({
            user_id: user.id,
            goal_id: goalId,
            log_date: targetDate,
            completed,
            completion_time: completed ? new Date().toISOString() : null,
            progress_value: progressValue,
            notes,
            mood_rating: moodRating,
          })
          .select()
          .single()

        if (error) throw error
        return data
      }
    },
    onSuccess: () => {
      // Reason: Invalidate related queries to refresh data
      queryClient.invalidateQueries({ queryKey: ['daily_logs', user?.id, targetDate] })
      queryClient.invalidateQueries({ queryKey: ['daily_logs_summary', user?.id, targetDate] })
    },
  })

  // Reason: Mutation for bulk logging (multiple goals at once)
  const bulkLogMutation = useMutation({
    mutationFn: async (logs: Array<{
      goalId: string
      completed: boolean
      progressValue?: number
      notes?: string
    }>) => {
      if (!user) throw new Error('User not authenticated')

      const results = await Promise.all(
        logs.map(log => logProgressMutation.mutateAsync(log))
      )
      return results
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['daily_logs', user?.id, targetDate] })
      queryClient.invalidateQueries({ queryKey: ['daily_logs_summary', user?.id, targetDate] })
    },
  })

  return {
    // Data
    dailyLogs,
    todaySummary,
    targetDate,
    
    // State
    isLoading,
    isSummaryLoading,
    error,

    // Actions
    logProgress: logProgressMutation.mutateAsync,
    bulkLog: bulkLogMutation.mutateAsync,

    // Loading states
    isLogging: logProgressMutation.isPending,
    isBulkLogging: bulkLogMutation.isPending,

    // Errors
    logError: logProgressMutation.error,
    bulkLogError: bulkLogMutation.error,
  }
}
