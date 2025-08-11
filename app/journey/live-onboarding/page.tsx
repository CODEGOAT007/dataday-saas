import Link from 'next/link'
import { Card, CardTitle } from '@/components/ui/card'

export default function LiveOnboardingPage() {
  return (
    <main className="min-h-screen bg-[#0B1220] flex flex-col items-center p-6 gap-6">
      <h1 className="text-xl text-white">Live Onboarding Flow</h1>
      <div className="w-full max-w-4xl grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <Link href="/journey/live/story" className="block">
          <Card className="bg-gray-900 border-gray-800 text-gray-100 hover:border-blue-600 hover:bg-gray-800 transition">
            <div className="flex items-center justify-center min-h-[120px] p-4 text-center">
              <CardTitle className="text-base">Collect Life Story + Current Struggles</CardTitle>
            </div>
          </Card>
        </Link>
        <Link href="/journey/live/goal-design" className="block">
          <Card className="bg-gray-900 border-gray-800 text-gray-100 hover:border-blue-600 hover:bg-gray-800 transition">
            <div className="flex items-center justify-center min-h-[120px] p-4 text-center">
              <CardTitle className="text-base">Design Actionable Daily Goal</CardTitle>
            </div>
          </Card>
        </Link>
        <Link href="/journey/live/app-walkthrough" className="block">
          <Card className="bg-gray-900 border-gray-800 text-gray-100 hover:border-blue-600 hover:bg-gray-800 transition">
            <div className="flex items-center justify-center min-h-[120px] p-4 text-center">
              <CardTitle className="text-base">Explain How The App Works</CardTitle>
            </div>
          </Card>
        </Link>
        <Link href="/journey/live/signup-link" className="block">
          <Card className="bg-gray-900 border-gray-800 text-gray-100 hover:border-blue-600 hover:bg-gray-800 transition">
            <div className="flex items-center justify-center min-h-[120px] p-4 text-center">
              <CardTitle className="text-base">Text Signup Link and Create Account</CardTitle>
            </div>
          </Card>
        </Link>
        <Link href="/journey/live/device" className="block">
          <Card className="bg-gray-900 border-gray-800 text-gray-100 hover:border-blue-600 hover:bg-gray-800 transition">
            <div className="flex items-center justify-center min-h-[120px] p-4 text-center">
              <CardTitle className="text-base">Choose Device Type: iPhone or Android</CardTitle>
            </div>
          </Card>
        </Link>
        <Link href="/journey/live/pwa-install" className="block">
          <Card className="bg-gray-900 border-gray-800 text-gray-100 hover:border-blue-600 hover:bg-gray-800 transition">
            <div className="flex items-center justify-center min-h-[120px] p-4 text-center">
              <CardTitle className="text-base">Install PWA with Device-Specific Video</CardTitle>
            </div>
          </Card>
        </Link>
        <Link href="/journey/live/goal-voice" className="block">
          <Card className="bg-gray-900 border-gray-800 text-gray-100 hover:border-blue-600 hover:bg-gray-800 transition">
            <div className="flex items-center justify-center min-h-[120px] p-4 text-center">
              <CardTitle className="text-base">Record Goal Sentence (Voice)</CardTitle>
            </div>
          </Card>
        </Link>
        <Link href="/journey/live/support-contacts" className="block">
          <Card className="bg-gray-900 border-gray-800 text-gray-100 hover:border-blue-600 hover:bg-gray-800 transition">
            <div className="flex items-center justify-center min-h-[120px] p-4 text-center">
              <CardTitle className="text-base">Enter Support Contact Info</CardTitle>
            </div>
          </Card>
        </Link>
        <Link href="/journey/live/test-day-view" className="block">
          <Card className="bg-gray-900 border-gray-800 text-gray-100 hover:border-blue-600 hover:bg-gray-800 transition">
            <div className="flex items-center justify-center min-h-[120px] p-4 text-center">
              <CardTitle className="text-base">Explore Test Day View</CardTitle>
            </div>
          </Card>
        </Link>
        <Link href="/journey/live/payment" className="block">
          <Card className="bg-gray-900 border-gray-800 text-gray-100 hover:border-blue-600 hover:bg-gray-800 transition">
            <div className="flex items-center justify-center min-h-[120px] p-4 text-center">
              <CardTitle className="text-base">Add Card on File</CardTitle>
            </div>
          </Card>
        </Link>
      </div>
    </main>
  )
}

