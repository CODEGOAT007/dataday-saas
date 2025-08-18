"use client"

import { useEffect } from 'react'

export function OfferTracker() {
  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search)
      const offer = params.get('offer')
      if (!offer) return
      // Persist locally for later attribution if user signs in later
      localStorage.setItem('selectedOffer', offer)
      localStorage.setItem('selectedOfferAt', new Date().toISOString())
      // Best-effort server log (no-op if not signed in)
      fetch('/api/offer/log', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ offer })
      }).catch(() => {})
    } catch {}
  }, [])

  return null
}

