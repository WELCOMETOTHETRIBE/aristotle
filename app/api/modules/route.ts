import { prisma } from "@/lib/db";

// Force dynamic rendering
export const dynamic = 'force-dynamic';

export async function GET() {
  if (!prisma) {
    return new Response("Database not available", { status: 503 });
  }
  
  const modules = await prisma.module.findMany({
    orderBy: { name: "asc" },
    include: {
      levels: { orderBy: { level: "asc" } },
      virtueMaps: true
    }
  });
  return Response.json(modules);
} 