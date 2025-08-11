import { Metadata } from 'next'
import { SupportCircleManagement } from '@/components/support-circle/support-circle-management'

export const metadata: Metadata = {
  title: 'Support Circle | MyDataday',
  description: 'Manage your social accountability network',
}

export default function SupportCirclePage() {
  return <SupportCircleManagement />
}
