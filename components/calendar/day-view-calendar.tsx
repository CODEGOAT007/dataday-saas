'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ChevronLeft, ChevronRight, Calendar, Clock } from 'lucide-react'
import { GoalEntryCard } from './goal-entry-card'
import { useGoals } from '@/hooks/use-goals'
import { useDailyLogs } from '@/hooks/use-daily-logs'

export function DayViewCalendar() {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [isClient, setIsClient] = useState(false)
  const { goals } = useGoals()

  // Reason: Initialize date after hydration to prevent SSR mismatch
  useEffect(() => {
    setSelectedDate(new Date())
    setIsClient(true)
  }, [])

  const { todaySummary } = useDailyLogs(selectedDate?.toISOString().split('T')[0] || '')

  // Reason: Generate time slots for the day (6 AM to 11 PM)
  const timeSlots = Array.from({ length: 17 }, (_, i) => {
    const hour = i + 6
    return {
      time: `${hour.toString().padStart(2, '0')}:00`,
      hour: hour,
      displayTime: hour > 12 ? `${hour - 12}:00 PM` : hour === 12 ? '12:00 PM' : `${hour}:00 AM`
    }
  })

  // Reason: Navigate to previous/next day
  const navigateDay = (direction: 'prev' | 'next') => {
    if (!selectedDate) return
    const newDate = new Date(selectedDate)
    newDate.setDate(newDate.getDate() + (direction === 'next' ? 1 : -1))
    setSelectedDate(newDate)
  }

  // Reason: Format date for display
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  // Reason: Check if date is today
  const isToday = (date: Date) => {
    if (!isClient) return false
    const today = new Date()
    return date.toDateString() === today.toDateString()
  }

  // Reason: Get goals scheduled for specific time slots
  const getGoalsForTimeSlot = (hour: number) => {
    return goals.filter(goal => {
      // For now, we'll distribute goals across different times
      // Later this will be based on user-set target times
      // Use a hash of the goal ID to distribute goals across time slots
      const goalHash = goal.id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
      const goalHour = (goalHash % 17) + 6
      return goalHour === hour
    })
  }

  // Reason: Show loading state during hydration
  if (!isClient || !selectedDate) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-64 mx-auto mb-6"></div>
          <div className="h-32 bg-gray-200 dark:bg-gray-700 rounded mb-6"></div>
          <div className="space-y-4">
            {Array.from({ length: 8 }, (_, i) => (
              <div key={i} className="h-20 bg-gray-200 dark:bg-gray-700 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full px-2 sm:px-0">
      {/* Header */}
      <div className="flex flex-col items-center gap-4 mb-4 sm:mb-6">
        {/* Navigation Controls */}
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigateDay('prev')}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>

          <div className="text-center">
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
              {formatDate(selectedDate)}
            </h1>
            {isToday(selectedDate) && (
              <span className="text-sm text-blue-600 dark:text-blue-400 font-medium">Today</span>
            )}
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => navigateDay('next')}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        {/* Today Button - Centered */}
        <Button
          variant="outline"
          onClick={() => isClient && setSelectedDate(new Date())}
          className="flex items-center gap-2"
        >
          <Calendar className="h-4 w-4" />
          Today
        </Button>
      </div>

      {/* Progress Summary */}
      {todaySummary && (
        <Card className="mb-4 sm:mb-6 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
          <CardContent className="p-3 sm:p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 sm:gap-4">
                <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-300">
                  {todaySummary.completedGoals} of {todaySummary.totalGoals} completed
                </div>
                <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-300">
                  {todaySummary.progressPercentage}% progress
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Day View Calendar */}
      <Card className="w-full max-w-none bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
        <CardContent className="p-0">
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {timeSlots.map((slot) => {
              const goalsForSlot = getGoalsForTimeSlot(slot.hour)

              return (
                <div key={slot.time} className="flex">
                  {/* Time Column - More compact on mobile */}
                  <div className="w-16 sm:w-20 md:w-24 p-2 sm:p-3 md:p-4 text-xs sm:text-sm text-gray-500 dark:text-gray-400 border-r border-gray-200 dark:border-gray-700 flex items-start">
                    <Clock className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2 mt-0.5 flex-shrink-0" />
                    <span className="leading-tight">{slot.displayTime}</span>
                  </div>

                  {/* Content Column - More compact on mobile */}
                  <div className="flex-1 p-2 sm:p-3 md:p-4 min-h-[60px] sm:min-h-[70px] md:min-h-[80px]">
                    {goalsForSlot.length > 0 ? (
                      <div className="space-y-2 sm:space-y-3">
                        {goalsForSlot.map((goal) => (
                          <GoalEntryCard
                            key={goal.id}
                            goal={goal}
                            targetDate={selectedDate.toISOString().split('T')[0]}
                            scheduledTime={slot.displayTime}
                          />
                        ))}
                      </div>
                    ) : (
                      <div className="text-gray-400 dark:text-gray-500 text-xs sm:text-sm italic">
                        No goals scheduled
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
