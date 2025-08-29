import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const envVars = {
      OPENAI_API_KEY: {
        exists: !!process.env.OPENAI_API_KEY,
        length: process.env.OPENAI_API_KEY ? process.env.OPENAI_API_KEY.length : 0,
        prefix: process.env.OPENAI_API_KEY ? process.env.OPENAI_API_KEY.substring(0, 10) + '...' : 'none',
        value: process.env.OPENAI_API_KEY || 'NOT_SET'
      },
      DATABASE_URL: {
        exists: !!process.env.DATABASE_URL,
        value: process.env.DATABASE_URL || 'NOT_SET'
      },
      NODE_ENV: process.env.NODE_ENV,
      RAILWAY_ENVIRONMENT: process.env.RAILWAY_ENVIRONMENT,
      RAILWAY_PROJECT_NAME: process.env.RAILWAY_PROJECT_NAME
    };

    return NextResponse.json({
      timestamp: new Date().toISOString(),
      environment: envVars,
      allEnvKeys: Object.keys(process.env).filter(key => 
        key.includes('OPENAI') || 
        key.includes('RAILWAY') || 
        key.includes('DATABASE') ||
        key.includes('NODE')
      )
    });
  } catch (error) {
    return NextResponse.json({
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
} 