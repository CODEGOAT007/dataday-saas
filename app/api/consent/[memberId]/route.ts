import { NextRequest, NextResponse } from 'next/server'
import { ConsentService } from '@/lib/services/consent-service'
import { createClient } from '@/lib/supabase-client'

const supabase = createClient()

// GET: Fetch Emergency Support Team member data for consent form
export async function GET(
  request: NextRequest,
  { params }: { params: { memberId: string } }
) {
  try {
    const { memberId } = params

    // Fetch member data with user information
    const { data: member, error } = await supabase
      .from('emergency_support_team')
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
      return NextResponse.json(
        { error: 'Emergency Support Team member not found' },
        { status: 404 }
      )
    }

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
    console.error('Error fetching member data:', error)
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
