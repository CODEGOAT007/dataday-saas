'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { Home, Calendar, Settings, Users, Menu, X } from 'lucide-react'
import { LogoutButton } from '@/components/auth/logout-button'
import { InstallButton } from '@/components/pwa/install-button'

const navigation = [
  { name: 'Today', href: '/today', icon: Calendar },
  { name: 'Dashboard', href: '/dashboard', icon: Home },
  { name: 'Support Circle', href: '/support-circle', icon: Users },
  { name: 'Settings', href: '/settings', icon: Settings },
]

export function DashboardNav() {
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <>
      {/* Mobile Navigation Header */}
      <nav className="bg-gray-900 border-b border-gray-800 lg:hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link href="/dashboard" className="text-xl font-bold text-white">
                MyDataday
              </Link>
            </div>

            {/* Mobile menu button */}
            <div className="flex items-center">
              <button
                type="button"
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-300 hover:text-white hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                <span className="sr-only">Open main menu</span>
                {mobileMenuOpen ? (
                  <X className="h-6 w-6" aria-hidden="true" />
                ) : (
                  <Menu className="h-6 w-6" aria-hidden="true" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu dropdown */}
        {mobileMenuOpen && (
          <div className="border-t border-gray-800">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {navigation.map((item) => {
                const Icon = item.icon
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={cn(
                      'flex items-center px-3 py-2 rounded-md text-base font-medium w-full',
                      pathname === item.href
                        ? 'bg-blue-600 text-white'
                        : 'text-gray-300 hover:text-white hover:bg-gray-800'
                    )}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <Icon className="h-5 w-5 mr-3" />
                    {item.name}
                  </Link>
                )
              })}

              {/* Install button and Logout button for mobile */}
              <div className="pt-2 border-t border-gray-200 mt-2 space-y-2">
                <InstallButton
                  variant="outline"
                  size="default"
                  className="w-full justify-start text-gray-300 hover:text-white hover:bg-gray-800 border-gray-600 hover:border-gray-500"
                >
                  Install MyDataday
                </InstallButton>
                <LogoutButton
                  variant="ghost"
                  size="default"
                  className="w-full justify-start text-gray-300 hover:text-white hover:bg-gray-800 px-3 py-2 text-base font-medium"
                />
              </div>
            </div>
          </div>
        )}
      </nav>
    </>
  )
}
