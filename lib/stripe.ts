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

// Pricing tier types
interface BasePricingTier {
  id: string
  name: string
  price: number
  priceId: string
  features: string[]
  limits: {
    goals: number | string
    emergencySupportTeamMembers: number
    planningCalls: number
    escalationDelay: number
  }
  hidden?: boolean
  popular?: boolean
}

interface BetaPricingTier extends BasePricingTier {
  betaPrice: number
  betaPriceId: string
}

// Pricing tier configuration
export const PRICING_TIERS = {
  essential: {
    id: 'essential',
    name: 'Essential',
    price: 350,
    priceId: process.env.STRIPE_ESSENTIAL_PRICE_ID!,
    hidden: true, // Hidden tier for mentor conversion tool
    features: [
      'Goal tracking & progress monitoring',
      'Support team activation (2+ days missed)',
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
  basic: {
    id: 'basic',
    name: 'Basic',
    price: 350, // Beta public price
    betaPrice: 35, // Mentor code price
    priceId: process.env.STRIPE_BASIC_PRICE_ID!,
    betaPriceId: process.env.STRIPE_BASIC_BETA_PRICE_ID!,
    features: [
      'Goal tracking & progress monitoring',
      'Support team activation (2+ days missed)',
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
    price: 650, // Beta public price
    betaPrice: 65, // Mentor code price
    priceId: process.env.STRIPE_PRO_PRICE_ID!,
    betaPriceId: process.env.STRIPE_PRO_BETA_PRICE_ID!,
    popular: true,
    features: [
      'Everything in Basic',
      'Weekly planning calls',
      'Priority support team activation (1 day missed)',
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
    price: 1200, // Beta public price
    betaPrice: 120, // Mentor code price
    priceId: process.env.STRIPE_PREMIUM_PRICE_ID!,
    betaPriceId: process.env.STRIPE_PREMIUM_BETA_PRICE_ID!,
    features: [
      'Everything in Pro',
      'Bi-weekly planning calls',
      'Same-day support team activation',
      'Custom goal strategies',
      'Advanced coaching features',
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
    price: 2000, // Beta public price
    betaPrice: 200, // Mentor code price
    priceId: process.env.STRIPE_ELITE_PRICE_ID!,
    betaPriceId: process.env.STRIPE_ELITE_BETA_PRICE_ID!,
    features: [
      'Everything in Premium',
      'Weekly 1:1 coaching calls',
      'Immediate support team activation',
      'Personal success manager',
      'Custom coaching strategies',
      'White-glove onboarding'
    ],
    limits: {
      goals: 'unlimited',
      emergencySupportTeamMembers: 5,
      planningCalls: 4, // per week
      escalationDelay: 0 // immediate
    }
  }
}

export type PricingTierId = keyof typeof PRICING_TIERS
export type PricingTier = BasePricingTier | BetaPricingTier

// Helper functions
export function getPricingTier(tierId: string): PricingTier | null {
  return PRICING_TIERS[tierId as PricingTierId] || null
}

export function getAllPricingTiers(includeHidden = false): PricingTier[] {
  const tiers = Object.values(PRICING_TIERS) as PricingTier[]
  return includeHidden ? tiers : tiers.filter(tier => (tier as any).hidden !== true)
}

export function getPublicPricingTiers(): PricingTier[] {
  return getAllPricingTiers(false)
}

export function getHiddenTiers(): PricingTier[] {
  return (Object.values(PRICING_TIERS) as PricingTier[]).filter(tier => (tier as any).hidden === true)
}

export function getPriceForTier(tierId: string, isBeta = false): number {
  const tier = getPricingTier(tierId)
  if (!tier) return 0

  if (isBeta && 'betaPrice' in tier) {
    return tier.betaPrice
  }
  return tier.price
}

export function getPriceIdForTier(tierId: string, isBeta = false): string | null {
  const tier = getPricingTier(tierId)
  if (!tier) return null

  if (isBeta && 'betaPriceId' in tier) {
    return tier.betaPriceId
  }
  return tier.priceId
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
