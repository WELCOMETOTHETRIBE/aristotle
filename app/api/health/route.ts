import { NextResponse } from 'next/server';
import { z } from 'zod';

// Health check response schema
const HealthResponseSchema = z.object({
  status: z.enum(['healthy', 'unhealthy']),
  timestamp: z.string(),
  service: z.string()
});

export async function GET() {
  try {
    // Simple health check that doesn't require database
    const healthData = {
      status: 'healthy' as const,
      timestamp: new Date().toISOString(),
      service: 'Aion - Aristotle-Inspired Life Coach'
    };
    
    // Validate response data
    const validationResult = HealthResponseSchema.safeParse(healthData);
    if (!validationResult.success) {
      return NextResponse.json(
        { 
          status: 'unhealthy', 
          error: 'Health check validation failed',
          timestamp: new Date().toISOString()
        },
        { status: 500 }
      );
    }
    
    return NextResponse.json(healthData, { status: 200 });
  } catch (error) {
    console.error('Health check error:', error);
    return NextResponse.json(
      { 
        status: 'unhealthy', 
        error: 'Health check failed',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
} 