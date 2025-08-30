import { prisma } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { userId = 1, moduleId, practiceId, frameworkId } = body;
    
    console.log('Starting session with data:', { userId, moduleId, practiceId, frameworkId });
    
    // Convert practiceId to number if it's a string and not null
    const numericPracticeId = practiceId ? parseInt(practiceId) : null;
    
    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { id: userId }
    });
    
    if (!user) {
      console.error('User not found:', userId);
      return Response.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }
    
    // Check if module exists if moduleId is provided
    if (moduleId) {
      const module = await prisma.module.findUnique({
        where: { id: moduleId }
      });
      
      if (!module) {
        console.error('Module not found:', moduleId);
        return Response.json(
          { error: 'Module not found' },
          { status: 404 }
        );
      }
    }
    
    // Check if practice exists if practiceId is provided
    let validPracticeId = null;
    if (numericPracticeId) {
      const practice = await prisma.practice.findUnique({
        where: { id: numericPracticeId }
      });
      
      if (!practice) {
        console.warn('Practice not found in database, proceeding without practiceId:', numericPracticeId);
        // Continue without practiceId rather than failing
      } else {
        validPracticeId = numericPracticeId;
      }
    }
    
    // Check if framework exists by slug if frameworkId is provided
    let frameworkDbId = null;
    if (frameworkId) {
      const framework = await prisma.framework.findUnique({
        where: { slug: frameworkId }
      });
      
      if (!framework) {
        console.error('Framework not found:', frameworkId);
        return Response.json(
          { error: 'Framework not found' },
          { status: 404 }
        );
      }
      
      frameworkDbId = framework.id;
    }
    
    const session = await prisma.session.create({ 
      data: { 
        userId, 
        moduleId, 
        practiceId: validPracticeId, 
        frameworkId: frameworkDbId
      }
    });
    
    console.log('Session created successfully:', session.id);
    return Response.json({ sessionId: session.id });
  } catch (error) {
    console.error('Error starting session:', error);
    return Response.json(
      { error: 'Failed to start session', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
} 