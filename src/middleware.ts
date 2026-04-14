import { NextRequest, NextResponse } from 'next/server'

export function middleware(request: NextRequest) {
  const token = request.cookies.get('auth-token')?.value
  const { pathname, searchParams } = request.nextUrl

  const isProtected = pathname.startsWith('/client-area')
  const isAuthRoute = pathname.startsWith('/auth/')

  // Logout route - clear cookie
  if (pathname === '/auth/logout') {
    const res = NextResponse.redirect(new URL('/auth/login', request.url))
    res.cookies.delete('auth-token')
    return res
  }

  if (isProtected && !token) {
    const loginUrl = new URL('/auth/login', request.url)
    loginUrl.searchParams.set('redirect', pathname)
    return NextResponse.redirect(loginUrl)
  }

  // Only redirect if no ?force param (allows re-login)
  if (isAuthRoute && token && !searchParams.has('force')) {
    return NextResponse.redirect(new URL('/client-area/dashboard', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/client-area/:path*', '/auth/:path*'],
}
