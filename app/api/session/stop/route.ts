import { prisma } from "@/lib/db";

export async function POST(req: Request) {
  const body = await req.json();
  const { sessionId, metrics, moodPre, moodPost, notes } = body;
  
  await prisma.session.update({ 
    where: { id: sessionId }, 
    data: { 
      endedAt: new Date(), 
      metrics: JSON.stringify(metrics || {}), 
      moodPre, 
      moodPost, 
      notes 
    }
  });
  return Response.json({ ok: true });
} 