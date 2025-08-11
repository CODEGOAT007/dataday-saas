import { Metadata } from 'next'
import { ConsentForm } from '@/components/consent/consent-form'
import { MobileDebug } from '@/components/mobile-debug'

export const metadata: Metadata = {
  title: 'Emergency Support Team Consent | MyDataday',
  description: 'Join someone\'s Emergency Support Team to help them achieve their goals',
}

interface ConsentPageProps {
  params: {
    memberId: string
  }
}

export default function ConsentPage({ params }: ConsentPageProps) {
  return (
    <div className="min-h-screen bg-gray-950 py-12 px-4">
      <div className="container mx-auto max-w-2xl">
        <ConsentForm memberId={params.memberId} />
      </div>
      <MobileDebug />
    </div>
  )
}
