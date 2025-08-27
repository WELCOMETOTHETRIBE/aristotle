import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';

const openai = process.env.OPENAI_API_KEY ? new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
}) : null;

// Simplified audio files for smooth breathwork experience
const audioFiles = [
  // Core breathing instructions - short and clear
  { text: 'Inhale', filename: 'inhale.mp3' },
  { text: 'Hold', filename: 'hold.mp3' },
  { text: 'Exhale', filename: 'exhale.mp3' },
  { text: 'Hold empty', filename: 'hold-empty.mp3' },
  
  // Efficient counting - just the numbers
  { text: 'One', filename: 'count-1.mp3' },
  { text: 'Two', filename: 'count-2.mp3' },
  { text: 'Three', filename: 'count-3.mp3' },
  { text: 'Four', filename: 'count-4.mp3' },
  { text: 'Five', filename: 'count-5.mp3' },
  { text: 'Six', filename: 'count-6.mp3' },
  { text: 'Seven', filename: 'count-7.mp3' },
  { text: 'Eight', filename: 'count-8.mp3' },
  { text: 'Nine', filename: 'count-9.mp3' },
  { text: 'Ten', filename: 'count-10.mp3' },
  { text: 'Eleven', filename: 'count-11.mp3' },
  { text: 'Twelve', filename: 'count-12.mp3' },
  { text: 'Thirteen', filename: 'count-13.mp3' },
  { text: 'Fourteen', filename: 'count-14.mp3' },
  { text: 'Fifteen', filename: 'count-15.mp3' },
  
  // Session messages
  { text: 'Begin your breathwork session', filename: 'session-start.mp3' },
  { text: 'Session complete. Well done', filename: 'session-complete.mp3' },
];

async function generateAudioFile(text: string, filename: string) {
  try {
    if (!openai) {
      console.log(`Skipping TTS generation for: "${text}" - OpenAI not configured`);
      return null;
    }
    
    console.log(`Generating TTS for: "${text}"`);
    
    const speech = await openai.audio.speech.create({
      model: 'tts-1',
      voice: 'nova',
      input: text,
    });

    const buffer = Buffer.from(await speech.arrayBuffer());
    
    // Create audio directory if it doesn't exist
    const audioDir = join(process.cwd(), 'public', 'audio', 'breathwork');
    await mkdir(audioDir, { recursive: true });

    // Save file
    const filepath = join(audioDir, filename);
    await writeFile(filepath, buffer);

    console.log(`✅ Generated: ${filename}`);
    return `/audio/breathwork/${filename}`;
  } catch (error) {
    console.error(`❌ Failed to generate ${filename}:`, error);
    return null;
  }
}

export async function POST(request: NextRequest) {
  try {
    if (!openai) {
      return NextResponse.json(
        { error: 'OpenAI API key not configured' },
        { status: 400 }
      );
    }
    
    console.log('🎵 Generating breathwork audio files...');
    
    const results = [];
    
    for (const audioFile of audioFiles) {
      const url = await generateAudioFile(audioFile.text, audioFile.filename);
      if (url) {
        results.push({
          ...audioFile,
          url: url
        });
      }
      // Small delay to avoid overwhelming the API
      await new Promise(resolve => setTimeout(resolve, 300));
    }

    // Create the audio mapping
    const audioMapping: {
      instructions: { [key: string]: string };
      counting: { [key: string]: string };
      session: { [key: string]: string };
    } = {
      instructions: {
        inhale: results.find(r => r.filename === 'inhale.mp3')?.url || '',
        hold: results.find(r => r.filename === 'hold.mp3')?.url || '',
        exhale: results.find(r => r.filename === 'exhale.mp3')?.url || '',
        holdEmpty: results.find(r => r.filename === 'hold-empty.mp3')?.url || ''
      },
      counting: {},
      session: {
        start: results.find(r => r.filename === 'session-start.mp3')?.url || '',
        complete: results.find(r => r.filename === 'session-complete.mp3')?.url || ''
      }
    };

    // Add counting numbers
    for (let i = 1; i <= 15; i++) {
      const countFile = results.find(r => r.filename === `count-${i}.mp3`);
      if (countFile) {
        audioMapping.counting[i.toString()] = countFile.url;
      }
    }

    // Save the mapping
    const mappingPath = join(process.cwd(), 'public', 'audio', 'breathwork', 'audio-mapping.json');
    await writeFile(mappingPath, JSON.stringify(audioMapping, null, 2));
    
    console.log('🎉 Audio generation complete!');
    
    return NextResponse.json(audioMapping);
  } catch (error) {
    console.error('❌ Audio generation failed:', error);
    return NextResponse.json(
      { error: 'Failed to generate audio files' },
      { status: 500 }
    );
  }
} 