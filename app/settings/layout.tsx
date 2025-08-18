import { DashboardNav } from '@/components/layout/dashboard-nav'
import { DashboardSidebar } from '@/components/layout/dashboard-sidebar'
import { DashboardHeader } from '@/components/layout/dashboard-header'

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Mobile Navigation */}
      <div className="lg:hidden">
        <DashboardNav />
      </div>

      <div className="lg:flex">
        {/* Desktop Sidebar */}
        <div className="hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0">
          <DashboardSidebar />
        </div>

        {/* Main Content */}
        <div className="lg:pl-64 flex flex-col flex-1 min-w-0">
          <DashboardHeader />
          <main className="flex-1 p-4 lg:p-6 max-w-7xl mx-auto w-full overflow-x-hidden">
            {children}
          </main>
        </div>
      </div>
    </div>
  )
}
