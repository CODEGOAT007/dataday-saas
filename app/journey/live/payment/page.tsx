'use client'

import Link from 'next/link'
import { Card, CardTitle } from '@/components/ui/card'
import { CheckoutButton } from './components/CheckoutButton'

export default function LivePaymentPage() {
  return (
    <main className="min-h-screen bg-[#0B1220] flex flex-col items-center justify-center p-6 gap-6">
      <Card className="w-full max-w-xl bg-gray-900 border-gray-800 text-gray-100 shadow-xl">
        <div className="flex flex-col items-center justify-center min-h-[260px] p-6 text-center gap-4">
          <CardTitle className="text-2xl">Add Card on File</CardTitle>
          <p className="text-gray-300">Capture card now so billing is ready after trial.</p>

          <CheckoutButton />

          <div className="mt-6 text-sm text-gray-500">
            Stripe keys must be configured for this to work in production.
          </div>
          <Link href="/journey" className="mt-2 text-blue-400 hover:underline">Finish</Link>
        </div>
      </Card>
    </main>
  )
}

