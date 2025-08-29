import { NextResponse } from 'next/server';
import { getAllFrameworks } from '../../../lib/frameworkMap';

export async function GET() {
  try {
    const frameworks = getAllFrameworks();
    return NextResponse.json(frameworks);
  } catch (error) {
    console.error('Error in frameworks API:', error);
    return NextResponse.json(
      { error: 'Failed to load frameworks' },
      { status: 500 }
    );
  }
} 