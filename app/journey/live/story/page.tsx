import Link from 'next/link'
import { Card, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export default function LiveStoryPage() {
  return (
    <main className="min-h-screen bg-[#0B1220] flex flex-col items-center justify-center p-6 gap-6">
      <Card className="w-full max-w-xl bg-gray-900 border-gray-800 text-gray-100 shadow-xl">
        <div className="flex flex-col items-center justify-center min-h-[260px] p-6 text-center">
          <CardTitle className="text-2xl mb-4">Collect Life Story + Current Struggles</CardTitle>
          <p className="text-gray-300 mb-6">Talk through their background, current issues, and what they want to change. Keep it conversational.</p>
          <Link href="/journey/live/goal-design">
            <Button className="bg-blue-600 hover:bg-blue-700">Next: Design Goal</Button>
          </Link>
        </div>
      </Card>
    </main>
  )
}

