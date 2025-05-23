import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Get token from cookies or headers
  const token = request.cookies.get('token')?.value || 
                request.headers.get('authorization')?.replace('Bearer ', '');
  
  // Define protected routes
  const protectedRoutes = ['/'];
  const authRoutes = ['/login', '/signup'];
  
  const isProtectedRoute = protectedRoutes.includes(pathname);
  const isAuthRoute = authRoutes.includes(pathname);
  
  // If user is not authenticated and trying to access protected route
  if (isProtectedRoute && !token) {
    const loginUrl = new URL('/login', request.url);
    return NextResponse.redirect(loginUrl);
  }
  
  // If user is authenticated and trying to access auth routes, redirect to home
  if (isAuthRoute && token) {
    const homeUrl = new URL('/', request.url);
    homeUrl.searchParams.set('status', 'login');
    return NextResponse.redirect(homeUrl);
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};