'use client'

import { useEffect } from 'react'

export function ServiceWorkerRegistration() {
  useEffect(() => {
    // Reason: Manually register service worker to ensure PWA functionality
    if ('serviceWorker' in navigator && process.env.NODE_ENV === 'production') {
      const registerSW = async () => {
        try {
          console.log('Attempting to register service worker...')

          // Check if already registered
          const registrations = await navigator.serviceWorker.getRegistrations()
          console.log(`Existing registrations: ${registrations.length}`)

          // Register the service worker
          const registration = await navigator.serviceWorker.register('/sw.js', {
            scope: '/'
          })

          console.log('Service Worker registered successfully:', registration)
          
          // Handle updates
          registration.addEventListener('updatefound', () => {
            console.log('Service Worker update found')
            const newWorker = registration.installing
            if (newWorker) {
              newWorker.addEventListener('statechange', () => {
                if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                  console.log('New service worker installed, refresh to update')
                }
              })
            }
          })
          
        } catch (error) {
          console.error('Service Worker registration failed:', error)
        }
      }
      
      // Register when page loads
      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', registerSW)
      } else {
        registerSW()
      }
    } else if (process.env.NODE_ENV === 'development') {
      console.log('Service Worker registration skipped in development mode')
    } else {
      console.log('Service Workers not supported in this browser')
    }
  }, [])

  return null // This component doesn't render anything
}
