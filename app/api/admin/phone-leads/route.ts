import { NextRequest, NextResponse } from 'next/server'
import { createServiceRoleClient } from '@/lib/supabase'
import { cookies } from 'next/headers'

export async function GET(request: NextRequest) {
  try {
    // Verify admin session
    const cookieStore = cookies()
    const adminSessionCookie = cookieStore.get('admin_session')
    
    if (!adminSessionCookie) {
      return NextResponse.json(
        { error: 'Admin authentication required' },
        { status: 401 }
      )
    }

    console.log('📱 Admin fetching phone leads')
    
    const supabase = createServiceRoleClient()

    // Fetch all phone leads from leads table
    const { data: phoneLeads, error } = await supabase
      .from('leads')
      .select(`
        id,
        phone,
        email,
        full_name,
        lead_source,
        lead_status,
        lead_notes,
        created_at,
        updated_at,
        contacted_at,
        qualified_at,
        converted_at,
        converted_user_id,
        priority,
        assigned_to,
        next_follow_up
      `)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching phone leads:', error)
      return NextResponse.json(
        { error: 'Failed to fetch phone leads' },
        { status: 500 }
      )
    }

    console.log(`✅ Fetched ${phoneLeads?.length || 0} phone leads`)

    return NextResponse.json({
      success: true,
      phoneLeads: phoneLeads || []
    })

  } catch (error) {
    console.error('Phone leads API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// PATCH: Update phone lead status
export async function PATCH(request: NextRequest) {
  // Reason: Enforce linear lead transitions server-side with optional override
  const ALLOWED_NEXT: Record<string, string[]> = {
    new: ['contacted', 'connected_now', 'lost', 'declined', 'rescheduled'],
    not_contacted: ['contacted', 'connected_now', 'lost', 'declined', 'rescheduled'],
    open: ['contacted', 'connected_now', 'lost', 'declined', 'rescheduled'],
    contacted: ['connected_now', 'signup_sent', 'lost', 'declined', 'rescheduled'],
    connected_now: ['signup_sent', 'account_created', 'lost', 'declined', 'rescheduled'],
    signup_sent: ['account_created', 'lost', 'declined', 'rescheduled'],
    account_created: ['payment_pending', 'attached'],
    attached: ['payment_pending'],
    payment_pending: ['card_on_file'],
    card_on_file: ['onboarded'],
    onboarded: [],
    qualified: ['account_created', 'attached', 'payment_pending', 'card_on_file', 'onboarded'],
    converted: ['card_on_file', 'onboarded'],
    declined: [],
    lost: [],
    rescheduled: ['contacted', 'connected_now']
  }

  try {
    // Verify admin session
    const cookieStore = cookies()
    const adminSessionCookie = cookieStore.get('admin_session')

    if (!adminSessionCookie) {
      return NextResponse.json(
        { error: 'Admin authentication required' },
        { status: 401 }
      )
    }

    const { id, status, notes, converted_user_id, override, next_follow_up } = await request.json()

    if (!id || !status) {
      return NextResponse.json(
        { error: 'ID and status are required' },
        { status: 400 }
      )
    }

    const supabase = createServiceRoleClient()

    // Reason: Enforce linear transitions unless override is provided
    const { data: existing, error: fetchErr } = await supabase
      .from('leads')
      .select('lead_status, converted_user_id')
      .eq('id', id)
      .single()
    if (fetchErr) {
      console.error('Error fetching current lead:', fetchErr)
      return NextResponse.json({ error: 'Lead not found' }, { status: 404 })
    }

    const currentStatus: string = existing?.lead_status || 'new'
    const allowedNext = ALLOWED_NEXT[currentStatus] || []
    const isAllowed = allowedNext.includes(status)

    if (!isAllowed && !override) {
      return NextResponse.json(
        { error: `Invalid transition from ${currentStatus} to ${status}` },
        { status: 400 }
      )
    }

    const now = new Date().toISOString()
    const updateData: any = {
      lead_status: status,
      updated_at: now
    }

    if (next_follow_up) {
      updateData.next_follow_up = next_follow_up
    }

    if (notes) {
      updateData.lead_notes = notes
    }

    if (converted_user_id) {
      updateData.converted_user_id = converted_user_id
    }

    // Timestamp helpers for key stages
    if (status === 'contacted' || status === 'connected_now') {
      updateData.contacted_at = now
    }
    if (status === 'account_created' || status === 'qualified') {
      updateData.qualified_at = now
    }
    if (status === 'converted' || status === 'card_on_file' || status === 'onboarded') {
      updateData.converted_at = now
    }

    const { data, error } = await supabase
      .from('leads')
      .update(updateData)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Error updating phone lead:', error)
      return NextResponse.json(
        { error: 'Failed to update phone lead' },
        { status: 500 }
      )
    }

    console.log(`✅ Updated phone lead ${id} to status: ${status}`)

    return NextResponse.json({
      success: true,
      phoneLead: data
    })

  } catch (error) {
    console.error('Phone lead update error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
