import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { createServerClient } from '@/lib/supabase'
import { cookies } from 'next/headers'

export async function POST(request: NextRequest) {
  try {
    // Check if Stripe is configured
    if (!stripe) {
      return NextResponse.json(
        { error: 'Subscription system not configured' },
        { status: 503 }
      )
    }

    const { action } = await request.json()

    // Get the current user
    const cookieStore = cookies()
    const supabase = createServerClient(cookieStore)
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    // Get user's subscription details
    const { data: profile, error: profileError } = await supabase
      .from('users')
      .select('stripe_subscription_id, subscription_tier')
      .eq('id', user.id)
      .single()

    if (profileError || !profile?.stripe_subscription_id) {
      return NextResponse.json(
        { error: 'No active subscription found' },
        { status: 404 }
      )
    }

    switch (action) {
      case 'cancel':
        // Cancel subscription at period end
        const cancelledSubscription = await stripe.subscriptions.update(
          profile.stripe_subscription_id,
          {
            cancel_at_period_end: true,
          }
        )

        // Update database
        await supabase
          .from('users')
          .update({
            subscription_status: 'cancelled',
            updated_at: new Date().toISOString(),
          })
          .eq('id', user.id)

        return NextResponse.json({
          success: true,
          message: 'Subscription will be cancelled at the end of the current period',
          subscription: cancelledSubscription,
        })

      case 'reactivate':
        // Reactivate subscription
        const reactivatedSubscription = await stripe.subscriptions.update(
          profile.stripe_subscription_id,
          {
            cancel_at_period_end: false,
          }
        )

        // Update database
        await supabase
          .from('users')
          .update({
            subscription_status: 'active',
            updated_at: new Date().toISOString(),
          })
          .eq('id', user.id)

        return NextResponse.json({
          success: true,
          message: 'Subscription has been reactivated',
          subscription: reactivatedSubscription,
        })

      default:
        return NextResponse.json(
          { error: 'Invalid action' },
          { status: 400 }
        )
    }

  } catch (error) {
    console.error('Error managing subscription:', error)
    return NextResponse.json(
      { error: 'Failed to manage subscription' },
      { status: 500 }
    )
  }
}

// Get subscription details
export async function GET(request: NextRequest) {
  try {
    // Get the current user
    const cookieStore = cookies()
    const supabase = createServerClient(cookieStore)
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    // Get user's subscription details from database
    const { data: profile, error: profileError } = await supabase
      .from('users')
      .select('stripe_subscription_id, subscription_tier, subscription_status, subscription_current_period_end')
      .eq('id', user.id)
      .single()

    if (profileError) {
      return NextResponse.json(
        { error: 'Failed to get user profile' },
        { status: 500 }
      )
    }

    // If user has a Stripe subscription, get details from Stripe
    let stripeSubscription = null
    if (profile.stripe_subscription_id && stripe) {
      try {
        stripeSubscription = await stripe.subscriptions.retrieve(profile.stripe_subscription_id)
      } catch (stripeError) {
        console.error('Error retrieving Stripe subscription:', stripeError)
        // Continue without Stripe data
      }
    }

    return NextResponse.json({
      subscription: {
        tier: profile.subscription_tier || 'basic',
        status: profile.subscription_status,
        currentPeriodEnd: profile.subscription_current_period_end,
        stripeSubscription,
      },
    })

  } catch (error) {
    console.error('Error getting subscription:', error)
    return NextResponse.json(
      { error: 'Failed to get subscription details' },
      { status: 500 }
    )
  }
}
