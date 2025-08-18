import { NextRequest, NextResponse } from 'next/server'
import { ConsentService } from '@/lib/services/consent-service'
import { getUser } from '@/lib/supabase'

// POST: Send consent requests to all pending Support Circle members for a user
export async function POST(request: NextRequest) {
  try {
    console.log('Consent API: Starting request processing')

    // Get authenticated user using helper function
    const user = await getUser()
    console.log('Consent API: Auth result:', { userId: user?.id, userEmail: user?.email })

    if (!user) {
      console.error('No authenticated user found in consent API')
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get user's name from auth metadata or email
    const userName = user.user_metadata?.full_name || user.email?.split('@')[0] || 'Someone you know'

    // Send consent requests to all pending members
    await ConsentService.sendAllConsentRequests(user.id, userName)

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
