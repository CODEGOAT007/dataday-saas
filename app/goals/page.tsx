import { Metadata } from 'next'
import { GoalsList } from '@/components/goals/goals-list'
import { CreateGoalButton } from '@/components/goals/create-goal-button'
import { GoalsStats } from '@/components/goals/goals-stats'
import { GoalsFilters } from '@/components/goals/goals-filters'

export const metadata: Metadata = {
  title: 'Goals',
  description: 'Manage your goals and track your progress',
}

export default function GoalsPage() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Goals</h1>
          <p className="text-muted-foreground">
            Track your progress and achieve your dreams
          </p>
        </div>
        <CreateGoalButton />
      </div>

      {/* Goals Stats */}
      <GoalsStats />

      {/* Filters */}
      <GoalsFilters />

      {/* Goals List */}
      <GoalsList />
    </div>
  )
}
