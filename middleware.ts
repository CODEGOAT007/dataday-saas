import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  // Reason: High-performance JWT validation with new signing keys
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,

    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          request.cookies.set({
            name,
            value,
            ...options,
          })
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          })
          response.cookies.set({
            name,
            value,
            ...options,
          })
        },
        remove(name: string, options: CookieOptions) {
          request.cookies.set({
            name,
            value: '',
            ...options,
          })
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          })
          response.cookies.set({
            name,
            value: '',
            ...options,
          })
        },
      },
    }
  )

  // Reason: Use high-performance getClaims() instead of getUser() for JWT signing keys
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  // Reason: Define protected and auth routes
  const protectedRoutes = ['/dashboard', '/logs', '/settings', '/today', '/support-team', '/support-circle']
  const authRoutes = ['/auth/login', '/auth/signup', '/auth/callback']
  const publicRoutes = ['/', '/about', '/pricing', '/contact']
  const adminRoutes = ['/admin'] // Admin routes use separate authentication

  const isProtectedRoute = protectedRoutes.some(route =>
    request.nextUrl.pathname.startsWith(route)
  )
  const isAuthRoute = authRoutes.some(route =>
    request.nextUrl.pathname.startsWith(route)
  )
  const isPublicRoute = publicRoutes.includes(request.nextUrl.pathname)
  const isAdminRoute = adminRoutes.some(route =>
    request.nextUrl.pathname.startsWith(route)
  )

  // Reason: Skip regular auth for admin routes (they have separate authentication)
  if (isAdminRoute) {
    return response
  }

  // Reason: Redirect unauthenticated users from protected routes
  if (isProtectedRoute && !user) {
    const redirectUrl = new URL('/auth/login', request.url)
    redirectUrl.searchParams.set('redirectTo', request.nextUrl.pathname)
    return NextResponse.redirect(redirectUrl)
  }

  // Reason: Redirect authenticated users from auth routes to dashboard
  if (isAuthRoute && user) {
    const redirectTo = request.nextUrl.searchParams.get('redirectTo')
    const redirectUrl = new URL(redirectTo || '/today', request.url)
    return NextResponse.redirect(redirectUrl)
  }

  // Reason: Redirect authenticated users from landing page to today page
  if (request.nextUrl.pathname === '/' && user) {
    return NextResponse.redirect(new URL('/today', request.url))
  }

  // Reason: Redirect /support-team to support circle management page
  if (request.nextUrl.pathname === '/support-team' && user) {
    return NextResponse.redirect(new URL('/support-circle', request.url))
  }

  // Reason: Skip onboarding gate; business flow wants direct access to Today immediately after signup
  // If you need onboarding later, show it contextually instead of blocking primary nav
  // Removed: redirect to /onboarding when onboarding_completed_at is null

  // Reason: Onboarding remains accessible if user navigates manually, but never auto-redirect to it

  return response
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
