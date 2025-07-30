'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { useSubscription } from '@/hooks/use-subscription'
import { Crown, Zap, Star, AlertTriangle, Calendar, CreditCard } from 'lucide-react'
import Link from 'next/link'

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

export function SubscriptionStatus() {
  const {
    subscription,
    currentTier,
    hasActiveSubscription,
    isPastDue,
    isCancelled,
    daysUntilRenewal,
    getFeatureLimits,
    isLoading,
  } = useSubscription()

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Subscription</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!currentTier) {
    return null
  }

  const Icon = tierIcons[currentTier.id as keyof typeof tierIcons]
  const limits = getFeatureLimits()

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-full ${tierColors[currentTier.id as keyof typeof tierColors]} flex items-center justify-center`}>
              <Icon className="w-5 h-5 text-white" />
            </div>
            <div>
              <CardTitle className="flex items-center gap-2">
                {currentTier.name} Plan
                {(currentTier as any).popular && (
                  <Badge variant="secondary" className="text-xs">Popular</Badge>
                )}
              </CardTitle>
              <CardDescription>
                ${currentTier.price}/month
              </CardDescription>
            </div>
          </div>

          <div className="text-right">
            {hasActiveSubscription && (
              <Badge variant="default" className="bg-green-500">
                Active
              </Badge>
            )}
            {isPastDue && (
              <Badge variant="destructive">
                <AlertTriangle className="w-3 h-3 mr-1" />
                Past Due
              </Badge>
            )}
            {isCancelled && (
              <Badge variant="outline">
                Cancelled
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Subscription Status */}
        {hasActiveSubscription && daysUntilRenewal && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="w-4 h-4" />
            <span>
              {daysUntilRenewal > 0 
                ? `Renews in ${daysUntilRenewal} day${daysUntilRenewal > 1 ? 's' : ''}`
                : 'Renews today'
              }
            </span>
          </div>
        )}

        {isCancelled && daysUntilRenewal && (
          <div className="flex items-center gap-2 text-sm text-orange-600">
            <AlertTriangle className="w-4 h-4" />
            <span>
              Access ends in {daysUntilRenewal} day{daysUntilRenewal > 1 ? 's' : ''}
            </span>
          </div>
        )}

        {isPastDue && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center gap-2 text-red-800 mb-2">
              <CreditCard className="w-4 h-4" />
              <span className="font-medium">Payment Required</span>
            </div>
            <p className="text-sm text-red-700 mb-3">
              Your payment failed. Please update your payment method to continue using premium features.
            </p>
            <Button size="sm" variant="destructive">
              Update Payment Method
            </Button>
          </div>
        )}

        {/* Feature Limits */}
        <div className="space-y-4">
          <h4 className="font-medium">Plan Features</h4>
          
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <div className="text-muted-foreground">Goals</div>
              <div className="font-medium">
                {typeof limits.goals === 'string' ? limits.goals : limits.goals}
              </div>
            </div>
            
            <div>
              <div className="text-muted-foreground">Emergency Support Team</div>
              <div className="font-medium">{limits.emergencySupportTeamMembers} people</div>
            </div>
            
            <div>
              <div className="text-muted-foreground">Planning Calls</div>
              <div className="font-medium">
                {limits.planningCalls === 0 ? 'None' : `${limits.planningCalls}/week`}
              </div>
            </div>
            
            <div>
              <div className="text-muted-foreground">Escalation Speed</div>
              <div className="font-medium">
                {limits.escalationDelay === 0 ? 'Immediate' : `${limits.escalationDelay} day${limits.escalationDelay > 1 ? 's' : ''}`}
              </div>
            </div>
          </div>
        </div>

        {/* Key Features */}
        <div className="space-y-2">
          <h4 className="font-medium">Included Features</h4>
          <ul className="text-sm text-muted-foreground space-y-1">
            {currentTier.features.slice(0, 3).map((feature, index) => (
              <li key={index} className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                {feature}
              </li>
            ))}
            {currentTier.features.length > 3 && (
              <li className="text-xs">
                +{currentTier.features.length - 3} more features
              </li>
            )}
          </ul>
        </div>

        {/* Actions */}
        <div className="flex gap-2 pt-4 border-t">
          <Button variant="outline" size="sm" asChild className="flex-1">
            <Link href="/pricing">
              {currentTier.id === 'basic' ? 'Upgrade Plan' : 'Change Plan'}
            </Link>
          </Button>
          
          {hasActiveSubscription && (
            <Button variant="ghost" size="sm">
              Manage Billing
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
