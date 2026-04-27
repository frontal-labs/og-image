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

export interface LeftCopyThemeProps extends OGThemeProps {
  surface: Surface;
}

interface LayoutMetrics {
  contentGap: number;
  contentJustify: "center" | "space-between";
  copyGap: number;
  copyWidth: string;
  descriptionWidth: string;
  footerMarginTop: number;
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

function getLayoutMetrics(options: {
  hasDescription: boolean;
  hasLabel: boolean;
  hasTitle: boolean;
}): LayoutMetrics {
  const { hasDescription, hasLabel, hasTitle } = options;

  if (hasTitle && hasDescription) {
    return {
      contentGap: 40,
      contentJustify: hasLabel ? "space-between" : "center",
      copyGap: 24,
      copyWidth: "82%",
      descriptionWidth: "92%",
      footerMarginTop: 32,
    };
  }

  if (hasTitle) {
    return {
      contentGap: 34,
      contentJustify: hasLabel ? "space-between" : "center",
      copyGap: 18,
      copyWidth: "72%",
      descriptionWidth: "90%",
      footerMarginTop: 28,
    };
  }

  if (hasDescription) {
    return {
      contentGap: 32,
      contentJustify: hasLabel ? "space-between" : "center",
      copyGap: 18,
      copyWidth: "64%",
      descriptionWidth: "100%",
      footerMarginTop: 26,
    };
  }

  return {
    contentGap: 28,
    contentJustify: "space-between",
    copyGap: 16,
    copyWidth: "56%",
    descriptionWidth: "100%",
    footerMarginTop: 24,
  };
}

export function LeftCopyTheme({
  description,
  label,
  surface,
  title,
}: LeftCopyThemeProps): ReactElement {
  const palette = SURFACES[surface];
  const hasHeading = Boolean(title);
  const hasDescription = Boolean(description);
  const hasLabel = Boolean(label);
  const titleFontSize = title ? getTitleFontSize(title) : 84;
  const layout = getLayoutMetrics({
    hasDescription,
    hasLabel,
    hasTitle: hasHeading,
  });

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
          top: 68,
          left: 76,
          display: "flex",
        }}
      >
        <FrontalMark color={palette.mark} size={38} />
      </div>
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: layout.contentJustify,
          gap: layout.contentGap,
          padding: "68px 76px 66px",
        }}
      >
        <div style={{ height: 60, display: "flex" }} />

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: layout.copyGap,
            width: layout.copyWidth,
          }}
        >
          <div
            style={{
              fontSize: 16,
              lineHeight: 1,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: palette.eyebrow,
              fontWeight: 600,
            }}
          >
            Frontal
          </div>
          {title ? (
            <div
              style={{
                width: "100%",
                maxWidth: "100%",
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
          {description ? (
            <div
              style={{
                width: layout.descriptionWidth,
                fontSize: 28,
                lineHeight: 1.34,
                letterSpacing: "-0.018em",
                textWrap: "balance",
                color: palette.body,
                fontWeight: 400,
              }}
            >
              {description}
            </div>
          ) : null}
        </div>

        {label ? (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              marginTop: layout.footerMarginTop,
            }}
          >
            <div
              style={{
                fontSize: 16,
                lineHeight: 1,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                color: palette.eyebrow,
                fontWeight: 500,
              }}
            >
              {label}
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
