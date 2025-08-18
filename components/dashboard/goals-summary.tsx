'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Plus, Target } from 'lucide-react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useAuth } from '@/hooks/use-auth'

interface Goal {
  id: string
  title: string
  description: string | null
  status: string
  created_at: string
  streak?: number
  completionRate?: number
}

export function GoalsSummary() {
  const { user } = useAuth()
  const [goals, setGoals] = useState<Goal[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClientComponentClient()

  useEffect(() => {
    if (user) {
      fetchGoals()
    }
  }, [user])

  const fetchGoals = async () => {
    try {
      const { data, error } = await supabase
        .from('goals')
        .select('*')
        .eq('user_id', user?.id)
        .eq('status', 'active')
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error fetching goals:', error)
        return
      }

      // For each goal, calculate streak and completion rate
      const goalsWithStats = await Promise.all(
        (data || []).map(async (goal) => {
          // Get daily logs for this goal in the last 30 days
          const thirtyDaysAgo = new Date()
          thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

          const { data: logs } = await supabase
            .from('daily_logs')
            .select('*')
            .eq('user_id', user?.id)
            .eq('goal_id', goal.id)
            .gte('target_date', thirtyDaysAgo.toISOString().split('T')[0])
            .order('target_date', { ascending: false })

          // Calculate completion rate
          const totalDays = 30
          const completedDays = logs?.filter(log => log.completed).length || 0
          const completionRate = Math.round((completedDays / totalDays) * 100)

          // Calculate current streak
          let streak = 0
          if (logs && logs.length > 0) {
            // Sort by date descending and count consecutive completed days
            const sortedLogs = logs.sort((a, b) => new Date(b.target_date).getTime() - new Date(a.target_date).getTime())
            for (const log of sortedLogs) {
              if (log.completed) {
                streak++
              } else {
                break
              }
            }
          }

          return {
            ...goal,
            streak,
            completionRate
          }
        })
      )

      setGoals(goalsWithStats)
    } catch (error) {
      console.error('Error calculating goal stats:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Your Goals
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-16 bg-gray-300 rounded"></div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <Target className="h-5 w-5" />
          Your Goals
        </CardTitle>
        <div className="text-sm text-gray-500">
          {goals.length} active goal{goals.length !== 1 ? 's' : ''}
        </div>
      </CardHeader>
      <CardContent>
        {goals.length === 0 ? (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            <Target className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p className="mb-2">No active goals yet</p>
            <p className="text-sm">Your coach will set up goals for you to complete</p>
          </div>
        ) : (
          <div className="space-y-4">
            {goals.map((goal) => (
              <div key={goal.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex-1">
                  <h3 className="font-medium">{goal.title}</h3>
                  {goal.description && (
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      {goal.description}
                    </p>
                  )}
                  <div className="flex items-center gap-4 mt-2">
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      <span className="font-medium text-purple-600">{goal.streak || 0}</span> day streak
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      <span className="font-medium text-green-600">{goal.completionRate || 0}%</span> completion
                    </div>
                  </div>
                </div>
                <Badge variant={goal.status === 'active' ? 'default' : 'secondary'}>
                  {goal.status}
                </Badge>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
