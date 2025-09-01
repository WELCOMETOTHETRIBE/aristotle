import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import * as jose from 'jose';

const JWT_SECRET = 'default-jwt-secret-for-development-only';

async function verifyTokenInMiddleware(token: string) {
  console.log('🔐 Attempting to verify token with secret:', JWT_SECRET ? 'SECRET_SET' : 'SECRET_NOT_SET');
  console.log('🔐 JWT_SECRET value:', JWT_SECRET);
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
  console.log('🚨 MIDDLEWARE CALLED for path:', request.nextUrl.pathname);
  
  const { pathname } = request.nextUrl;
  const token = request.cookies.get('auth-token')?.value;
  
  console.log('🔍 Middleware debug:', {
    pathname,
    hasToken: !!token,
    tokenLength: token?.length || 0,
    tokenPreview: token ? `${token.substring(0, 20)}...` : 'none'
  });

  // Define protected and auth routes
  const isProtectedRoute = pathname !== '/auth' && 
                          !pathname.startsWith('/api/') && 
                          !pathname.startsWith('/_next/') && 
                          !pathname.startsWith('/favicon.ico');
  
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
    // Allow main pages for development/testing
    const allowedPaths = [
      '/',
      '/dashboard',
      '/frameworks',
      '/wisdom',
      '/courage', 
      '/justice',
      '/temperance',
      '/community',
      '/today',
      '/academy',
      '/philosophers',
      '/breath',
      '/coach',
      '/fasting',
      '/progress',
      '/onboarding',
      '/tools'
    ];
    
    const isAllowedPath = allowedPaths.includes(pathname) || pathname.startsWith('/frameworks/');
    
    if (isAllowedPath) {
      console.log('✅ Allowing page access for development:', pathname);
      return NextResponse.next();
    }
    
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
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}; 