import { NextRequest, NextResponse } from 'next/server';
import { generateWithCache, FrameworkResourceSchema } from '@/lib/ai';

export async function POST(request: NextRequest) {
  try {
    const { frameworkId, frameworkName, frameworkTone, type = 'wisdom' } = await request.json();
    
    const getPromptByType = (type: string) => {
      const basePrompt = `Generate a wisdom resource for the ${frameworkName} tradition (${frameworkTone} tone).`;
      
      switch (type) {
        case 'practice':
          return `${basePrompt}
          
          Focus on practical exercises and daily practices that embody ${frameworkName} principles.
          Create actionable steps that can be implemented immediately in daily life.
          
          Requirements:
          - Provide specific, actionable practices that can be done in 5-15 minutes
          - Include physical, mental, and behavioral exercises
          - Make practices accessible for beginners but meaningful for all levels
          - Connect each practice to core ${frameworkName} principles
          
          Format the response as JSON with:
          - title: a compelling title for the practice resource
          - thinker: a relevant historical figure or source from ${frameworkName} tradition
          - era: the historical period or context
          - type: "practice"
          - estMinutes: estimated time to engage with this resource (5-15 minutes)
          - keyIdeas: array of 2-3 core principles this practice develops
          - microPractices: array of 3-4 specific, actionable practice steps
          - reflections: array of 1-2 reflection questions about the practice
          - level: difficulty level (Beginner, Intermediate, Advanced)`;

        case 'reflection':
          return `${basePrompt}
          
          Focus on deep contemplation and self-examination using ${frameworkName} wisdom.
          Create opportunities for meaningful introspection and personal growth.
          
          Requirements:
          - Provide thought-provoking questions that encourage self-examination
          - Include both analytical and intuitive reflection approaches
          - Connect reflection to daily life and modern challenges
          - Encourage deeper understanding of ${frameworkName} principles
          
          Format the response as JSON with:
          - title: a compelling title for the reflection resource
          - thinker: a relevant historical figure or source from ${frameworkName} tradition
          - era: the historical period or context
          - type: "reflection"
          - estMinutes: estimated time to engage with this resource (10-20 minutes)
          - keyIdeas: array of 2-3 philosophical concepts to contemplate
          - microPractices: array of 2-3 reflection techniques or approaches
          - reflections: array of 2-3 deep, open-ended reflection questions
          - level: difficulty level (Beginner, Intermediate, Advanced)`;

        case 'wisdom':
        default:
          return `${basePrompt}
          
          Create a comprehensive wisdom resource that captures the essence of ${frameworkName} philosophy.
          Balance theoretical understanding with practical application for modern life.
          
          Requirements:
          - Present core ${frameworkName} principles in an accessible way
          - Include both theoretical understanding and practical application
          - Make wisdom relevant to contemporary challenges and daily life
          - Provide a balanced mix of learning and doing
          
          Format the response as JSON with:
          - title: a compelling title for the wisdom resource
          - thinker: a relevant historical figure or source from ${frameworkName} tradition
          - era: the historical period or context
          - type: "wisdom"
          - estMinutes: estimated time to engage with this resource (15-30 minutes)
          - keyIdeas: array of 3-4 fundamental ${frameworkName} principles
          - microPractices: array of 2-3 practical applications of the wisdom
          - reflections: array of 2-3 questions for deeper contemplation
          - level: difficulty level (Beginner, Intermediate, Advanced)`;
      }
    };

    const prompt = getPromptByType(type);

    const resource = await generateWithCache(
      'framework_resource',
      { 
        frameworkId,
        frameworkName,
        frameworkTone,
        type,
        resourceType: type
      },
      FrameworkResourceSchema,
      prompt
    );

    // Enhance the resource with additional metadata
    const enhancedResource = {
      id: `ai-generated-${type}-${Date.now()}`,
      ...resource,
      // Add framework-specific enhancements
      frameworkId,
      frameworkName,
      generatedAt: new Date().toISOString(),
      aiGenerated: true,
      // Add default values for missing fields
      estMinutes: resource.estMinutes || 15,
      level: resource.level || 'Beginner',
      keyIdeas: resource.keyIdeas || ['Core principle', 'Practical application'],
      microPractices: resource.microPractices || ['Daily practice', 'Mindful reflection'],
      reflections: resource.reflections || ['How does this apply to your life?'],
      // Add metadata for tracking
      metadata: {
        generationType: type,
        frameworkTone,
        timestamp: new Date().toISOString()
      }
    };

    return NextResponse.json(enhancedResource);

  } catch (error) {
    console.error('Error generating framework resource:', error);
    
    // Enhanced fallback resource
    const fallbackResource = {
      id: `fallback-${Date.now()}`,
      title: 'Ancient Wisdom for Modern Life',
      thinker: 'Ancient Sage',
      era: 'Timeless',
      type: 'wisdom',
      estMinutes: 15,
      keyIdeas: [
        'Foundational principles of wisdom',
        'Practical application in daily life',
        'Continuous growth and learning'
      ],
      microPractices: [
        'Morning reflection on intentions',
        'Mindful practice throughout the day',
        'Evening review of experiences'
      ],
      reflections: [
        'How did I embody wisdom today?',
        'What can I learn from today\'s challenges?',
        'How can I apply this wisdom tomorrow?'
      ],
      level: 'Beginner',
      frameworkId: 'unknown',
      frameworkName: 'Ancient Wisdom',
      generatedAt: new Date().toISOString(),
      aiGenerated: false,
      metadata: {
        generationType: 'fallback',
        frameworkTone: 'neutral',
        timestamp: new Date().toISOString()
      }
    };
    
    return NextResponse.json(fallbackResource);
  }
} 