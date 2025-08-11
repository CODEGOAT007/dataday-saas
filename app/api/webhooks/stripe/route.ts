import { NextRequest, NextResponse } from 'next/server'
import { headers } from 'next/headers'
import { stripe, STRIPE_WEBHOOK_EVENTS } from '@/lib/stripe'
import { createServerClient, createServiceRoleClient } from '@/lib/supabase'
import { cookies } from 'next/headers'
import Stripe from 'stripe'

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!

export async function POST(request: NextRequest) {
  try {
    // Check if Stripe is configured
    if (!stripe) {
      return NextResponse.json(
        { error: 'Stripe not configured' },
        { status: 503 }
      )
    }

    const body = await request.text()
    const headersList = headers()
    const signature = headersList.get('stripe-signature')!

    let event: Stripe.Event

    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
    } catch (err) {
      console.error('Webhook signature verification failed:', err)
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 400 }
      )
    }

    // Handle the event
    switch (event.type) {
      case 'customer.subscription.created':
      case 'customer.subscription.updated':
        await handleSubscriptionChange(event.data.object as Stripe.Subscription)
        break

      case 'customer.subscription.deleted':
        await handleSubscriptionCancellation(event.data.object as Stripe.Subscription)
        break

      case 'invoice.payment_succeeded':
        await handlePaymentSucceeded(event.data.object as Stripe.Invoice)
        break

      case 'invoice.payment_failed':
        await handlePaymentFailed(event.data.object as Stripe.Invoice)
        break

      default:
        console.log(`Unhandled event type: ${event.type}`)
    }

    return NextResponse.json({ received: true })

  } catch (error) {
    console.error('Webhook error:', error)
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500 }
    )
  }
}

async function handleSubscriptionChange(subscription: Stripe.Subscription) {
  const userId = subscription.metadata.user_id
  const tierId = subscription.metadata.tier_id

  if (!userId) {
    console.error('No user_id in subscription metadata')
    return
  }

  // Create a server client (note: webhooks don't have user context)
  const cookieStore = cookies()
  // Use service role client for webhook DB updates (no user context)
  const supabase = createServiceRoleClient()

  // Update user subscription in database
  const { error } = await supabase
    .from('users')
    .update({
      subscription_tier: tierId,
      subscription_status: subscription.status,
      stripe_subscription_id: subscription.id,
      subscription_current_period_end: new Date((subscription as any).current_period_end * 1000).toISOString(),
      updated_at: new Date().toISOString(),
    })
    .eq('id', userId)

  if (error) {
    console.error('Error updating user subscription:', error)
  } else {
    console.log(`Updated subscription for user ${userId} to tier ${tierId}`)
  }

  // Attempt to mark related lead as card_on_file if they were payment_pending
  try {
    const { data: lead } = await supabase
      .from('leads')
      .select('id')
      .eq('converted_user_id', userId)
      .eq('lead_status', 'payment_pending')
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle()

    if (lead?.id) {
      await supabase
        .from('leads')
        .update({ lead_status: 'card_on_file', updated_at: new Date().toISOString(), converted_at: new Date().toISOString() })
        .eq('id', lead.id)
      console.log(`Lead ${lead.id} marked as card_on_file via webhook`)
    }
  } catch (err) {
    console.error('Error updating lead from webhook:', err)
  }

}

async function handleSubscriptionCancellation(subscription: Stripe.Subscription) {
  const userId = subscription.metadata.user_id

  if (!userId) {
    console.error('No user_id in subscription metadata')
    return
  }

  const cookieStore = cookies()
  const supabase = createServiceRoleClient()

  // Update user to basic tier (free tier)
  const { error } = await supabase
    .from('users')
    .update({
      subscription_tier: 'basic',
      subscription_status: 'cancelled',
      stripe_subscription_id: null,
      subscription_current_period_end: null,
      updated_at: new Date().toISOString(),
    })
    .eq('id', userId)

  if (error) {
    console.error('Error cancelling user subscription:', error)
  } else {
    console.log(`Cancelled subscription for user ${userId}`)
  }
}

async function handlePaymentSucceeded(invoice: Stripe.Invoice) {
  // Log successful payment
  console.log(`Payment succeeded for invoice ${invoice.id}`)

  // Could add logic here to:
  // - Send thank you email
  // - Update payment history
  // - Trigger celebration workflow
}

async function handlePaymentFailed(invoice: Stripe.Invoice) {
  // Log failed payment
  console.log(`Payment failed for invoice ${invoice.id}`)

  // Could add logic here to:
  // - Send payment retry email
  // - Update subscription status
  // - Trigger dunning workflow
}
