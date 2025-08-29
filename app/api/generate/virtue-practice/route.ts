import { prisma } from "@/lib/db";
import { generateWithCache, PracticeDetailSchema } from "@/lib/ai";
import { virtuePracticePrompt } from "@/lib/prompts";

export async function GET(req: Request) {
  if (!prisma) {
    return new Response("Database not available", { status: 503 });
  }
  
  const url = new URL(req.url);
  const id = url.searchParams.get("id");
  const style = url.searchParams.get("style") || "aristotle";
  const locale = url.searchParams.get("locale") || "en";
  
  if (!id) {
    return new Response("Virtue practice ID required", { status: 400 });
  }

  const practice = await prisma.virtuePractice.findUnique({ 
    where: { id: parseInt(id) }
  });
  
  if (!practice) {
    return new Response("Virtue practice not found", { status: 404 });
  }

  const prompt = virtuePracticePrompt({
    title: practice.title,
    virtue: practice.virtue,
    shortDesc: practice.shortDesc,
    safety: practice.safety,
    measurement: practice.measurement,
    style,
    locale
  });

  const payload = await generateWithCache(
    "virtue_practice_detail",
    { virtuePracticeId: practice.id, style, locale },
    PracticeDetailSchema,
    prompt
  );

  return Response.json(payload);
} 