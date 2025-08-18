"use client"

import { useEffect } from 'react'

// Reason: On mobile, ensure focusing inputs doesn't cause the layout to jump leaving large blank space.
export function MobileKeyboardHints() {
  useEffect(() => {
    // Use VisualViewport to scroll focused inputs into view without overscrolling
    const vv = (window as any).visualViewport as VisualViewport | undefined
    if (!vv) return

    const onFocus = (e: FocusEvent) => {
      const target = e.target as HTMLElement | null
      if (!target) return
      // Slight delay to let keyboard animate
      setTimeout(() => {
        target.scrollIntoView({ block: 'center', behavior: 'smooth' })
      }, 50)
    }

    document.addEventListener('focusin', onFocus)
    return () => {
      document.removeEventListener('focusin', onFocus)
    }
  }, [])

  return null
}

