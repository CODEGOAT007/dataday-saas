import { Metadata } from 'next'
import { ConsentForm } from '@/components/consent/consent-form'

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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 py-12 px-4">
      <div className="container mx-auto max-w-2xl">
        <ConsentForm memberId={params.memberId} />
      </div>
    </div>
  )
}
