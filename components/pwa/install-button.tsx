'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Download, Share, Plus, Smartphone } from 'lucide-react'
import { cn } from '@/lib/utils'

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

interface InstallButtonProps {
  variant?: 'default' | 'outline' | 'ghost' | 'secondary'
  size?: 'default' | 'sm' | 'lg' | 'icon'
  className?: string
  showIcon?: boolean,
  immediateOnly?: boolean // If true, never show instructions; only native prompt when available
  children?: React.ReactNode
}

export function InstallButton({
  variant = 'default',
  size = 'default',
  className,
  showIcon = true,
  immediateOnly = false,
  children
}: InstallButtonProps) {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null)
  const [isInstalled, setIsInstalled] = useState(false)
  const [platform, setPlatform] = useState<'android' | 'ios' | 'desktop' | 'unknown'>('unknown')
  const [showInstructions, setShowInstructions] = useState(false)

  // Reason: Detect if running on mobile/tablet device
  const isMobileOrTablet = () => {
    const userAgent = navigator.userAgent.toLowerCase()
    return /android|iphone|ipad|ipod|blackberry|iemobile|opera mini|mobile|tablet/.test(userAgent) ||
           ('ontouchstart' in window && window.innerWidth <= 1024)
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
    const checkInstallStatus = () => {
      const isStandalone = window.matchMedia('(display-mode: standalone)').matches ||
                          (window.navigator as any).standalone === true
      setIsInstalled(isStandalone)
    }

    setPlatform(detectPlatform())
    checkInstallStatus()

    // Reason: Capture beforeinstallprompt event
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault()
      setDeferredPrompt(e as BeforeInstallPromptEvent)
    }

    // Reason: Hide button after successful installation
    const handleAppInstalled = () => {
      setIsInstalled(true)
      setDeferredPrompt(null)
      setShowInstructions(false)
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
    window.addEventListener('appinstalled', handleAppInstalled)

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
      window.removeEventListener('appinstalled', handleAppInstalled)
    }
  }, [])

  // Reason: Handle native install prompt
  const handleInstall = async () => {
    if (deferredPrompt) {
      try {
        await deferredPrompt.prompt()
        const { outcome } = await deferredPrompt.userChoice
        
        if (outcome === 'accepted') {
          setIsInstalled(true)
        }
        
        setDeferredPrompt(null)
        setShowInstructions(false)
      } catch (error) {
        console.error('Install prompt failed:', error)
        // Fallback behavior
        if (!immediateOnly) setShowInstructions(true)
      }
    } else {
      // Show manual instructions
      if (!immediateOnly) setShowInstructions(true)
    }
  }

  // Reason: Don't show button if already installed
  if (isInstalled) {
    return null
  }

  // Reason: Show different content based on state
  if (showInstructions) {
    return (
      <div className="space-y-2 p-4 bg-gray-50 rounded-lg border">
        <div className="flex items-center gap-2 mb-2">
          <Smartphone className="h-4 w-4" />
          <span className="font-medium text-sm">Install MyDataday</span>
        </div>
        
        {platform === 'ios' ? (
          <div className="space-y-1 text-xs text-gray-600">
            <div className="flex items-center gap-2">
              <span>1. Tap</span>
              <Share className="h-3 w-3" />
              <span>Share button</span>
            </div>
            <div className="flex items-center gap-2">
              <span>2. Tap</span>
              <Plus className="h-3 w-3" />
              <span>"Add to Home Screen"</span>
            </div>
          </div>
        ) : (
          <div className="space-y-1 text-xs text-gray-600">
            <div>1. Tap the menu (⋮) in Chrome</div>
            <div>2. Tap "Add to Home screen"</div>
          </div>
        )}
        
        <Button 
          variant="outline" 
          size="sm" 
          className="w-full mt-2"
          onClick={() => setShowInstructions(false)}
        >
          Got it
        </Button>
      </div>
    )
  }

  return (
    <Button
      variant={variant}
      size={size}
      className={cn(className)}
      onClick={handleInstall}
    >
      {showIcon && <Download className="h-4 w-4 mr-2" />}
      {children || 'Install App'}
    </Button>
  )
}
