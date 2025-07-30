'use client'

interface EmergencySupportTeamCardProps {
  goalId: string
}

export function EmergencySupportTeamCard({ goalId }: EmergencySupportTeamCardProps) {
  return (
    <div className="text-muted-foreground">
      Emergency support team card component placeholder for goal {goalId}
    </div>
  )
}
