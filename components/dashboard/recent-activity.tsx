'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  CheckCircle,
  Target,
  Calendar,
  Trophy,
  Flame,
  Star,
  Clock,
  TrendingUp,
  Users,
  MessageCircle
} from 'lucide-react'
import { cn } from '@/lib/utils'

export function RecentActivity() {
  const activities = [
    {
      id: '1',
      type: 'goal_completed',
      title: 'Completed Daily Exercise',
      description: '45 minutes of cardio workout',
      timestamp: '2 hours ago',
      icon: CheckCircle,
      iconColor: 'text-green-600',
      iconBg: 'bg-green-100',
      badge: { text: 'Goal', variant: 'success' as const }
    },
    {
      id: '2',
      type: 'streak_milestone',
      title: 'Meditation Streak: 12 Days!',
      description: 'Longest streak this year',
      timestamp: '5 hours ago',
      icon: Flame,
      iconColor: 'text-orange-600',
      iconBg: 'bg-orange-100',
      badge: { text: 'Milestone', variant: 'warning' as const }
    },
    {
      id: '3',
      type: 'goal_created',
      title: 'New Goal: Read 30 Minutes',
      description: 'Daily reading habit goal created',
      timestamp: '1 day ago',
      icon: Target,
      iconColor: 'text-blue-600',
      iconBg: 'bg-blue-100',
      badge: { text: 'New', variant: 'default' as const }
    },
    {
      id: '4',
      type: 'achievement',
      title: 'Perfect Week Achievement',
      description: 'Completed all goals for 7 days straight',
      timestamp: '2 days ago',
      icon: Trophy,
      iconColor: 'text-yellow-600',
      iconBg: 'bg-yellow-100',
      badge: { text: 'Achievement', variant: 'warning' as const }
    },
    {
      id: '5',
      type: 'support_interaction',
      title: 'Support Team Check-in',
      description: 'Sarah from your support team sent encouragement',
      timestamp: '3 days ago',
      icon: Users,
      iconColor: 'text-purple-600',
      iconBg: 'bg-purple-100',
      badge: { text: 'Support', variant: 'secondary' as const }
    },
    {
      id: '6',
      type: 'progress_update',
      title: 'Weekly Progress Report',
      description: 'Completion rate improved by 15%',
      timestamp: '4 days ago',
      icon: TrendingUp,
      iconColor: 'text-indigo-600',
      iconBg: 'bg-indigo-100',
      badge: { text: 'Progress', variant: 'default' as const }
    },
    {
      id: '7',
      type: 'goal_completed',
      title: 'Completed Reading Session',
      description: 'Finished chapter 3 of "Atomic Habits"',
      timestamp: '5 days ago',
      icon: CheckCircle,
      iconColor: 'text-green-600',
      iconBg: 'bg-green-100',
      badge: { text: 'Goal', variant: 'success' as const }
    }
  ]

  const getTimelineConnector = (index: number, isLast: boolean) => {
    if (isLast) return null

    return (
      <div className="absolute left-6 top-12 w-0.5 h-8 bg-gradient-to-b from-gray-200 to-gray-100" />
    )
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-gradient-to-r from-green-500 to-blue-500">
              <Clock className="h-5 w-5 text-white" />
            </div>
            Recent Activity
          </CardTitle>
          <Button size="sm" variant="ghost">
            View All
          </Button>
        </div>
      </CardHeader>

      <CardContent>
        <div className="space-y-0">
          {activities.map((activity, index) => {
            const Icon = activity.icon
            const isLast = index === activities.length - 1

            return (
              <div key={activity.id} className="relative">
                <div className="flex items-start gap-4 pb-6">
                  {/* Timeline Icon */}
                  <div className={cn(
                    "relative z-10 flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center border-2 border-white shadow-sm",
                    activity.iconBg
                  )}>
                    <Icon className={cn("h-5 w-5", activity.iconColor)} />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0 pt-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-semibold text-sm text-gray-900 truncate">
                        {activity.title}
                      </h4>
                      <Badge
                        variant={activity.badge.variant}
                        className="text-xs px-2 py-0.5 flex-shrink-0"
                      >
                        {activity.badge.text}
                      </Badge>
                    </div>

                    <p className="text-sm text-gray-600 mb-2 leading-relaxed">
                      {activity.description}
                    </p>

                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <Clock className="h-3 w-3" />
                      <span>{activity.timestamp}</span>
                    </div>
                  </div>
                </div>

                {/* Timeline Connector */}
                {getTimelineConnector(index, isLast)}
              </div>
            )
          })}
        </div>

        {/* Footer */}
        <div className="pt-4 border-t border-gray-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <div className="flex -space-x-1">
                <div className="w-6 h-6 rounded-full bg-green-100 border-2 border-white flex items-center justify-center">
                  <CheckCircle className="h-3 w-3 text-green-600" />
                </div>
                <div className="w-6 h-6 rounded-full bg-orange-100 border-2 border-white flex items-center justify-center">
                  <Flame className="h-3 w-3 text-orange-600" />
                </div>
                <div className="w-6 h-6 rounded-full bg-yellow-100 border-2 border-white flex items-center justify-center">
                  <Trophy className="h-3 w-3 text-yellow-600" />
                </div>
              </div>
              <span>12 activities this week</span>
            </div>

            <Button size="sm" variant="outline" className="text-xs">
              <MessageCircle className="h-3 w-3 mr-1" />
              Share Progress
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
