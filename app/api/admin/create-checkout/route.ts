import { NextRequest, NextResponse } from 'next/server'
import { stripe, getPriceIdForTier } from '@/lib/stripe'
import { cookies } from 'next/headers'
import { createServiceRoleClient } from '@/lib/supabase'

// POST /api/admin/create-checkout
// Body: { userId: string, tierId: string, beta?: boolean }
export async function POST(request: NextRequest) {
  try {
    if (!stripe) {
      return NextResponse.json({ error: 'Stripe not configured' }, { status: 503 })
    }

    // Admin auth via cookie
    const cookieStore = cookies()
    const adminSessionCookie = cookieStore.get('admin_session')
    if (!adminSessionCookie) {
      return NextResponse.json({ error: 'Admin authentication required' }, { status: 401 })
    }

    const { userId, tierId, beta = false } = await request.json()
    if (!userId || !tierId) {
      return NextResponse.json({ error: 'userId and tierId required' }, { status: 400 })
    }

    const supabase = createServiceRoleClient()

    // Fetch user profile
    const { data: profile, error: profileError } = await supabase
      .from('users')
      .select('id, email, stripe_customer_id')
      .eq('id', userId)
      .single()

    if (profileError || !profile) {
      return NextResponse.json({ error: 'User profile not found' }, { status: 404 })
    }

    // Get or create Stripe customer
    let customerId = profile.stripe_customer_id as string | null
    if (!customerId) {
      const customer = await stripe.customers.create({
        email: profile.email || undefined,
        metadata: { supabase_user_id: profile.id },
      })
      customerId = customer.id
      await supabase.from('users').update({ stripe_customer_id: customerId }).eq('id', profile.id)
    }

    // Resolve priceId
    const priceId = getPriceIdForTier(tierId, beta)
    if (!priceId) {
      return NextResponse.json({ error: 'Invalid tier or price not configured' }, { status: 400 })
    }

    // Create Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      payment_method_types: ['card'],
      line_items: [{ price: priceId, quantity: 1 }],
      mode: 'subscription',
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?subscription=success&tier=${tierId}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/pricing?subscription=cancelled`,
      metadata: { user_id: profile.id, tier_id: tierId },
      subscription_data: { metadata: { user_id: profile.id, tier_id: tierId } },
      allow_promotion_codes: true,
      billing_address_collection: 'required',
    })

    return NextResponse.json({ url: session.url, sessionId: session.id })
  } catch (error) {
    console.error('Admin create checkout error:', error)
    return NextResponse.json({ error: 'Failed to create checkout session' }, { status: 500 })
  }
}

