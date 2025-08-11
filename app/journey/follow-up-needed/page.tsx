import Link from 'next/link'
import { Card, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export default function FollowUpNeededPage() {
  return (
    <main className="min-h-screen bg-[#0B1220] flex flex-col items-center justify-center p-6 gap-6">
      <Card className="w-full max-w-md bg-yellow-900/20 border-yellow-800 text-gray-100 shadow-xl">
        <div className="flex flex-col items-center justify-center min-h-[200px] p-6 text-center">
          <div className="text-6xl mb-4">🕒</div>
          <CardTitle className="text-2xl text-yellow-400 mb-2">Follow-Up Needed</CardTitle>
          <p className="text-gray-300 mb-4">They want to think about it. Schedule a follow-up and send materials.</p>
          <Link href="/journey">
            <Button className="bg-blue-600 hover:bg-blue-700">Return to Journey</Button>
          </Link>
        </div>
      </Card>
    </main>
  )
}
