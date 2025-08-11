import { Metadata } from 'next'
import { CoachingInterface } from '@/components/admin/coaching-interface'
import { AdminAuthGuard } from '@/components/admin/admin-auth-guard'

export const metadata: Metadata = {
  title: 'Coaching Session - MyDataday',
  description: 'Coach user through goal setup and support circle activation',
}

interface CoachingPageProps {
  params: {
    userId: string
  }
}

export default function CoachingPage({ params }: CoachingPageProps) {
  return (
    <AdminAuthGuard>
      <div className="min-h-screen bg-gray-950">
        <CoachingInterface userId={params.userId} />
      </div>
    </AdminAuthGuard>
  )
}
