'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Check, Zap, Users, Gift, Key, AlertCircle } from 'lucide-react'
import { PRICING_TIERS, getHiddenTiers } from '@/lib/stripe'
import { toast } from 'sonner'

export default function MentorPage() {
  const [mentorPassword, setMentorPassword] = useState('')
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loading, setLoading] = useState(false)

  const authenticateMentor = () => {
    if (!mentorPassword.trim()) {
      toast.error('Please enter the mentor password')
      return
    }

    setLoading(true)
    
    // Simple password check - in production, this would be more secure
    setTimeout(() => {
      const validPasswords = ['MENTOR2024', 'COACH', 'DATADAY']
      const isValid = validPasswords.includes(mentorPassword.toUpperCase())
      
      setIsAuthenticated(isValid)
      setLoading(false)
      
      if (isValid) {
        toast.success('🎉 Welcome, Mentor! Access granted.')
      } else {
        toast.error('Invalid mentor password.')
      }
    }, 1000)
  }

  const hiddenTiers = getHiddenTiers()
  const publicTiers = Object.values(PRICING_TIERS).filter(tier => !(tier as any).hidden)

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="flex items-center justify-center gap-2">
              <Key className="w-5 h-5 text-purple-600" />
              Mentor Access
            </CardTitle>
            <CardDescription>
              Enter your mentor credentials to access the dashboard
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="password">Mentor Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter mentor password"
                value={mentorPassword}
                onChange={(e) => setMentorPassword(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && authenticateMentor()}
              />
            </div>
            <Button 
              onClick={authenticateMentor}
              disabled={loading || !mentorPassword.trim()}
              className="w-full"
            >
              {loading ? 'Authenticating...' : 'Access Dashboard'}
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4">Mentor Dashboard</h1>
          <p className="text-xl text-muted-foreground">
            Tools to help your mentees succeed with MyDataday
          </p>
        </div>

        <Tabs defaultValue="codes" className="space-y-8">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="codes">Beta Codes</TabsTrigger>
            <TabsTrigger value="conversion">Conversion Tool</TabsTrigger>
            <TabsTrigger value="pricing">All Pricing</TabsTrigger>
          </TabsList>

          {/* Beta Codes Tab */}
          <TabsContent value="codes" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Gift className="w-5 h-5" />
                  Beta Access Codes
                </CardTitle>
                <CardDescription>
                  Share these codes with your mentees for lifetime beta pricing
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {['MENTOR2024', 'BETA', 'COACH', 'MENTOR', 'LIFETIME'].map((code) => (
                    <div key={code} className="bg-gray-50 border rounded-lg p-4 text-center">
                      <div className="font-mono text-lg font-bold text-purple-600 mb-2">
                        {code}
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          navigator.clipboard.writeText(code)
                          toast.success('Code copied to clipboard!')
                        }}
                      >
                        Copy Code
                      </Button>
                    </div>
                  ))}
                </div>
                
                <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="font-semibold text-blue-800 mb-2">How to use:</h4>
                  <ol className="text-sm text-blue-700 space-y-1">
                    <li>1. Send mentee to: <code className="bg-blue-100 px-2 py-1 rounded">mydataday.app/beta-access</code></li>
                    <li>2. They enter any of the codes above</li>
                    <li>3. They get lifetime access to beta rates + 1 free month</li>
                    <li>4. They can pause/restart anytime at the same rate</li>
                  </ol>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Conversion Tool Tab */}
          <TabsContent value="conversion" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 text-orange-500" />
                  Conversion Tool - Essential Tier
                </CardTitle>
                <CardDescription>
                  Hidden tier for mentees who are about to quit or need extra help converting
                </CardDescription>
              </CardHeader>
              <CardContent>
                {hiddenTiers.map((tier) => (
                  <div key={tier.id} className="border rounded-lg p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h3 className="text-xl font-semibold">{tier.name}</h3>
                        <p className="text-muted-foreground">For at-risk mentees</p>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold">${tier.price}/month</div>
                        <Badge variant="secondary">Hidden Tier</Badge>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-semibold mb-3">Features:</h4>
                        <div className="space-y-2">
                          {tier.features.map((feature, index) => (
                            <div key={index} className="flex items-start gap-2">
                              <Check className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                              <span className="text-sm">{feature}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="font-semibold mb-3">When to use:</h4>
                        <ul className="text-sm text-muted-foreground space-y-1">
                          <li>• Mentee is about to quit</li>
                          <li>• Price sensitivity issues</li>
                          <li>• Needs basic features only</li>
                          <li>• Conversion from free trial</li>
                        </ul>
                      </div>
                    </div>
                    
                    <div className="mt-6 bg-orange-50 border border-orange-200 rounded-lg p-4">
                      <p className="text-orange-800 text-sm">
                        <strong>Note:</strong> This tier is not advertised publicly. Use it strategically for retention and conversion.
                      </p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          {/* All Pricing Tab */}
          <TabsContent value="pricing" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Object.values(PRICING_TIERS).map((tier) => (
                <Card key={tier.id} className={(tier as any).hidden ? 'border-orange-300 bg-orange-50' : ''}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle>{tier.name}</CardTitle>
                      {(tier as any).hidden && <Badge variant="secondary">Hidden</Badge>}
                      {'popular' in tier && tier.popular && <Badge>Popular</Badge>}
                    </div>
                    <div className="space-y-2">
                      <div className="text-2xl font-bold">
                        ${tier.price}/month
                      </div>
                      {'betaPrice' in tier && (
                        <div className="text-lg text-green-600 font-semibold">
                          Beta: ${tier.betaPrice}/month
                        </div>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {tier.features.slice(0, 3).map((feature, index) => (
                        <div key={index} className="flex items-start gap-2">
                          <Check className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                          <span className="text-sm">{feature}</span>
                        </div>
                      ))}
                      {tier.features.length > 3 && (
                        <div className="text-sm text-muted-foreground">
                          +{tier.features.length - 3} more features
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
