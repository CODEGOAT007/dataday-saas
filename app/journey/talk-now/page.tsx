import Link from 'next/link'
import { Card, CardTitle } from '@/components/ui/card'

export default function TalkNowPage() {
  return (
    <main className="min-h-screen bg-[#0B1220] flex flex-col items-center p-6 gap-6">
      <h1 className="text-xl text-white">Live Conversion - Next Step</h1>
      <div className="w-full max-w-2xl grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Link href="/journey/live/story" className="block">
          <Card className="bg-gray-900 border-gray-800 text-gray-100 hover:border-green-600 hover:bg-gray-800 transition">
            <div className="flex items-center justify-center min-h-[120px] p-4">
              <CardTitle className="text-base text-center">Ready to sign up and get started now</CardTitle>
            </div>
          </Card>
        </Link>
        <Link href="/journey/follow-up-needed" className="block">
          <Card className="bg-gray-900 border-gray-800 text-gray-100 hover:border-yellow-600 hover:bg-gray-800 transition">
            <div className="flex items-center justify-center min-h-[120px] p-4">
              <CardTitle className="text-base text-center">Interested but wants to think about it</CardTitle>
            </div>
          </Card>
        </Link>
      </div>
    </main>
  )
}

