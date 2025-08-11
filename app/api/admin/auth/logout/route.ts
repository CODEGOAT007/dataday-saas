import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function POST(request: NextRequest) {
  try {
    console.log('🚪 Admin logout request')
    
    const cookieStore = cookies()
    
    // Clear admin session cookie
    cookieStore.delete('admin_session')
    
    // Clear any impersonation session
    cookieStore.delete('impersonation_session')
    
    console.log('✅ Admin logged out successfully')

    return NextResponse.json({
      success: true,
      message: 'Logged out successfully'
    })

  } catch (error) {
    console.error('❌ Admin logout error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
