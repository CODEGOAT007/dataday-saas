import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { cookies } from 'next/headers'
import { createServerClient } from '@/lib/supabase'

// GET /api/checkout/intro-success?tier=pro&cs=cs_test_...
// Creates a 30-day trial subscription after the $3 intro payment succeeds.
export async function GET(request: NextRequest) {
  try {
    if (!stripe) {
      return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/pricing?error=stripe_not_configured`)
    }

    const { searchParams } = new URL(request.url)
    const tier = searchParams.get('tier')
    const cs = searchParams.get('cs') // Checkout Session ID

    if (!tier || !cs) {
      return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/pricing?error=missing_params`)
    }

    const cookieStore = cookies()
    const supabase = createServerClient(cookieStore)
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/auth/login`)
    }

    // Retrieve the checkout session
    const session = await stripe.checkout.sessions.retrieve(cs)
    const customerId = (session.customer as string)
    if (!customerId) {
      return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/pricing?error=no_customer`)
    }

    // Create subscription with 30-day trial; PM already saved by checkout
    const trialEnd = Math.floor((Date.now() + 30 * 24 * 60 * 60 * 1000) / 1000)
    const priceId = process.env[`STRIPE_${tier.toUpperCase()}_PRICE_ID`] as string

    await stripe.subscriptions.create({
      customer: customerId,
      items: [{ price: priceId }],
      trial_end: trialEnd,
      metadata: { user_id: user.id, tier_id: tier, offer: 'intro3' },
    })

    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/dashboard?subscription=success&tier=${tier}`)
  } catch (e) {
    console.error('intro-success error', e)
    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/pricing?subscription=failed`)
  }
}

