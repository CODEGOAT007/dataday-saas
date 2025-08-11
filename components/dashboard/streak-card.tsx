'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Calendar, TrendingUp } from 'lucide-react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useAuth } from '@/hooks/use-auth'

interface StreakData {
  day: string
  streak: number
  date: string
  completed: boolean
}

interface StreakStats {
  currentStreak: number
  bestStreak: number
  totalDays: number
  completedDays: number
  streakData: StreakData[]
}

export function StreakCard() {
  const { user } = useAuth()
  const [stats, setStats] = useState<StreakStats>({
    currentStreak: 0,
    bestStreak: 0,
    totalDays: 0,
    completedDays: 0,
    streakData: []
  })
  const [loading, setLoading] = useState(true)
  const supabase = createClientComponentClient()

  useEffect(() => {
    if (user) {
      fetchStreakData()
    }
  }, [user])

  const fetchStreakData = async () => {
    try {
      // Get daily logs for the last 30 days
      const thirtyDaysAgo = new Date()
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

      const { data: logs, error } = await supabase
        .from('daily_logs')
        .select('*')
        .eq('user_id', user?.id)
        .gte('target_date', thirtyDaysAgo.toISOString().split('T')[0])
        .order('target_date', { ascending: true })

      if (error) {
        console.error('Error fetching daily logs:', error)
        return
      }

      // Calculate streak data
      const streakData: StreakData[] = []
      const today = new Date()
      let currentStreak = 0
      let bestStreak = 0
      let tempStreak = 0
      let completedDays = 0

      // Generate data for last 30 days
      for (let i = 29; i >= 0; i--) {
        const date = new Date()
        date.setDate(date.getDate() - i)
        const dateStr = date.toISOString().split('T')[0]

        const log = logs?.find(l => l.target_date === dateStr)
        const completed = log?.completed || false

        if (completed) {
          tempStreak++
          completedDays++
          if (i === 0) currentStreak = tempStreak // If today is completed, this is current streak
        } else {
          if (i > 0) tempStreak = 0 // Reset streak for past days, but not today
        }

        bestStreak = Math.max(bestStreak, tempStreak)

        streakData.push({
          day: `Day ${30 - i}`,
          streak: tempStreak,
          date: dateStr,
          completed
        })
      }

      // If today is not completed, current streak is the streak up to yesterday
      if (!logs?.find(l => l.target_date === today.toISOString().split('T')[0])?.completed) {
        // Find the most recent completed day and calculate streak from there
        let recentStreak = 0
        for (let i = 1; i < streakData.length; i++) {
          const dayData = streakData[streakData.length - 1 - i]
          if (dayData.completed) {
            recentStreak++
          } else {
            break
          }
        }
        currentStreak = recentStreak
      }

      setStats({
        currentStreak,
        bestStreak,
        totalDays: 30,
        completedDays,
        streakData
      })

    } catch (error) {
      console.error('Error calculating streak:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <Card className="relative overflow-hidden bg-white dark:bg-gray-800 border-0 shadow-lg">
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-6 bg-gray-300 rounded w-1/3"></div>
            <div className="h-32 bg-gray-300 rounded"></div>
            <div className="h-64 bg-gray-300 rounded"></div>
          </div>
        </CardContent>
      </Card>
    )
  }

  const { currentStreak, bestStreak, totalDays, completedDays, streakData } = stats
  const isPersonalBest = currentStreak === bestStreak && currentStreak > 0

  return (
    <Card className="relative overflow-hidden bg-white dark:bg-gray-800 border-0 shadow-lg">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-500 to-purple-600 opacity-5" />

      <CardHeader className="relative z-10">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl shadow-sm bg-gradient-to-br from-purple-50 to-purple-100">
              <Calendar className="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Current Streak
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {currentStreak === 0 ? 'Start your journey!' : 'Keep up the momentum!'}
              </p>
            </div>
          </div>
          {isPersonalBest && (
            <div className="text-right">
              <div className="flex items-center space-x-1 text-green-500">
                <TrendingUp className="h-4 w-4" />
                <span className="text-sm font-semibold">Personal Best!</span>
              </div>
            </div>
          )}
        </CardTitle>
      </CardHeader>

      <CardContent className="relative z-10 space-y-6">
        {/* Streak Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-3xl font-bold text-purple-600 dark:text-purple-400">
              {currentStreak}
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              Current Streak
            </div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-green-600 dark:text-green-400">
              {bestStreak}
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              Best Streak
            </div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
              {completedDays}
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              Days Completed
            </div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-orange-600 dark:text-orange-400">
              {Math.round((completedDays / totalDays) * 100)}%
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              Success Rate
            </div>
          </div>
        </div>

        {/* Streak Progress Chart */}
        {streakData.length > 0 ? (
          <div className="space-y-4">
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">
              30-Day Streak Progress
            </h4>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={streakData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                  <XAxis
                    dataKey="day"
                    tick={{ fontSize: 12 }}
                    interval="preserveStartEnd"
                    tickFormatter={(value, index) => {
                      // Show every 5th day
                      return index % 5 === 0 ? `D${index + 1}` : ''
                    }}
                  />
                  <YAxis
                    tick={{ fontSize: 12 }}
                    label={{ value: 'Streak Days', angle: -90, position: 'insideLeft' }}
                  />
                  <Tooltip
                    labelFormatter={(label, payload) => {
                      if (payload && payload[0]) {
                        const data = payload[0].payload
                        return `${data.date} (${data.completed ? 'Completed' : 'Missed'})`
                      }
                      return label
                    }}
                    formatter={(value: number) => [value, 'Streak Days']}
                    contentStyle={{
                      backgroundColor: 'rgba(255, 255, 255, 0.95)',
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px',
                      fontSize: '12px'
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="streak"
                    stroke="#8b5cf6"
                    strokeWidth={3}
                    dot={(props) => {
                      const { payload } = props
                      return (
                        <circle
                          cx={props.cx}
                          cy={props.cy}
                          r={4}
                          fill={payload.completed ? '#8b5cf6' : '#ef4444'}
                          stroke={payload.completed ? '#8b5cf6' : '#ef4444'}
                          strokeWidth={2}
                        />
                      )
                    }}
                    activeDot={{ r: 6, stroke: '#8b5cf6', strokeWidth: 2 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No activity data yet. Start completing goals to see your streak!</p>
          </div>
        )}

        {/* Motivational Message */}
        <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4 border border-purple-200 dark:border-purple-800">
          <p className="text-sm text-purple-700 dark:text-purple-300 text-center">
            {currentStreak === 0
              ? "🌟 Ready to start your streak? Complete your first goal today!"
              : currentStreak === 1
              ? "🎉 Great start! One day down, keep the momentum going!"
              : `🔥 Amazing! ${currentStreak} days in a row. ${isPersonalBest ? "That's a new personal best!" : `Your best is ${bestStreak} days - you're getting close!`}`
            }
          </p>
        </div>
      </CardContent>

      {/* Decorative element */}
      <div className="absolute bottom-0 right-0 w-32 h-32 opacity-10">
        <div className="w-full h-full rounded-full bg-gradient-to-br from-purple-500 to-purple-600 transform translate-x-12 translate-y-12" />
      </div>
    </Card>
  )
}
