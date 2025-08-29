import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const slug = searchParams.get('slug');

    if (!slug) {
      return NextResponse.json(
        { error: 'Slug parameter is required' },
        { status: 400 }
      );
    }

    const practice = await prisma.virtuePractice.findUnique({
      where: { slug }
    });

    if (!practice) {
      return NextResponse.json(
        { error: 'Practice not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(practice);
  } catch (error) {
    console.error('Error loading virtue practice:', error);
    return NextResponse.json(
      { error: 'Failed to load virtue practice' },
      { status: 500 }
    );
  }
} 