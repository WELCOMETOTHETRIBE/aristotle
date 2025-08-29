import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyToken } from '@/lib/auth';

// Routes that require authentication
const protectedRoutes = [
  '/',
  '/dashboard',
  '/frameworks',
  '/wisdom',
  '/courage',
  '/justice',
  '/temperance',
  '/coach',
  '/breath',
  '/fasting',
  '/progress',
  '/today',
  '/community',
  '/academy'
];

// Routes that should redirect to dashboard if already authenticated
const authRoutes = [
  '/auth'
];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get('auth-token')?.value;
  
  console.log('🔍 Middleware debug:', {
    pathname,
    hasToken: !!token,
    tokenLength: token?.length || 0,
    tokenPreview: token ? `${token.substring(0, 20)}...` : 'none',
    jwtSecret: process.env.JWT_SECRET ? 'SET' : 'NOT_SET',
    nodeEnv: process.env.NODE_ENV
  });
  
  const isAuthenticated = token && verifyToken(token);
  
  console.log('🔐 Authentication result:', {
    isAuthenticated,
    tokenValid: !!verifyToken(token || '')
  });

  // Check if the route requires authentication
  const isProtectedRoute = protectedRoutes.some(route => 
    pathname === route || pathname.startsWith(route + '/')
  );

  // Check if it's an auth route
  const isAuthRoute = authRoutes.some(route => 
    pathname === route || pathname.startsWith(route + '/')
  );

  console.log('🛣️ Route analysis:', {
    isProtectedRoute,
    isAuthRoute,
    willRedirect: (!isAuthenticated && isProtectedRoute) || (isAuthenticated && isAuthRoute)
  });

  // If user is not authenticated and trying to access protected route
  if (!isAuthenticated && isProtectedRoute) {
    console.log('🚫 Redirecting to auth (not authenticated)');
    const url = request.nextUrl.clone();
    url.pathname = '/auth';
    return NextResponse.redirect(url);
  }

  // If user is authenticated and trying to access auth route
  if (isAuthenticated && isAuthRoute) {
    console.log('✅ Redirecting to dashboard (authenticated)');
    const url = request.nextUrl.clone();
    url.pathname = '/';
    return NextResponse.redirect(url);
  }

  console.log('➡️ Continuing to requested page');
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