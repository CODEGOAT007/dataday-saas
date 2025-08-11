'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'

export function CheckoutButton({ tierId = 'basic', priceId }: { tierId?: string; priceId?: string }) {
  const [loading, setLoading] = useState(false)

  const createCheckout = async () => {
    try {
      setLoading(true)
      const res = await fetch('/api/subscriptions/create-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tierId, priceId })
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

