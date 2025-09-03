import { NextRequest, NextResponse } from 'next/server';
import { generateAIComment } from './generate';

export async function POST(request: NextRequest) {
  try {
    console.log('AI philosopher comment endpoint called');
    
    const body = await request.json();
    console.log('Request body:', body);
    
    const { 
      imageUrl, 
      caption, 
      tags, 
      location, 
      weather, 
      mood, 
      postId
    } = body;

    if (!imageUrl || !postId) {
      console.error('Missing required fields:', { imageUrl: !!imageUrl, postId: !!postId });
      return NextResponse.json({ 
        error: 'imageUrl and postId are required' 
      }, { status: 400 });
    }

    const result = await generateAIComment({
      imageUrl,
      caption,
      tags,
      location,
      weather,
      mood,
      postId
    });

    return NextResponse.json(result);

  } catch (error) {
    console.error('Error creating AI philosopher comment:', error);
    return NextResponse.json(
      { 
        error: 'Failed to create AI philosopher comment', 
        details: error instanceof Error ? error.message : 'Unknown error' 
      },
      { status: 500 }
    );
  }
} 