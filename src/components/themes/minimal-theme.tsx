import type { ReactElement } from "react";
import { FrontalMark } from "@/components/brand/frontal-mark";
import type { OGThemeProps } from "../../types/theme-props";

type Surface = "dark" | "light";

const SURFACES: Record<
  Surface,
  {
    background: string;
    body: string;
    eyebrow: string;
    mark: string;
    title: string;
  }
> = {
  dark: {
    background: "#000000",
    body: "rgba(255,255,255,0.76)",
    eyebrow: "rgba(255,255,255,0.56)",
    mark: "#ffffff",
    title: "#ffffff",
  },
  light: {
    background: "#ffffff",
    body: "rgba(0,0,0,0.66)",
    eyebrow: "rgba(0,0,0,0.48)",
    mark: "#000000",
    title: "#000000",
  },
};

export interface MinimalThemeProps extends OGThemeProps {
  surface: Surface;
}

const WORD_REGEX = /\s+/;

function getTitleFontSize(title: string): number {
  const normalizedLength = title.trim().length;
  const longestWordLength = title
    .split(WORD_REGEX)
    .reduce((longest, word) => Math.max(longest, word.length), 0);

  if (normalizedLength > 100 || longestWordLength > 24) {
    return 58;
  }

  if (normalizedLength > 80 || longestWordLength > 20) {
    return 64;
  }

  if (normalizedLength > 60 || longestWordLength > 16) {
    return 72;
  }

  return 84;
}

export function MinimalTheme({
  surface,
  title,
}: MinimalThemeProps): ReactElement {
  const palette = SURFACES[surface];
  const titleFontSize = title ? getTitleFontSize(title) : 84;

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        position: "relative",
        overflow: "hidden",
        background: palette.background,
        color: palette.title,
        fontFamily: "Figtree",
      }}
    >
      <div
        style={{
          position: "absolute",
          bottom: 76,
          right: 76,
          display: "flex",
        }}
      >
        <FrontalMark color={palette.mark} size={60} />
      </div>
      <div
        style={{
          position: "absolute",
          top: 76,
          left: 76,
          display: "flex",
        }}
      >
        {title ? (
          <div
            style={{
              fontSize: titleFontSize,
              lineHeight: 0.94,
              letterSpacing: "-0.065em",
              fontWeight: 600,
              textWrap: "balance",
              wordBreak: "break-word",
              overflowWrap: "break-word",
              color: palette.title,
            }}
          >
            {title}
          </div>
        ) : null}
      </div>
    </div>
  );
}
