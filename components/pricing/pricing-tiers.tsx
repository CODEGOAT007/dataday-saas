'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Check, Zap, Crown, Star } from 'lucide-react'
import { PRICING_TIERS, type PricingTierId } from '@/lib/stripe'
import { useAuth } from '@/hooks/use-auth'
import { toast } from 'sonner'

interface PricingTiersProps {
  currentTier?: string
  onSelectTier?: (tierId: PricingTierId) => void
}

const tierIcons = {
  basic: Zap,
  pro: Star,
  premium: Crown,
  elite: Crown
}

const tierColors = {
  basic: 'bg-blue-500',
  pro: 'bg-purple-500',
  premium: 'bg-orange-500',
  elite: 'bg-gradient-to-r from-yellow-400 to-orange-500'
}

export function PricingTiers({ currentTier, onSelectTier }: PricingTiersProps) {
  const { user } = useAuth()
  const [loading, setLoading] = useState<string | null>(null)
  const isStripeConfigured = !!process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY

  const handleSelectTier = async (tierId: PricingTierId) => {
    if (!user) {
      toast.error('Please sign in to subscribe')
      return
    }

    if (currentTier === tierId) {
      toast.info('You are already on this plan')
      return
    }

    // Check if Stripe is configured
    if (!process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY) {
      toast.error('Subscription system is not configured. Please contact support.')
      return
    }

    setLoading(tierId)

    try {
      const tier = PRICING_TIERS[tierId]
      
      // Create Stripe checkout session
      const response = await fetch('/api/subscriptions/create-checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          priceId: tier.priceId,
          tierId: tierId,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to create checkout session')
      }

      const { url } = await response.json()
      
      // Redirect to Stripe checkout
      window.location.href = url

    } catch (error) {
      console.error('Error creating checkout session:', error)
      toast.error('Failed to start checkout process')
    } finally {
      setLoading(null)
    }

    if (onSelectTier) {
      onSelectTier(tierId)
    }
  }

  return (
    <div className="max-w-7xl mx-auto">
      {/* Demo Mode Banner */}
      {!isStripeConfigured && (
        <div className="mb-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-center gap-2 text-blue-800 mb-2">
            <Zap className="w-4 h-4" />
            <span className="font-medium">Demo Mode</span>
          </div>
          <p className="text-sm text-blue-700">
            Subscription system is in demo mode. All features are available for testing.
            Contact support to enable live payments.
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {Object.entries(PRICING_TIERS).map(([tierId, tier]) => {
        const Icon = tierIcons[tierId as PricingTierId]
        const isCurrentTier = currentTier === tierId
        const isPopular = (tier as any).popular
        const isLoading = loading === tierId

        return (
          <Card 
            key={tierId} 
            className={`relative ${isPopular ? 'border-purple-500 shadow-lg scale-105' : ''} ${isCurrentTier ? 'ring-2 ring-green-500' : ''}`}
          >
            {isPopular && (
              <Badge className="absolute -top-2 left-1/2 transform -translate-x-1/2 bg-purple-500">
                Most Popular
              </Badge>
            )}
            
            {isCurrentTier && (
              <Badge className="absolute -top-2 right-4 bg-green-500">
                Current Plan
              </Badge>
            )}

            <CardHeader className="text-center">
              <div className={`w-12 h-12 rounded-full ${tierColors[tierId as PricingTierId]} flex items-center justify-center mx-auto mb-4`}>
                <Icon className="w-6 h-6 text-white" />
              </div>
              
              <CardTitle className="text-2xl">{tier.name}</CardTitle>
              
              <div className="text-3xl font-bold">
                ${tier.price}
                <span className="text-sm font-normal text-muted-foreground">/month</span>
              </div>
              
              <CardDescription>
                {tierId === 'basic' && 'Perfect for getting started with goal achievement'}
                {tierId === 'pro' && 'Ideal for serious goal achievers who want human support'}
                {tierId === 'premium' && 'Advanced features for ambitious individuals'}
                {tierId === 'elite' && 'White-glove service for ultimate success'}
              </CardDescription>
            </CardHeader>

            <CardContent>
              <ul className="space-y-3">
                {tier.features.map((feature, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-sm">{feature}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-6 pt-4 border-t">
                <div className="text-sm text-muted-foreground space-y-1">
                  <div>Goals: {typeof tier.limits.goals === 'number' ? tier.limits.goals : tier.limits.goals}</div>
                  <div>Emergency Support Team: {tier.limits.emergencySupportTeamMembers} people</div>
                  <div>Planning Calls: {tier.limits.planningCalls}/week</div>
                  <div>Escalation: {tier.limits.escalationDelay === 0 ? 'Immediate' : `${tier.limits.escalationDelay} day${tier.limits.escalationDelay > 1 ? 's' : ''}`}</div>
                </div>
              </div>
            </CardContent>

            <CardFooter>
              <Button
                className="w-full"
                variant={isCurrentTier ? 'outline' : (isPopular ? 'default' : 'outline')}
                onClick={() => handleSelectTier(tierId as PricingTierId)}
                disabled={isCurrentTier || isLoading}
              >
                {isLoading ? 'Processing...' : isCurrentTier ? 'Current Plan' : !isStripeConfigured ? 'Demo Mode' : `Choose ${tier.name}`}
              </Button>
            </CardFooter>
          </Card>
        )
      })}
      </div>
    </div>
  )
}
