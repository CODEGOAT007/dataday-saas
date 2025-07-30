import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { SiteHeader } from '@/components/layout/site-header'
import { SiteFooter } from '@/components/layout/site-footer'
import { InstallButton } from '@/components/pwa/install-button'
import { ArrowRight, CheckCircle, Users, Brain, Shield, Zap } from 'lucide-react'
import Link from 'next/link'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-50 via-white to-brand-100 dark:from-brand-950 dark:via-brand-900 dark:to-brand-800">
      {/* Navigation Header */}
      <SiteHeader />

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 md:py-24 pt-24 md:pt-32">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6 text-white">
            When life gets messy,{' '}
            <br className="hidden md:block" />
            we keep you{' '}
            <span className="text-blue-400">on track</span>.
          </h1>

          <p className="text-xl text-gray-200 mb-8 max-w-2xl mx-auto">
            One missed day doesn't have to{' '}
            <span className="text-blue-400">derail you</span>.
            MyDataday is grounded in Kahneman's loss aversion research and behavioral science studies.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild>
              <Link href="/auth/signup">
                Start Your Journey
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/about">
                Learn More
              </Link>
            </Button>
          </div>
          
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-blue-400">94%</div>
              <div className="text-sm text-gray-300">Success Rate</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-blue-400">3x</div>
              <div className="text-sm text-gray-300">More Effective Than Willpower</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-blue-400">24/7</div>
              <div className="text-sm text-gray-300">Support Available</div>
            </div>
          </div>

          <div className="mt-16 text-center">
            <p className="text-sm text-gray-400 mb-2">Powered by Advanced Behavioral Science</p>
            <p className="text-xs text-gray-500 max-w-2xl mx-auto">
              Based on Kahneman's loss aversion research and social accountability studies.
            </p>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Advanced Behavioral Science in Action</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Our Emergency Support Team system harnesses fear of failure and social pressure—the most powerful human motivators.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <Users className="h-8 w-8 text-primary mb-2" />
              <CardTitle>Your Support Network</CardTitle>
              <CardDescription>
                Connect with people who care about your success. They'll cheer you on when you need it most.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-success-500" />
                  Family & friends encouragement
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-success-500" />
                  Gentle check-ins when needed
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-success-500" />
                  Celebrate your wins together
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Brain className="h-8 w-8 text-primary mb-2" />
              <CardTitle>AI Progress Support Team</CardTitle>
              <CardDescription>
                Personalized AI coaching that learns your patterns and motivates you daily
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-success-500" />
                  Daily check-ins & motivation
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-success-500" />
                  Pattern recognition & insights
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-success-500" />
                  Personalized strategies
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Shield className="h-8 w-8 text-primary mb-2" />
              <CardTitle>Human Backup Support</CardTitle>
              <CardDescription>
                Real humans step in when you need extra support or guidance
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-success-500" />
                  Weekly planning sessions
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-success-500" />
                  Crisis intervention
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-success-500" />
                  Goal strategy optimization
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Pricing Preview */}
      <section id="pricing" className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Simple, Effective Pricing</h2>
          <p className="text-muted-foreground">
            Choose the level of support that works for you
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {[
            { name: 'Essential', price: '$35', features: ['AI Support', 'Social Network', 'Basic Analytics'] },
            { name: 'Growth', price: '$65', features: ['Everything in Essential', 'Weekly Calls', 'Advanced Insights'], popular: true },
            { name: 'Accelerate', price: '$120', features: ['Everything in Growth', 'Priority Support', 'Custom Strategies'] },
            { name: 'Transform', price: '$200', features: ['Everything in Accelerate', 'Daily Check-ins', 'Life Coaching'] },
          ].map((plan, index) => (
            <Card key={index} className={plan.popular ? 'ring-2 ring-primary' : ''}>
              <CardHeader>
                {plan.popular && (
                  <Badge className="w-fit mb-2">Most Popular</Badge>
                )}
                <CardTitle>{plan.name}</CardTitle>
                <div className="text-3xl font-bold">{plan.price}<span className="text-sm font-normal">/month</span></div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-success-500" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>
        
        <div className="text-center mt-8">
          <Button size="lg" asChild>
            <Link href="/pricing">
              View Full Pricing
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-16">
        <Card className="bg-primary text-primary-foreground">
          <CardContent className="p-8 text-center">
            <h2 className="text-3xl font-bold mb-4">Ready to Make Your Goals Happen?</h2>
            <p className="text-lg mb-6 opacity-90">
              Join thousands of people who have transformed their lives with Dataday's 
              Social Accountability Network system.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="secondary" asChild>
                <Link href="/auth/signup">
                  Start Free Trial
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <InstallButton
                variant="outline"
                size="lg"
                className="bg-white/10 border-white/20 text-white hover:bg-white/20"
              >
                Install App
              </InstallButton>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Footer */}
      <SiteFooter />
    </div>
  )
}
