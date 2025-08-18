'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Bug, Settings, Eye, EyeOff } from 'lucide-react'

export function DebugToggle() {
  const [showDebugTools, setShowDebugTools] = useState(false)

  useEffect(() => {
    // Reason: Check if debug tools should be shown by default
    const shouldShow = process.env.NODE_ENV === 'development' || 
                      window.location.search.includes('debug=true')
    setShowDebugTools(shouldShow)

    // Reason: Add keyboard shortcut to toggle debug tools (Ctrl+Shift+D)
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key === 'D') {
        e.preventDefault()
        setShowDebugTools(prev => {
          const newValue = !prev
          // Store in localStorage so it persists
          localStorage.setItem('debug-tools-visible', newValue.toString())
          return newValue
        })
      }
    }

    // Reason: Check localStorage for saved preference
    const saved = localStorage.getItem('debug-tools-visible')
    if (saved !== null) {
      setShowDebugTools(saved === 'true')
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  // Reason: Update global CSS variable to control debug tool visibility
  useEffect(() => {
    document.documentElement.style.setProperty(
      '--debug-tools-display', 
      showDebugTools ? 'block' : 'none'
    )
  }, [showDebugTools])

  // Reason: Only show toggle in development or when debug=true
  const shouldShowToggle = process.env.NODE_ENV === 'development' || 
                          typeof window !== 'undefined' && window.location.search.includes('debug=true')

  if (!shouldShowToggle) return null

  return (
    <Button
      onClick={() => setShowDebugTools(prev => {
        const newValue = !prev
        localStorage.setItem('debug-tools-visible', newValue.toString())
        return newValue
      })}
      className="fixed top-4 left-4 z-50 h-10 w-10 rounded-full bg-black hover:bg-gray-800 text-white shadow-lg border-2 border-gray-300 p-0"
      title={`${showDebugTools ? 'Hide' : 'Show'} Debug Tools (Ctrl+Shift+D)`}
    >
      {showDebugTools ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
    </Button>
  )
}
