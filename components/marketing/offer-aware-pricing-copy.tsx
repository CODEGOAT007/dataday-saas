"use client"

import { useMemo } from 'react'

export function OfferAwarePricingCopy() {
  const offer = useMemo(() => {
    if (typeof window === 'undefined') return null
    const urlOffer = new URLSearchParams(window.location.search).get('offer')
    return urlOffer || localStorage.getItem('selectedOffer')
  }, [])

  if (offer !== 'intro3') return null

  return (
    <span>
      Offer: <strong>$3 intro</strong> — First 30 days for $3, then $65/month. Cancel anytime.
    </span>
  )
}

