import { NextRequest, NextResponse } from 'next/server';
import { generateWithCache, PracticeDetailSchema } from '@/lib/ai';

export async function POST(request: NextRequest) {
  try {
    const { virtue, userLevel, interests } = await request.json();
    
    const getVirtuePrompt = (virtue: string) => {
      switch (virtue.toLowerCase()) {
        case 'wisdom':
          return `Generate 3 personalized wisdom insights for a ${userLevel} level practitioner interested in ${interests.join(', ')}.
          
          Focus on:
          - Practical wisdom that can be applied immediately
          - Insights that build on the user's current level
          - Connections to their specific interests
          - Actionable advice for growth
          
          Format as an array of 3 concise, inspiring insights (max 100 words each).`;
          
        case 'courage':
          return `Generate 3 personalized courage insights for a ${userLevel} level practitioner interested in ${interests.join(', ')}.
          
          Focus on:
          - Building mental and emotional resilience
          - Overcoming specific fears and challenges
          - Developing inner strength and confidence
          - Practical courage exercises
          
          Format as an array of 3 concise, motivating insights (max 100 words each).`;
          
        case 'justice':
          return `Generate 3 personalized justice insights for a ${userLevel} level practitioner interested in ${interests.join(', ')}.
          
          Focus on:
          - Fairness in relationships and decisions
          - Balancing competing interests
          - Building trust and integrity
          - Contributing to community well-being
          
          Format as an array of 3 concise, ethical insights (max 100 words each).`;
          
        case 'temperance':
          return `Generate 3 personalized temperance insights for a ${userLevel} level practitioner interested in ${interests.join(', ')}.
          
          Focus on:
          - Finding balance and moderation
          - Self-control and discipline
          - Mindful consumption and habits
          - Inner peace and harmony
          
          Format as an array of 3 concise, balanced insights (max 100 words each).`;
          
        default:
          return `Generate 3 personalized insights for a ${userLevel} level practitioner interested in ${interests.join(', ')}.
          
          Focus on:
          - Practical application of virtue
          - Personal growth and development
          - Meaningful insights for daily life
          
          Format as an array of 3 concise, inspiring insights (max 100 words each).`;
      }
    };

    const prompt = getVirtuePrompt(virtue);
    
    const insights = await generateWithCache(
      'practice_detail',
      { 
        virtue,
        userLevel,
        interests: interests.join(', ')
      },
      PracticeDetailSchema,
      prompt
    );

    return NextResponse.json(insights);

  } catch (error) {
    console.error('Error generating virtue insights:', error);
    
    // Fallback insights
    const fallbackInsights = {
      insights: [
        "Every challenge is an opportunity to grow wiser. Embrace difficulties as teachers.",
        "True wisdom comes from understanding that you don't know everything.",
        "Reflect daily on your experiences to extract meaningful lessons."
      ]
    };
    
    return NextResponse.json(fallbackInsights);
  }
} 