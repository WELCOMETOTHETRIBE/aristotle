import { NextRequest, NextResponse } from 'next/server';
import { generateWithCache, PracticeDetailSchema } from '@/lib/ai';

export async function POST(request: NextRequest) {
  try {
    const { frameworkId, frameworkName, frameworkTone } = await request.json();
    
    const prompt = `Generate a wisdom resource for the ${frameworkName} tradition (${frameworkTone} tone).
    
    Requirements:
    - Create a practical wisdom resource that embodies ${frameworkName} principles
    - Include key ideas that can be applied to daily life
    - Provide micro-practices for immediate implementation
    - Add reflection questions for deeper contemplation
    - Make it relevant for modern practitioners
    
    Format the response as JSON with:
    - title: a compelling title for the resource
    - thinker: a relevant historical figure or source
    - era: the historical period or context
    - type: the type of resource (capsule, practice, reflection, etc.)
    - estMinutes: estimated time to engage with this resource (5-30 minutes)
    - keyIdeas: array of 2-3 key concepts to remember
    - microPractices: array of 2-3 simple practices to try
    - reflections: array of 1-2 reflection questions
    - level: difficulty level (Beginner, Intermediate, Advanced)`;

    const resource = await generateWithCache(
      'practice_detail',
      { 
        frameworkId,
        frameworkName,
        frameworkTone,
        type: 'framework_resource'
      },
      PracticeDetailSchema,
      prompt
    );

    return NextResponse.json({
      id: `ai-generated-${Date.now()}`,
      title: resource.title,
      thinker: resource.safety_reminders?.[0] || 'Ancient Sage', // Using safety_reminders for thinker
      era: 'Timeless',
      type: 'capsule',
      estMinutes: resource.est_time_min || 15,
      keyIdeas: resource.bullets || ['Foundational principles', 'Practical application'],
      microPractices: resource.coach_prompts || ['Daily reflection', 'Mindful practice'],
      reflections: resource.safety_reminders?.slice(1) || ['How does this wisdom apply today?'],
      level: 'Beginner'
    });

  } catch (error) {
    console.error('Error generating framework resource:', error);
    
    // Fallback resource
    return NextResponse.json({
      id: 'fallback-1',
      title: 'Ancient Wisdom',
      thinker: 'Ancient Sage',
      era: 'Timeless',
      type: 'capsule',
      estMinutes: 5,
      keyIdeas: ['Foundational principles', 'Practical application'],
      microPractices: ['Daily reflection', 'Mindful practice'],
      reflections: ['How does this wisdom apply today?'],
      level: 'Beginner'
    });
  }
} 