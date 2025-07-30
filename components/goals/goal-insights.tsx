'use client'

interface GoalInsightsProps {
  goalId: string
}

export function GoalInsights({ goalId }: GoalInsightsProps) {
  return (
    <div className="text-muted-foreground">
      Goal insights component placeholder for goal {goalId}
    </div>
  )
}
