'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { useGoals } from '@/hooks/use-goals'
import { useDailyLogs } from '@/hooks/use-daily-logs'
import { CheckCircle, Circle, Target, Calendar } from 'lucide-react'

export function DailyLogForm() {
  const { activeGoals, isLoading: goalsLoading } = useGoals()
  const { todaySummary, logProgress, isLogging } = useDailyLogs()
  const [expandedGoal, setExpandedGoal] = useState<string | null>(null)

  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })

  // Reason: Handle quick completion toggle
  const handleQuickComplete = async (goalId: string, completed: boolean) => {
    try {
      await logProgress({
        goalId,
        completed,
        progressValue: completed ? 1 : 0
      })
    } catch (error) {
      console.error('Error logging progress:', error)
    }
  }

  // Reason: Handle detailed progress logging
  const handleDetailedLog = async (goalId: string, formData: FormData) => {
    const completed = formData.get('completed') === 'on'
    const progressValue = parseFloat(formData.get('progress') as string) || 0
    const notes = formData.get('notes') as string

    try {
      await logProgress({
        goalId,
        completed,
        progressValue,
        notes: notes || undefined
      })
      setExpandedGoal(null) // Close the expanded form
    } catch (error) {
      console.error('Error logging detailed progress:', error)
    }
  }

  if (goalsLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Daily Progress
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-gray-600">
            Loading your goals...
          </div>
        </CardContent>
      </Card>
    )
  }

  if (activeGoals.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Daily Progress
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <Target className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Active Goals</h3>
            <p className="text-gray-600 mb-4">
              Create your first goal to start tracking daily progress.
            </p>
            <Button onClick={() => window.location.href = '/goals'}>
              Create Goal
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  // Get logged goals for today
  const loggedGoalIds = new Set(todaySummary?.logs?.map(log => log.goal_id) || [])
  const completedGoalIds = new Set(
    todaySummary?.logs?.filter(log => log.completed).map(log => log.goal_id) || []
  )

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Daily Progress
          </CardTitle>
          <div className="text-sm text-gray-600">
            {today}
          </div>
        </div>
        {todaySummary && (
          <div className="flex items-center gap-4 text-sm text-gray-700">
            <span>{todaySummary.completedGoals} of {todaySummary.totalGoals} completed</span>
            <div className="flex-1 bg-muted rounded-full h-2">
              <div 
                className="bg-primary h-2 rounded-full transition-all duration-300"
                style={{ width: `${todaySummary.progressPercentage}%` }}
              />
            </div>
            <span>{todaySummary.progressPercentage}%</span>
          </div>
        )}
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {activeGoals.map((goal) => {
            const isLogged = loggedGoalIds.has(goal.id)
            const isCompleted = completedGoalIds.has(goal.id)
            const isExpanded = expandedGoal === goal.id

            return (
              <div
                key={goal.id}
                className={`border rounded-lg p-4 transition-all ${
                  isCompleted ? 'bg-green-50 border-green-200' : 
                  isLogged ? 'bg-blue-50 border-blue-200' : 
                  'bg-white border-gray-200'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 flex-1">
                    <button
                      onClick={() => handleQuickComplete(goal.id, !isCompleted)}
                      disabled={isLogging}
                      className="flex-shrink-0 p-1 rounded-full hover:bg-gray-100 transition-colors duration-200 disabled:opacity-50"
                      title={isCompleted ? "Mark as incomplete" : "Mark as complete"}
                    >
                      {isCompleted ? (
                        <CheckCircle className="h-6 w-6 text-green-600 hover:text-green-700" />
                      ) : (
                        <Circle className="h-6 w-6 text-gray-400 hover:text-green-600 transition-colors duration-200" />
                      )}
                    </button>
                    
                    <div className="flex-1">
                      <h3 className={`font-medium ${isCompleted ? 'line-through text-gray-500' : 'text-gray-900'}`}>
                        {goal.title}
                      </h3>
                      <p className="text-sm text-gray-600">
                        Target: {goal.target_frequency}x {goal.frequency_type}
                      </p>
                    </div>
                  </div>

                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setExpandedGoal(isExpanded ? null : goal.id)}
                  >
                    {isExpanded ? 'Less' : 'Details'}
                  </Button>
                </div>

                {isExpanded && (
                  <form
                    onSubmit={(e) => {
                      e.preventDefault()
                      handleDetailedLog(goal.id, new FormData(e.currentTarget))
                    }}
                    className="mt-4 pt-4 border-t border-gray-200 space-y-4 bg-gray-50 p-4 rounded-lg"
                  >
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id={`completed-${goal.id}`}
                        name="completed"
                        defaultChecked={isCompleted}
                      />
                      <label htmlFor={`completed-${goal.id}`} className="text-sm font-medium text-gray-900">
                        Mark as completed
                      </label>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-900 mb-2">
                        Progress Value (0-{goal.target_frequency})
                      </label>
                      <input
                        name="progress"
                        type="number"
                        min="0"
                        max={goal.target_frequency}
                        step="0.1"
                        defaultValue={isCompleted ? goal.target_frequency : 0}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-900 mb-2">
                        Notes (optional)
                      </label>
                      <textarea
                        name="notes"
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 placeholder-gray-500"
                        placeholder="How did it go? Any observations..."
                      />
                    </div>

                    <div className="flex gap-2">
                      <Button
                        type="submit"
                        disabled={isLogging}
                        size="sm"
                      >
                        {isLogging ? 'Saving...' : 'Save Progress'}
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => setExpandedGoal(null)}
                      >
                        Cancel
                      </Button>
                    </div>
                  </form>
                )}
              </div>
            )
          })}
        </div>

        {activeGoals.length > 0 && (
          <div className="mt-6 pt-4 border-t text-center">
            <p className="text-sm text-gray-600">
              Click the circle to quickly mark complete, or "Details" for more options
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
