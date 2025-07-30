import { Metadata } from 'next'
import { DashboardOverview } from '@/components/dashboard/dashboard-overview'
import { GoalsSummary } from '@/components/dashboard/goals-summary'
import { RecentActivity } from '@/components/dashboard/recent-activity'
import { ProgressChart } from '@/components/dashboard/progress-chart'
import { AIInsights } from '@/components/dashboard/ai-insights'
import { EmergencySupportTeamStatus } from '@/components/dashboard/emergency-support-team-status'
import { SubscriptionStatus } from '@/components/dashboard/subscription-status'
import { DailyProgressSummary } from '@/components/daily-logs/daily-progress-summary'
import { DailyLogForm } from '@/components/daily-logs/daily-log-form'
import { DemoBanner } from '@/components/dashboard/demo-banner'

export const metadata: Metadata = {
  title: 'Dashboard',
  description: 'Your personal progress dashboard',
}

export default function DashboardPage() {
  return (
    <>
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
          Dashboard
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400">
          Welcome back! Here's your progress overview.
        </p>
      </div>

      {/* Demo Banner */}
      <DemoBanner />

      {/* Overview Stats */}
      <DashboardOverview />

      {/* Daily Progress Summary */}
      <div className="mb-8">
        <DailyProgressSummary />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 lg:gap-8">
        {/* Left Column - Main Content */}
        <div className="xl:col-span-2 space-y-6 lg:space-y-8 min-w-0">
          <DailyLogForm />
          <GoalsSummary />
          <ProgressChart />
          <RecentActivity />
        </div>

        {/* Right Column - Sidebar */}
        <div className="space-y-6 lg:space-y-8 min-w-0">
          <SubscriptionStatus />
          <AIInsights />
          <EmergencySupportTeamStatus />
        </div>
      </div>
    </>
  )
}
