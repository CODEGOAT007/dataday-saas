import { NextRequest, NextResponse } from 'next/server'
import { ConsentService } from '@/lib/services/consent-service'
import { createServiceRoleClient } from '@/lib/supabase'

// GET: Fetch Emergency Support Team member data for consent form
export async function GET(
  request: NextRequest,
  { params }: { params: { memberId: string } }
) {
  try {
    const { memberId } = params
    const userAgent = request.headers.get('user-agent') || 'unknown'
    const isMobile = /Mobile|Android|iPhone|iPad/.test(userAgent)

    console.log('🔍 Consent API GET request:', {
      memberId,
      userAgent,
      isMobile,
      supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
      supabaseAnonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'SET' : 'MISSING',
      headers: Object.fromEntries(request.headers.entries())
    })

    // Create service role client for database access (no authentication needed)
    const supabase = createServiceRoleClient()

    // Fetch member data with user information
    const { data: member, error } = await supabase
      .from('support_circle')
      .select(`
        *,
        users (
          id,
          full_name,
          email
        )
      `)
      .eq('id', memberId)
      .single()

    if (error || !member) {
      console.error('Consent API - Member lookup failed:', {
        memberId,
        error: error?.message,
        memberExists: !!member
      })
      return NextResponse.json(
        { error: 'Support Circle member not found' },
        { status: 404 }
      )
    }

    console.log('Consent API - Member found:', {
      memberId,
      memberName: member.name,
      hasUsers: !!member.users,
      userFullName: member.users?.full_name
    })

    // Don't expose sensitive information
    const sanitizedMember = {
      id: member.id,
      name: member.name,
      relationship: member.relationship,
      preferred_contact_method: member.preferred_contact_method,
      consent_given: member.consent_given,
      users: {
        id: member.users.id,
        full_name: member.users.full_name
      }
    }

    return NextResponse.json({
      success: true,
      member: sanitizedMember
    })

  } catch (error) {
    console.error('🔍 Error fetching member data:', {
      error: error instanceof Error ? error.message : error,
      stack: error instanceof Error ? error.stack : undefined,
      memberId: params.memberId,
      userAgent: request.headers.get('user-agent'),
      isMobile: /Mobile|Android|iPhone|iPad/.test(request.headers.get('user-agent') || '')
    })
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST: Process consent response
export async function POST(
  request: NextRequest,
  { params }: { params: { memberId: string } }
) {
  try {
    const { memberId } = params
    const { consented } = await request.json()

    if (typeof consented !== 'boolean') {
      return NextResponse.json(
        { error: 'Invalid consent value' },
        { status: 400 }
      )
    }

    const result = await ConsentService.processConsentResponse(
      memberId,
      consented,
      'web'
    )

    if (!result.success) {
      return NextResponse.json(
        { error: result.error || 'Failed to process consent' },
        { status: 400 }
      )
    }

    return NextResponse.json({
      success: true,
      consented,
      member: result.member
    })

  } catch (error) {
    console.error('Error processing consent:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
