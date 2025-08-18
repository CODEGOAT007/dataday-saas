'use client'

import Link from 'next/link'
import { Suspense, useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { Card, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { InstallButton } from '@/components/pwa/install-button'

// Reason: Next.js requires hooks like useSearchParams to be within a <Suspense> boundary during prerender.
function PwaInstallContent() {
  const params = useSearchParams()
  const initialDevice = (params.get('device') as 'android' | 'iphone') || 'iphone'
  const [device, setDevice] = useState<'android' | 'iphone'>(initialDevice)
  const [isInstalled, setIsInstalled] = useState(false)
  const [showToggle, setShowToggle] = useState(true)

  // Reason: Prefer local files under /public/videos with remote fallback
  const mediaSources = useMemo(() => {
    const local = device === 'android' ? '/videos/pwa-install-android.mp4' : '/videos/pwa-install-iphone.mp4'
    const remote = device === 'android'
      ? 'https://storage.googleapis.com/mydataday-assets/pwa-install-android.mp4'
      : 'https://storage.googleapis.com/mydataday-assets/pwa-install-iphone.mp4'
    return { local, remote }
  }, [device])

  useEffect(() => {
    const checkInstalled = () => {
      const isStandalone = window.matchMedia('(display-mode: standalone)').matches || (window as any).navigator.standalone
      setIsInstalled(!!isStandalone)
    }

    checkInstalled()
    const visibilityHandler = () => checkInstalled()
    document.addEventListener('visibilitychange', visibilityHandler)
    window.addEventListener('focus', checkInstalled)
    return () => {
      document.removeEventListener('visibilitychange', visibilityHandler)
      window.removeEventListener('focus', checkInstalled)
    }
  }, [])

  useEffect(() => {
    // Allow explicit override via query param
    const urlDevice = (params.get('device') || '').toLowerCase()
    if (urlDevice === 'android' || urlDevice === 'iphone') {
      setDevice(urlDevice as 'android' | 'iphone')
      setShowToggle(false)
      return
    }

    // Heuristic detection
    const ua = navigator.userAgent || ''
    const isAndroid = /Android/i.test(ua)
    const isiOSUserAgent = /iPhone|iPad|iPod/i.test(ua)
    const isiPadOS = navigator.platform === 'MacIntel' && (navigator as any).maxTouchPoints > 1

    if (isAndroid) { setDevice('android'); setShowToggle(false) }
    else if (isiOSUserAgent || isiPadOS) { setDevice('iphone'); setShowToggle(false) }
    else { setShowToggle(true) }
  }, [params])

  return (
    <main className="min-h-screen bg-[#0B1220] flex flex-col items-center justify-center p-6 gap-6">
      <Card className="w-full max-w-xl bg-gray-900 border-gray-800 text-gray-100 shadow-xl">
        <div className="flex flex-col items-center justify-center min-h-[260px] p-6 text-center">
          <CardTitle className="text-2xl mb-4">Setup MyDataDay</CardTitle>

          {/* Device toggle: Android / iPhone */}
          {showToggle && (
            <div className="mb-4 inline-flex rounded-md overflow-hidden border border-gray-700">
              <button
                className={`px-4 py-2 text-sm ${device === 'android' ? 'bg-blue-600 text-white' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'}`}
                onClick={() => setDevice('android')}
              >
                Android
              </button>
              <button
                className={`px-4 py-2 text-sm border-l border-gray-700 ${device === 'iphone' ? 'bg-blue-600 text-white' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'}`}
                onClick={() => setDevice('iphone')}
              >
                iPhone
              </button>
            </div>
          )}

          {/* Media under title */}
          <video key={device} controls className="w-full rounded-md border border-gray-700 mb-4">
            <source src={mediaSources.local} type="video/mp4" />
            <source src={mediaSources.remote} type="video/mp4" />
            Your browser does not support the video tag.
          </video>

          {/* Setup button under the video */}
          <div className="">
            <InstallButton className="bg-blue-600 hover:bg-blue-700" showIcon immediateOnly>
              Setup MyDataDay
            </InstallButton>
          </div>
        </div>
      </Card>
    </main>
  )
}

export default function LivePwaInstallPage() {
  // Reason: Wrap content in Suspense so useSearchParams is safe during prerender.
  return (
    <Suspense fallback={<main className="min-h-screen bg-[#0B1220] flex items-center justify-center p-6"><div className="text-gray-300">Loading…</div></main>}>
      <PwaInstallContent />
    </Suspense>
  )
}

