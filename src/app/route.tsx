import type { ImageResponse } from "next/og";
import type { NextRequest, NextResponse } from "next/server";
import {
  createErrorResponse,
  UnsupportedMediaTypeError,
  ValidationError,
} from "@/lib/error";
import { normalizeQuality, normalizeTheme } from "@/lib/og";
import { generateOGImage, parseSearchParams } from "@/services/og-service";

export const runtime = "nodejs";

export const GET = async (
  request: NextRequest
): Promise<ImageResponse | NextResponse> => {
  try {
    const { searchParams } = new URL(request.url);
    const { title, description, label, quality, theme } =
      parseSearchParams(searchParams);

    return await generateOGImage(title, description, { label, quality, theme });
  } catch (error) {
    return createErrorResponse(error);
  }
};

export const POST = async (
  request: NextRequest
): Promise<ImageResponse | NextResponse> => {
  try {
    const contentType = request.headers.get("content-type") ?? "";

    if (!contentType.includes("application/json")) {
      throw new UnsupportedMediaTypeError();
    }

    const body = await request.json();

    if (!body || typeof body !== "object" || Array.isArray(body)) {
      throw new ValidationError("Request body must be a JSON object");
    }

    const { title, description, label, quality, theme } = body as Record<
      string,
      unknown
    >;

    return await generateOGImage(title, description, {
      label: typeof label === "string" ? label : undefined,
      quality: normalizeQuality(quality),
      theme: typeof theme === "string" ? normalizeTheme(theme) : undefined,
    });
  } catch (error) {
    return createErrorResponse(error);
  }
};
