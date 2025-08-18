import { Metadata } from 'next'
import { PricingTiers } from '@/components/pricing/pricing-tiers'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Users, Zap, Shield, Heart } from 'lucide-react'
import Link from 'next/link'
import { OfferAwarePricingCopy } from '@/components/marketing/offer-aware-pricing-copy'

export const metadata: Metadata = {
  title: 'Pricing - MyDataday',
  description: 'Choose the perfect plan for your personal goal achievement app. From AI coaching to personal success managers.',
}

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      {/* Header */}
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center gap-4 mb-8">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/dashboard">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Link>
          </Button>
          <div className="ml-auto text-xs text-muted-foreground">
            <OfferAwarePricingCopy />
          </div>
        </div>

        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-full text-sm font-medium mb-6">
            🚀 BETA ACCESS - Limited Time
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Choose Your Success Plan
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-4">
            The only platform that activates your real-life support network for 90%+ goal achievement rates.
            Choose the level of support that matches your ambition.
          </p>
          <div className="bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-lg p-4 max-w-2xl mx-auto mb-8">
            <p className="text-green-800 font-medium">
              🎯 <strong>Beta Special:</strong> Get lifetime access at these rates with a mentor code + 1 free month to try risk-free!
            </p>
            <p className="text-sm text-green-600 mt-2">
              Pause and restart anytime. Lock in these prices forever.
            </p>
          </div>

          {/* Value Props */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 max-w-4xl mx-auto mb-12">
            <div className="flex flex-col items-center p-4">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-3">
                <Zap className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="font-semibold mb-2">AI Progress Support Team</h3>
              <p className="text-sm text-muted-foreground">Personalized coaching with 3 AI personas</p>
            </div>

            <div className="flex flex-col items-center p-4">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mb-3">
                <Users className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="font-semibold mb-2">Emergency Support Team</h3>
              <p className="text-sm text-muted-foreground">Your family & friends activated when you struggle</p>
            </div>

            <div className="flex flex-col items-center p-4">
              <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mb-3">
                <Shield className="w-6 h-6 text-orange-600" />
              </div>
              <h3 className="font-semibold mb-2">Fear of Failure</h3>
              <p className="text-sm text-muted-foreground">Social pressure that motivates, not shames</p>
            </div>

            <div className="flex flex-col items-center p-4">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-3">
                <Heart className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="font-semibold mb-2">90%+ Success Rate</h3>
              <p className="text-sm text-muted-foreground">Industry-leading goal completion rates</p>
            </div>
          </div>
        </div>

        {/* Pricing Tiers */}
        <PricingTiers />

        {/* FAQ Section */}
        <div className="mt-20 max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Frequently Asked Questions</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="font-semibold mb-2">How does the Emergency Support Team work?</h3>
              <p className="text-muted-foreground text-sm">
                You add 1-5 people (family, friends, colleagues) who care about your success. When you miss your goals,
                they receive thoughtful notifications asking them to check in with you. It's social accountability that actually works.
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-2">What's the difference between tiers?</h3>
              <p className="text-muted-foreground text-sm">
                Higher tiers get faster Emergency Support Team activation, more planning calls with human coaches,
                and advanced features. All tiers include the core AI + Emergency Support Team system.
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Can I change plans anytime?</h3>
              <p className="text-muted-foreground text-sm">
                Yes! You can upgrade or downgrade your plan at any time. Changes take effect at your next billing cycle,
                and you'll have access to new features immediately upon upgrading.
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Is there a free trial?</h3>
              <p className="text-muted-foreground text-sm">
                The Basic plan includes core features to get started. You can experience the Emergency Support Team system
                and see results before upgrading to higher tiers with human coaching.
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-2">How do planning calls work?</h3>
              <p className="text-muted-foreground text-sm">
                Pro+ tiers include weekly calls with certified Progress Support Team members who help optimize your goals,
                strategies, and Emergency Support Team setup for maximum success.
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-2">What if my Emergency Support Team doesn't respond?</h3>
              <p className="text-muted-foreground text-sm">
                Our system tracks engagement and provides alternative strategies. Higher tiers include human Progress Support Team
                intervention to ensure you always have support when you need it most.
              </p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-20 text-center">
          <div className="bg-white rounded-2xl p-8 shadow-lg max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold mb-4">Ready to achieve your goals?</h2>
            <p className="text-muted-foreground mb-6">
              Join thousands of people who've transformed their lives with social accountability.
            </p>
            <Button size="lg" asChild>
              <Link href="/dashboard">
                Get Started Today
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
