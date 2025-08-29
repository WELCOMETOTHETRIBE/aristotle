import { NextRequest, NextResponse } from 'next/server';
import { getFrameworksByModule } from '@/lib/frameworkMap';

export async function GET(
  request: NextRequest,
  { params }: { params: { moduleId: string } }
) {
  try {
    const frameworks = getFrameworksByModule(params.moduleId);
    
    if (!frameworks) {
      return NextResponse.json({ core: [], support: [] });
    }

    return NextResponse.json(frameworks);
  } catch (error) {
    console.error('Error loading frameworks by module:', error);
    return NextResponse.json(
      { error: 'Failed to load frameworks by module' },
      { status: 500 }
    );
  }
} 