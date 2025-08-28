import { prisma } from "@/lib/db";
import { NextRequest } from "next/server";

export async function GET(_: NextRequest, { params }: { params: { id: string }}) {
  const m = await prisma.module.findUnique({
    where: { id: params.id },
    include: {
      levels: { orderBy: { level: "asc" } },
      practices: { take: 12, orderBy: { id: "asc" } },
      virtueMaps: true
    }
  });
  if (!m) return new Response("Not found", { status: 404 });
  return Response.json(m);
} 