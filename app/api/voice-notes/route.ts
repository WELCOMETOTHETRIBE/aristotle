import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    // Get token from cookies
    const token = request.cookies.get('auth-token')?.value;
    
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const payload = await verifyToken(token);
    if (!payload?.userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { audioData, duration, date } = await request.json();

    if (!audioData) {
      return NextResponse.json(
        { error: 'Audio data is required' },
        { status: 400 }
      );
    }

    // Transcribe the audio using AI
    let transcription = null;
    let aiInsights = null;
    
    try {
      // First, transcribe the audio
      const transcribeResponse = await fetch(`${request.nextUrl.origin}/api/transcribe`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          audioData: audioData,
          userId: payload.userId
        })
      });

      if (transcribeResponse.ok) {
        const transcribeResult = await transcribeResponse.json();
        transcription = transcribeResult.transcription;

        // Generate AI insights based on the transcription
        if (transcription) {
          const insightsResponse = await fetch(`${request.nextUrl.origin}/api/generate/reflection`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              journalEntry: transcription,
              type: 'voice_note',
              userId: payload.userId
            })
          });

          if (insightsResponse.ok) {
            aiInsights = await insightsResponse.json();
          }
        }
      }
    } catch (error) {
      console.error('Error processing voice note:', error);
    }

    // In a real app, save to database
    const voiceNote = {
      id: Date.now().toString(),
      userId: payload.userId,
      audioData,
      duration,
      transcription,
      aiInsights,
      date,
      createdAt: new Date().toISOString()
    };

    console.log('Saving voice note:', voiceNote);

    return NextResponse.json({ 
      success: true,
      voiceNote: voiceNote,
      message: 'Voice note saved successfully'
    });

  } catch (error) {
    console.error('Error saving voice note:', error);
    return NextResponse.json(
      { error: 'Failed to save voice note' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    // Get token from cookies
    const token = request.cookies.get('auth-token')?.value;
    
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const payload = await verifyToken(token);
    if (!payload?.userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // In a real app, fetch from database
    const mockVoiceNotes = [
      {
        id: '1',
        duration: 45,
        transcription: 'Today I reflected on the importance of patience in my daily practice.',
        date: new Date().toISOString(),
        aiInsights: {
          themes: ['patience', 'reflection', 'practice'],
          reflection: 'Your voice note shows deep contemplation about patience, a key virtue in many traditions.'
        }
      },
      {
        id: '2',
        duration: 32,
        transcription: 'I am grateful for the support of my community and the wisdom they share.',
        date: new Date().toISOString(),
        aiInsights: {
          themes: ['gratitude', 'community', 'wisdom'],
          reflection: 'Your gratitude for community support demonstrates the value you place on connection.'
        }
      }
    ];

    return NextResponse.json({ 
      voiceNotes: mockVoiceNotes,
      message: 'Voice notes retrieved successfully'
    });

  } catch (error) {
    console.error('Error fetching voice notes:', error);
    return NextResponse.json(
      { error: 'Failed to fetch voice notes' },
      { status: 500 }
    );
  }
} 