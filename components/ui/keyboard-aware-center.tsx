"use client"

import { useEffect, useState } from 'react'
import clsx from 'clsx'

// Reason: Centers content by default and gently lifts it when the mobile keyboard appears
export function KeyboardAwareCenter({ children, className }: { children: React.ReactNode; className?: string }) {
  const [keyboardActive, setKeyboardActive] = useState(false)
  const [shift, setShift] = useState(0) // px to lift content
  const [lastDelta, setLastDelta] = useState(0)

  useEffect(() => {
    const vv: VisualViewport | undefined = (window as any).visualViewport
    if (!vv) return

    // Hysteresis thresholds to avoid flapping
    const ON_THRESHOLD = 160
    const OFF_THRESHOLD = 100

    let raf = 0
    const onResize = () => {
      const delta = Math.max(0, Math.round(window.innerHeight - vv.height))
      const diff = Math.abs(delta - lastDelta)
      const nextActive = delta > ON_THRESHOLD ? true : (delta < OFF_THRESHOLD ? false : keyboardActive)
      // Only update when movement is meaningful to avoid micro-jumps when switching fields
      if (diff > 12) {
        const targetShift = (nextActive || delta > 40) ? Math.min(240, Math.round(delta * 0.78)) : 0
        if (targetShift !== shift) setShift(targetShift)
        setLastDelta(delta)
      }
      if (nextActive !== keyboardActive) setKeyboardActive(nextActive)
    }
    const onResizeRaf = () => {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(onResize)
    }

    const onFocusIn = () => {
      // Do not force state here; rely on vv for stability, just schedule a recalculation
      requestAnimationFrame(onResize)
    }
    const onFocusOut = () => {
      // Let viewport settle; then recalc
      setTimeout(onResizeRaf, 80)
    }

    vv.addEventListener('resize', onResizeRaf)
    document.addEventListener('focusin', onFocusIn)
    document.addEventListener('focusout', onFocusOut)
    onResize()

    return () => {
      vv.removeEventListener('resize', onResizeRaf)
      document.removeEventListener('focusin', onFocusIn)
      document.removeEventListener('focusout', onFocusOut)
      cancelAnimationFrame(raf)
    }
  }, [keyboardActive, shift])

  return (
    <div className={clsx('min-h-[100dvh] flex items-center justify-center p-4 overflow-y-auto overscroll-contain', className)}>
      <div
        className="w-full max-w-md transition-transform duration-300 ease-out will-change-transform"
        style={{ transform: `translate3d(0, -${shift}px, 0)` }}
      >
        {children}
      </div>
    </div>
  )
}

