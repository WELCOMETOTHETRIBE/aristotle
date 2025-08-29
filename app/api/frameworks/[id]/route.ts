import { NextRequest, NextResponse } from 'next/server';
import { getFrameworkById } from '@/lib/frameworkMap';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const framework = getFrameworkById(params.id);
    
    if (!framework) {
      return NextResponse.json(
        { error: 'Framework not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(framework);
  } catch (error) {
    console.error('Error in framework API:', error);
    return NextResponse.json(
      { error: 'Failed to load framework' },
      { status: 500 }
    );
  }
} 