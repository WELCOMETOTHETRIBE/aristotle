import { prisma } from "@/lib/db";

// Force dynamic rendering
export const dynamic = 'force-dynamic';

export async function GET() {
  const userId = 1; // placeholder user
  const since = new Date(Date.now() - 14 * 24 * 3600 * 1000);
  
  const recent = await prisma.session.findMany({
    where: { 
      userId, 
      startedAt: { gte: since }, 
      moduleId: { not: null } 
    },
    select: { moduleId: true }
  });
  
  const weights = await prisma.moduleVirtueMap.findMany();
  const map = new Map<string, { virtue: string; weight: number }[]>();
  
  for (const w of weights) {
    const arr = map.get(w.moduleId) || [];
    arr.push({ virtue: w.virtue, weight: w.weight });
    map.set(w.moduleId, arr);
  }
  
  const scores: Record<string, number> = { 
    Wisdom: 0, 
    Courage: 0, 
    Temperance: 0, 
    Justice: 0 
  };
  
  for (const r of recent) {
    const vs = map.get(r.moduleId!);
    if (!vs) continue;
    for (const v of vs) scores[v.virtue] = Math.min(100, scores[v.virtue] + v.weight);
  }
  
  return Response.json(scores);
} 