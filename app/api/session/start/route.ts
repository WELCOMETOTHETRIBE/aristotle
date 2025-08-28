import { prisma } from "@/lib/db";

export async function POST(req: Request) {
  const body = await req.json();
  const { userId = 1, moduleId, practiceId, frameworkId } = body;
  
  const s = await prisma.session.create({ 
    data: { 
      userId, 
      moduleId, 
      practiceId, 
      frameworkId 
    }
  });
  return Response.json({ sessionId: s.id });
} 