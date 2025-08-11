import { Card, CardTitle } from '@/components/ui/card'

export default function TalkLaterPage() {
  return (
    <main className="min-h-screen bg-[#0B1220] flex flex-col items-center p-6 gap-6">
      <h1 className="text-xl text-white">Talk Later - Choose Timeframe</h1>
      <div className="w-full max-w-2xl grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Card className="bg-gray-900 border-gray-800 text-gray-100 hover:border-green-600 hover:bg-gray-800 transition">
          <div className="flex items-center justify-center min-h-[120px] p-4">
            <CardTitle className="text-base text-center">At an exact time/day</CardTitle>
          </div>
        </Card>
        <Card className="bg-gray-900 border-gray-800 text-gray-100 hover:border-yellow-600 hover:bg-gray-800 transition">
          <div className="flex items-center justify-center min-h-[120px] p-4">
            <CardTitle className="text-base text-center">They can talk later ambiguous timeframe</CardTitle>
          </div>
        </Card>
      </div>
    </main>
  )
}
