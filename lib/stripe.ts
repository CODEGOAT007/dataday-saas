import Stripe from 'stripe'

// Initialize Stripe with secret key (with fallback for development)
const stripeSecretKey = process.env.STRIPE_SECRET_KEY

if (!stripeSecretKey || stripeSecretKey.includes('placeholder')) {
  if (process.env.NODE_ENV === 'development') {
    console.log('Stripe not configured for development. Subscription features will be disabled.')
  } else {
    console.warn('STRIPE_SECRET_KEY not found. Subscription features will be disabled.')
  }
}

const stripe = (stripeSecretKey && !stripeSecretKey.includes('placeholder')) ? new Stripe(stripeSecretKey, {
  apiVersion: '2025-06-30.basil',
  typescript: true,
}) : null

export { stripe }

// Pricing tier configuration
export const PRICING_TIERS = {
  basic: {
    id: 'basic',
    name: 'Basic',
    price: 35,
    priceId: process.env.STRIPE_BASIC_PRICE_ID!,
    features: [
      'AI Progress Support Team',
      'Emergency Support Team activation (2+ days missed)',
      'Basic goal tracking',
      'Email support',
      'Mobile PWA app',
      'Milestone celebrations'
    ],
    limits: {
      goals: 3,
      emergencySupportTeamMembers: 3,
      planningCalls: 0,
      escalationDelay: 2 // days
    }
  },
  pro: {
    id: 'pro',
    name: 'Pro',
    price: 65,
    priceId: process.env.STRIPE_PRO_PRICE_ID!,
    popular: true,
    features: [
      'Everything in Basic',
      'Weekly planning calls (human Progress Support Team)',
      'Priority Emergency Support Team activation (1 day missed)',
      'Advanced analytics',
      'Goal strategy optimization',
      'Priority support'
    ],
    limits: {
      goals: 10,
      emergencySupportTeamMembers: 5,
      planningCalls: 1, // per week
      escalationDelay: 1 // days
    }
  },
  premium: {
    id: 'premium',
    name: 'Premium',
    price: 120,
    priceId: process.env.STRIPE_PREMIUM_PRICE_ID!,
    features: [
      'Everything in Pro',
      'Bi-weekly planning calls',
      'Same-day Emergency Support Team activation',
      'Custom goal strategies',
      'Advanced AI personas',
      'Personal success tracking'
    ],
    limits: {
      goals: 25,
      emergencySupportTeamMembers: 5,
      planningCalls: 2, // per week
      escalationDelay: 0 // same day
    }
  },
  elite: {
    id: 'elite',
    name: 'Elite',
    price: 200,
    priceId: process.env.STRIPE_ELITE_PRICE_ID!,
    features: [
      'Everything in Premium',
      'Weekly 1:1 coaching calls',
      'Immediate Emergency Support Team activation',
      'Personal success manager',
      'Custom AI training',
      'White-glove onboarding'
    ],
    limits: {
      goals: 'unlimited',
      emergencySupportTeamMembers: 5,
      planningCalls: 4, // per week
      escalationDelay: 0 // immediate
    }
  }
} as const

export type PricingTierId = keyof typeof PRICING_TIERS
export type PricingTier = typeof PRICING_TIERS[PricingTierId]

// Helper functions
export function getPricingTier(tierId: string): PricingTier | null {
  return PRICING_TIERS[tierId as PricingTierId] || null
}

export function getAllPricingTiers(): PricingTier[] {
  return Object.values(PRICING_TIERS)
}

export function canUserAccessFeature(userTier: string, requiredTier: PricingTierId): boolean {
  const tierOrder = ['basic', 'pro', 'premium', 'elite']
  const userTierIndex = tierOrder.indexOf(userTier)
  const requiredTierIndex = tierOrder.indexOf(requiredTier)
  
  return userTierIndex >= requiredTierIndex
}

// Stripe webhook event types we care about
export const STRIPE_WEBHOOK_EVENTS = [
  'customer.subscription.created',
  'customer.subscription.updated',
  'customer.subscription.deleted',
  'invoice.payment_succeeded',
  'invoice.payment_failed',
] as const

export type StripeWebhookEvent = typeof STRIPE_WEBHOOK_EVENTS[number]
