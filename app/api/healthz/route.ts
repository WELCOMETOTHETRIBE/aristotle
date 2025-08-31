import { NextResponse } from "next/server";

export async function GET() {
  try {
    const healthCheck = {
      ok: true,
      timestamp: new Date().toISOString(),
      version: process.env.npm_package_version || '0.1.0',
      environment: process.env.NODE_ENV,
      commitSha: process.env.VERCEL_GIT_COMMIT_SHA || process.env.GITHUB_SHA || null,
      uptime: process.uptime(),
      memory: process.memoryUsage(),
    };

    return NextResponse.json(healthCheck, { status: 200 });
  } catch (error) {
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