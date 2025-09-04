import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { GoalSchema } from '@/lib/validators';
import { verifyToken } from '@/lib/auth';
import { prisma } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    // Get user ID from authentication
    let userId: number | null = null;
    
    // Try Bearer token first
    const authHeader = request.headers.get('authorization');
    if (authHeader) {
      const token = authHeader.replace('Bearer ', '');
      const payload = await verifyToken(token);
      if (payload) {
        userId = payload.userId;
      }
    }
    
    // If no Bearer token, try cookie-based auth
    if (!userId) {
      try {
        const cookieHeader = request.headers.get('cookie');
        if (cookieHeader) {
          const response = await fetch(`${request.nextUrl.origin}/api/auth/me`, {
            headers: { cookie: cookieHeader }
          });
          
          if (response.ok) {
            const authData = await response.json();
            if (authData.user && authData.user.id) {
              userId = authData.user.id;
            }
          }
        }
      } catch (error) {
        console.error('Cookie auth check failed:', error);
      }
    }
    
    // Require authentication
    if (!userId) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }
    
    const goals = await prisma.goal.findMany({
      where: { userId: userId },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(goals);
  } catch (error) {
    console.error('Goals GET error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch goals' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const goalData = GoalSchema.parse(body);
    
    // Get user ID from authentication
    let userId: number | null = null;
    
    // Try Bearer token first
    const authHeader = request.headers.get('authorization');
    if (authHeader) {
      const token = authHeader.replace('Bearer ', '');
      const payload = await verifyToken(token);
      if (payload) {
        userId = payload.userId;
      }
    }
    
    // If no Bearer token, try cookie-based auth
    if (!userId) {
      try {
        const cookieHeader = request.headers.get('cookie');
        if (cookieHeader) {
          const response = await fetch(`${request.nextUrl.origin}/api/auth/me`, {
            headers: { cookie: cookieHeader }
          });
          
          if (response.ok) {
            const authData = await response.json();
            if (authData.user && authData.user.id) {
              userId = authData.user.id;
            }
          }
        }
      } catch (error) {
        console.error('Cookie auth check failed:', error);
      }
    }
    
    // Require authentication
    if (!userId) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }
    
    const goal = await prisma.goal.create({
      data: {
        userId: userId,
        title: goalData.title,
        description: goalData.description,
        category: goalData.category,
      },
    });

    return NextResponse.json(goal);
  } catch (error) {
    console.error('Goals POST error:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid goal data', details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to create goal' },
      { status: 500 }
    );
  }
} 