import { NextRequest, NextResponse } from 'next/server';
import { generateWithCache, PracticeDetailSchema } from '@/lib/ai';

export async function POST(request: NextRequest) {
  try {
    const { topic, difficulty, focus } = await request.json();
    
    const prompt = `Generate a learning resource about ${topic || 'ancient wisdom'} for ${difficulty || 'beginner'} level learners.
    
    Requirements:
    - Create an engaging learning resource that teaches ${topic || 'ancient wisdom'} principles
    - Focus on ${focus || 'practical application'} 
    - Include structured lessons with clear learning objectives
    - Provide reflection questions and practical exercises
    - Make it accessible for ${difficulty || 'beginner'} level understanding
    
    Format the response as JSON with:
    - title: an engaging title for the learning resource
    - author: a relevant expert or source
    - description: a compelling description of what will be learned
    - difficulty: the learning level (beginner, intermediate, advanced)
    - estimatedTime: estimated time to complete the resource (15-60 minutes)
    - lessons: array of lesson objects with title, content, questions, and practices`;

    const resource = await generateWithCache(
      'practice_detail',
      { 
        topic: topic || 'ancient wisdom',
        difficulty: difficulty || 'beginner',
        focus: focus || 'practical application',
        type: 'learning_resource'
      },
      PracticeDetailSchema,
      prompt
    );

    // Create a structured learning resource from the AI response
    const lessons = [
      {
        id: 'lesson-1',
        title: resource.title,
        content: resource.body,
        questions: (resource.coach_prompts || []).map((prompt, index) => ({
          id: `q-${index + 1}`,
          question: prompt,
          type: 'text'
        })),
        practices: (resource.safety_reminders || []).map((reminder, index) => ({
          id: `p-${index + 1}`,
          title: `Practice ${index + 1}`,
          description: reminder,
          instructions: [reminder]
        })),
        isCompleted: false
      }
    ];

    return NextResponse.json({
      id: `ai-learning-${Date.now()}`,
      title: resource.title,
      author: (resource.safety_reminders || [])[0] || 'Ancient Sage',
      description: resource.body,
      difficulty: difficulty || 'beginner',
      estimatedTime: resource.est_time_min,
      lessons: lessons
    });

  } catch (error) {
    console.error('Error generating learning resource:', error);
    
    // Fallback learning resource
    return NextResponse.json({
      id: 'fallback-learning',
      title: 'Meditations by Marcus Aurelius',
      author: 'Marcus Aurelius',
      description: 'A practical guide to Stoic philosophy and daily reflection.',
      difficulty: 'beginner',
      estimatedTime: 30,
      lessons: [
        {
          id: 'lesson-1',
          title: 'Introduction to Stoicism',
          content: 'Stoicism is a philosophy that teaches us to focus on what we can control and accept what we cannot.',
          questions: [
            {
              id: 'q-1',
              question: 'What aspects of your life are within your control?',
              type: 'text'
            }
          ],
          practices: [
            {
              id: 'p-1',
              title: 'Daily Reflection',
              description: 'Take time each day to reflect on your actions and thoughts.',
              instructions: ['Find a quiet moment', 'Reflect on your day', 'Consider what you can improve']
            }
          ],
          isCompleted: false
        }
      ]
    });
  }
} 