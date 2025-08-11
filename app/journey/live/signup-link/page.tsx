'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Card, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export default function LiveSignupLinkPage() {
  const prodBase = process.env.NEXT_PUBLIC_APP_URL || 'https://mydataday.app' // Reason: Use configured base URL for production
  const baseRedirect = '/journey/live/device'
  const prodUrl = `${prodBase}/auth/signup?redirectTo=${encodeURIComponent(baseRedirect)}`
  const localUrl = `http://localhost:3000/auth/signup?redirectTo=${encodeURIComponent(baseRedirect)}`
  const [copied, setCopied] = useState<'local' | 'prod' | null>(null)

  const copy = async (text: string, which: 'local' | 'prod') => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(which)
      setTimeout(() => setCopied(null), 1200)
    } catch {
      // no-op for now
    }
  }

  return (
    <main className="min-h-screen bg-[#0B1220] flex flex-col items-center justify-center p-6 gap-6">
      <Card className="w-full max-w-xl bg-gray-900 border-gray-800 text-gray-100 shadow-xl">
        <div className="flex flex-col items-center justify-center min-h-[260px] p-6 text-center">
          <CardTitle className="text-2xl mb-4">Text Signup Link and Create Account</CardTitle>

          <div className="w-full text-left space-y-4">
            {typeof window !== 'undefined' && window.location.host.includes('localhost') && (
              <div className="p-3 rounded-md bg-gray-800 border border-gray-700">
                <div className="text-xs text-gray-400 mb-1">Local (during calls on your machine)</div>
                <div className="text-blue-300 break-all mb-2">{localUrl}</div>
                <div className="flex gap-2">
                  <Button onClick={() => copy(localUrl, 'local')} className="bg-blue-600 hover:bg-blue-700">Copy Local Link</Button>
                  <a href={localUrl} target="_blank" rel="noreferrer">
                    <Button variant="outline" className="border-gray-600 text-gray-200">Open</Button>
                  </a>
                  {copied === 'local' && <span className="text-green-400 text-sm">Copied!</span>}
                </div>
              </div>
            )}

            <div className="p-3 rounded-md bg-gray-800 border border-gray-700">
              <div className="text-xs text-gray-400 mb-1">Production (send to the user over text)</div>
              <div className="text-blue-300 break-all mb-2">{prodUrl}</div>
              <div className="flex gap-2">
                <Button onClick={() => copy(prodUrl, 'prod')} className="bg-blue-600 hover:bg-blue-700">Copy Production Link</Button>
                <a href={prodUrl} target="_blank" rel="noreferrer">
                  <Button variant="outline" className="border-gray-600 text-gray-200">Open</Button>
                </a>
                {copied === 'prod' && <span className="text-green-400 text-sm">Copied!</span>}
              </div>
            </div>
          </div>

          <div className="mt-6">
            <Link href="/journey/live/device">
              <Button className="bg-blue-600 hover:bg-blue-700">Next: Choose Device</Button>
            </Link>
          </div>
        </div>
      </Card>
    </main>
  )
}

