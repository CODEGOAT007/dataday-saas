'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts'
import { TrendingUp, Calendar, Target, MoreHorizontal } from 'lucide-react'
import { useState } from 'react'

export function ProgressChart() {
  const [chartType, setChartType] = useState<'area' | 'bar'>('area')

  // Sample data for the last 30 days
  const progressData = [
    { date: '2024-01-01', completed: 3, total: 4, percentage: 75 },
    { date: '2024-01-02', completed: 4, total: 4, percentage: 100 },
    { date: '2024-01-03', completed: 2, total: 4, percentage: 50 },
    { date: '2024-01-04', completed: 4, total: 4, percentage: 100 },
    { date: '2024-01-05', completed: 3, total: 4, percentage: 75 },
    { date: '2024-01-06', completed: 4, total: 4, percentage: 100 },
    { date: '2024-01-07', completed: 3, total: 4, percentage: 75 },
    { date: '2024-01-08', completed: 4, total: 4, percentage: 100 },
    { date: '2024-01-09', completed: 2, total: 4, percentage: 50 },
    { date: '2024-01-10', completed: 4, total: 4, percentage: 100 },
    { date: '2024-01-11', completed: 3, total: 4, percentage: 75 },
    { date: '2024-01-12', completed: 4, total: 4, percentage: 100 },
    { date: '2024-01-13', completed: 4, total: 4, percentage: 100 },
    { date: '2024-01-14', completed: 3, total: 4, percentage: 75 },
    { date: '2024-01-15', completed: 4, total: 4, percentage: 100 },
    { date: '2024-01-16', completed: 2, total: 4, percentage: 50 },
    { date: '2024-01-17', completed: 4, total: 4, percentage: 100 },
    { date: '2024-01-18', completed: 3, total: 4, percentage: 75 },
    { date: '2024-01-19', completed: 4, total: 4, percentage: 100 },
    { date: '2024-01-20', completed: 4, total: 4, percentage: 100 },
    { date: '2024-01-21', completed: 3, total: 4, percentage: 75 },
    { date: '2024-01-22', completed: 4, total: 4, percentage: 100 },
    { date: '2024-01-23', completed: 2, total: 4, percentage: 50 },
    { date: '2024-01-24', completed: 4, total: 4, percentage: 100 },
    { date: '2024-01-25', completed: 3, total: 4, percentage: 75 },
    { date: '2024-01-26', completed: 4, total: 4, percentage: 100 },
    { date: '2024-01-27', completed: 4, total: 4, percentage: 100 },
    { date: '2024-01-28', completed: 3, total: 4, percentage: 75 },
    { date: '2024-01-29', completed: 4, total: 4, percentage: 100 },
    { date: '2024-01-30', completed: 4, total: 4, percentage: 100 },
  ]

  // Calculate stats
  const totalDays = progressData.length
  const averageCompletion = Math.round(
    progressData.reduce((sum, day) => sum + day.percentage, 0) / totalDays
  )
  const perfectDays = progressData.filter(day => day.percentage === 100).length
  const currentStreak = (() => {
    let streak = 0
    for (let i = progressData.length - 1; i >= 0; i--) {
      if (progressData[i].percentage === 100) {
        streak++
      } else {
        break
      }
    }
    return streak
  })()

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload
      return (
        <div className="bg-white p-3 border rounded-lg shadow-lg">
          <p className="text-sm font-medium text-gray-900">
            {new Date(label).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric'
            })}
          </p>
          <p className="text-sm text-gray-600">
            {data.completed} of {data.total} goals completed
          </p>
          <p className="text-sm font-semibold text-blue-600">
            {data.percentage}% completion
          </p>
        </div>
      )
    }
    return null
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-gradient-to-r from-blue-500 to-purple-500">
              <TrendingUp className="h-5 w-5 text-white" />
            </div>
            <CardTitle>Progress Overview</CardTitle>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex bg-gray-100 rounded-lg p-1">
              <Button
                size="sm"
                variant={chartType === 'area' ? 'default' : 'ghost'}
                className="h-8 px-3 text-xs"
                onClick={() => setChartType('area')}
              >
                Area
              </Button>
              <Button
                size="sm"
                variant={chartType === 'bar' ? 'default' : 'ghost'}
                className="h-8 px-3 text-xs"
                onClick={() => setChartType('bar')}
              >
                Bar
              </Button>
            </div>
            <Button size="sm" variant="ghost">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
          <div className="text-center p-3 bg-blue-50 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">{averageCompletion}%</div>
            <div className="text-xs text-blue-600 font-medium">Avg Completion</div>
          </div>
          <div className="text-center p-3 bg-green-50 rounded-lg">
            <div className="text-2xl font-bold text-green-600">{perfectDays}</div>
            <div className="text-xs text-green-600 font-medium">Perfect Days</div>
          </div>
          <div className="text-center p-3 bg-purple-50 rounded-lg">
            <div className="text-2xl font-bold text-purple-600">{currentStreak}</div>
            <div className="text-xs text-purple-600 font-medium">Current Streak</div>
          </div>
          <div className="text-center p-3 bg-orange-50 rounded-lg">
            <div className="text-2xl font-bold text-orange-600">{totalDays}</div>
            <div className="text-xs text-orange-600 font-medium">Days Tracked</div>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            {chartType === 'area' ? (
              <AreaChart data={progressData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorCompletion" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.05}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis
                  dataKey="date"
                  tickFormatter={(value) => new Date(value).getDate().toString()}
                  stroke="#64748b"
                  fontSize={12}
                />
                <YAxis
                  domain={[0, 100]}
                  tickFormatter={(value) => `${value}%`}
                  stroke="#64748b"
                  fontSize={12}
                />
                <Tooltip content={<CustomTooltip />} />
                <Area
                  type="monotone"
                  dataKey="percentage"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorCompletion)"
                />
              </AreaChart>
            ) : (
              <BarChart data={progressData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis
                  dataKey="date"
                  tickFormatter={(value) => new Date(value).getDate().toString()}
                  stroke="#64748b"
                  fontSize={12}
                />
                <YAxis
                  domain={[0, 100]}
                  tickFormatter={(value) => `${value}%`}
                  stroke="#64748b"
                  fontSize={12}
                />
                <Tooltip content={<CustomTooltip />} />
                <Bar
                  dataKey="percentage"
                  fill="#3b82f6"
                  radius={[2, 2, 0, 0]}
                />
              </BarChart>
            )}
          </ResponsiveContainer>
        </div>

        <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Calendar className="h-4 w-4" />
            <span>Last 30 days</span>
          </div>
          <Badge variant="outline" className="text-green-600 border-green-200 bg-green-50">
            <TrendingUp className="h-3 w-3 mr-1" />
            +12% vs last month
          </Badge>
        </div>
      </CardContent>
    </Card>
  )
}
