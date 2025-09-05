import { NextResponse } from "next/server";

export async function GET() {
  try {
    // Simple health check that doesn't depend on database
    const healthCheck = {
      ok: true,
      timestamp: new Date().toISOString(),
      version: process.env.npm_package_version || '0.1.0',
      environment: process.env.NODE_ENV,
      uptime: process.uptime(),
      status: 'healthy'
    };

    return NextResponse.json(healthCheck, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        error: "Health check failed",
        timestamp: new Date().toISOString(),
        status: 'unhealthy'
      },
      { status: 500 }
    );
  }
}
