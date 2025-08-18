import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { stripe } from '@/lib/stripe'

// GET /api/admin/stripe/create-intro-price
// Requires admin_session cookie. Creates/fetches a one-time $3 price for the intro flow.
export async function GET(_request: NextRequest) {
  try {
    const cookieStore = cookies()
    const adminSessionCookie = cookieStore.get('admin_session')
    if (!adminSessionCookie) {
      return NextResponse.json({ error: 'Admin authentication required' }, { status: 401 })
    }

    if (!stripe) {
      return NextResponse.json({ error: 'Stripe not configured' }, { status: 503 })
    }

    // Try to find existing product by name
    const targetName = 'Intro Setup + Credits ($3)'
    const products = await stripe.products.list({ limit: 100, active: true })
    let product = products.data.find(p => p.name === targetName) || null

    if (!product) {
      product = await stripe.products.create({
        name: targetName,
        type: 'service',
        active: true,
        metadata: { purpose: 'intro3_setup', amount: '300' }
      })
    }

    // Try to find an active one-time $3 USD price for this product
    const prices = await stripe.prices.list({ product: product.id, active: true, limit: 100 })
    let price = prices.data.find(pr => pr.currency === 'usd' && pr.unit_amount === 300 && !pr.recurring) || null

    if (!price) {
      price = await stripe.prices.create({
        product: product.id,
        currency: 'usd',
        unit_amount: 300,
        nickname: 'Intro $3 (one-time)',
      })
    }

    return NextResponse.json({ success: true, productId: product.id, priceId: price.id })
  } catch (e: any) {
    console.error('create-intro-price error', e)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

