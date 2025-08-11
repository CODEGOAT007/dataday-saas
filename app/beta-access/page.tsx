'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Check, Zap, Star, Crown, ArrowLeft, Gift } from 'lucide-react'
import { getPublicPricingTiers, getPriceForTier } from '@/lib/stripe'
import { toast } from 'sonner'
import Link from 'next/link'

export default function BetaAccessPage() {
  const [mentorCode, setMentorCode] = useState('')
  const [isValidCode, setIsValidCode] = useState(false)
  const [loading, setLoading] = useState(false)

  const validateMentorCode = async () => {
    if (!mentorCode.trim()) {
      toast.error('Please enter a mentor code')
      return
    }

    setLoading(true)
    
    // Simulate validation - in real app, this would call an API
    setTimeout(() => {
      // For demo, accept any code that contains "MENTOR" or "BETA"
      const validCodes = ['MENTOR2024', 'BETA', 'COACH', 'MENTOR', 'LIFETIME']
      const isValid = validCodes.some(code => mentorCode.toUpperCase().includes(code.toUpperCase()))
      
      setIsValidCode(isValid)
      setLoading(false)
      
      if (isValid) {
        toast.success('🎉 Valid mentor code! You now have access to lifetime beta pricing.')
      } else {
        toast.error('Invalid mentor code. Please check with your mentor.')
      }
    }, 1000)
  }

  const tiers = getPublicPricingTiers()
  const tierIcons = {
    basic: Zap,
    pro: Star,
    premium: Crown,
    elite: Crown
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/pricing">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Pricing
            </Link>
          </Button>
        </div>

        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-full text-sm font-medium mb-6">
            🚀 EXCLUSIVE BETA ACCESS
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Back to Pricing
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
            Enter your mentor code to access exclusive lifetime rates + 1 free month to try risk-free.
          </p>
        </div>

        {/* Mentor Code Input */}
        <div className="max-w-md mx-auto mb-12">
          <Card>
            <CardHeader className="text-center">
              <CardTitle className="flex items-center justify-center gap-2">
                <Gift className="w-5 h-5 text-purple-600" />
                Enter Mentor Code
              </CardTitle>
              <CardDescription>
                Get this code from your mentor or coach
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="mentorCode">Mentor Code</Label>
                <Input
                  id="mentorCode"
                  placeholder="Enter your mentor code"
                  value={mentorCode}
                  onChange={(e) => setMentorCode(e.target.value)}
                  className="text-center font-mono"
                />
              </div>
              <Button 
                onClick={validateMentorCode}
                disabled={loading || !mentorCode.trim()}
                className="w-full"
              >
                {loading ? 'Validating...' : 'Unlock Beta Access'}
              </Button>
              
              {isValidCode && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
                  <div className="text-green-800 font-medium mb-2">
                    ✅ Code Validated!
                  </div>
                  <div className="text-sm text-green-600">
                    You now have access to lifetime beta pricing below
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Beta Pricing Tiers */}
        {isValidCode && (
          <div className="space-y-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold mb-4">Your Exclusive Beta Rates</h2>
              <div className="bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-lg p-4 max-w-2xl mx-auto">
                <p className="text-green-800 font-medium">
                  🎯 <strong>Lifetime Guarantee:</strong> These rates are locked in forever. Pause and restart anytime.
                </p>
                <p className="text-sm text-green-600 mt-2">
                  + 1 FREE MONTH to try risk-free!
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {tiers.map((tier) => {
                const Icon = tierIcons[tier.id as keyof typeof tierIcons]
                const isPopular = 'popular' in tier && tier.popular
                const originalPrice = tier.price
                const betaPrice = 'betaPrice' in tier ? tier.betaPrice : tier.price

                return (
                  <Card key={tier.id} className={`relative ${isPopular ? 'ring-2 ring-purple-500' : ''}`}>
                    {isPopular && (
                      <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-purple-500">
                        Most Popular
                      </Badge>
                    )}
                    
                    <CardHeader className="text-center">
                      <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      
                      <CardTitle className="text-2xl">{tier.name}</CardTitle>
                      
                      <div className="space-y-2">
                        <div className="text-lg text-gray-500 line-through">
                          ${originalPrice}/month
                        </div>
                        <div className="text-3xl font-bold text-green-600">
                          ${betaPrice}/month
                        </div>
                        <div className="text-sm text-green-600 font-medium">
                          LIFETIME RATE + 1 FREE MONTH
                        </div>
                      </div>
                    </CardHeader>

                    <CardContent>
                      <div className="space-y-3">
                        {tier.features.map((feature, index) => (
                          <div key={index} className="flex items-start gap-2">
                            <Check className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                            <span className="text-sm">{feature}</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>

                    <div className="p-6 pt-0">
                      <Button className="w-full" variant={isPopular ? 'default' : 'outline'}>
                        Start Free Month
                      </Button>
                    </div>
                  </Card>
                )
              })}
            </div>

            <div className="text-center">
              <p className="text-sm text-muted-foreground">
                Questions about your mentor code? Contact your mentor or{' '}
                <Link href="/contact" className="text-purple-600 hover:underline">
                  reach out to support
                </Link>
              </p>
            </div>
          </div>
        )}

        {/* Call to Action for Non-Validated */}
        {!isValidCode && (
          <div className="text-center">
            <Card className="max-w-lg mx-auto">
              <CardContent className="p-8">
                <h3 className="text-xl font-semibold mb-4">Don't have a mentor code?</h3>
                <p className="text-muted-foreground mb-6">
                  Connect with one of our certified mentors to get your exclusive access code and personalized guidance.
                </p>
                <Button asChild>
                  <Link href="/contact">
                    Find a Mentor
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}
