import { NextRequest, NextResponse } from 'next/server'
import { EscalationService } from '@/lib/services/escalation-service'

// Reason: API endpoint to process daily escalations
// This should be called by a cron job or scheduled function daily
export async function POST(request: NextRequest) {
  try {
    // Reason: Verify this is an authorized request (in production, use proper auth)
    const authHeader = request.headers.get('authorization')
    const expectedToken = process.env.ESCALATION_CRON_TOKEN
    
    if (!expectedToken || authHeader !== `Bearer ${expectedToken}`) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    console.log('🚨 Starting daily escalation processing...')
    
    // Reason: Process all escalations for all users
    await EscalationService.processEscalations()
    
    console.log('✅ Daily escalation processing completed')
    
    return NextResponse.json({
      success: true,
      message: 'Escalations processed successfully',
      timestamp: new Date().toISOString()
    })
    
  } catch (error) {
    console.error('❌ Error processing escalations:', error)
    
    return NextResponse.json(
      { 
        error: 'Failed to process escalations',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

// Reason: GET endpoint for testing/manual trigger (development only)
export async function GET(request: NextRequest) {
  // Reason: Only allow in development
  if (process.env.NODE_ENV !== 'development') {
    return NextResponse.json(
      { error: 'Not available in production' },
      { status: 404 }
    )
  }

  try {
    console.log('🧪 Manual escalation processing (development mode)...')
    
    await EscalationService.processEscalations()
    
    return NextResponse.json({
      success: true,
      message: 'Escalations processed successfully (development)',
      timestamp: new Date().toISOString()
    })
    
  } catch (error) {
    console.error('❌ Error processing escalations:', error)
    
    return NextResponse.json(
      { 
        error: 'Failed to process escalations',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
