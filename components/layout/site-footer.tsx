'use client'

import Link from 'next/link'
import { Twitter, Github, Linkedin, Mail } from 'lucide-react'
import { InstallButton } from '@/components/pwa/install-button'
import { Logo11_CalendarCheck } from '@/components/ui/mydataday-logo'

const navigation = {
  product: [
    { name: 'Features', href: '#features' },
    { name: 'Pricing', href: '#pricing' },
    { name: 'Dashboard', href: '/dashboard' },
    { name: 'API', href: '/api' },
  ],
  support: [
    { name: 'Help Center', href: '/help' },
    { name: 'Contact Us', href: '/contact' },
    { name: 'Status', href: '/status' },
    { name: 'Community', href: '/community' },
  ],
  company: [
    { name: 'About', href: '/about' },
    { name: 'Blog', href: '/blog' },
    { name: 'Careers', href: '/careers' },
    { name: 'Press', href: '/press' },
  ],
  legal: [
    { name: 'Privacy', href: '/privacy' },
    { name: 'Terms', href: '/terms' },
    { name: 'Security', href: '/security' },
    { name: 'Cookies', href: '/cookies' },
  ],
}

const social = [
  {
    name: 'Twitter',
    href: '#',
    icon: Twitter,
  },
  {
    name: 'GitHub',
    href: '#',
    icon: Github,
  },
  {
    name: 'LinkedIn',
    href: '#',
    icon: Linkedin,
  },
  {
    name: 'Email',
    href: 'mailto:hello@dataday.app',
    icon: Mail,
  },
]

export function SiteFooter() {
  return (
    <footer className="border-t" style={{background: 'var(--background)', borderColor: 'var(--border-muted)'}} aria-labelledby="footer-heading">
      <h2 id="footer-heading" className="sr-only">
        Footer
      </h2>
      <div className="mx-auto max-w-7xl px-6 pb-8 pt-16 sm:pt-24 lg:px-8 lg:pt-32">
        <div className="xl:grid xl:grid-cols-3 xl:gap-8">
          <div className="space-y-8">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-gradient-to-r from-slate-700 to-slate-900 rounded-lg flex items-center justify-center">
                <Logo11_CalendarCheck variant="white" size="md" />
              </div>
              <span className="text-xl font-bold" style={{color: 'var(--foreground)'}}>MyDataDay</span>
            </div>
            <p className="text-sm leading-6" style={{color: 'var(--silver)'}}>
              The universal life progress system that makes sure your goals happen.
              Track daily progress, stay accountable, and achieve consistent results.
            </p>
            <div className="space-y-4">
              <InstallButton
                variant="outline"
                size="sm"
                className="w-fit border-white/20 text-white hover:bg-white/10"
              >
                Install MyDataday
              </InstallButton>
              <div className="flex space-x-6">
                {social.map((item) => (
                  <a
                    key={item.name}
                    href={item.href}
                    className="transition-colors duration-300"
                    style={{color: 'var(--silver-dark)'}}
                    onMouseEnter={(e) => e.currentTarget.style.color = 'var(--bright-blue)'}
                    onMouseLeave={(e) => e.currentTarget.style.color = 'var(--silver-dark)'}
                  >
                    <span className="sr-only">{item.name}</span>
                    <item.icon className="h-6 w-6" aria-hidden="true" />
                  </a>
                ))}
              </div>
            </div>
          </div>
          <div className="mt-16 grid grid-cols-2 gap-8 xl:col-span-2 xl:mt-0">
            <div className="md:grid md:grid-cols-2 md:gap-8">
              <div>
                <h3 className="text-sm font-semibold leading-6" style={{color: 'var(--foreground)'}}>Product</h3>
                <ul role="list" className="mt-6 space-y-4">
                  {navigation.product.map((item) => (
                    <li key={item.name}>
                      <Link
                        href={item.href}
                        className="text-sm leading-6 transition-colors duration-300 hover:text-blue-400"
                        style={{color: 'var(--silver)'}}
                      >
                        {item.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="mt-10 md:mt-0">
                <h3 className="text-sm font-semibold leading-6" style={{color: 'var(--foreground)'}}>Support</h3>
                <ul role="list" className="mt-6 space-y-4">
                  {navigation.support.map((item) => (
                    <li key={item.name}>
                      <Link
                        href={item.href}
                        className="text-sm leading-6 transition-colors duration-300 hover:text-blue-400"
                        style={{color: 'var(--silver)'}}
                      >
                        {item.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="md:grid md:grid-cols-2 md:gap-8">
              <div>
                <h3 className="text-sm font-semibold leading-6" style={{color: 'var(--foreground)'}}>Company</h3>
                <ul role="list" className="mt-6 space-y-4">
                  {navigation.company.map((item) => (
                    <li key={item.name}>
                      <Link
                        href={item.href}
                        className="text-sm leading-6 transition-colors duration-300 hover:text-blue-400"
                        style={{color: 'var(--silver)'}}
                      >
                        {item.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="mt-10 md:mt-0">
                <h3 className="text-sm font-semibold leading-6" style={{color: 'var(--foreground)'}}>Legal</h3>
                <ul role="list" className="mt-6 space-y-4">
                  {navigation.legal.map((item) => (
                    <li key={item.name}>
                      <Link
                        href={item.href}
                        className="text-sm leading-6 transition-colors duration-300 hover:text-blue-400"
                        style={{color: 'var(--silver)'}}
                      >
                        {item.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-16 border-t pt-8 sm:mt-20 lg:mt-24" style={{borderColor: 'var(--border-muted)'}}>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <p className="text-xs leading-5" style={{color: 'var(--silver-dark)'}}>
              &copy; 2024 MyDataDay, Inc. All rights reserved.
            </p>
            <div className="mt-4 sm:mt-0">
              <p className="text-xs leading-5" style={{color: 'var(--silver-dark)'}}>
                Made with ❤️ for people who want to achieve their goals
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
