'use client'

interface SupportCircleCardProps {
  goalId: string
}

export function SupportCircleCard({ goalId }: SupportCircleCardProps) {
  return (
    <div className="text-muted-foreground">
      Support circle card component placeholder for goal {goalId}
    </div>
  )
}
