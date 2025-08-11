import { Metadata } from 'next'
import { StreakCard } from '@/components/dashboard/streak-card'
import { GoalsSummary } from '@/components/dashboard/goals-summary'

export const metadata: Metadata = {
  title: 'Dashboard',
  description: 'Your personal progress dashboard',
}

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
          Dashboard
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400">
          Welcome back! Here's your progress overview.
        </p>
      </div>

      {/* Current Streak Card with Graph */}
      <StreakCard />

      {/* Your Goals Card */}
      <GoalsSummary />
    </div>
  )
}
