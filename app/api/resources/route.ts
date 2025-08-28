import { prisma } from "@/lib/db";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const thinker = url.searchParams.get("thinker") || undefined;
  const level = url.searchParams.get("level") || undefined;
  const type = url.searchParams.get("type") || undefined;
  
  const rows = await prisma.resource.findMany({
    where: {
      thinker, 
      level, 
      type
    },
    orderBy: { title: "asc" }
  });
  return Response.json(rows);
} 