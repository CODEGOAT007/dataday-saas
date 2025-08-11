import { Metadata } from 'next'
import { AdminDashboard } from '@/components/admin/admin-dashboard'
import { AdminAuthGuard } from '@/components/admin/admin-auth-guard'

export const metadata: Metadata = {
  title: 'Admin Dashboard - MyDataday',
  description: 'Manage users, goals, and sales process',
}

export default function AdminDashboardPage() {
  return (
    <AdminAuthGuard>
      <div className="min-h-screen bg-gray-950">
        <AdminDashboard />
      </div>
    </AdminAuthGuard>
  )
}
