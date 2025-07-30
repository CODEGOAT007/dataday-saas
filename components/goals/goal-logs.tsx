'use client'

interface GoalLogsProps {
  goalId: string
}

export function GoalLogs({ goalId }: GoalLogsProps) {
  return (
    <div className="text-muted-foreground">
      Goal logs component placeholder for goal {goalId}
    </div>
  )
}
