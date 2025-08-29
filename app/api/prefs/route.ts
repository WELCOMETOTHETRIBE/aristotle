import { prisma } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  if (!prisma) {
    return NextResponse.json({ error: "Database not available" }, { status: 503 });
  }
  
  // For demo purposes, use user ID 1
  const userId = 1;
  
  const prefs = await prisma.userPreference.findUnique({
    where: { userId }
  });
  
  if (!prefs) {
    // Create default preferences
    const defaultPrefs = await prisma.userPreference.create({
      data: {
        userId,
        framework: null,
        style: null,
        locale: 'en'
      }
    });
    return NextResponse.json(defaultPrefs);
  }
  
  return NextResponse.json(prefs);
}

export async function PUT(req: NextRequest) {
  if (!prisma) {
    return NextResponse.json({ error: "Database not available" }, { status: 503 });
  }
  
  const userId = 1; // Demo user
  const body = await req.json();
  
  const prefs = await prisma.userPreference.upsert({
    where: { userId },
    update: {
      framework: body.framework,
      style: body.style,
      locale: body.locale || 'en',
      updatedAt: new Date()
    },
    create: {
      userId,
      framework: body.framework,
      style: body.style,
      locale: body.locale || 'en'
    }
  });
  
  return NextResponse.json(prefs);
} 