import { NextRequest, NextResponse } from 'next/server'
import { ConsentService } from '@/lib/services/consent-service'

// POST: Send consent requests to all pending Emergency Support Team members for a user
export async function POST(request: NextRequest) {
  try {
    const { userId } = await request.json()

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      )
    }

    // Send consent requests to all pending members
    await ConsentService.sendAllConsentRequests(userId)

    return NextResponse.json({
      success: true,
      message: 'Consent requests sent successfully'
    })

  } catch (error) {
    console.error('Error sending consent requests:', error)
    return NextResponse.json(
      { 
        error: 'Failed to send consent requests',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
