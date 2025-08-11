import Link from 'next/link'
import { Card, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export default function LiveDevicePage() {
  return (
    <main className="min-h-screen bg-[#0B1220] flex flex-col items-center justify-center p-6 gap-6">
      <Card className="w-full max-w-xl bg-gray-900 border-gray-800 text-gray-100 shadow-xl">
        <div className="flex flex-col items-center justify-center min-h-[260px] p-6 text-center">
          <CardTitle className="text-2xl mb-4">Choose Device Type</CardTitle>
          <div className="flex gap-3">
            <Link href="/journey/live/pwa-install?device=iphone"><Button className="bg-blue-600 hover:bg-blue-700">iPhone</Button></Link>
            <Link href="/journey/live/pwa-install?device=android"><Button className="bg-green-600 hover:bg-green-700">Android</Button></Link>
          </div>
        </div>
      </Card>
    </main>
  )
}

