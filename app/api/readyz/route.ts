import { NextResponse } from "next/server";
import { logger } from "@/lib/logger";
import { appConfig } from "@/lib/config/app";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  try {
    // Check database connectivity
    let dbStatus = "unknown";
    try {
      await prisma.$queryRaw`SELECT 1`;
      dbStatus = "connected";
    } catch (dbError) {
      dbStatus = "disconnected";
      logger.error("Database connectivity check failed");
    }

    const readinessCheck = {
      ok: dbStatus === "connected",
      timestamp: new Date().toISOString(),
      version: appConfig.version,
      environment: process.env.NODE_ENV,
      services: {
        database: dbStatus,
      },
      commitSha: process.env.VERCEL_GIT_COMMIT_SHA || process.env.GITHUB_SHA || null,
    };

    logger.info("Readiness check requested");
    
    return NextResponse.json(readinessCheck, { 
      status: readinessCheck.ok ? 200 : 503 
    });
  } catch (error) {
    logger.error("Readiness check failed");
    
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