import Link from 'next/link'
import { Card, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export default function LiveAppWalkthroughPage() {
  return (
    <main className="min-h-screen bg-[#0B1220] flex flex-col items-center justify-center p-6 gap-6">
      <Card className="w-full max-w-xl bg-gray-900 border-gray-800 text-gray-100 shadow-xl">
        <div className="flex flex-col items-center justify-center min-h-[260px] p-6 text-center">
          <CardTitle className="text-2xl mb-4">Explain How The App Works</CardTitle>
          <p className="text-gray-300 mb-6">Show Today view, proof-based completion, and how goals appear on schedule.</p>
          <Link href="/journey/live/signup-link">
            <Button className="bg-blue-600 hover:bg-blue-700">Next: Text Signup Link</Button>
          </Link>
        </div>
      </Card>
    </main>
  )
}

