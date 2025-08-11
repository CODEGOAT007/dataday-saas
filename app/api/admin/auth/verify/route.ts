import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function GET(request: NextRequest) {
  try {
    const cookieStore = cookies()
    const adminSessionCookie = cookieStore.get('admin_session')

    if (!adminSessionCookie) {
      return NextResponse.json(
        { error: 'No admin session found' },
        { status: 401 }
      )
    }

    const session = JSON.parse(adminSessionCookie.value)
    
    // Check if session is expired (7 days)
    const loginTime = new Date(session.loginTime)
    const now = new Date()
    const daysDiff = (now.getTime() - loginTime.getTime()) / (1000 * 60 * 60 * 24)
    
    if (daysDiff > 7) {
      return NextResponse.json(
        { error: 'Admin session expired' },
        { status: 401 }
      )
    }

    return NextResponse.json({
      success: true,
      session: {
        email: session.email,
        role: session.role,
        full_name: session.full_name,
        loginTime: session.loginTime
      }
    })

  } catch (error) {
    console.error('Admin session verification error:', error)
    return NextResponse.json(
      { error: 'Invalid session' },
      { status: 401 }
    )
  }
}
