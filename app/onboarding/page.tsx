import { Metadata } from 'next'
import { OnboardingFlow } from '@/components/onboarding/onboarding-flow'

export const metadata: Metadata = {
  title: 'Welcome to Dataday',
  description: 'Set up your account and start achieving your goals',
}

export default function OnboardingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-50 via-white to-brand-100 dark:from-brand-950 dark:via-brand-900 dark:to-brand-800">
      <OnboardingFlow />
    </div>
  )
}
