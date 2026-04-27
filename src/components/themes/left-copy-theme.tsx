import type { ReactElement } from "react";
import { FrontalMark } from "@/components/brand/frontal-mark";
import type { OGThemeProps } from "./theme-props";

type Surface = "dark" | "light";

const SURFACES: Record<
  Surface,
  {
    background: string;
    body: string;
    eyebrow: string;
    line: string;
    mark: string;
    title: string;
  }
> = {
  dark: {
    background: "#111111",
    body: "rgba(245,245,247,0.74)",
    eyebrow: "rgba(245,245,247,0.46)",
    line: "rgba(245,245,247,0.14)",
    mark: "#f5f5f7",
    title: "#f5f5f7",
  },
  light: {
    background: "#ffffff",
    body: "rgba(17,17,17,0.62)",
    eyebrow: "rgba(17,17,17,0.42)",
    line: "rgba(17,17,17,0.1)",
    mark: "#111111",
    title: "#111111",
  },
};

export interface LeftCopyThemeProps extends OGThemeProps {
  surface: Surface;
}

export function LeftCopyTheme({
  description,
  label,
  surface,
  title,
}: LeftCopyThemeProps): ReactElement {
  const palette = SURFACES[surface];

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
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "68px 76px 66px",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 18,
          }}
        >
          <FrontalMark color={palette.mark} size={36} />
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 24,
            width: "74%",
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
          <div
            style={{
              fontSize: 84,
              lineHeight: 0.92,
              letterSpacing: "-0.065em",
              fontWeight: 600,
              textWrap: "balance",
              color: palette.title,
              width: "100%",
            }}
          >
            {title}
          </div>
          <div
            style={{
              width: "84%",
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
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
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
            {label ?? "Open Graph"}
          </div>
          <div
            style={{
              width: 164,
              height: 1,
              background: palette.line,
            }}
          />
        </div>
      </div>
    </div>
  );
}
