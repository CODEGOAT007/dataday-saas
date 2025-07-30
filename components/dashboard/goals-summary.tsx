'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Plus, Target } from 'lucide-react'

export function GoalsSummary() {
  const goals = [
    {
      id: '1',
      title: 'Daily Exercise',
      streak: 12,
      completionRate: 94,
      status: 'active' as const,
    },
    {
      id: '2', 
      title: 'Read 30 Minutes',
      streak: 8,
      completionRate: 87,
      status: 'active' as const,
    },
    {
      id: '3',
      title: 'Meditation',
      streak: 5,
      completionRate: 76,
      status: 'active' as const,
    },
  ]

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <Target className="h-5 w-5" />
          Your Goals
        </CardTitle>
        <Button size="sm">
          <Plus className="h-4 w-4 mr-2" />
          Add Goal
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {goals.map((goal) => (
            <div key={goal.id} className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex-1">
                <h3 className="font-medium">{goal.title}</h3>
                <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                  <span>{goal.streak} day streak</span>
                  <span>{goal.completionRate}% completion</span>
                </div>
              </div>
              <Badge variant="success">Active</Badge>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
