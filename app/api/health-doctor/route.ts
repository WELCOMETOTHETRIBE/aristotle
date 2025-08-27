import { NextResponse } from 'next/server';
import { z } from 'zod';

// Aristotle-specific health check
export async function GET() {
  try {
    const needed = ['OPENAI_API_KEY', 'DATABASE_URL', 'NEXT_PUBLIC_APP_NAME'];
    const missing = needed.filter(k => !process.env[k]);
    
    let dbOk = false;
    let dbError = '';
    
    try {
      // Test database connection
      const { PrismaClient } = await import('@prisma/client');
      const prisma = new PrismaClient();
      await prisma.$queryRaw`SELECT 1`;
      await prisma.$disconnect();
      dbOk = true;
    } catch (error: any) {
      dbError = error.message || 'Database connection failed';
    }
    
    // Check audio files
    let audioOk = false;
    try {
      const fs = await import('fs');
      const path = await import('path');
      const audioMappingPath = path.join(process.cwd(), 'public', 'audio', 'breathwork', 'audio-mapping.json');
      audioOk = fs.existsSync(audioMappingPath);
    } catch {
      audioOk = false;
    }
    
    // Check TTS API
    let ttsOk = false;
    if (process.env.OPENAI_API_KEY) {
      try {
        const OpenAI = (await import('openai')).default;
        const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
        // Just test the client creation, don't make actual API call
        ttsOk = true;
      } catch {
        ttsOk = false;
      }
    }
    
    return NextResponse.json({
      ok: true,
      service: 'Aristotle - AI Life Coach',
      timestamp: new Date().toISOString(),
      environment: {
        missing,
        present: needed.filter(k => process.env[k])
      },
      database: {
        status: dbOk ? 'ok' : 'fail',
        error: dbError || undefined
      },
      audio: {
        breathwork: audioOk ? 'ok' : 'missing'
      },
      tts: {
        status: ttsOk ? 'ok' : 'fail'
      }
    });
  } catch (error: any) {
    return NextResponse.json({
      ok: false,
      error: error.message,
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}
