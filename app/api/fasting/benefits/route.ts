import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const protocol = searchParams.get('protocol') || '16:8';
    
    // Static benefits data as fallback
    const staticBenefits = {
      '16:8': [
        { type: 'Autophagy', intensity: 3, description: 'Cellular cleanup and renewal' },
        { type: 'Insulin Sensitivity', intensity: 4, description: 'Improved blood sugar regulation' },
        { type: 'Fat Burning', intensity: 4, description: 'Enhanced fat metabolism' },
        { type: 'Mental Clarity', intensity: 3, description: 'Improved focus and cognitive function' },
        { type: 'Inflammation Reduction', intensity: 2, description: 'Lower systemic inflammation' }
      ],
      '18:6': [
        { type: 'Autophagy', intensity: 4, description: 'Enhanced cellular cleanup' },
        { type: 'Ketosis', intensity: 3, description: 'Fat-burning metabolic state' },
        { type: 'Growth Hormone', intensity: 4, description: 'Increased HGH production' },
        { type: 'Brain Function', intensity: 4, description: 'Improved cognitive performance' },
        { type: 'Longevity', intensity: 3, description: 'Potential lifespan extension' }
      ],
      '20:4': [
        { type: 'Deep Autophagy', intensity: 5, description: 'Maximum cellular renewal' },
        { type: 'Ketosis', intensity: 5, description: 'Full fat-burning state' },
        { type: 'Growth Hormone', intensity: 5, description: 'Peak HGH levels' },
        { type: 'Mental Sharpness', intensity: 5, description: 'Exceptional clarity and focus' },
        { type: 'Anti-Aging', intensity: 4, description: 'Advanced anti-aging effects' }
      ]
    };
    
    // Get benefits for the requested protocol
    const benefits = staticBenefits[protocol as keyof typeof staticBenefits] || staticBenefits['16:8'];
    
    return NextResponse.json({
      protocol,
      benefits,
      count: benefits.length
    });
  } catch (error) {
    console.error('Error fetching fasting benefits:', error);
    return NextResponse.json(
      { error: 'Failed to fetch fasting benefits' },
      { status: 500 }
    );
  }
} 