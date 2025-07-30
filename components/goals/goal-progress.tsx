'use client'

interface GoalProgressProps {
  goalId: string
}

export function GoalProgress({ goalId }: GoalProgressProps) {
  return (
    <div className="text-muted-foreground">
      Goal progress component placeholder for goal {goalId}
    </div>
  )
}
