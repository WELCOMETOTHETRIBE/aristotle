import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { verifyToken } from '@/lib/auth';

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get('auth-token')?.value;
    if (!token) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const payload = await verifyToken(token);
    if (!payload) {
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { lessonId, lessonTitle, moduleName, milestones, userInputs, aiResponses } = body;

    if (!lessonId || !lessonTitle || !moduleName) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const userId = payload.userId;

    // Create a comprehensive journal entry for the completed lesson
    const journalContent = `# Academy Milestone: ${lessonTitle}

## Module: ${moduleName}
**Lesson Completed:** ${new Date().toLocaleDateString('en-US', { 
  weekday: 'long', 
  year: 'numeric', 
  month: 'long', 
  day: 'numeric' 
})}

## What I Learned
${userInputs.teaching || 'Reflection on teaching section'}

## My Reflection
${userInputs.question || 'Personal response to reflection question'}

## Practice Experience
${userInputs.practice || 'Experience with practice exercise'}

## Reading Insights
${userInputs.reading || 'Analysis of recommended reading'}

## Wisdom Application
${userInputs.quote || 'Personal interpretation of wisdom quote'}

## AI Guidance Received
${Object.entries(aiResponses).map(([section, response]) => 
  response ? `**${section.charAt(0).toUpperCase() + section.slice(1)}:** ${response}` : ''
).filter(Boolean).join('\n\n')}

## Next Steps
Based on this lesson, I will continue to develop my understanding of ${moduleName.toLowerCase()} and apply these insights in my daily life.

---
*This milestone was automatically logged from Aristotle's Academy*`;

    // Save to journal
    const journalEntry = await prisma.journalEntry.create({
      data: {
        userId,
        type: 'reflection',
        content: journalContent,
        prompt: `Academy milestone: ${lessonTitle}`,
        category: 'academy_milestone',
        date: new Date(),
        aiInsights: `Congratulations on completing "${lessonTitle}"! This lesson has contributed to your growth in ${moduleName.toLowerCase()}. Consider how you can apply these insights in your daily life.`
      }
    });

    // Update user's virtue scores based on lesson completion
    // This would integrate with your existing virtue tracking system
    console.log(`Milestone logged for user ${userId}: ${lessonTitle}`);

    return NextResponse.json({
      success: true,
      journalEntry,
      message: 'Milestone logged successfully',
      milestones
    });

  } catch (error) {
    console.error('Error logging milestone:', error);
    return NextResponse.json(
      { error: 'Failed to log milestone' },
      { status: 500 }
    );
  }
} 