import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

// Reason: Super-minimal page to iterate on journey states quickly in local dev
export default function JourneyPage() {
  return (
    <main className="min-h-screen bg-[#0B1220] flex items-center justify-center p-6">
      <Link href="/journey/new-lead" className="block w-full max-w-md">
        <Card className="w-full bg-gray-900 border-gray-800 text-gray-100 shadow-xl hover:border-blue-600 hover:bg-gray-800 transition">
          <div className="flex flex-col items-center justify-center min-h-[180px] p-6">
            <CardTitle className="text-xl text-center">New Lead - Untouched</CardTitle>
            <p className="text-gray-400 text-sm mt-2">Tap to continue</p>
          </div>
        </Card>
      </Link>
    </main>
  )
}

