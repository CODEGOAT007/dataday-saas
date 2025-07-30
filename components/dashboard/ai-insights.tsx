'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Brain, TrendingUp, Target, Lightbulb, ArrowRight, Sparkles } from 'lucide-react'
import { cn } from '@/lib/utils'

export function AIInsights() {
  const insights = [
    {
      id: '1',
      type: 'trend',
      title: 'Strong Morning Momentum',
      description: 'You complete 78% more goals when you start before 9 AM. Consider scheduling important tasks earlier.',
      confidence: 92,
      icon: TrendingUp,
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50',
      iconColor: 'text-blue-600',
      actionable: true
    },
    {
      id: '2',
      type: 'recommendation',
      title: 'Streak Protection',
      description: 'Your meditation streak is at risk. Set a reminder for 7 PM to maintain your 12-day streak.',
      confidence: 87,
      icon: Target,
      color: 'from-amber-500 to-amber-600',
      bgColor: 'bg-amber-50',
      iconColor: 'text-amber-600',
      actionable: true
    },
    {
      id: '3',
      type: 'insight',
      title: 'Weekly Pattern',
      description: 'Your completion rate drops 23% on Fridays. Try scheduling lighter goals for end of week.',
      confidence: 84,
      icon: Lightbulb,
      color: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-50',
      iconColor: 'text-purple-600',
      actionable: false
    }
  ]

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 90) return 'text-green-600 bg-green-100'
    if (confidence >= 80) return 'text-blue-600 bg-blue-100'
    return 'text-gray-600 bg-gray-100'
  }

  return (
    <Card className="relative overflow-hidden">
      {/* Header with gradient background */}
      <div className="absolute top-0 left-0 right-0 h-20 bg-gradient-to-r from-indigo-500/10 to-purple-500/10" />

      <CardHeader className="relative z-10">
        <CardTitle className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-500">
            <Brain className="h-5 w-5 text-white" />
          </div>
          AI Insights
          <Sparkles className="h-4 w-4 text-indigo-500 ml-auto" />
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        {insights.map((insight, index) => {
          const Icon = insight.icon

          return (
            <div
              key={insight.id}
              className={cn(
                "p-4 rounded-xl border transition-all duration-200 hover:shadow-md",
                insight.bgColor,
                "hover:scale-[1.02]"
              )}
            >
              <div className="flex items-start gap-3">
                <div className={cn(
                  "p-2 rounded-lg flex-shrink-0",
                  insight.bgColor === 'bg-blue-50' ? 'bg-blue-100' :
                  insight.bgColor === 'bg-amber-50' ? 'bg-amber-100' :
                  'bg-purple-100'
                )}>
                  <Icon className={cn("h-4 w-4", insight.iconColor)} />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-semibold text-sm text-gray-900">
                      {insight.title}
                    </h4>
                    <Badge
                      variant="outline"
                      className={cn(
                        "text-xs px-2 py-0.5",
                        getConfidenceColor(insight.confidence)
                      )}
                    >
                      {insight.confidence}% confident
                    </Badge>
                  </div>

                  <p className="text-sm text-gray-600 leading-relaxed mb-3">
                    {insight.description}
                  </p>

                  {insight.actionable && (
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-8 px-3 text-xs font-medium hover:bg-white/50"
                    >
                      Take Action
                      <ArrowRight className="h-3 w-3 ml-1" />
                    </Button>
                  )}
                </div>
              </div>
            </div>
          )
        })}

        {/* Footer */}
        <div className="pt-4 border-t border-gray-100">
          <div className="flex items-center justify-between text-xs text-gray-500">
            <span>Insights updated 2 hours ago</span>
            <Button variant="ghost" size="sm" className="h-8 text-xs">
              View All Insights
              <ArrowRight className="h-3 w-3 ml-1" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
