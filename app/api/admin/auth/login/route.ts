import { NextRequest, NextResponse } from 'next/server'
import { createServiceRoleClient } from '@/lib/supabase'
import { cookies } from 'next/headers'

// Admin credentials (in production, these should be in environment variables)
const ADMIN_CREDENTIALS = [
  {
    email: 'admin@mydataday.app',
    password: 'DataDay2024!Admin',
    role: 'founder',
    full_name: 'MyDataday Founder'
  },
  {
    email: 'coach@mydataday.app', 
    password: 'DataDay2024!Coach',
    role: 'coach',
    full_name: 'MyDataday Coach'
  }
]

export async function POST(request: NextRequest) {
  try {
    console.log('🔐 Admin login attempt')
    
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      )
    }

    // Check admin credentials
    const adminUser = ADMIN_CREDENTIALS.find(
      admin => admin.email === email && admin.password === password
    )

    if (!adminUser) {
      console.log('❌ Invalid admin credentials:', email)
      return NextResponse.json(
        { error: 'Invalid admin credentials' },
        { status: 401 }
      )
    }

    console.log('✅ Admin login successful:', adminUser.email)

    // Create admin session cookie
    const cookieStore = cookies()
    const sessionData = {
      email: adminUser.email,
      role: adminUser.role,
      full_name: adminUser.full_name,
      loginTime: new Date().toISOString()
    }

    // Set secure admin session cookie
    cookieStore.set('admin_session', JSON.stringify(sessionData), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/'
    })

    return NextResponse.json({
      success: true,
      user: {
        email: adminUser.email,
        role: adminUser.role,
        full_name: adminUser.full_name
      },
      session: {
        expires: new Date(Date.now() + 60 * 60 * 24 * 7 * 1000).toISOString()
      }
    })

  } catch (error) {
    console.error('❌ Admin login error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
