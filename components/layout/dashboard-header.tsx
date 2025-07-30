'use client'

import { Bell, Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { LogoutButton } from '@/components/auth/logout-button'
import { ProfileAvatar } from '@/components/ui/profile-avatar'

export function DashboardHeader() {
  return (
    <header className="bg-gray-900 border-b border-gray-800 px-4 lg:px-6 py-4">
      <div className="flex items-center justify-between gap-4">
        {/* Search - Hidden on small mobile, shown on larger screens */}
        <div className="hidden sm:flex flex-1 max-w-lg">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search goals, logs, or insights..."
              className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 text-white placeholder-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Mobile Search Button - Only shown on small screens */}
        <div className="sm:hidden flex-1">
          <Button variant="ghost" size="icon" className="w-full justify-start">
            <Search className="h-4 w-4 mr-2" />
            <span className="text-sm text-muted-foreground">Search...</span>
          </Button>
        </div>

        {/* Actions */}
        <div className="flex items-center space-x-2 lg:space-x-4">
          <Button variant="ghost" size="icon" className="hidden sm:flex">
            <Bell className="h-4 w-4" />
          </Button>

          <ProfileAvatar size="md" />

          {/* Logout button - always visible but icon-only on mobile */}
          <div className="sm:block">
            <LogoutButton
              variant="ghost"
              size="icon"
              showIcon={true}
              className="sm:w-auto sm:px-3"
            >
              <span className="hidden sm:inline ml-2">Sign Out</span>
            </LogoutButton>
          </div>
        </div>
      </div>
    </header>
  )
}
