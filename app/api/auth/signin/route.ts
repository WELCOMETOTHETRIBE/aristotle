import { NextRequest, NextResponse } from 'next/server';
import { authenticateUser, generateToken } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    console.log('🔐 Signin request received');
    
    const body = await request.json();
    console.log('📝 Request body:', { username: body.username, password: body.password ? '[REDACTED]' : 'missing' });
    
    const { username, password } = body;

    if (!username || !password) {
      console.log('❌ Missing username or password');
      return NextResponse.json(
        { error: 'Username and password are required' },
        { status: 400 }
      );
    }

    console.log('🔍 Authenticating user:', username);
    const user = await authenticateUser(username, password);
    console.log('👤 Authentication result:', user ? 'success' : 'failed');

    if (!user) {
      console.log('❌ Authentication failed for user:', username);
      return NextResponse.json(
        { error: 'Invalid username or password' },
        { status: 401 }
      );
    }

    console.log('✅ User authenticated, generating token');
    const token = await generateToken({
      userId: user.id,
      username: user.username
    });

    console.log('🎫 Token generated, creating response');
    const response = NextResponse.json({
      message: 'Authentication successful',
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        displayName: user.displayName
      }
    });

    // Set HTTP-only cookie
    console.log('🍪 Setting auth cookie');
    response.cookies.set('auth-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 // 7 days
    });

    console.log('✅ Signin successful for user:', username);
    return response;
  } catch (error) {
    console.error('💥 Sign-in error:', error);
    console.error('💥 Error stack:', error instanceof Error ? error.stack : 'No stack trace');
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
} 