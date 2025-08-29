import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get('auth-token')?.value;
    
    console.log('🔍 Test auth debug:');
    console.log('- Has token:', !!token);
    console.log('- Token length:', token?.length || 0);
    console.log('- Token preview:', token ? `${token.substring(0, 50)}...` : 'none');
    
    if (!token) {
      return NextResponse.json({ 
        authenticated: false, 
        reason: 'No token found' 
      });
    }
    
    const decoded = verifyToken(token);
    console.log('- Token decoded:', decoded);
    
    return NextResponse.json({
      authenticated: !!decoded,
      decoded,
      tokenLength: token.length,
      tokenPreview: `${token.substring(0, 50)}...`
    });
  } catch (error) {
    console.error('Test auth error:', error);
    return NextResponse.json(
      { error: 'Test auth error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
} 