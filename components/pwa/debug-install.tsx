'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ChevronDown, ChevronUp, Copy, X, Minimize2, Bug, Trash2, RefreshCw } from 'lucide-react'

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

export function DebugInstall() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null)
  const [debugInfo, setDebugInfo] = useState<string[]>([])
  const [isInstalled, setIsInstalled] = useState(false)
  const [isCollapsed, setIsCollapsed] = useState(true)
  const [isVisible, setIsVisible] = useState(true)
  const [isMinimized, setIsMinimized] = useState(true)
  const [isClearing, setIsClearing] = useState(false)
  const [cacheMessage, setCacheMessage] = useState('')

  // Reason: Always show in development mode
  const shouldShow = process.env.NODE_ENV === 'development'

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

  const clearAllCaches = async () => {
    setIsClearing(true)
    setCacheMessage('')

    try {
      // Clear all caches
      if ('caches' in window) {
        const cacheNames = await caches.keys()
        await Promise.all(cacheNames.map(name => caches.delete(name)))
        addDebug(`🗑️ Cleared ${cacheNames.length} caches`)
      }

      // Clear localStorage
      localStorage.clear()
      addDebug('🗑️ Cleared localStorage')

      // Clear sessionStorage
      sessionStorage.clear()
      addDebug('🗑️ Cleared sessionStorage')

      // Clear IndexedDB (basic attempt)
      if ('indexedDB' in window) {
        try {
          const databases = await indexedDB.databases()
          for (const db of databases) {
            if (db.name) {
              indexedDB.deleteDatabase(db.name)
            }
          }
          addDebug('🗑️ Cleared IndexedDB')
        } catch (e) {
          addDebug('⚠️ IndexedDB clear failed')
        }
      }

      setCacheMessage('✅ All caches cleared!')
      addDebug('✅ All caches and storage cleared')
    } catch (error) {
      setCacheMessage('❌ Failed to clear caches')
      addDebug(`❌ Cache clear error: ${error}`)
    } finally {
      setIsClearing(false)
      setTimeout(() => setCacheMessage(''), 3000)
    }
  }

  const forceRefresh = () => {
    addDebug('🔄 Force refreshing page...')
    window.location.reload()
  }

  if (!isVisible || !shouldShow) return null

  // Minimized floating icon
  if (isMinimized) {
    return (
      <button
        onClick={() => setIsMinimized(false)}
        className="fixed top-16 right-4 z-50 h-8 w-8 rounded-full shadow-lg border-2 transition-all duration-200 flex items-center justify-center"
        style={{
          backgroundColor: 'rgba(0, 0, 0, 0.2)',
          borderColor: 'rgba(156, 163, 175, 0.2)',
          color: 'rgba(255, 255, 255, 0.2)'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = 'rgba(0, 0, 0, 0.8)'
          e.currentTarget.style.borderColor = 'rgba(156, 163, 175, 0.6)'
          e.currentTarget.style.color = 'rgba(255, 255, 255, 1)'
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = 'rgba(0, 0, 0, 0.2)'
          e.currentTarget.style.borderColor = 'rgba(156, 163, 175, 0.2)'
          e.currentTarget.style.color = 'rgba(255, 255, 255, 0.2)'
        }}
        title="Debug Tools"
      >
        <Bug className="h-4 w-4" />
      </button>
    )
  }

  return (
    <Card className="fixed top-4 right-4 w-80 z-50 bg-white shadow-lg border-2">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm text-black">PWA Debug & Cache Tools</CardTitle>
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
              onClick={() => setIsMinimized(true)}
              size="sm"
              variant="ghost"
              className="h-6 w-6 p-0"
              title="Minimize"
            >
              <Minimize2 className="h-3 w-3" />
            </Button>
            <Button
              onClick={() => setIsVisible(false)}
              size="sm"
              variant="ghost"
              className="h-6 w-6 p-0"
              title="Close"
            >
              <X className="h-3 w-3" />
            </Button>
          </div>
        </div>
      </CardHeader>

      {!isCollapsed && (
        <CardContent className="space-y-2">
          {/* PWA Install Controls */}
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
            <Button
              onClick={() => setIsMinimized(true)}
              size="sm"
              variant="outline"
              className="px-2"
              title="Minimize"
            >
              <Minimize2 className="h-3 w-3" />
            </Button>
          </div>

          {/* Cache Controls */}
          <div className="flex gap-1">
            <Button
              onClick={clearAllCaches}
              disabled={isClearing}
              size="sm"
              variant="destructive"
              className="flex-1 text-xs"
            >
              <Trash2 className="h-3 w-3 mr-1" />
              Clear All
            </Button>
            <Button
              onClick={forceRefresh}
              size="sm"
              variant="outline"
              className="flex-1 text-xs"
            >
              <RefreshCw className="h-3 w-3 mr-1" />
              Refresh
            </Button>
          </div>

          {cacheMessage && (
            <div className="text-xs p-2 rounded bg-gray-100 text-black">
              {cacheMessage}
            </div>
          )}

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
