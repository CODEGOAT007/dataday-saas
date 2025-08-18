'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'

export function CheckoutButton({ tierId = 'basic', priceId }: { tierId?: string; priceId?: string }) {
  const [loading, setLoading] = useState(false)

  const createCheckout = async () => {
    try {
      setLoading(true)
      // Toggle between offers via query param (?offer=intro3)
      const offer = new URLSearchParams(window.location.search).get('offer')
      const endpoint = offer === 'intro3' ? '/api/subscriptions/start-checkout' : '/api/subscriptions/create-checkout'
      const body = offer === 'intro3' ? { tierId, offer } : { tierId, priceId }
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to start checkout')
      window.location.href = data.url
    } catch (e) {
      console.error(e)
      alert('Could not start checkout. Are Stripe keys configured?')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Button className="bg-green-600 hover:bg-green-700" disabled={loading} onClick={createCheckout}>
      {loading ? 'Redirecting…' : 'Add Card on File'}
    </Button>
  )
}

