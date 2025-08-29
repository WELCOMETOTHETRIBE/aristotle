import { NextRequest, NextResponse } from 'next/server';
import { getFrameworksByPractice } from '../../../../../lib/frameworkMap';

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const frameworkIds = getFrameworksByPractice(params.slug);
    
    return NextResponse.json({ frameworks: frameworkIds });
  } catch (error) {
    console.error('Error loading frameworks by practice:', error);
    return NextResponse.json(
      { error: 'Failed to load frameworks by practice' },
      { status: 500 }
    );
  }
} 