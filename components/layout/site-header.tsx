'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { MyDataDayLogo, Logo11_CalendarCheck } from '@/components/ui/mydataday-logo'
import {
  Menu,
  X,
  ArrowRight,
  Target,
  Users,
  Brain,
  Shield,
  ChevronDown
} from 'lucide-react'
import { InstallButton } from '@/components/pwa/install-button'
import { useState, useEffect } from 'react'
import { cn } from '@/lib/utils'

const navigation = [
  { name: 'Features', href: '#features' },
  { name: 'Pricing', href: '#pricing' },
  { name: 'About', href: '/about' },
  { name: 'Contact', href: '/contact' },
]

const features = [
  {
    name: 'Goal Tracking',
    description: 'Track progress & habits',
    href: '#features',
    icon: Target,
  },
  {
    name: 'Stay Accountable',
    description: 'Connect with people who care',
    href: '#features',
    icon: Users,
  },
  {
    name: 'Smart Reminders',
    description: 'Never miss your goals',
    href: '#features',
    icon: Shield,
  },
]

export function SiteHeader() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [featuresOpen, setFeaturesOpen] = useState(false)

  // Reason: Close mobile menu on ESC key press for better accessibility
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setMobileMenuOpen(false)
        setFeaturesOpen(false)
      }
    }

    if (mobileMenuOpen || featuresOpen) {
      document.addEventListener('keydown', handleEscape)
      // Reason: Prevent body scroll when menu is open
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }

    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = 'unset'
    }
  }, [mobileMenuOpen, featuresOpen])

  return (
    <>
    <header className="absolute inset-x-0 top-0 z-50 border-b" style={{background: 'var(--background)', borderColor: 'var(--border-muted)'}}>
      <nav className="flex items-center justify-between p-6 lg:px-8" aria-label="Global">
        {/* Logo */}
        <div className="flex lg:flex-1">
          <Link href="/" className="-m-1.5 p-1.5 flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-r from-slate-700 to-slate-900 rounded-lg flex items-center justify-center">
              <Logo11_CalendarCheck variant="white" size="md" />
            </div>
            <span className="text-xl font-bold text-white">MyDataDay</span>
          </Link>
        </div>

        {/* Mobile menu button */}
        <div className="flex lg:hidden">
          <button
            type="button"
            className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-300 hover:text-white"
            onClick={() => setMobileMenuOpen(true)}
          >
            <span className="sr-only">Open main menu</span>
            <Menu className="h-6 w-6" aria-hidden="true" />
          </button>
        </div>

        {/* Desktop navigation */}
        <div className="hidden lg:flex lg:gap-x-12">
          {/* Features dropdown */}
          <div className="relative">
            <button
              type="button"
              className="flex items-center gap-x-1 text-sm font-semibold leading-6 text-white hover:text-blue-400 transition-colors duration-200"
              onClick={() => setFeaturesOpen(!featuresOpen)}
            >
              Features
              <ChevronDown className="h-4 w-4 flex-none text-white" />
            </button>

            {featuresOpen && (
              <div className="absolute -left-8 top-full z-10 mt-3 w-screen max-w-md overflow-hidden rounded-3xl bg-gray-800 shadow-lg ring-1 ring-gray-700/50">
                <div className="p-4">
                  {features.map((item) => (
                    <div
                      key={item.name}
                      className="group relative flex items-center gap-x-6 rounded-lg p-4 text-sm leading-6 hover:bg-gray-700"
                    >
                      <div className="flex h-11 w-11 flex-none items-center justify-center rounded-lg bg-gray-700 group-hover:bg-gray-600">
                        <item.icon className="h-6 w-6 text-gray-300 group-hover:text-blue-400" />
                      </div>
                      <div className="flex-auto">
                        <a href={item.href} className="block font-semibold text-white">
                          {item.name}
                          <span className="absolute inset-0" />
                        </a>
                        <p className="mt-1 text-gray-300">{item.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="bg-gray-700">
                  <a
                    href="/dashboard"
                    className="flex items-center justify-center gap-x-2.5 p-3 text-sm font-semibold leading-6 text-white hover:bg-gray-600"
                  >
                    <ArrowRight className="h-5 w-5 flex-none text-gray-300" />
                    Dashboard
                  </a>
                </div>
              </div>
            )}
          </div>

          {navigation.slice(1).map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="text-sm font-semibold leading-6 text-white hover:text-blue-400 transition-colors duration-200 relative z-10"
            >
              {item.name}
            </Link>
          ))}
        </div>

        {/* CTA buttons */}
        <div className="hidden lg:flex lg:flex-1 lg:justify-end lg:gap-x-4">
          <Button variant="ghost" asChild>
            <Link href="/auth/login">Sign in</Link>
          </Button>
          <Button asChild>
            <Link href="/auth/signup">
              Get Started
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </nav>




      {/* Click outside to close features dropdown */}
      {featuresOpen && (
        <div
          className="fixed inset-0 z-0"
          onClick={() => setFeaturesOpen(false)}
        />
      )}
    </header>

    {/* Mobile menu - positioned outside header to avoid z-index conflicts */}
    {mobileMenuOpen && (
      <div className="lg:hidden">
        {/* Backdrop overlay */}
        <div
          className="fixed inset-0 z-[9998] bg-black/50 backdrop-blur-sm transition-opacity duration-300 ease-in-out"
          onClick={() => setMobileMenuOpen(false)}
          aria-hidden="true"
        />
        {/* Menu panel */}
        <div className="fixed inset-y-0 right-0 z-[9999] w-full overflow-y-auto bg-gray-900 px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-700/50 shadow-2xl transform transition-transform duration-300 ease-in-out">
          <div className="flex items-center justify-between">
            <Link href="/" className="-m-1.5 p-1.5 flex items-center gap-2">
              <div className="w-10 h-10 bg-gradient-to-r from-slate-700 to-slate-900 rounded-lg flex items-center justify-center">
                <Logo11_CalendarCheck variant="white" size="md" />
              </div>
              <span className="text-xl font-bold text-white">MyDataDay</span>
            </Link>
            <button
              type="button"
              className="-m-2.5 rounded-md p-2.5 text-gray-300 hover:text-white"
              onClick={() => setMobileMenuOpen(false)}
            >
              <span className="sr-only">Close menu</span>
              <X className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>
          <div className="mt-6 flow-root">
            <div className="-my-6 divide-y divide-gray-700/50">
              <div className="space-y-2 py-6">
                <div className="-mx-3">
                  <div className="mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-white">
                    Features
                  </div>
                  <div className="mt-2 space-y-2">
                    {features.map((item) => (
                      <a
                        key={item.name}
                        href={item.href}
                        className="block rounded-lg py-2 pl-6 pr-3 text-sm font-semibold leading-7 text-gray-300 hover:bg-gray-800 hover:text-white"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        <div className="flex items-center">
                          <item.icon className="h-4 w-4 mr-3" />
                          <div>
                            <div className="font-semibold">{item.name}</div>
                            <div className="text-xs text-gray-400">{item.description}</div>
                          </div>
                        </div>
                      </a>
                    ))}
                  </div>
                </div>
                {navigation.map((item) => (
                  <a
                    key={item.name}
                    href={item.href}
                    className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-white hover:bg-gray-800"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {item.name}
                  </a>
                ))}
              </div>
              <div className="py-6 space-y-2">
                <InstallButton
                  variant="outline"
                  className="w-full"
                  showIcon={true}
                >
                  Install MyDataday
                </InstallButton>
                <Button variant="outline" className="w-full" asChild>
                  <Link href="/auth/login">Sign in</Link>
                </Button>
                <Button className="w-full" asChild>
                  <Link href="/auth/signup">
                    Get Started
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    )}
    </>
  )
}
