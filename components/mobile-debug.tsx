'use client'

import { useEffect } from 'react'

export function MobileDebug() {
  useEffect(() => {
    // Only load on mobile devices
    if (typeof window !== 'undefined' && /Mobile|Android|iPhone|iPad/.test(navigator.userAgent)) {
      // Load Eruda mobile debugging tool
      const script = document.createElement('script')
      script.src = 'https://cdn.jsdelivr.net/npm/eruda@3.0.1/eruda.min.js'
      script.onload = () => {
        // @ts-ignore
        if (window.eruda) {
          // @ts-ignore
          window.eruda.init()
          console.log('🔍 Mobile debugging enabled! Tap the floating button to open console.')
        }
      }
      document.head.appendChild(script)
    }
  }, [])

  return null
}
