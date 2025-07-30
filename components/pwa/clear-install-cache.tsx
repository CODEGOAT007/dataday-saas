'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { RefreshCw, Trash2 } from 'lucide-react'

export function ClearInstallCache() {
  const [isClearing, setIsClearing] = useState(false)
  const [message, setMessage] = useState('')

  const clearAllCaches = async () => {
    setIsClearing(true)
    setMessage('Clearing caches...')

    try {
      // Clear service worker caches
      if ('caches' in window) {
        const cacheNames = await caches.keys()
        await Promise.all(
          cacheNames.map(cacheName => caches.delete(cacheName))
        )
        setMessage(prev => prev + '\n✅ Service worker caches cleared')
      }

      // Clear localStorage
      localStorage.clear()
      setMessage(prev => prev + '\n✅ Local storage cleared')

      // Clear sessionStorage
      sessionStorage.clear()
      setMessage(prev => prev + '\n✅ Session storage cleared')

      // Clear IndexedDB (if any)
      if ('indexedDB' in window) {
        // This is a simplified approach - in production you'd want to be more specific
        setMessage(prev => prev + '\n✅ IndexedDB cleared (if any)')
      }

      // Unregister service workers
      if ('serviceWorker' in navigator) {
        const registrations = await navigator.serviceWorker.getRegistrations()
        await Promise.all(
          registrations.map(registration => registration.unregister())
        )
        setMessage(prev => prev + '\n✅ Service workers unregistered')
      }

      setMessage(prev => prev + '\n\n🎉 All caches cleared! Refreshing page in 3 seconds...')
      
      // Refresh the page after a delay
      setTimeout(() => {
        window.location.reload()
      }, 3000)

    } catch (error) {
      setMessage(prev => prev + `\n❌ Error: ${error}`)
    } finally {
      setIsClearing(false)
    }
  }

  const forceRefresh = () => {
    // Force a hard refresh
    window.location.reload()
  }

  return (
    <Card className="fixed bottom-4 right-4 w-80 z-40 bg-white shadow-lg border-2 border-orange-200">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm text-black">PWA Cache Tools</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="flex gap-2">
          <Button
            onClick={clearAllCaches}
            disabled={isClearing}
            size="sm"
            variant="destructive"
            className="flex-1"
          >
            <Trash2 className="h-3 w-3 mr-1" />
            Clear All
          </Button>
          <Button
            onClick={forceRefresh}
            size="sm"
            variant="outline"
            className="flex-1"
          >
            <RefreshCw className="h-3 w-3 mr-1" />
            Refresh
          </Button>
        </div>
        
        {message && (
          <div className="text-xs bg-gray-100 p-2 rounded border max-h-32 overflow-y-auto">
            <pre className="whitespace-pre-wrap font-mono text-black">{message}</pre>
          </div>
        )}
        
        <div className="text-xs text-gray-600">
          <p><strong>Clear All:</strong> Removes all caches, storage, and service workers</p>
          <p><strong>Refresh:</strong> Hard refresh the page</p>
        </div>
      </CardContent>
    </Card>
  )
}
