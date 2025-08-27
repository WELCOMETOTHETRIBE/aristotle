import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { TTSRequestSchema } from '@/lib/validators';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';

const openai = process.env.OPENAI_API_KEY ? new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
}) : null;

export async function POST(request: NextRequest) {
  try {
    if (!openai) {
      return NextResponse.json(
        { error: 'OpenAI API key not configured' },
        { status: 400 }
      );
    }
    
    const body = await request.json();
    const { text, voice = 'alloy' } = TTSRequestSchema.parse(body);

    // Validate text length (OpenAI TTS has a limit of 4096 characters)
    if (text.length > 4096) {
      return NextResponse.json(
        { error: 'Text too long. Maximum length is 4096 characters.' },
        { status: 400 }
      );
    }

    if (text.length < 1) {
      return NextResponse.json(
        { error: 'Text cannot be empty.' },
        { status: 400 }
      );
    }

    console.log('Generating TTS for text:', {
      length: text.length,
      voice,
      preview: text.substring(0, 100) + '...',
    });

    // Generate speech with OpenAI TTS
    const speech = await openai.audio.speech.create({
      model: 'tts-1',
      voice: voice as 'alloy' | 'echo' | 'fable' | 'onyx' | 'nova' | 'shimmer',
      input: text,
    });

    // Convert to buffer
    const buffer = Buffer.from(await speech.arrayBuffer());

    // Create audio directory if it doesn't exist
    const audioDir = join(process.cwd(), 'public', 'audio');
    await mkdir(audioDir, { recursive: true });

    // Generate unique filename
    const timestamp = Date.now();
    const filename = `tts_${timestamp}.mp3`;
    const filepath = join(audioDir, filename);

    // Save file
    await writeFile(filepath, buffer);

    console.log('TTS file saved:', {
      filename,
      size: buffer.length,
      path: filepath,
    });

    // Return URL
    const url = `/audio/${filename}`;

    return NextResponse.json({
      url,
      filename,
      size: buffer.length,
    });

  } catch (error: any) {
    console.error('TTS error:', error);
    
    // Handle validation errors
    if (error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Invalid request format', details: error.errors },
        { status: 400 }
      );
    }

    // Handle OpenAI API errors
    if (error.status === 400) {
      return NextResponse.json(
        { error: 'Invalid request to OpenAI TTS API', details: error.error?.message },
        { status: 400 }
      );
    }

    if (error.status === 401) {
      return NextResponse.json(
        { error: 'OpenAI API key is invalid or missing' },
        { status: 401 }
      );
    }

    if (error.status === 429) {
      return NextResponse.json(
        { error: 'Rate limit exceeded. Please try again in a moment.' },
        { status: 429 }
      );
    }

    if (error.status === 500) {
      return NextResponse.json(
        { error: 'OpenAI service temporarily unavailable. Please try again.' },
        { status: 500 }
      );
    }

    // Handle file system errors
    if (error.code === 'ENOSPC') {
      return NextResponse.json(
        { error: 'Storage space insufficient. Please try again later.' },
        { status: 500 }
      );
    }

    // Handle network errors
    if (error.code === 'ENOTFOUND' || error.code === 'ECONNREFUSED') {
      return NextResponse.json(
        { error: 'Network error. Please check your connection and try again.' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to generate speech. Please try again.' },
      { status: 500 }
    );
  }
} 