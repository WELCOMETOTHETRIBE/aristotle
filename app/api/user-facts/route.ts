import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getOrCreateUser, createUserFacts } from '@/lib/db';
import { generateEmbedding } from '@/lib/embeddings';

const UserFactsRequestSchema = z.object({
  facts: z.array(z.object({
    kind: z.enum(['bio', 'value', 'constraint', 'preference', 'insight']),
    content: z.string().min(1),
  })),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { facts } = UserFactsRequestSchema.parse(body);

    // Get or create user
    const user = await getOrCreateUser('User');

    // Generate embeddings for each fact
    const factsWithEmbeddings = await Promise.all(
      facts.map(async (fact) => ({
        kind: fact.kind,
        content: fact.content,
        embedding: await generateEmbedding(fact.content),
      }))
    );

    // Save to database
    await createUserFacts(user.id, factsWithEmbeddings);

    return NextResponse.json({
      success: true,
      message: `Saved ${facts.length} user facts`,
      userId: user.id,
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