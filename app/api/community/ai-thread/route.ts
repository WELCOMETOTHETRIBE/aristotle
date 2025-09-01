import { NextRequest, NextResponse } from 'next/server';
import { PHILOSOPHERS } from '@/lib/philosophers';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    // Select a random philosopher for today's thread
    const randomPhilosopher = PHILOSOPHERS[Math.floor(Math.random() * PHILOSOPHERS.length)];
    
    // Get today's date for context
    const today = new Date();
    const dayOfWeek = today.toLocaleDateString('en-US', { weekday: 'long' });
    const month = today.toLocaleDateString('en-US', { month: 'long' });
    const day = today.getDate();

    // Create the AI thread generation prompt
    const prompt = `You are ${randomPhilosopher.name}, ${randomPhilosopher.title}. 

Today is ${dayOfWeek}, ${month} ${day}. You are creating a daily philosophical discussion thread for a community of wisdom seekers.

Please create a thought-provoking thread that:
1. Relates to current events, seasons, or universal human experiences
2. Draws from your philosophical teachings and perspective
3. Encourages community discussion and reflection
4. Is relevant to modern life while honoring ancient wisdom
5. Has a compelling title and engaging opening content
6. Includes 2-3 discussion questions to spark conversation
7. Relates to one of these categories: Stoicism, Aristotelian Ethics, Courage, Wisdom, Justice, or Temperance

Format your response as:
Title: [Your thread title]
Content: [Your opening post content - 3-4 sentences]
Category: [Choose one of the categories above]
Tags: [3-5 relevant tags separated by commas]

Respond as ${randomPhilosopher.name} would, using your unique voice and wisdom.`;

    // Call the AI API to generate the thread
    const aiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: randomPhilosopher.systemPrompt
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 400,
        temperature: 0.8,
      }),
    });

    if (!aiResponse.ok) {
      throw new Error('Failed to generate AI thread');
    }

    const aiData = await aiResponse.json();
    const aiThreadContent = aiData.choices[0].message.content.trim();

    // Parse the AI response to extract title, content, category, and tags
    const titleMatch = aiThreadContent.match(/Title:\s*(.+)/);
    const contentMatch = aiThreadContent.match(/Content:\s*(.+)/);
    const categoryMatch = aiThreadContent.match(/Category:\s*(.+)/);
    const tagsMatch = aiThreadContent.match(/Tags:\s*(.+)/);

    const title = titleMatch ? titleMatch[1].trim() : `Daily Wisdom from ${randomPhilosopher.name}`;
    const content = contentMatch ? contentMatch[1].trim() : aiThreadContent;
    const category = categoryMatch ? categoryMatch[1].trim() : 'Wisdom';
    const tags = tagsMatch ? tagsMatch[1].split(',').map((tag: string) => tag.trim()) : ['daily-wisdom', 'philosophy'];

    // Extract AI insights from the content
    const aiInsights = extractAIInsights(content);

    // Create a system user for AI posts (or use a default user ID)
    // For now, we'll use a default user ID that should exist in the database
    const defaultUserId = 1; // This should be a valid user ID in your database

    // Save the AI thread to the database
    const savedThread = await prisma.communityPost.create({
      data: {
        title,
        content,
        authorId: defaultUserId,
        type: 'ai_question',
        category,
        tags,
        isAIQuestion: true,
        aiInsights,
        views: 0,
      },
      include: {
        author: {
          select: {
            id: true,
            username: true,
            displayName: true,
          },
        },
        _count: {
          select: {
            replies: true,
            likes: true,
          },
        },
      },
    });

    console.log('AI thread saved to database successfully:', { 
      id: savedThread.id, 
      title, 
      category, 
      tags 
    });

    return NextResponse.json({
      success: true,
      thread: {
        id: savedThread.id,
        title: savedThread.title,
        content: savedThread.content,
        category: savedThread.category,
        tags: savedThread.tags,
        author: {
          name: randomPhilosopher.name,
          avatar: randomPhilosopher.avatar,
          isAI: true,
          persona: randomPhilosopher.title,
        },
        createdAt: savedThread.createdAt.toISOString(),
        replies: savedThread._count.replies,
        views: savedThread.views,
        likes: savedThread._count.likes,
      },
      philosopher: {
        id: randomPhilosopher.id,
        name: randomPhilosopher.name,
        title: randomPhilosopher.title,
        avatar: randomPhilosopher.avatar,
      }
    });

  } catch (error) {
    console.error('Error generating AI thread:', error);
    return NextResponse.json({ error: 'Failed to generate AI thread' }, { status: 500 });
  }
}

// Helper function to extract AI insights from content
function extractAIInsights(content: string): string[] {
  const insights: string[] = [];
  
  // Extract key philosophical concepts and insights
  const philosophicalTerms = [
    'virtue', 'wisdom', 'courage', 'justice', 'temperance', 'eudaimonia', 'stoicism',
    'mindfulness', 'resilience', 'growth', 'reflection', 'practice', 'discipline',
    'balance', 'harmony', 'truth', 'knowledge', 'understanding', 'perspective'
  ];
  
  // Look for sentences that contain philosophical terms
  const sentences = content.split(/[.!?]+/).filter(s => s.trim().length > 10);
  
  sentences.forEach(sentence => {
    const lowerSentence = sentence.toLowerCase();
    const hasPhilosophicalTerm = philosophicalTerms.some(term => 
      lowerSentence.includes(term)
    );
    
    if (hasPhilosophicalTerm && sentence.trim().length > 20) {
      insights.push(sentence.trim());
    }
  });
  
  // If no philosophical insights found, create general insights
  if (insights.length === 0) {
    insights.push('This discussion touches on important philosophical themes');
    insights.push('Consider how this relates to your personal growth journey');
  }
  
  // Limit to 3 insights maximum
  return insights.slice(0, 3);
} 