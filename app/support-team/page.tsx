'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function SupportTeamPage() {
  const router = useRouter()

  useEffect(() => {
    // Redirect to the working emergency support team setup
    router.push('/onboarding/emergency-support-team')
  }, [router])

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Emergency Support Team</h1>
        <p className="text-gray-600 mb-8">
          Redirecting to setup page...
        </p>
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <p className="text-blue-800">
            🚀 Taking you to the emergency support team setup!
          </p>
        </div>
      </div>
    </div>
  )
}
