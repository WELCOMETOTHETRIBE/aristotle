import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    console.log('🔍 Testing Prisma client...');
    
    // Test basic connection
    const userCount = await prisma.user.count();
    console.log('✅ User count:', userCount);
    
    // Test CommunityPost model specifically
    try {
      const postCount = await prisma.communityPost.count();
      console.log('✅ CommunityPost count:', postCount);
      
      // Try to find a specific post
      const posts = await prisma.communityPost.findMany({
        take: 1,
        include: {
          author: {
            select: {
              id: true,
              username: true,
            }
          }
        }
      });
      console.log('✅ Found posts:', posts.length);
      
      return NextResponse.json({
        success: true,
        userCount,
        postCount,
        postsFound: posts.length,
        modelNames: Object.keys(prisma),
        timestamp: new Date().toISOString()
      });
      
    } catch (postError) {
      console.error('❌ CommunityPost model error:', postError);
      return NextResponse.json({
        success: false,
        error: 'CommunityPost model failed',
        details: postError instanceof Error ? postError.message : 'Unknown error',
        userCount,
        modelNames: Object.keys(prisma),
        timestamp: new Date().toISOString()
      }, { status: 500 });
    }
    
  } catch (error) {
    console.error('❌ Prisma test failed:', error);
    return NextResponse.json({
      success: false,
      error: 'Prisma connection failed',
      details: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
} 