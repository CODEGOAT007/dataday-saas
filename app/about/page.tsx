import type { Metadata } from 'next'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Users, Target, Shield, Zap } from 'lucide-react'

export const metadata: Metadata = {
  title: 'About - MyDataday',
  description: 'Learn about MyDataday - your personal goal achievement app with social accountability.',
}

export default function AboutPage() {
  return (
    <>
      {/* Hero Section */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          About MyDataday
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Your personal goal achievement app that activates your social network 
          to ensure 90%+ success rates through our Emergency Support Team system.
        </p>
      </div>

      {/* Mission Section */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="text-2xl text-center">Our Mission</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-lg text-gray-700 text-center max-w-4xl mx-auto">
            We believe that achieving your goals shouldn't be a solo journey. MyDataday 
            transforms your personal network into a powerful accountability system, 
            ensuring you stay on track and celebrate every milestone along the way.
          </p>
        </CardContent>
      </Card>

      {/* Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        
        {/* Emergency Support Team */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-6 w-6 text-primary" />
              Emergency Support Team
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">
              When you're struggling, your trusted friends and family automatically 
              receive notifications to provide support, encouragement, and accountability.
            </p>
          </CardContent>
        </Card>

        {/* Goal Tracking */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-6 w-6 text-primary" />
              Smart Goal Tracking
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">
              Track your daily progress with intelligent insights and AI coaching 
              that adapts to your unique patterns and challenges.
            </p>
          </CardContent>
        </Card>

        {/* Social Accountability */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-6 w-6 text-primary" />
              Social Accountability
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">
              Your network becomes your net worth. Connect with people who care 
              about your success and create mutual accountability partnerships.
            </p>
          </CardContent>
        </Card>

        {/* AI Coaching */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-6 w-6 text-primary" />
              AI-Powered Insights
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">
              Get personalized coaching and insights powered by AI that learns 
              your patterns and provides actionable recommendations.
            </p>
          </CardContent>
        </Card>

      </div>

      {/* Stats Section */}
      <Card className="mb-8 bg-primary text-primary-foreground">
        <CardContent className="py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold mb-2">90%+</div>
              <div className="text-primary-foreground/80">Success Rate</div>
            </div>
            <div>
              <div className="text-3xl font-bold mb-2">24/7</div>
              <div className="text-primary-foreground/80">Support Network</div>
            </div>
            <div>
              <div className="text-3xl font-bold mb-2">AI</div>
              <div className="text-primary-foreground/80">Powered Coaching</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Story Section */}
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl text-center">The Story Behind MyDataday</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="prose max-w-none text-gray-700">
            <p className="text-lg mb-4">
              MyDataday was born from a simple observation: most people fail to achieve 
              their goals not because they lack motivation, but because they lack 
              consistent support and accountability.
            </p>
            <p className="mb-4">
              Traditional goal-setting apps focus on individual willpower, but research 
              shows that social accountability increases success rates by over 65%. 
              We took this insight and built an entire platform around it.
            </p>
            <p className="mb-4">
              Our Emergency Support Team system ensures that when you're having a tough 
              day, the people who care about you most are automatically notified and 
              can provide the encouragement you need to keep going.
            </p>
            <p>
              Because your goals matter. And you don't have to achieve them alone.
            </p>
          </div>
        </CardContent>
      </Card>
    </>
  )
}
