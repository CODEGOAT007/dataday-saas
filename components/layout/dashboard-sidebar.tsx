'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { Home, Target, Calendar, Settings, Users, Brain } from 'lucide-react'
import { LogoutButton } from '@/components/auth/logout-button'
import { ProfileAvatar } from '@/components/ui/profile-avatar'

const navigation = [
  { name: 'Today', href: '/today', icon: Calendar },
  { name: 'Dashboard', href: '/dashboard', icon: Home },
  { name: 'Goals', href: '/goals', icon: Target },
  { name: 'Support Team', href: '/support-team', icon: Users },
  { name: 'AI Coach', href: '/ai-coach', icon: Brain },
  { name: 'Settings', href: '/settings', icon: Settings },
]

export function DashboardSidebar() {
  const pathname = usePathname()

  return (
    <div className="flex flex-col h-full bg-gray-900 border-r border-gray-800">
      {/* Logo */}
      <div className="flex items-center h-16 px-6 border-b border-gray-800">
        <Link href="/dashboard" className="text-xl font-bold text-white">
          MyDataday
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-2">
        {navigation.map((item) => {
          const Icon = item.icon
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                'flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors',
                pathname === item.href
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-300 hover:text-white hover:bg-gray-800'
              )}
            >
              <Icon className="h-4 w-4 mr-3" />
              {item.name}
            </Link>
          )
        })}
      </nav>

      {/* User section */}
      <div className="p-4 border-t border-gray-800 space-y-3">
        <div className="flex items-center space-x-3">
          <ProfileAvatar size="md" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white truncate">
              User Name
            </p>
            <p className="text-xs text-gray-400 truncate">
              user@example.com
            </p>
          </div>
        </div>

        {/* Logout button */}
        <LogoutButton
          variant="ghost"
          size="sm"
          className="w-full justify-start text-gray-400 hover:text-white"
        />
      </div>
    </div>
  )
}
