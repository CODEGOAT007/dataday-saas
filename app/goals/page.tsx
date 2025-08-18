import { Metadata } from 'next'
import { GoalCreationFlow } from '@/components/goals/goal-creation-flow'
import { Suspense } from 'react'

export const metadata: Metadata = {
  title: 'Goals - Coach Dashboard',
  description: 'Help users set goals and activate their support circles',
}

export default function GoalsPage() {
  return (
    <div className="min-h-screen bg-gray-950">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Page Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">Coach: Set User Goal</h1>
          <p className="text-gray-300 text-lg">
            Help the user define their goal and record a personal message for their support circle
          </p>
          <div className="mt-4 p-3 bg-blue-900/20 border border-blue-700 rounded-lg">
            <p className="text-blue-200 text-sm">
              👨‍💼 <strong>Coach Mode:</strong> You're setting up a goal for the user. Guide them through each step.
            </p>
          </div>
        </div>

        {/* Goal Creation Flow */}
        <Suspense fallback={<div className="text-gray-400">Loading goal flow…</div>}>
          <GoalCreationFlow />
        </Suspense>
      </div>
    </div>
  )
}
