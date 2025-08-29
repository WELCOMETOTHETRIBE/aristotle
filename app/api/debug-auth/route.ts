import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get('auth-token')?.value;
    
    const verified = token ? !!(await verifyToken(token)) : false;
    return NextResponse.json({
      hasToken: !!token,
      tokenLength: token?.length || 0,
      tokenPreview: token ? `${token.substring(0, 20)}...` : null,
      verified,
      headers: Object.fromEntries(request.headers.entries()),
      cookies: Object.fromEntries(request.cookies.getAll().map(c => [c.name, c.value]))
    });
  } catch (error) {
    console.error('Debug auth error:', error);
    return NextResponse.json(
      { error: 'Debug error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
} 