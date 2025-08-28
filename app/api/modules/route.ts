import { prisma } from "@/lib/db";

export async function GET() {
  const modules = await prisma.module.findMany({ 
    orderBy: { name: "asc" },
    include: {
      levels: { orderBy: { level: "asc" } },
      virtueMaps: true
    }
  });
  return Response.json(modules);
} 