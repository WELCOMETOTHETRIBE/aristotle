import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { z } from 'zod';

const openai = process.env.OPENAI_API_KEY ? new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
}) : null;

// Validation schema for transcription request
const TranscriptionRequestSchema = z.object({
  audio: z.any().refine((val) => val instanceof File || (typeof val === 'object' && val !== null), { 
    message: 'Audio file is required' 
  })
});

export async function POST(request: NextRequest) {
  try {
    if (!openai) {
      console.error('OpenAI API key not configured');
      return NextResponse.json(
        { error: 'OpenAI API key not configured' },
        { status: 400 }
      );
    }
    
    const formData = await request.formData();
    const audioFile = formData.get('audio') as File;

    // Validate audio file
    const validationResult = TranscriptionRequestSchema.safeParse({ audio: audioFile });
    if (!validationResult.success) {
      return NextResponse.json(
        { 
          error: 'Invalid request format', 
          details: validationResult.error.errors 
        },
        { status: 400 }
      );
    }

    if (!audioFile) {
      console.error('No audio file provided');
      return NextResponse.json(
        { error: 'No audio file provided' },
        { status: 400 }
      );
    }

    // Log the file details for debugging
    console.log('Audio file details:', {
      name: audioFile.name,
      type: audioFile.type,
      size: audioFile.size,
    });

    // Validate file size (max 25MB for OpenAI Whisper)
    const maxSize = 25 * 1024 * 1024; // 25MB
    if (audioFile.size > maxSize) {
      console.error('Audio file too large:', audioFile.size);
      return NextResponse.json(
        { error: 'Audio file too large. Maximum size is 25MB.' },
        { status: 400 }
      );
    }

    // Validate minimum file size
    if (audioFile.size < 100) {
      console.error('Audio file too small:', audioFile.size);
      return NextResponse.json(
        { error: 'Audio file too small. Please record for at least a few seconds.' },
        { status: 400 }
      );
    }

    console.log('Processing audio file:', {
      originalType: audioFile.type,
      size: audioFile.size,
    });

    // Create a new FormData for OpenAI API
    const openaiFormData = new FormData();
    openaiFormData.append('file', audioFile, 'audio.webm');
    openaiFormData.append('model', 'whisper-1');
    openaiFormData.append('language', 'en');

    // Send to OpenAI Whisper using fetch directly
    console.log('Sending to OpenAI Whisper...');
    const response = await fetch('https://api.openai.com/v1/audio/transcriptions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: openaiFormData,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || `HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    console.log('Transcription successful:', {
      textLength: data.text.length,
      preview: data.text.substring(0, 100) + '...',
    });

    return NextResponse.json({
      text: data.text,
    });

  } catch (error: any) {
    console.error('Transcription error:', error);
    console.error('Error details:', {
      message: error.message,
      status: error.status,
      code: error.code,
      type: error.type,
    });
    
    // Handle specific OpenAI errors
    if (error.message?.includes('Invalid file format')) {
      return NextResponse.json(
        { 
          error: 'Audio format not supported. Please try recording again.',
          details: 'The recorded audio format is not compatible with OpenAI Whisper. Try using a different browser or recording method.'
        },
        { status: 400 }
      );
    }
    
    if (error.message?.includes('file size')) {
      return NextResponse.json(
        { error: 'Audio file too large. Please record a shorter message.' },
        { status: 400 }
      );
    }

    if (error.message?.includes('401')) {
      return NextResponse.json(
        { error: 'OpenAI API key is invalid or missing' },
        { status: 401 }
      );
    }

    if (error.message?.includes('429')) {
      return NextResponse.json(
        { error: 'Rate limit exceeded. Please try again in a moment.' },
        { status: 429 }
      );
    }

    if (error.message?.includes('500')) {
      return NextResponse.json(
        { error: 'OpenAI service temporarily unavailable. Please try again.' },
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

    // Handle other errors
    return NextResponse.json(
      { 
        error: 'Failed to transcribe audio. Please try again.',
        details: error.message || 'Unknown error occurred'
      },
      { status: 500 }
    );
  }
} 