import { NextRequest, NextResponse } from 'next/server';
import { generateDailyQuests } from '@/lib/quest-engine';
import { getFrameworkBySlug } from '@/lib/frameworks.config';
import { VirtueTotals } from '@/lib/virtue';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { frameworkSlug } = body;

    if (!frameworkSlug) {
      return NextResponse.json(
        { error: 'Framework slug is required' },
        { status: 400 }
      );
    }

    // Get framework config
    const frameworkConfig = getFrameworkBySlug(frameworkSlug);
    if (!frameworkConfig) {
      return NextResponse.json(
        { error: 'Framework not found' },
        { status: 404 }
      );
    }

    // Mock user virtues (in real app, get from database)
    const userVirtues: VirtueTotals = {
      wisdom: 45,
      justice: 32,
      courage: 28,
      temperance: 38
    };

    // Mock recent completions (in real app, get from database)
    const recentCompletions: string[] = [];

    // Generate quests
    const quests = generateDailyQuests({
      frameworkSlug,
      userVirtues,
      recentCompletions,
      timeBudget: 25, // 25 minutes
      frameworkConfig
    });

    return NextResponse.json({
      success: true,
      quests,
      userVirtues,
      timeBudget: 25
    });

  } catch (error) {
    console.error('Error generating quests:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const frameworkSlug = searchParams.get('frameworkSlug');

    if (!frameworkSlug) {
      return NextResponse.json(
        { error: 'Framework slug is required' },
        { status: 400 }
      );
    }

    // Get framework config
    const frameworkConfig = getFrameworkBySlug(frameworkSlug);
    if (!frameworkConfig) {
      return NextResponse.json(
        { error: 'Framework not found' },
        { status: 404 }
      );
    }

    // Mock user virtues (in real app, get from database)
    const userVirtues: VirtueTotals = {
      wisdom: 45,
      justice: 32,
      courage: 28,
      temperance: 38
    };

    // Mock recent completions (in real app, get from database)
    const recentCompletions: string[] = [];

    // Generate quests
    const quests = generateDailyQuests({
      frameworkSlug,
      userVirtues,
      recentCompletions,
      timeBudget: 25, // 25 minutes
      frameworkConfig
    });

    return NextResponse.json({
      success: true,
      quests,
      userVirtues,
      timeBudget: 25
    });

  } catch (error) {
    console.error('Error generating quests:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 