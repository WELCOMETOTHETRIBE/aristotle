import { generateWithCache, ReflectionSchema } from "@/lib/ai";
import { reflectionPrompt } from "@/lib/prompts";
import { prisma } from "@/lib/db";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const sessionId = Number(url.searchParams.get("sessionId"));
  
  const s = await prisma.session.findUnique({ 
    where: { id: sessionId }, 
    include: { module: true }
  });
  if (!s || !s.module) return new Response("Not found", { status: 404 });

  const minutes = s.endedAt ? 
    Math.round((s.endedAt.getTime() - s.startedAt.getTime()) / 60000) : 5;

  const payload = await generateWithCache(
    "reflection",
    { 
      moduleId: s.moduleId, 
      minutes, 
      pre: s.moodPre || 3, 
      post: s.moodPost || 3 
    },
    ReflectionSchema,
    reflectionPrompt({ 
      moduleName: s.module.name, 
      minutes, 
      pre: s.moodPre || 3, 
      post: s.moodPost || 3 
    })
  );
  return Response.json(payload);
} 