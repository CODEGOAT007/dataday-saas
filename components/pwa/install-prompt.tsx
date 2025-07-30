'use client'

import { useState, useEffect } from 'react'
import { X, Download, Share, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

export function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null)
  const [showPrompt, setShowPrompt] = useState(false)
  const [isInstalled, setIsInstalled] = useState(false)
  const [platform, setPlatform] = useState<'android' | 'ios' | 'desktop' | 'unknown'>('unknown')
  const [debugInfo, setDebugInfo] = useState<string>('')

  // Reason: Check if device is mobile/tablet (not desktop) - moved outside useEffect
  const isMobileOrTablet = () => {
    if (typeof window === 'undefined') return false
    const userAgent = navigator.userAgent.toLowerCase()

    console.log('PWA Install Check - User Agent:', userAgent)
    console.log('PWA Install Check - Screen Width:', window.innerWidth)

    // First check: If screen is desktop-sized, it's desktop
    if (window.innerWidth > 1024) {
      console.log('PWA Install Check: Large screen detected - DESKTOP')
      return false
    }

    // Second check: Explicit desktop OS detection
    if (/windows nt|macintosh|mac os x|linux|x11/.test(userAgent)) {
      console.log('PWA Install Check: Desktop OS detected - DESKTOP')
      return false
    }

    // Third check: Desktop browsers without mobile indicators
    if (/edg\/|chrome\/|firefox\/|safari\/|opera\//.test(userAgent) && !/mobile|android|iphone|ipad|touch/.test(userAgent)) {
      console.log('PWA Install Check: Desktop browser detected - DESKTOP')
      return false
    }

    // Fourth check: Explicit mobile/tablet detection
    if (/android|iphone|ipad|ipod|blackberry|iemobile|opera mini|mobile|tablet/.test(userAgent)) {
      console.log('PWA Install Check: Mobile/tablet device detected - MOBILE')
      return true
    }

    // Fifth check: Touch capability + small screen
    if ('ontouchstart' in window && window.innerWidth <= 1024) {
      console.log('PWA Install Check: Touch device with small screen - MOBILE')
      return true
    }

    // Default to false for safety (don't show on unknown devices)
    console.log('PWA Install Check: Unknown device - defaulting to DESKTOP')
    return false
  }

  useEffect(() => {
    // Reason: Detect platform for appropriate install instructions
    const detectPlatform = () => {
      const userAgent = navigator.userAgent.toLowerCase()
      if (/android/.test(userAgent)) return 'android'
      if (/iphone|ipad|ipod/.test(userAgent)) return 'ios'
      if (/windows|mac|linux/.test(userAgent)) return 'desktop'
      return 'unknown'
    }

    // Reason: Check if app is already installed
    const checkInstallStatus = async () => {
      // Modern way - check if running in standalone mode
      const isStandalone = window.matchMedia('(display-mode: standalone)').matches ||
                          (window.navigator as any).standalone === true

      // Future-proof way using getInstalledRelatedApps (when available)
      if ('getInstalledRelatedApps' in navigator) {
        try {
          const relatedApps = await (navigator as any).getInstalledRelatedApps()
          setIsInstalled(relatedApps.length > 0 || isStandalone)
        } catch {
          setIsInstalled(isStandalone)
        }
      } else {
        setIsInstalled(isStandalone)
      }
    }

    const detectedPlatform = detectPlatform()
    setPlatform(detectedPlatform)
    checkInstallStatus()

    // Reason: Debug info for troubleshooting
    setDebugInfo(`Platform: ${detectedPlatform}, UA: ${navigator.userAgent.slice(0, 50)}...`)

    // Reason: Capture beforeinstallprompt event for Android/Mobile only
    const handleBeforeInstallPrompt = (e: Event) => {
      console.log('PWA Install: beforeinstallprompt event fired!')

      // Reason: Check if mobile/tablet BEFORE preventing default
      const isMobile = isMobileOrTablet()
      const currentPlatform = detectPlatform()
      console.log('PWA Install: Is mobile/tablet:', isMobile, 'Platform:', currentPlatform)

      if (!isMobile || currentPlatform === 'desktop') {
        console.log('PWA Install: Desktop detected - IGNORING install prompt completely')
        // Don't prevent default, don't capture event, let browser handle it normally
        return
      }

      console.log('PWA Install: Mobile detected - capturing prompt')
      e.preventDefault()
      setDeferredPrompt(e as BeforeInstallPromptEvent)
      setDebugInfo(prev => prev + ' | Prompt captured!')

      // Reason: Only show prompt if not already installed
      if (!isInstalled) {
        setShowPrompt(true)
      }
    }

    // Reason: Hide prompt after successful installation
    const handleAppInstalled = () => {
      setShowPrompt(false)
      setIsInstalled(true)
      setDeferredPrompt(null)
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
    window.addEventListener('appinstalled', handleAppInstalled)

    // Reason: Fallback timer - show install prompt after 30 seconds if no beforeinstallprompt
    const fallbackTimer = setTimeout(() => {
      if (!deferredPrompt && !isInstalled && isMobileOrTablet()) {
        console.log('PWA Install: Fallback timer triggered - showing prompt without beforeinstallprompt')
        setShowPrompt(true)
      }
    }, 30000) // 30 seconds

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
      window.removeEventListener('appinstalled', handleAppInstalled)
      clearTimeout(fallbackTimer)
    }
  }, [isInstalled])

  // Reason: Handle Android/Desktop install via native prompt
  const handleInstall = async () => {
    if (!deferredPrompt) return

    try {
      await deferredPrompt.prompt()
      const { outcome } = await deferredPrompt.userChoice
      
      if (outcome === 'accepted') {
        setShowPrompt(false)
        setIsInstalled(true)
      }
      
      setDeferredPrompt(null)
    } catch (error) {
      console.error('Install prompt failed:', error)
    }
  }

  // Reason: Early return for desktop - don't render anything
  if (!isMobileOrTablet()) {
    return null
  }

  // Reason: Don't show if already installed
  if (isInstalled) {
    return null
  }

  // Reason: Show iOS instructions even without deferred prompt
  // For Android, show if we have deferred prompt OR if user has been on page for 30+ seconds
  const shouldShow = platform === 'ios' || deferredPrompt || showPrompt

  if (!shouldShow) {
    return null
  }

  return (
    <Card className="fixed bottom-4 left-4 right-4 z-50 mx-auto max-w-sm shadow-lg border-primary/20 bg-white/95 backdrop-blur-sm">
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm">M</span>
            </div>
            <div>
              <h3 className="font-semibold text-sm">Install MyDataday</h3>
              <p className="text-xs text-muted-foreground">Get the full app experience</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6"
            onClick={() => setShowPrompt(false)}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {platform === 'android' || platform === 'desktop' ? (
          deferredPrompt ? (
            <Button
              onClick={handleInstall}
              className="w-full"
              size="sm"
            >
              <Download className="h-4 w-4 mr-2" />
              Install App
            </Button>
          ) : (
            <div className="space-y-2">
              <p className="text-xs text-muted-foreground">
                To install this app:
              </p>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <span>1. Tap the menu (⋮) in Chrome</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <span>2. Tap "Add to Home screen"</span>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="w-full"
                onClick={() => setShowPrompt(false)}
              >
                Got it
              </Button>
            </div>
          )
        ) : platform === 'ios' ? (
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span>1. Tap</span>
              <Share className="h-3 w-3" />
              <span>Share button</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span>2. Tap</span>
              <Plus className="h-3 w-3" />
              <span>"Add to Home Screen"</span>
            </div>
            <Button 
              variant="outline"
              size="sm"
              className="w-full"
              onClick={() => setShowPrompt(false)}
            >
              Got it
            </Button>
          </div>
        ) : null}
      </CardContent>
    </Card>
  )
}
