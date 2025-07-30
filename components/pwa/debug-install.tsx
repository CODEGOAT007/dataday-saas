'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ChevronDown, ChevronUp, Copy, X } from 'lucide-react'

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

export function DebugInstall() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null)
  const [debugInfo, setDebugInfo] = useState<string[]>([])
  const [isInstalled, setIsInstalled] = useState(false)
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [isVisible, setIsVisible] = useState(true)

  const addDebug = (message: string) => {
    setDebugInfo(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`])
  }

  useEffect(() => {
    // Check if already installed
    const checkInstalled = () => {
      const isStandalone = window.matchMedia('(display-mode: standalone)').matches ||
                          (window.navigator as any).standalone === true
      setIsInstalled(isStandalone)
      addDebug(`Installed: ${isStandalone}`)
    }

    // Platform detection
    const platform = /android/i.test(navigator.userAgent) ? 'Android' : 
                     /iphone|ipad/i.test(navigator.userAgent) ? 'iOS' : 'Desktop'
    addDebug(`Platform: ${platform}`)
    addDebug(`User Agent: ${navigator.userAgent}`)
    addDebug(`Browser: ${navigator.userAgent.includes('Edg') ? 'Edge' : 'Other'}`)

    checkInstalled()

    // Listen for beforeinstallprompt
    const handleBeforeInstallPrompt = (e: Event) => {
      addDebug('🎉 beforeinstallprompt event fired!')
      e.preventDefault()
      setDeferredPrompt(e as BeforeInstallPromptEvent)
    }

    // Listen for app installed
    const handleAppInstalled = () => {
      addDebug('✅ App installed!')
      setIsInstalled(true)
      setDeferredPrompt(null)
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
    window.addEventListener('appinstalled', handleAppInstalled)

    // Check if service worker is registered
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.getRegistrations().then(registrations => {
        addDebug(`Service Workers: ${registrations.length} registered`)
        if (registrations.length > 0) {
          addDebug('✅ PWA Service Worker is working!')
        }
      })

      // Listen for service worker registration
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        addDebug('🔄 Service Worker controller changed')
      })
    }

    // Check manifest
    const manifestLink = document.querySelector('link[rel="manifest"]')
    addDebug(`Manifest: ${manifestLink ? 'Found' : 'Missing'}`)

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
      window.removeEventListener('appinstalled', handleAppInstalled)
    }
  }, [])

  const testInstall = async () => {
    if (deferredPrompt) {
      addDebug('🚀 Triggering install prompt...')
      try {
        await deferredPrompt.prompt()
        const { outcome } = await deferredPrompt.userChoice
        addDebug(`User choice: ${outcome}`)
        setDeferredPrompt(null)
      } catch (error) {
        addDebug(`Error: ${error}`)
      }
    } else {
      addDebug('❌ No deferred prompt available')
    }
  }

  const forceShow = () => {
    addDebug('🔧 Force showing install prompt')
    // This will show our custom prompt regardless
  }

  const copyLogs = async () => {
    const logsText = debugInfo.join('\n')
    try {
      await navigator.clipboard.writeText(logsText)
      addDebug('📋 Logs copied to clipboard!')
    } catch (error) {
      addDebug('❌ Failed to copy logs')
      // Fallback: create a text area and select it
      const textArea = document.createElement('textarea')
      textArea.value = logsText
      document.body.appendChild(textArea)
      textArea.select()
      document.execCommand('copy')
      document.body.removeChild(textArea)
      addDebug('📋 Logs copied (fallback method)')
    }
  }

  if (!isVisible) return null

  return (
    <Card className="fixed top-4 right-4 w-80 z-50 bg-white shadow-lg border-2">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm text-black">PWA Install Debug</CardTitle>
          <div className="flex gap-1">
            <Button
              onClick={() => setIsCollapsed(!isCollapsed)}
              size="sm"
              variant="ghost"
              className="h-6 w-6 p-0"
            >
              {isCollapsed ? <ChevronDown className="h-3 w-3" /> : <ChevronUp className="h-3 w-3" />}
            </Button>
            <Button
              onClick={() => setIsVisible(false)}
              size="sm"
              variant="ghost"
              className="h-6 w-6 p-0"
            >
              <X className="h-3 w-3" />
            </Button>
          </div>
        </div>
      </CardHeader>

      {!isCollapsed && (
        <CardContent className="space-y-2">
          <div className="flex gap-1">
            <Button
              onClick={testInstall}
              size="sm"
              disabled={!deferredPrompt}
              className="flex-1 text-xs"
            >
              Test Install
            </Button>
            <Button
              onClick={forceShow}
              size="sm"
              variant="outline"
              className="flex-1 text-xs"
            >
              Force Show
            </Button>
            <Button
              onClick={copyLogs}
              size="sm"
              variant="outline"
              className="px-2"
              title="Copy logs"
            >
              <Copy className="h-3 w-3" />
            </Button>
          </div>

          <div className="text-xs space-y-1 max-h-48 overflow-y-auto bg-gray-100 p-2 rounded border">
            {debugInfo.map((info, i) => (
              <div key={i} className="font-mono text-black leading-tight">{info}</div>
            ))}
          </div>

          <div className="text-xs text-black bg-gray-50 p-2 rounded">
            <div>Prompt Available: {deferredPrompt ? '✅' : '❌'}</div>
            <div>Installed: {isInstalled ? '✅' : '❌'}</div>
          </div>
        </CardContent>
      )}
    </Card>
  )
}
