"use client"

import { useEffect, useState } from 'react'
import Image from 'next/image'

// Reason: Show an animated in-app splash overlay on cold PWA launches only
// - Does NOT touch 192x192 launcher icon
// - Relies on manifest background_color for OS splash background
// - Fades/zooms the brand mark for a modern feel and then dismisses quickly

export function LaunchSplash() {
  const [show, setShow] = useState(false)
  const [showLogo, setShowLogo] = useState(false)

  useEffect(() => {
    try {
      // Heuristic: show only on first paint of a PWA standalone window
      const isStandalone = (typeof window !== 'undefined') && (
        window.matchMedia('(display-mode: standalone)').matches ||
        // iOS Safari PWA
        (navigator as any).standalone === true
      )
      // Avoid showing on client-side navigations within the app
      const hasShownThisSession = sessionStorage.getItem('launch-splash-shown') === '1'

      if (isStandalone && !hasShownThisSession) {
        setShow(true)
        // Reason: wait ~140ms so the OS splash (small icon) is gone, then reveal our large logo
        setTimeout(() => setShowLogo(true), 140)
        // Auto dismiss after 1200ms total
        setTimeout(() => {
          setShow(false)
          sessionStorage.setItem('launch-splash-shown', '1')
        }, 1200)
      }
    } catch {
      // ignore
    }
  }, [])

  if (!show) return null

  return (
    <div
      aria-label="Launching MyDataDay"
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black"
      style={{ backgroundColor: '#000000' }}
      onAnimationEnd={() => {
        try {
          document.documentElement.setAttribute('data-booted', '1')
        } catch {}
      }}
    >
      {/* Animated logo: delay briefly to avoid small→large jump from OS splash */}
      {showLogo && (
        <div className="animate-[splashZoom_1.05s_ease-out_forwards]">
          <Image
            src="/icons/app-icon-512-any.png"
            alt=""
            aria-hidden
            width={260}
            height={260}
            priority
            role="presentation"
          />
        </div>
      )}
      <style jsx global>{`
        @keyframes splashZoom {
          0% { transform: scale(0.86); opacity: 0.0; }
          35% { opacity: 1; }
          100% { transform: scale(1.08); opacity: 1; }
        }
      `}</style>
    </div>
  )
}

