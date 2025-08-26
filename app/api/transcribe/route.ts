import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const audioFile = formData.get('audio') as File;

    if (!audioFile) {
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
      return NextResponse.json(
        { error: 'Audio file too large. Maximum size is 25MB.' },
        { status: 400 }
      );
    }

    // Validate minimum file size
    if (audioFile.size < 100) {
      return NextResponse.json(
        { error: 'Audio file too small. Please record for at least a few seconds.' },
        { status: 400 }
      );
    }

    // Convert File to Buffer
    const buffer = Buffer.from(await audioFile.arrayBuffer());

    // Determine the best file extension based on MIME type
    let fileName = 'audio';
    let mimeType = audioFile.type;
    
    if (audioFile.type.includes('webm')) {
      fileName = 'audio.webm';
    } else if (audioFile.type.includes('mp3')) {
      fileName = 'audio.mp3';
    } else if (audioFile.type.includes('wav')) {
      fileName = 'audio.wav';
    } else if (audioFile.type.includes('m4a')) {
      fileName = 'audio.m4a';
    } else if (audioFile.type.includes('mp4')) {
      fileName = 'audio.mp4';
    } else if (audioFile.type.includes('ogg')) {
      fileName = 'audio.ogg';
    } else {
      // Default to webm if we can't determine the type
      fileName = 'audio.webm';
      mimeType = 'audio/webm';
    }

    // Create a new File object with the proper name and type
    const processedFile = new File([buffer], fileName, { type: mimeType });

    console.log('Processing audio file:', {
      fileName,
      mimeType,
      size: processedFile.size,
    });

    // Send to OpenAI Whisper
    const transcription = await openai.audio.transcriptions.create({
      file: processedFile,
      model: 'whisper-1',
      language: 'en',
    });

    console.log('Transcription successful:', {
      textLength: transcription.text.length,
      preview: transcription.text.substring(0, 100) + '...',
    });

    return NextResponse.json({
      text: transcription.text,
    });

  } catch (error: any) {
    console.error('Transcription error:', error);
    
    // Handle specific OpenAI errors
    if (error.status === 400) {
      if (error.error?.message?.includes('Invalid file format')) {
        return NextResponse.json(
          { 
            error: 'Audio format not supported. Please try recording again.',
            details: 'The recorded audio format is not compatible with OpenAI Whisper. Try using a different browser or recording method.'
          },
          { status: 400 }
        );
      }
      if (error.error?.message?.includes('file size')) {
        return NextResponse.json(
          { error: 'Audio file too large. Please record a shorter message.' },
          { status: 400 }
        );
      }
      return NextResponse.json(
        { error: 'Invalid request to OpenAI API', details: error.error?.message },
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

    // Handle network errors
    if (error.code === 'ENOTFOUND' || error.code === 'ECONNREFUSED') {
      return NextResponse.json(
        { error: 'Network error. Please check your connection and try again.' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to transcribe audio. Please try again.' },
      { status: 500 }
    );
  }
} 