import { prisma } from "@/lib/db";
import { generateWithCache, PracticeDetailSchema } from "@/lib/ai";
import { practiceDetailPrompt } from "@/lib/prompts";

export async function GET(req: Request) {
  if (!prisma) {
    return new Response("Database not available", { status: 503 });
  }
  
  const url = new URL(req.url);
  const moduleId = url.searchParams.get("moduleId")!;
  const level = (url.searchParams.get("level") || "Beginner")!;
  const style = url.searchParams.get("style") || "aristotle";
  const locale = url.searchParams.get("locale") || "en";
  
  const mod = await prisma.module.findUnique({ where: { id: moduleId }});
  if (!mod) return new Response("Module not found", { status: 404 });

  const baseFacts = {
    safety: (mod.contraindications ? [mod.contraindications] : []),
    measurement: (mod.measurement ? [mod.measurement] : [])
  };

  const prompt = practiceDetailPrompt({
    moduleName: mod.name, level, style, locale, baseFacts
  });

  const payload = await generateWithCache(
    "practice_detail",
    { moduleId, level, style, locale },
    PracticeDetailSchema,
    prompt
  );

  return Response.json(payload);
} 