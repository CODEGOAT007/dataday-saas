'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { SiteHeader } from '@/components/layout/site-header'
import { SiteFooter } from '@/components/layout/site-footer'
import { InstallButton } from '@/components/pwa/install-button'
import { MyDataDayLogo } from '@/components/ui/mydataday-logo'
import { ArrowRight, CheckCircle, Users, Brain, Shield, Zap } from 'lucide-react'
import Link from 'next/link'
import { useEffect } from 'react'

export default function HomePage() {
  // No shimmer animation - just keep it simple

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-50 via-white to-brand-100 dark:from-brand-950 dark:via-brand-900 dark:to-brand-800">
      {/* Navigation Header */}
      <SiteHeader />

      {/* Hero Section */}
      <section className="relative overflow-hidden" style={{background: 'var(--background)'}}>
        <div className="absolute inset-0" style={{background: 'linear-gradient(to right, oklch(25% .08 240/.15), oklch(65% .18 240/.08), oklch(15% .06 240/.15))'}}></div>
        <div className="absolute inset-0" style={{background: 'radial-gradient(ellipse at center, oklch(65% .18 240/.1), transparent, transparent)'}}></div>
        <div className="relative container mx-auto px-4 py-12 md:py-16 pt-28 md:pt-36">
          <div className="text-center max-w-4xl mx-auto">
            {/* Logo and Brand Name */}
            <div className="glass-panel mb-8 mx-auto max-w-fit">
              <MyDataDayLogo
                variant="white"
                size="lg"
                logoType="logo11"
                showText={false}
              />
              <div className="border-l border-white/20 pl-6 ml-4 transition-all duration-300 ease-out">
                <h1 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold text-shimmer" id="shimmer-text">MyDataDay</h1>
              </div>
            </div>

          <h2 className="text-4xl md:text-6xl font-bold tracking-tight mb-8 text-white">
            When life gets messy,{' '}
            <br className="hidden md:block" />
            we keep you{' '}
            <span style={{color: 'oklch(65% .18 240)'}}>on track</span>.
          </h2>

          <p className="text-xl text-gray-200 mb-10 max-w-2xl mx-auto">
            One missed day doesn't have to{' '}
            <span style={{color: 'oklch(65% .18 240)'}}>derail you</span>.
            MyDataday is grounded in Kahneman's loss aversion research and behavioral science studies.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Button size="lg" asChild>
              <Link href="/auth/signup">
                Start Your Journey
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>

          <div className="text-center">
            <p className="text-sm text-gray-400 mb-2">Powered by Advanced Behavioral Science</p>
            <p className="text-xs text-gray-500 max-w-2xl mx-auto">
              Based on Kahneman's loss aversion research and social accountability studies.
            </p>
          </div>
        </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-6">The Story Behind MyDataday</h2>
          </div>

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

                <div className="bg-gradient-to-r from-slate-950 to-gray-950 rounded-lg p-8 mt-8 border border-slate-700 shadow-lg">
                  <p className="text-xl font-medium text-center text-blue-400">
                    Your goals matter and you're more likely to achieve them with a team.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Built for Real Life</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Simple, powerful tools to help you stay consistent with your goals, even when life gets complicated.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <Zap className="h-8 w-8 text-primary mb-2" />
              <CardTitle>Simple Goal Tracking</CardTitle>
              <CardDescription>
                Set your goals and track your progress with an intuitive, clean interface.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-success-500" />
                  Easy goal setup
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-success-500" />
                  Daily progress tracking
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-success-500" />
                  Visual progress charts
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Users className="h-8 w-8 text-primary mb-2" />
              <CardTitle>Stay Accountable</CardTitle>
              <CardDescription>
                Built-in accountability features to help you maintain consistency.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-success-500" />
                  Streak tracking
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-success-500" />
                  Progress insights
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-success-500" />
                  Milestone celebrations
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Shield className="h-8 w-8 text-primary mb-2" />
              <CardTitle>Never Miss a Beat</CardTitle>
              <CardDescription>
                Smart reminders and notifications keep you on track with your goals.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-success-500" />
                  Smart notifications
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-success-500" />
                  Flexible scheduling
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-success-500" />
                  Progress reminders
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Pricing Preview */}
      <section id="pricing" className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-slate-700 to-slate-900 text-white rounded-full text-sm font-medium mb-6 border border-white/20">
            BETA ACCESS - Limited Time
          </div>
          <h2 className="text-3xl font-bold mb-4">Simple, Effective Pricing</h2>
          <p className="text-muted-foreground mb-4">
            Choose the level of support that works for you
          </p>
          <div className="bg-gradient-to-r from-slate-900/30 to-gray-900/30 border border-white/20 rounded-lg p-4 max-w-2xl mx-auto">
            <p className="font-medium" style={{color: 'oklch(65% .18 240)'}}>
              🎯 <strong>Limited Early Access Rate for Mentor Referrals:</strong> Pro tier only - Get lifetime access at $65/month with a mentor code + 1 free month!
            </p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {[
            { name: 'Business', price: 'Contact for Pricing', features: ['Team goal tracking & monitoring', 'Multi-user dashboard', 'Enterprise support', 'Bulk user management'], business: true },
            { name: 'Pro', price: '$650', betaPrice: '$65', features: ['Personal goal tracking', 'Weekly planning calls', 'Advanced analytics', 'Priority support'], popular: true, beta: true },
            { name: 'Premium', price: '$1,200', features: ['Everything in Pro', 'Priority support activation', 'Custom goal strategies', 'Advanced progress coaching'] },
            { name: 'Elite', price: '$2,000', features: ['Everything in Premium', 'Weekly 1:1 coaching calls', 'Dedicated success manager', 'White-glove service'] },
          ].map((plan, index) => (
            <Card key={index} className={`${plan.popular ? 'ring-2 ring-primary' : ''}`}>
              <CardHeader>
                {plan.popular && (
                  <Badge className="w-fit mb-2">Most Popular</Badge>
                )}
                {plan.business && (
                  <Badge variant="secondary" className="w-fit mb-2">For Businesses</Badge>
                )}

                <CardTitle>{plan.name}</CardTitle>
                <div className="space-y-2">
                  <div className={`font-bold ${plan.business ? 'text-lg' : 'text-3xl'}`}>{plan.price}{!plan.business && <span className="text-sm font-normal">/month</span>}</div>
                  {plan.beta && plan.betaPrice && (
                    <div className="bg-gradient-to-r from-slate-800/50 to-gray-800/50 border border-white/20 rounded-lg p-3">
                      <div className="text-lg font-bold" style={{color: 'oklch(65% .18 240)'}}>
                        {plan.betaPrice}/month
                      </div>
                      <div className="text-xs text-green-600">
                        With mentor code + lifetime rate
                      </div>
                    </div>
                  )}
                </div>
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
            <Link href="/beta-access">
              Get Mentor Code
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
              goal achievement system.
            </p>
            <div className="flex justify-center">
              <div className="flex flex-col sm:flex-row gap-4 items-center">
                <Button size="lg" variant="secondary" asChild>
                  <Link href="/auth/signup">
                    Start Free Trial
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <InstallButton
                  variant="outline"
                  size="lg"
                  className="bg-slate-100 border-slate-300 text-slate-700 hover:bg-slate-200 hover:text-slate-800"
                >
                  Install App
                </InstallButton>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Footer */}
      <SiteFooter />
    </div>
  )
}
