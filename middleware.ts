import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import * as jose from 'jose';

// Use environment variable for JWT secret, fallback for development
const JWT_SECRET = process.env.JWT_SECRET || 'default-jwt-secret-for-development-only';

async function verifyTokenInMiddleware(token: string) {
  console.log('🔐 Attempting to verify token with secret:', JWT_SECRET ? 'SECRET_SET' : 'SECRET_NOT_SET');
  try {
    const secret = new TextEncoder().encode(JWT_SECRET);
    const { payload } = await jose.jwtVerify(token, secret);
    console.log('🔐 Middleware token verification success:', { 
      userId: payload.userId, 
      username: payload.username 
    });
    return payload;
  } catch (error) {
    console.log('🔐 Middleware token verification failed:', error);
    return null;
  }
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Skip middleware for static assets and API routes
  if (
    pathname.startsWith('/_next/') ||
    pathname.startsWith('/api/') ||
    pathname.startsWith('/favicon.ico') ||
    pathname.startsWith('/images/') ||
    pathname.startsWith('/audio/') ||
    pathname.includes('.')
  ) {
    return NextResponse.next();
  }

  console.log('🚨 MIDDLEWARE CALLED for path:', pathname);
  
  const token = request.cookies.get('auth-token')?.value;
  
  console.log('🔍 Middleware debug:', {
    pathname,
    hasToken: !!token,
    tokenLength: token?.length || 0,
    tokenPreview: token ? `${token.substring(0, 20)}...` : 'none'
  });

  // Define protected and auth routes
  const isProtectedRoute = pathname !== '/auth';
  const isAuthRoute = pathname === '/auth';

  console.log('🔍 Route types:', { isProtectedRoute, isAuthRoute });

  // Check if user is authenticated
  let isAuthenticated = false;
  if (token) {
    const decoded = await verifyTokenInMiddleware(token);
    isAuthenticated = !!decoded;
    console.log('🔐 Token verification result:', { decoded, isAuthenticated });
  }

  console.log('🔐 Authentication result:', { 
    isAuthenticated, 
    isProtectedRoute, 
    isAuthRoute,
    pathname 
  });

  // Handle authentication logic
  if (isProtectedRoute && !isAuthenticated) {
    console.log('🚫 Redirecting to auth (not authenticated)');
    return NextResponse.redirect(new URL('/auth', request.url));
  }

  if (isAuthRoute && isAuthenticated) {
    console.log('🔄 Redirecting to dashboard (already authenticated)');
    return NextResponse.redirect(new URL('/', request.url));
  }

  console.log('➡️ Allowing request to continue');
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
     * - images (image files)
     * - audio (audio files)
     * - files with extensions (static assets)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|images|audio|.*\\.).*)',
  ],
};
