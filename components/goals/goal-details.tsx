'use client'

interface GoalDetailsProps {
  goalId: string
}

export function GoalDetails({ goalId }: GoalDetailsProps) {
  return (
    <div className="text-muted-foreground">
      Goal details component placeholder for goal {goalId}
    </div>
  )
}
