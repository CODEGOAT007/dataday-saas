import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { GoalDetails } from '@/components/goals/goal-details'
import { GoalProgress } from '@/components/goals/goal-progress'
import { GoalLogs } from '@/components/goals/goal-logs'
import { GoalInsights } from '@/components/goals/goal-insights'
import { SupportCircleCard } from '@/components/goals/emergency-support-team-card'

interface GoalPageProps {
  params: {
    id: string
  }
}

export async function generateMetadata({ params }: GoalPageProps): Promise<Metadata> {
  // TODO: Fetch goal data to generate dynamic metadata
  return {
    title: 'Goal Details',
    description: 'View your goal progress and insights',
  }
}

export default function GoalPage({ params }: GoalPageProps) {
  // TODO: Add proper goal validation
  if (!params.id) {
    notFound()
  }

  return (
    <div className="space-y-6">
      {/* Goal Header */}
      <GoalDetails goalId={params.id} />

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Main Content */}
        <div className="lg:col-span-2 space-y-6">
          <GoalProgress goalId={params.id} />
          <GoalLogs goalId={params.id} />
        </div>

        {/* Right Column - Sidebar */}
        <div className="space-y-6">
          <GoalInsights goalId={params.id} />
          <SupportCircleCard goalId={params.id} />
        </div>
      </div>
    </div>
  )
}
