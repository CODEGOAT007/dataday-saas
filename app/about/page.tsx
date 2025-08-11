import type { Metadata } from 'next'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export const metadata: Metadata = {
  title: 'About - MyDataday',
  description: 'Learn about MyDataday - your personal goal achievement app.',
}

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      <div className="container mx-auto px-4 py-16">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
            The Story Behind MyDataday
          </h1>
          <p className="text-xl text-blue-200 max-w-2xl mx-auto">
            Why we built MyDataday and how it can transform your relationship with goals
          </p>
        </div>

        {/* Story Section */}
        <div className="max-w-4xl mx-auto">
          <Card className="shadow-xl border-0 bg-white/95 backdrop-blur">
            <CardContent className="p-12">
              <div className="prose prose-lg max-w-none space-y-6">
                <p className="text-2xl font-light text-gray-900 leading-relaxed">
                  MyDataday was born from a simple observation: most people fail to achieve
                  their goals not because they lack motivation, but because they lack
                  consistent support and accountability.
                </p>

                <p className="text-lg leading-relaxed text-gray-800">
                  Traditional goal-setting apps focus on individual willpower, but research
                  shows that social accountability increases success rates by over 65%.
                  We took this insight and built an entire platform around it.
                </p>

                <p className="text-lg leading-relaxed text-gray-800">
                  When life gets messy—and it always does—having people who care about your
                  success makes all the difference. MyDataday ensures that when you're having
                  a tough day, you're not facing it alone.
                </p>

                <p className="text-lg leading-relaxed text-gray-800">
                  We believe in the power of human connection, the science of behavioral
                  psychology, and the simple truth that consistency beats perfection every time.
                </p>

                <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-8 mt-8 border border-blue-200">
                  <p className="text-xl font-medium text-blue-900 text-center">
                    Your goals matter and you're more likely to achieve them with a team.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
