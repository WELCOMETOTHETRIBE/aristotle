import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import jwt from 'jsonwebtoken';

const JWT_SECRET = 'default-jwt-secret-for-development-only';

function verifyTokenInMiddleware(token: string) {
  console.log('🔐 Attempting to verify token with secret:', JWT_SECRET ? 'SECRET_SET' : 'SECRET_NOT_SET');
  console.log('🔐 JWT_SECRET value:', JWT_SECRET);
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    console.log('🔐 Middleware token verification success:', { 
      userId: decoded?.userId, 
      username: decoded?.username 
    });
    return decoded;
  } catch (error) {
    console.log('🔐 Middleware token verification failed:', error);
    return null;
  }
}

export function middleware(request: NextRequest) {
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
    const decoded = verifyTokenInMiddleware(token);
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
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}; 