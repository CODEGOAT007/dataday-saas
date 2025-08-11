'use client'

import Link from 'next/link'
import { Card, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { DemoEntry } from './components/DemoEntry'

export default function LiveTestDayViewPage() {
  return (
    <main className="min-h-screen bg-[#0B1220] flex flex-col items-center justify-center p-6 gap-6">
      <Card className="w-full max-w-xl bg-gray-900 border-gray-800 text-gray-100 shadow-xl">
        <div className="flex flex-col items-center justify-center min-h-[320px] p-6 text-center gap-4">
          <CardTitle className="text-2xl">Explore Test Day View</CardTitle>
          <p className="text-gray-300">Show how goals appear with times and how proof is recorded.</p>

          <div className="w-full space-y-3 mt-2">
            <DemoEntry time="7:00 AM" title="Drink 16oz water (voice confirm)" />
            <DemoEntry time="12:00 PM" title="Walk 10 minutes (start/stop)" />
            <DemoEntry time="9:30 PM" title="Reflect 1 min (voice note)" />
          </div>

          <div className="mt-4">
            <Link href="/journey/live/payment">
              <Button className="bg-blue-600 hover:bg-blue-700">Next: Add Card</Button>
            </Link>
          </div>
        </div>
      </Card>
    </main>
  )
}

