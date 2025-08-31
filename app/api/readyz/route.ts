import { NextResponse } from "next/server";

export async function GET() {
  try {
    // Check database connectivity
    let dbStatus = "unknown";
    try {
      if (process.env.DATABASE_URL) {
        const { PrismaClient } = await import("@prisma/client");
        const prisma = new PrismaClient();
        await prisma.$queryRaw`SELECT 1`;
        dbStatus = "connected";
      } else {
        dbStatus = "no_database_url";
      }
    } catch (dbError) {
      dbStatus = "disconnected";
    }

    const readinessCheck = {
      ok: dbStatus === "connected",
      timestamp: new Date().toISOString(),
      version: process.env.npm_package_version || '0.1.0',
      environment: process.env.NODE_ENV,
      services: {
        database: dbStatus,
      },
      commitSha: process.env.VERCEL_GIT_COMMIT_SHA || process.env.GITHUB_SHA || null,
    };

    return NextResponse.json(readinessCheck, {
      status: readinessCheck.ok ? 200 : 503
    });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        error: "Readiness check failed",
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
} 