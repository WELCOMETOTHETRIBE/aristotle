import { NextResponse } from "next/server";

export async function GET() {
  try {
    // Simple readiness check
    const readyCheck = {
      ready: true,
      timestamp: new Date().toISOString(),
      status: 'ready'
    };

    return NextResponse.json(readyCheck, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      {
        ready: false,
        error: "Service not ready",
        timestamp: new Date().toISOString(),
        status: 'not_ready'
      },
      { status: 503 }
    );
  }
}
