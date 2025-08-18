import { Metadata } from 'next'
import { SupportCircleSetup } from '@/components/onboarding/emergency-support-team-setup'

export const metadata: Metadata = {
  title: 'Support Circle Setup | MyDataday',
  description: 'Set up your social accountability network for 90%+ success rates',
}

export default function SupportCirclePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50 py-4 sm:py-8 md:py-12 px-2 sm:px-4">
      <div className="container mx-auto max-w-4xl">
        <SupportCircleSetup />
      </div>
    </div>
  )
}
