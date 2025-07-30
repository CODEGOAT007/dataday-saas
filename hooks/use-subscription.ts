'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useAuth } from './use-auth'
import { createClient } from '@/lib/supabase-client'
import { PRICING_TIERS, getPricingTier, canUserAccessFeature, type PricingTierId } from '@/lib/stripe'
import type { User } from '@/types'

const supabase = createClient()

// Reason: Custom hook for subscription management with TanStack Query
export function useSubscription() {
  const { user } = useAuth()
  const queryClient = useQueryClient()

  // Reason: Check if Stripe is configured
  const isStripeConfigured = !!process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY

  // Reason: Query for current user subscription details
  const {
    data: subscription,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['subscription', user?.id],
    queryFn: async () => {
      if (!user) return null

      // If Stripe is not configured, return demo subscription
      if (!isStripeConfigured) {
        return {
          tier: 'basic',
          status: 'active',
          currentPeriodEnd: null,
          stripeCustomerId: null,
          stripeSubscriptionId: null,
        }
      }

      const { data, error } = await supabase
        .from('users')
        .select('subscription_tier, subscription_status, subscription_current_period_end, stripe_customer_id, stripe_subscription_id')
        .eq('id', user.id)
        .single()

      if (error) throw error

      return {
        tier: data.subscription_tier || 'basic',
        status: data.subscription_status,
        currentPeriodEnd: data.subscription_current_period_end,
        stripeCustomerId: data.stripe_customer_id,
        stripeSubscriptionId: data.stripe_subscription_id,
      }
    },
    enabled: !!user,
    staleTime: 1000 * 60 * 5, // 5 minutes
  })

  // Reason: Get current pricing tier details
  const currentTier = subscription?.tier ? getPricingTier(subscription.tier) : getPricingTier('basic')

  // Reason: Check if user can access a specific feature
  const canAccess = (requiredTier: PricingTierId): boolean => {
    if (!subscription?.tier) return false
    return canUserAccessFeature(subscription.tier, requiredTier)
  }

  // Reason: Check if user has active subscription
  const hasActiveSubscription = subscription?.status === 'active'

  // Reason: Check if subscription is past due
  const isPastDue = subscription?.status === 'past_due'

  // Reason: Check if subscription is cancelled
  const isCancelled = subscription?.status === 'cancelled'

  // Reason: Get days until subscription ends
  const daysUntilRenewal = subscription?.currentPeriodEnd 
    ? Math.ceil((new Date(subscription.currentPeriodEnd).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
    : null

  // Reason: Mutation to create checkout session
  const createCheckoutMutation = useMutation({
    mutationFn: async ({ tierId }: { tierId: PricingTierId }) => {
      if (!isStripeConfigured) {
        throw new Error('Subscription system not configured')
      }

      const tier = PRICING_TIERS[tierId]

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

      return response.json()
    },
    onSuccess: (data) => {
      // Redirect to Stripe checkout
      window.location.href = data.url
    },
  })

  // Reason: Mutation to manage subscription (cancel, reactivate, etc.)
  const manageSubscriptionMutation = useMutation({
    mutationFn: async ({ action }: { action: 'cancel' | 'reactivate' }) => {
      const response = await fetch('/api/subscriptions/manage', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ action }),
      })

      if (!response.ok) {
        throw new Error(`Failed to ${action} subscription`)
      }

      return response.json()
    },
    onSuccess: () => {
      // Refresh subscription data
      queryClient.invalidateQueries({ queryKey: ['subscription', user?.id] })
    },
  })

  // Reason: Function to upgrade to a specific tier
  const upgradeTo = (tierId: PricingTierId) => {
    createCheckoutMutation.mutate({ tierId })
  }

  // Reason: Function to cancel subscription
  const cancelSubscription = () => {
    manageSubscriptionMutation.mutate({ action: 'cancel' })
  }

  // Reason: Function to reactivate subscription
  const reactivateSubscription = () => {
    manageSubscriptionMutation.mutate({ action: 'reactivate' })
  }

  // Reason: Get feature limits for current tier
  const getFeatureLimits = () => {
    return currentTier?.limits || PRICING_TIERS.basic.limits
  }

  // Reason: Check if user has reached a specific limit
  const hasReachedLimit = (feature: keyof typeof PRICING_TIERS.basic.limits, currentUsage: number): boolean => {
    const limits = getFeatureLimits()
    const limit = limits[feature]
    
    if (typeof limit === 'string' && limit === 'unlimited') return false
    if (typeof limit === 'number') return currentUsage >= limit
    
    return false
  }

  return {
    // Data
    subscription,
    currentTier,
    isLoading,
    error,

    // Status checks
    hasActiveSubscription,
    isPastDue,
    isCancelled,
    daysUntilRenewal,

    // Feature access
    canAccess,
    getFeatureLimits,
    hasReachedLimit,

    // Actions
    upgradeTo,
    cancelSubscription,
    reactivateSubscription,

    // Loading states
    isUpgrading: createCheckoutMutation.isPending,
    isManaging: manageSubscriptionMutation.isPending,
  }
}

// Reason: Hook for checking specific feature access
export function useFeatureAccess(requiredTier: PricingTierId) {
  const { canAccess, isLoading } = useSubscription()
  
  return {
    hasAccess: canAccess(requiredTier),
    isLoading,
  }
}

// Reason: Hook for getting feature limits
export function useFeatureLimits() {
  const { getFeatureLimits, hasReachedLimit, currentTier } = useSubscription()
  
  return {
    limits: getFeatureLimits(),
    hasReachedLimit,
    tierName: currentTier?.name || 'Basic',
  }
}
