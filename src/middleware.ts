import { NextRequest, NextResponse } from 'next/server'
import { KRATOS_PUBLIC_URL } from '@/lib/kratos'

// Session inactivity timeout (30 minutes in milliseconds)
const SESSION_TIMEOUT = 30 * 60 * 1000

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Skip middleware for static files and API routes
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.includes('.') ||
    pathname === '/favicon.ico'
  ) {
    return NextResponse.next()
  }

  const sessionToken = request.cookies.get('kratos-session-token')?.value
  const lastActivityCookie = request.cookies.get('kratos-last-activity')

  // Check if user is accessing login page
  if (pathname === '/login') {
    // If user has a valid session, redirect to dashboard
    if (sessionToken && (await isSessionValid(sessionToken)) && isSessionActive(lastActivityCookie?.value)) {
      return NextResponse.redirect(new URL('/dashboard', request.url))
    }
    return NextResponse.next()
  }

  // Check if user is accessing protected routes (dashboard and others)
  if (pathname.startsWith('/dashboard') || pathname === '/') {
    // Check session validity with Kratos
    const isValidSession = sessionToken && (await isSessionValid(sessionToken)) && isSessionActive(lastActivityCookie?.value)

    if (!isValidSession) {
      // Clear expired/invalid cookies
      const response = NextResponse.redirect(new URL('/login', request.url))
      response.cookies.delete('kratos-session-token')
      response.cookies.delete('kratos-last-activity')
      return response
    }

    // Update last activity timestamp
    const response = NextResponse.next()
    response.cookies.set('kratos-last-activity', Date.now().toString(), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 30 * 24 * 60 * 60, // 30 days
    })

    return response
  }

  return NextResponse.next()
}

async function isSessionValid(sessionToken: string): Promise<boolean> {
  try {
    const response = await fetch(`${KRATOS_PUBLIC_URL}/sessions/whoami`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${sessionToken}`,
      },
    })

    return response.ok
  } catch (error) {
    console.error('Session validation error:', error)
    return false
  }
}

function isSessionActive(lastActivity: string | undefined): boolean {
  if (!lastActivity) return false

  const lastActivityTime = parseInt(lastActivity)
  const now = Date.now()

  return (now - lastActivityTime) < SESSION_TIMEOUT
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
}