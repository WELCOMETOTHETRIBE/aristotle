import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    return NextResponse.json({
      DATABASE_URL: {
        exists: !!process.env.DATABASE_URL,
        value: process.env.DATABASE_URL || 'NOT_SET',
        length: process.env.DATABASE_URL?.length || 0,
        startsWithPostgres: process.env.DATABASE_URL?.startsWith('postgresql://') || false
      },
      NODE_ENV: process.env.NODE_ENV,
      JWT_SECRET: {
        exists: !!process.env.JWT_SECRET,
        value: process.env.JWT_SECRET ? 'SET' : 'NOT_SET'
      },
      allEnvVars: Object.keys(process.env).filter(key => key.includes('DATABASE') || key.includes('JWT') || key.includes('NODE'))
    });
  } catch (error) {
    console.error('Debug env error:', error);
    return NextResponse.json(
      { error: 'Debug error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
} 