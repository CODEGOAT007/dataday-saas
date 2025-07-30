'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Target, Calendar, TrendingUp, Users, ArrowUpRight, ArrowDownRight } from 'lucide-react'
import { cn } from '@/lib/utils'

export function DashboardOverview() {
  const stats = [
    {
      title: 'Active Goals',
      value: '3',
      icon: Target,
      change: '+1 this week',
      changeValue: '+33%',
      changeType: 'positive' as const,
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-gradient-to-br from-blue-50 to-blue-100',
      iconColor: 'text-blue-600'
    },
    {
      title: 'Current Streak',
      value: '12',
      unit: 'days',
      icon: Calendar,
      change: 'Personal best!',
      changeValue: 'New record',
      changeType: 'positive' as const,
      color: 'from-purple-500 to-purple-600',
      bgColor: 'bg-gradient-to-br from-purple-50 to-purple-100',
      iconColor: 'text-purple-600'
    },
    {
      title: 'Completion Rate',
      value: '94%',
      icon: TrendingUp,
      change: '+5% vs last month',
      changeValue: '+5.4%',
      changeType: 'positive' as const,
      color: 'from-green-500 to-green-600',
      bgColor: 'bg-gradient-to-br from-green-50 to-green-100',
      iconColor: 'text-green-600'
    },
    {
      title: 'Support Team',
      value: '5',
      unit: 'members',
      icon: Users,
      change: 'All active',
      changeValue: '100%',
      changeType: 'positive' as const,
      color: 'from-orange-500 to-orange-600',
      bgColor: 'bg-gradient-to-br from-orange-50 to-orange-100',
      iconColor: 'text-orange-600'
    },
  ]

  return (
    <div className="mb-8">
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon
          const TrendIcon = stat.changeType === 'positive' ? ArrowUpRight : ArrowDownRight

          return (
            <Card
              key={stat.title}
              className="relative overflow-hidden bg-white dark:bg-gray-800 border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
            >
              {/* Background gradient */}
              <div className={cn(
                "absolute inset-0 bg-gradient-to-br opacity-5",
                stat.color
              )} />

              <CardContent className="p-6 relative z-10">
                <div className="flex items-center justify-between mb-4">
                  <div className={cn(
                    "p-3 rounded-xl shadow-sm",
                    stat.bgColor
                  )}>
                    <Icon className={cn("h-6 w-6", stat.iconColor)} />
                  </div>
                  <div className="flex items-center space-x-1">
                    <TrendIcon className={cn(
                      "h-4 w-4",
                      stat.changeType === 'positive' ? 'text-green-500' : 'text-red-500'
                    )} />
                    <span className={cn(
                      "text-sm font-semibold",
                      stat.changeType === 'positive' ? 'text-green-500' : 'text-red-500'
                    )}>
                      {stat.changeValue}
                    </span>
                  </div>
                </div>

                <div className="space-y-1">
                  <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    {stat.title}
                  </h3>
                  <div className="flex items-baseline space-x-2">
                    <span className="text-3xl font-bold text-gray-900 dark:text-white">
                      {stat.value}
                    </span>
                    {stat.unit && (
                      <span className="text-lg font-medium text-gray-500 dark:text-gray-400">
                        {stat.unit}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                    {stat.change}
                  </p>
                </div>
              </CardContent>

              {/* Decorative element */}
              <div className="absolute bottom-0 right-0 w-24 h-24 opacity-10">
                <div className={cn(
                  "w-full h-full rounded-full bg-gradient-to-br transform translate-x-8 translate-y-8",
                  stat.color
                )} />
              </div>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
