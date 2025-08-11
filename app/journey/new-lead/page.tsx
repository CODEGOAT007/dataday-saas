import Link from 'next/link'
import { Card, CardTitle } from '@/components/ui/card'

export default function JourneyNewLeadPage() {
  return (
    <main className="min-h-screen bg-[#0B1220] flex flex-col items-center p-6 gap-6">
      <h1 className="text-xl text-white">New Lead - Choose Outcome</h1>
      <div className="w-full max-w-3xl grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Link href="/journey/game-over" className="block">
          <Card className="bg-gray-900 border-gray-800 text-gray-100 hover:border-red-600 hover:bg-gray-800 transition">
            <div className="flex items-center justify-center min-h-[120px] p-4">
              <CardTitle className="text-base text-center">Called and the Number was Bad or Wrong Person.</CardTitle>
            </div>
          </Card>
        </Link>
        <Link href="/journey/no-response" className="block">
          <Card className="bg-gray-900 border-gray-800 text-gray-100 hover:border-blue-600 hover:bg-gray-800 transition">
            <div className="flex items-center justify-center min-h-[120px] p-4">
              <CardTitle className="text-base text-center">Called Multiple Times and No Response to Phone Call.</CardTitle>
            </div>
          </Card>
        </Link>
        <Link href="/journey/talk-later" className="block">
          <Card className="bg-gray-900 border-gray-800 text-gray-100 hover:border-blue-600 hover:bg-gray-800 transition">
            <div className="flex items-center justify-center min-h-[120px] p-4">
              <CardTitle className="text-base text-center">Called and they can talk later.</CardTitle>
            </div>
          </Card>
        </Link>
        <Link href="/journey/talk-now" className="block">
          <Card className="bg-gray-900 border-gray-800 text-gray-100 hover:border-green-600 hover:bg-gray-800 transition">
            <div className="flex items-center justify-center min-h-[120px] p-4">
              <CardTitle className="text-base text-center">Called and they can talk now.</CardTitle>
            </div>
          </Card>
        </Link>
      </div>
    </main>
  )
}

