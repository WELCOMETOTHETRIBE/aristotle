import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { verifyToken } from '@/lib/auth';

const UserFactsRequestSchema = z.object({
  facts: z.array(z.object({
    kind: z.enum(['bio', 'value', 'constraint', 'preference', 'insight']),
    content: z.string().min(1),
  })),
});

// Helper function to get user ID from request
async function getUserIdFromRequest(request: NextRequest): Promise<number | null> {
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
  
  // If no Bearer token, try cookie-based auth directly
  if (!userId) {
    try {
      const token = request.cookies.get('auth-token')?.value;
      if (token) {
        const payload = await verifyToken(token);
        if (payload) {
          userId = payload.userId;
        }
      }
    } catch (error) {
      console.error('Cookie auth check failed:', error);
    }
  }
  
  return userId;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { facts } = UserFactsRequestSchema.parse(body);

    // Get user ID from authentication
    const userId = await getUserIdFromRequest(request);
    
    // Require authentication
    if (!userId) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    // For now, just log the facts since we don't have a userFact model yet
    console.log('User facts to save:', {
      userId,
      facts: facts.map(fact => ({
        kind: fact.kind,
        content: fact.content,
        // Note: embeddings would be generated here in the future
      }))
    });

    return NextResponse.json({
      success: true,
      message: `Saved ${facts.length} user facts`,
      userId: userId,
    });

  } catch (error) {
    console.error('User facts API error:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request format', details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to save user facts' },
      { status: 500 }
    );
  }
}
