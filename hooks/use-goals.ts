'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { createClient } from '@/lib/supabase-client'
import { useAuth } from '@/hooks/use-auth'
import type { Database } from '@/types/supabase'

type Goal = Database['public']['Tables']['goals']['Row']
type GoalInsert = Database['public']['Tables']['goals']['Insert']
type GoalUpdate = Database['public']['Tables']['goals']['Update']

const supabase = createClient()

// Sample data for demo mode
const sampleGoals: Goal[] = [
  {
    id: '1',
    user_id: 'demo-user',
    title: 'Daily Exercise',
    description: 'Complete 30 minutes of physical activity',
    category: 'health',
    target_frequency: 1,
    frequency_type: 'daily',
    difficulty_level: 3,
    start_date: '2024-01-01',
    target_end_date: null,
    status: 'active',
    is_public: false,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
    completed_at: null
  },
  {
    id: '2',
    user_id: 'demo-user',
    title: 'Read 30 Minutes',
    description: 'Read for personal development',
    category: 'education',
    target_frequency: 1,
    frequency_type: 'daily',
    difficulty_level: 2,
    start_date: '2024-01-01',
    target_end_date: null,
    status: 'active',
    is_public: false,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
    completed_at: null
  },
  {
    id: '3',
    user_id: 'demo-user',
    title: 'Meditation',
    description: 'Practice mindfulness meditation',
    category: 'health',
    target_frequency: 1,
    frequency_type: 'daily',
    difficulty_level: 3,
    start_date: '2024-01-01',
    target_end_date: null,
    status: 'active',
    is_public: false,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
    completed_at: null
  },
  {
    id: '4',
    user_id: 'demo-user',
    title: 'Work on MyDataDay Every day for at least 30 minutes',
    description: 'Dedicate time to developing and improving MyDataDay',
    category: 'career',
    target_frequency: 1,
    frequency_type: 'daily',
    difficulty_level: 3,
    start_date: '2024-01-01',
    target_end_date: null,
    status: 'active',
    is_public: false,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
    completed_at: null
  },
  {
    id: '5',
    user_id: 'demo-user',
    title: 'Learn Spanish',
    description: 'Practice Spanish vocabulary and grammar',
    category: 'education',
    target_frequency: 3,
    frequency_type: 'weekly',
    difficulty_level: 4,
    start_date: '2024-01-01',
    target_end_date: '2024-12-31',
    status: 'active',
    is_public: false,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
    completed_at: null
  }
]

// Reason: Custom hook for goal management with TanStack Query
export function useGoals() {
  const { user } = useAuth()
  const queryClient = useQueryClient()

  // Reason: Query for user's goals (with demo mode fallback)
  const {
    data: goals = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ['goals', user?.id || 'demo'],
    queryFn: async (): Promise<Goal[]> => {
      // Reason: If no user, return sample data for demo
      if (!user) {
        // Simulate loading delay for realistic experience
        await new Promise(resolve => setTimeout(resolve, 500))
        return sampleGoals
      }

      const { data, error } = await supabase
        .from('goals')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (error) throw error
      return data || []
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  })

  // Reason: Mutation for creating a new goal
  const createGoalMutation = useMutation({
    mutationFn: async (goalData: Omit<GoalInsert, 'user_id' | 'id' | 'created_at' | 'updated_at'>) => {
      if (!user) throw new Error('User not authenticated')

      const { data, error } = await supabase
        .from('goals')
        .insert({
          ...goalData,
          user_id: user.id,
        })
        .select()
        .single()

      if (error) throw error
      return data
    },
    onSuccess: (newGoal) => {
      // Reason: Update the goals cache with the new goal
      queryClient.setQueryData(['goals', user?.id], (oldGoals: Goal[] = []) => [
        newGoal,
        ...oldGoals,
      ])
      
      // Reason: Also invalidate to ensure fresh data
      queryClient.invalidateQueries({ queryKey: ['goals', user?.id] })
    },
  })

  // Reason: Mutation for updating a goal
  const updateGoalMutation = useMutation({
    mutationFn: async ({ id, ...updates }: GoalUpdate & { id: string }) => {
      const { data, error } = await supabase
        .from('goals')
        .update(updates)
        .eq('id', id)
        .select()
        .single()

      if (error) throw error
      return data
    },
    onSuccess: (updatedGoal) => {
      // Reason: Update the specific goal in cache
      queryClient.setQueryData(['goals', user?.id], (oldGoals: Goal[] = []) =>
        oldGoals.map((goal) => (goal.id === updatedGoal.id ? updatedGoal : goal))
      )
    },
  })

  // Reason: Mutation for deleting a goal
  const deleteGoalMutation = useMutation({
    mutationFn: async (goalId: string) => {
      const { error } = await supabase
        .from('goals')
        .delete()
        .eq('id', goalId)

      if (error) throw error
      return goalId
    },
    onSuccess: (deletedGoalId) => {
      // Reason: Remove the goal from cache
      queryClient.setQueryData(['goals', user?.id], (oldGoals: Goal[] = []) =>
        oldGoals.filter((goal) => goal.id !== deletedGoalId)
      )
    },
  })

  // Reason: Get goals by status
  const activeGoals = goals.filter(goal => goal.status === 'active')
  const completedGoals = goals.filter(goal => goal.status === 'completed')
  const pausedGoals = goals.filter(goal => goal.status === 'paused')

  // Reason: Get goals by category
  const goalsByCategory = goals.reduce((acc, goal) => {
    const category = goal.category || 'other'
    if (!acc[category]) acc[category] = []
    acc[category].push(goal)
    return acc
  }, {} as Record<string, Goal[]>)

  return {
    // Data
    goals,
    activeGoals,
    completedGoals,
    pausedGoals,
    goalsByCategory,
    
    // State
    isLoading,
    error,

    // Actions
    createGoal: createGoalMutation.mutateAsync,
    updateGoal: updateGoalMutation.mutateAsync,
    deleteGoal: deleteGoalMutation.mutateAsync,

    // Loading states
    isCreating: createGoalMutation.isPending,
    isUpdating: updateGoalMutation.isPending,
    isDeleting: deleteGoalMutation.isPending,

    // Errors
    createError: createGoalMutation.error,
    updateError: updateGoalMutation.error,
    deleteError: deleteGoalMutation.error,
  }
}
