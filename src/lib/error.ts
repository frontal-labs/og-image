import { NextResponse } from "next/server";
import { log } from "./log";

export class AppError extends Error {
  readonly statusCode: number;
  readonly code: string;
  readonly expose: boolean;

  constructor(message: string, statusCode = 500, code = "INTERNAL_ERROR") {
    super(message);
    this.name = new.target.name;
    this.statusCode = statusCode;
    this.code = code;
    this.expose = statusCode < 500;
  }
}

export class ValidationError extends AppError {
  constructor(message: string) {
    super(message, 400, "VALIDATION_ERROR");
  }
}

export class UnsupportedMediaTypeError extends AppError {
  constructor(message = "Content-Type must be application/json") {
    super(message, 415, "UNSUPPORTED_MEDIA_TYPE");
  }
}

export class GenerationError extends AppError {
  constructor(message = "Failed to generate image") {
    super(message, 500, "GENERATION_ERROR");
  }
}

export const parseError = (error: unknown): string => {
  if (error instanceof Error) {
    return error.message;
  }

  if (error && typeof error === "object" && "message" in error) {
    return String(error.message);
  }

  return "An unexpected error occurred";
};

export function createErrorResponse(error: unknown): NextResponse {
  const appError =
    error instanceof AppError
      ? error
      : new AppError("Internal server error", 500, "INTERNAL_ERROR");
  const message = error instanceof AppError ? error.message : parseError(error);

  log.error("[og-image] request failed", {
    code: appError.code,
    message,
    statusCode: appError.statusCode,
  });

  return NextResponse.json(
    {
      error: appError.expose ? message : "Internal server error",
      code: appError.code,
      success: false,
    },
    { status: appError.statusCode }
  );
}
