import { prisma } from "@/lib/db";

// Force dynamic rendering
export const dynamic = 'force-dynamic';

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