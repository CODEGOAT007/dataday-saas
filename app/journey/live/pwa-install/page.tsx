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
  const device = params.get('device') || 'iphone'
  const [isInstalled, setIsInstalled] = useState(false)

  const videoSrc = useMemo(() => {
    return device === 'android'
      ? 'https://storage.googleapis.com/mydataday-assets/pwa-install-android.mp4'
      : 'https://storage.googleapis.com/mydataday-assets/pwa-install-iphone.mp4'
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

  return (
    <main className="min-h-screen bg-[#0B1220] flex flex-col items-center justify-center p-6 gap-6">
      <Card className="w-full max-w-xl bg-gray-900 border-gray-800 text-gray-100 shadow-xl">
        <div className="flex flex-col items-center justify-center min-h-[260px] p-6 text-center">
          <CardTitle className="text-2xl mb-4">Install the PWA</CardTitle>
          <p className="text-gray-300 mb-6">Tap the install button below, then follow the short video for your device.</p>

          <div className="mb-4">
            <InstallButton className="bg-blue-600 hover:bg-blue-700" showIcon>
              Install MyDataday
            </InstallButton>
          </div>

          <video
            key={videoSrc}
            src={videoSrc}
            controls
            className="w-full rounded-md border border-gray-700"
          />

          <div className="mt-6">
            <Link href="/journey/live/goal-voice">
              <Button className="bg-blue-600 hover:bg-blue-700" disabled={!isInstalled}>
                {isInstalled ? 'PWA is Setup! Continue' : 'Install the PWA to Continue'}
              </Button>
            </Link>
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

