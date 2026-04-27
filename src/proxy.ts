import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

const SECURITY_HEADERS: Record<string, string> = {
  "Referrer-Policy": "no-referrer",
  "X-Content-Type-Options": "nosniff",
  "X-Frame-Options": "DENY",
};

function isAllowedOrigin(origin: string): boolean {
  if (!origin) {
    return false;
  }

  if (
    origin === "http://localhost:3000" ||
    origin === "http://localhost:3001"
  ) {
    return true;
  }

  try {
    const { hostname, protocol } = new URL(origin);
    return protocol === "https:" && hostname.endsWith(".vercel.app");
  } catch {
    return false;
  }
}

function applyHeaders(
  request: NextRequest,
  response: NextResponse
): NextResponse {
  for (const [header, value] of Object.entries(SECURITY_HEADERS)) {
    response.headers.set(header, value);
  }

  const origin = request.headers.get("origin") ?? "";

  if (isAllowedOrigin(origin)) {
    response.headers.set("Access-Control-Allow-Origin", origin);
    response.headers.set("Vary", "Origin");
  }

  response.headers.set(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization, X-Requested-With"
  );
  response.headers.set(
    "Access-Control-Allow-Methods",
    "GET, POST, HEAD, OPTIONS"
  );

  return response;
}

export function proxy(request: NextRequest) {
  if (request.method === "OPTIONS") {
    return applyHeaders(request, new NextResponse(null, { status: 204 }));
  }

  return applyHeaders(request, NextResponse.next());
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
