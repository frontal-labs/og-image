import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { createElement } from "react";
import { OGImage } from "@/components/og-image";
import { env } from "@/config/env";
import { GenerationError, ValidationError } from "@/lib/error";
import {
  normalizeQuality,
  normalizeTheme,
  type OGTheme,
  validateOGParams,
} from "@/lib/og";

export interface OGServiceOptions {
  height?: number;
  label?: string;
  quality?: number;
  theme?: OGTheme;
  width?: number;
}

export const DEFAULT_OG_OPTIONS = {
  width: 1200,
  height: 628,
  theme: "light",
  quality: 1,
} satisfies Required<Omit<OGServiceOptions, "label">>;

let figtreeRegularFont: ArrayBuffer | undefined;
let figtreeSemiboldFont: ArrayBuffer | undefined;

async function loadFont(fileName: string): Promise<ArrayBuffer> {
  const fontFile = await readFile(join(process.cwd(), "public", fileName));

  return fontFile.buffer.slice(
    fontFile.byteOffset,
    fontFile.byteOffset + fontFile.byteLength
  );
}

async function getFigtreeRegularFont(): Promise<ArrayBuffer> {
  if (!figtreeRegularFont) {
    figtreeRegularFont = await loadFont("figtree-regular-og.ttf");
  }

  return figtreeRegularFont;
}

async function getFigtreeSemiboldFont(): Promise<ArrayBuffer> {
  if (!figtreeSemiboldFont) {
    figtreeSemiboldFont = await loadFont("figtree-semibold-og.ttf");
  }

  return figtreeSemiboldFont;
}

export async function generateOGImage(
  title?: unknown,
  description?: unknown,
  options: OGServiceOptions = {}
): Promise<ImageResponse> {
  const finalLabel = options.label;
  const finalTheme = options.theme ?? DEFAULT_OG_OPTIONS.theme;
  const finalQuality = options.quality ?? DEFAULT_OG_OPTIONS.quality;
  const params = validateOGParams(
    title,
    description,
    finalLabel,
    finalTheme,
    finalQuality
  );
  const finalOptions = {
    ...DEFAULT_OG_OPTIONS,
    ...options,
    label: params.label,
    quality: params.quality,
    theme: params.theme,
  };

  try {
    const etag = generateETag(params.title, params.description, finalOptions);
    const outputWidth = finalOptions.width * finalOptions.quality;
    const outputHeight = finalOptions.height * finalOptions.quality;
    const [figtreeRegular, figtreeSemibold] = await Promise.all([
      getFigtreeRegularFont(),
      getFigtreeSemiboldFont(),
    ]);
    const imageElement =
      finalOptions.quality === 1
        ? OGImage({
            title: params.title,
            description: params.description,
            label: params.label,
            theme: params.theme,
          })
        : createElement(
            "div",
            {
              style: {
                width: "100%",
                height: "100%",
                display: "flex",
                position: "relative",
                overflow: "hidden",
              },
            },
            createElement(
              "div",
              {
                style: {
                  width: `${finalOptions.width}px`,
                  height: `${finalOptions.height}px`,
                  display: "flex",
                  transform: `scale(${finalOptions.quality})`,
                  transformOrigin: "top left",
                },
              },
              OGImage({
                title: params.title,
                description: params.description,
                label: params.label,
                theme: params.theme,
              })
            )
          );

    return new ImageResponse(imageElement, {
      width: outputWidth,
      height: outputHeight,
      headers: {
        "Cache-Control": "public, max-age=0, s-maxage=86400",
        ETag: etag,
        "X-OG-Quality": String(finalOptions.quality),
        "X-OG-Theme": params.theme,
      },
      fonts: [
        {
          name: "Figtree",
          data: figtreeRegular,
          weight: 400,
          style: "normal",
        },
        {
          name: "Figtree",
          data: figtreeSemibold,
          weight: 600,
          style: "normal",
        },
      ],
    });
  } catch (error) {
    if (error instanceof ValidationError) {
      throw error;
    }

    throw new GenerationError(
      error instanceof Error ? error.message : "Unknown rendering failure"
    );
  }
}

function generateETag(
  title: string | undefined,
  description: string | undefined,
  options: OGServiceOptions
): string {
  const data = JSON.stringify({
    title,
    description,
    options,
    debug: env.OG_HTML_DEBUG,
  });

  // Simple string hash without bitwise operators
  let hash = 5381;
  for (let index = 0; index < data.length; index++) {
    const char = data.charCodeAt(index);
    hash = (hash * 33 + char) % 2_147_483_647; // Keep within 32-bit signed int range
  }

  return `"${Math.abs(hash).toString(16)}"`;
}

export function parseSearchParams(searchParams: URLSearchParams): {
  title?: string;
  description?: string;
  label?: string;
  quality: number;
  theme: OGTheme;
} {
  return {
    title: searchParams.get("title") ?? undefined,
    description: searchParams.get("description") ?? undefined,
    label: searchParams.get("label") ?? undefined,
    quality: normalizeQuality(searchParams.get("quality")),
    theme: normalizeTheme(searchParams.get("theme")),
  };
}
