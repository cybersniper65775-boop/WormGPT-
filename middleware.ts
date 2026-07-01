import { NextRequest, NextResponse } from 'next/server'

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname
  const session = request.cookies.get('wormgpt-session')?.value

  // Parse session if exists
  let user = null
  if (session) {
    try {
      user = JSON.parse(session)
    } catch (e) {
      // Invalid session cookie
    }
  }

  // Protected routes that require authentication
  const protectedRoutes = ['/dashboard', '/ide', '/chat', '/generator', '/files', '/admin']
  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route))

  if (isProtectedRoute && !user) {
    return NextResponse.redirect(new URL('/sign-in', request.url))
  }

  // Admin routes require is_admin flag
  if (pathname.startsWith('/admin') && user && !user.is_admin) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  // Redirect authenticated users away from auth pages
  if ((pathname === '/sign-in' || pathname === '/sign-up') && user) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|wormgpt-logo.png).*)',
  ],
}
