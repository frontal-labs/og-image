import { NextResponse } from "next/server";

export const runtime = "edge";

const version = "0.1.0";

function createHealthPayload(status: "healthy" | "unhealthy", error?: string) {
  return {
    status,
    service: "og-image",
    timestamp: new Date().toISOString(),
    version,
    ...(error ? { error } : {}),
  };
}

export const GET = (): NextResponse => {
  try {
    return NextResponse.json(createHealthPayload("healthy"), { status: 200 });
  } catch (error) {
    return NextResponse.json(
      createHealthPayload(
        "unhealthy",
        error instanceof Error ? error.message : "Unknown error"
      ),
      { status: 503 }
    );
  }
};

export const HEAD = (): Response => new Response(null, { status: 200 });
