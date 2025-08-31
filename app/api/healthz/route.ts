import { NextResponse } from "next/server";
import { logger } from "@/lib/logger";
import { appConfig } from "@/lib/config/app";

export async function GET() {
  try {
    const healthCheck = {
      ok: true,
      timestamp: new Date().toISOString(),
      version: appConfig.version,
      environment: process.env.NODE_ENV,
      commitSha: process.env.VERCEL_GIT_COMMIT_SHA || process.env.GITHUB_SHA || null,
      uptime: process.uptime(),
      memory: process.memoryUsage(),
    };

    logger.info("Health check requested");
    
    return NextResponse.json(healthCheck, { status: 200 });
  } catch (error) {
    logger.error("Health check failed");
    
    return NextResponse.json(
      { 
        ok: false, 
        error: "Health check failed",
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
} 