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

    const { id, status, notes, converted_user_id } = await request.json()

    if (!id || !status) {
      return NextResponse.json(
        { error: 'ID and status are required' },
        { status: 400 }
      )
    }

    const supabase = createServiceRoleClient()

    const now = new Date().toISOString()
    const updateData: any = {
      lead_status: status,
      updated_at: now
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
