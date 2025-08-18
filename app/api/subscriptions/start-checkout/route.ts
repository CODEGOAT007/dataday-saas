import { NextRequest, NextResponse } from 'next/server'
import { stripe, PRICING_TIERS } from '@/lib/stripe'
import { cookies } from 'next/headers'
import { createServerClient } from '@/lib/supabase'

// POST /api/subscriptions/start-checkout
// Body: { tierId: string, offer?: 'intro3' | 'default' }
// When offer==='intro3', we charge a one-time $3 setup/credits fee and then
// redirect to a success page that activates a 30-day trial subscription.
export async function POST(request: NextRequest) {
  try {
    if (!stripe) {
      return NextResponse.json({ error: 'Subscription system not configured' }, { status: 503 })
    }

    const { tierId, offer = 'default' } = await request.json()

    const tier = PRICING_TIERS[tierId as keyof typeof PRICING_TIERS]
    if (!tier) {
      return NextResponse.json({ error: 'Invalid pricing tier' }, { status: 400 })
    }

    // Get current user
    const cookieStore = cookies()
    const supabase = createServerClient(cookieStore)
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
    }

    // Get or create Stripe customer for this user
    let customerId: string
    const { data: profile } = await supabase
      .from('users')
      .select('stripe_customer_id')
      .eq('id', user.id)
      .single()

    if (profile?.stripe_customer_id) {
      customerId = profile.stripe_customer_id
    } else {
      const customer = await stripe.customers.create({
        email: user.email || undefined,
        metadata: { supabase_user_id: user.id },
      })
      customerId = customer.id
      await supabase.from('users').update({ stripe_customer_id: customerId }).eq('id', user.id)
    }

    // Default behavior: regular subscription checkout
    if (offer !== 'intro3') {
      const session = await stripe.checkout.sessions.create({
        customer: customerId,
        payment_method_types: ['card'],
        line_items: [{ price: tier.priceId, quantity: 1 }],
        mode: 'subscription',
        success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?subscription=success&tier=${tierId}`,
        cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/pricing?subscription=cancelled`,
        metadata: { user_id: user.id, tier_id: tierId, offer: 'default' },
        subscription_data: { metadata: { user_id: user.id, tier_id: tierId, offer: 'default' } },
        allow_promotion_codes: true,
        billing_address_collection: 'required',
      })
      return NextResponse.json({ sessionId: session.id, url: session.url })
    }

    // Intro3 behavior: one-time $3 payment and save card, then activate a 30-day trial
    const introPriceId = process.env.STRIPE_INTRO_SETUP_PRICE_ID
    if (!introPriceId) {
      return NextResponse.json({ error: 'Intro price not configured' }, { status: 503 })
    }

    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      mode: 'payment',
      payment_method_types: ['card'],
      line_items: [{ price: introPriceId, quantity: 1 }],
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/api/checkout/intro-success?tier=${tierId}&cs={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/pricing?subscription=cancelled`,
      payment_intent_data: {
        setup_future_usage: 'off_session', // Save PM for later subscription
      },
      metadata: { user_id: user.id, tier_id: tierId, offer: 'intro3' },
    })

    return NextResponse.json({ sessionId: session.id, url: session.url })
  } catch (e: any) {
    console.error('start-checkout error', e)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

