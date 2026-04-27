import { ValidationError } from "./error";

export const OG_THEMES = ["dark", "light"] as const;
export const DEFAULT_OG_QUALITY = 1;

export type OGTheme = (typeof OG_THEMES)[number];

export interface OGParams {
  description?: string;
  label?: string;
  quality: number;
  theme: OGTheme;
  title?: string;
}

const TITLE_MAX_LENGTH = 100;
const DESCRIPTION_MAX_LENGTH = 200;
const LABEL_MAX_LENGTH = 40;

function normalizeOptionalText(
  value: unknown,
  maxLength: number
): string | undefined {
  if (value == null) {
    return;
  }

  if (typeof value !== "string") {
    throw new ValidationError("Title and description must be strings");
  }

  const normalized = value.trim();

  if (!normalized) {
    return;
  }

  if (normalized.length > maxLength) {
    throw new ValidationError(
      `Text must be less than or equal to ${maxLength} characters`
    );
  }

  return normalized;
}

export function normalizeTheme(theme?: string | null): OGTheme {
  if (!theme) {
    return "light";
  }

  if (OG_THEMES.includes(theme as OGTheme)) {
    return theme as OGTheme;
  }

  throw new ValidationError(`Theme must be one of: ${OG_THEMES.join(", ")}`);
}

export function normalizeQuality(value?: unknown): number {
  if (value == null || value === "") {
    return DEFAULT_OG_QUALITY;
  }

  const parsed = (() => {
    if (typeof value === "number") {
      return value;
    }
    if (typeof value === "string") {
      return Number(value);
    }
    return Number.NaN;
  })();

  if (!Number.isInteger(parsed) || parsed < 1 || parsed > 4) {
    throw new ValidationError("Quality must be an integer between 1 and 4");
  }

  return parsed;
}

export function validateOGParams(
  title?: unknown,
  description?: unknown,
  label?: unknown,
  theme?: string | null,
  quality?: unknown
): OGParams {
  const normalizedTitle = normalizeOptionalText(title, TITLE_MAX_LENGTH);
  const normalizedDescription = normalizeOptionalText(
    description,
    DESCRIPTION_MAX_LENGTH
  );
  const normalizedLabel = normalizeOptionalText(label, LABEL_MAX_LENGTH);

  if (
    (normalizedTitle && !normalizedDescription) ||
    (!normalizedTitle && normalizedDescription)
  ) {
    throw new ValidationError(
      "Title and description must be provided together"
    );
  }

  return {
    title: normalizedTitle,
    description: normalizedDescription,
    label: normalizedLabel,
    quality: normalizeQuality(quality),
    theme: normalizeTheme(theme),
  };
}
