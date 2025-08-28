import { prisma } from "@/lib/db";

export async function GET() {
  const rows = await prisma.framework.findMany({ 
    orderBy: { name: "asc" },
    include: {
      moduleMaps: {
        include: {
          module: true
        }
      }
    }
  });
  return Response.json(rows);
} 