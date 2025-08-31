import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { safeParse, zVirtueScore, zId } from '@/lib/validate';
import { z } from 'zod';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const days = parseInt(searchParams.get('days') || '7');
    const virtue = searchParams.get('virtue');
    
    // If specific virtue is requested, return user progress for that virtue
    if (virtue) {
      // For now, return mock data since we don't have real user progress
      // In production, this would query the database for actual user data
      const mockProgress = {
        totalSessions: Math.floor(Math.random() * 50) + 10,
        currentStreak: Math.floor(Math.random() * 30) + 1,
        wisdomLevel: getVirtueLevel(virtue),
        completionRate: Math.floor(Math.random() * 40) + 60,
        favoritePractice: getFavoritePractice(virtue),
        lastPractice: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString()
      };
      
      return NextResponse.json(mockProgress);
    }
    
    // Get virtue scores for the last N days
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    
    const virtueScores = await prisma.virtueScore.findMany({
      where: {
        date: {
          gte: startDate,
          lte: endDate
        }
      },
      orderBy: {
        date: 'desc'
      },
      take: days
    });
    
    // Calculate average scores
    const totalScores = virtueScores.reduce((acc: any, score: any) => ({
      wisdom: acc.wisdom + score.wisdom,
      courage: acc.courage + score.courage,
      justice: acc.justice + score.justice,
      temperance: acc.temperance + score.temperance
    }), { wisdom: 0, courage: 0, justice: 0, temperance: 0 });
    
    const count = virtueScores.length || 1;
    const averageScores = {
      wisdom: Math.round(totalScores.wisdom / count),
      courage: Math.round(totalScores.courage / count),
      justice: Math.round(totalScores.justice / count),
      temperance: Math.round(totalScores.temperance / count)
    };
    
    return NextResponse.json({
      scores: averageScores,
      recentScores: virtueScores,
      days: days
    });
  } catch (error) {
    console.error('Error fetching virtue progress:', error);
    return NextResponse.json(
      { error: 'Failed to fetch virtue progress' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const data = safeParse(zVirtueScore, body);
    
    // For now, use a default user ID (in production, get from auth)
    const userId = 1;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // Upsert today's virtue scores
    const virtueScore = await prisma.virtueScore.upsert({
      where: {
        userId_date: {
          userId,
          date: today
        }
      },
      update: {
        wisdom: data.wisdom,
        courage: data.courage,
        justice: data.justice,
        temperance: data.temperance,
        note: data.note
      },
      create: {
        userId,
        date: today,
        wisdom: data.wisdom,
        courage: data.courage,
        justice: data.justice,
        temperance: data.temperance,
        note: data.note
      }
    });
    
    return NextResponse.json({
      success: true,
      virtueScore
    });
  } catch (error) {
    console.error('Error updating virtue scores:', error);
    if (error instanceof Response) return error;
    return NextResponse.json(
      { error: 'Failed to update virtue scores' },
      { status: 500 }
    );
  }
}

// Helper functions for mock data
function getVirtueLevel(virtue: string): string {
  const levels = ['Apprentice', 'Student', 'Practitioner', 'Guide', 'Master'];
  const randomIndex = Math.floor(Math.random() * levels.length);
  return levels[randomIndex];
}

function getFavoritePractice(virtue: string): string {
  const practices = {
    wisdom: ['Socratic Dialogue', 'Contemplative Reading', 'Evening Reflection'],
    courage: ['Cold Exposure', 'Public Speaking', 'Boundary Setting'],
    justice: ['Active Listening', 'Fair Decision Making', 'Community Service'],
    temperance: ['Mindful Breathing', 'Digital Detox', 'Gratitude Practice']
  };
  
  const virtuePractices = practices[virtue as keyof typeof practices] || ['Daily Practice'];
  const randomIndex = Math.floor(Math.random() * virtuePractices.length);
  return virtuePractices[randomIndex];
} 