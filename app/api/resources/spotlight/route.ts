import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const frameworkId = searchParams.get('frameworkId');
    const limit = parseInt(searchParams.get('limit') || '3');
    
    if (!frameworkId) {
      return NextResponse.json(
        { error: 'Framework ID is required' },
        { status: 400 }
      );
    }
    
    // Get resources for the framework
    const resources = await prisma.resource.findMany({
      where: {
        // In a real implementation, you'd have a framework-resource mapping
        // For now, we'll use a simple filter based on resource type
        type: {
          in: ['book', 'article', 'video', 'podcast']
        }
      },
      take: limit,
      orderBy: {
        id: 'asc' // In real app, you'd order by relevance/rating
      }
    });
    
    // Transform resources to spotlight format
    const spotlightResources = resources.map((resource: any) => ({
      id: resource.id,
      title: resource.title,
      author: resource.thinker || 'Unknown',
      type: resource.type,
      estMinutes: resource.estMinutes || 30,
      keyIdeas: resource.keyIdeas ? JSON.parse(resource.keyIdeas) : [],
      bullets: resource.keyIdeas ? JSON.parse(resource.keyIdeas).slice(0, 3) : [
        'Core principle of the framework',
        'Practical application method',
        'Expected benefits and outcomes'
      ]
    }));
    
    // If we don't have enough resources, add some framework-specific defaults
    if (spotlightResources.length < limit) {
      const frameworkDefaults = {
        'stoic': [
          {
            id: 'stoic-meditations',
            title: 'Meditations by Marcus Aurelius',
            author: 'Marcus Aurelius',
            type: 'book',
            estMinutes: 45,
            bullets: [
              'Daily reflections on virtue and resilience',
              'Practical wisdom for modern challenges',
              'Timeless principles of self-mastery'
            ]
          },
          {
            id: 'stoic-letters',
            title: 'Letters from a Stoic',
            author: 'Seneca',
            type: 'book',
            estMinutes: 30,
            bullets: [
              'Personal guidance on living well',
              'Advice on handling adversity',
              'Philosophy as practical wisdom'
            ]
          }
        ],
        'spartan': [
          {
            id: 'spartan-discipline',
            title: 'The Spartan Way',
            author: 'Ancient Sources',
            type: 'article',
            estMinutes: 20,
            bullets: [
              'Physical and mental discipline',
              'Endurance through adversity',
              'Leadership through example'
            ]
          }
        ],
        'bushido': [
          {
            id: 'bushido-code',
            title: 'Bushido: The Soul of Japan',
            author: 'Inazo Nitobe',
            type: 'book',
            estMinutes: 40,
            bullets: [
              'The seven virtues of the samurai',
              'Honor and ethical conduct',
              'Spiritual development through practice'
            ]
          }
        ]
      };
      
      const defaults = frameworkDefaults[frameworkId as keyof typeof frameworkDefaults] || [];
      spotlightResources.push(...defaults.slice(0, limit - spotlightResources.length));
    }
    
    return NextResponse.json({
      frameworkId,
      resources: spotlightResources.slice(0, limit),
      count: spotlightResources.length
    });
  } catch (error) {
    console.error('Error fetching resource spotlight:', error);
    return NextResponse.json(
      { error: 'Failed to fetch resource spotlight' },
      { status: 500 }
    );
  }
} 