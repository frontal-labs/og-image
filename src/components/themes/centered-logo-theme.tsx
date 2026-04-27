import type { ReactElement } from "react";
import { FrontalWordmark } from "@/components/brand/frontal-wordmark";
import type { OGThemeProps } from "./theme-props";

type Surface = "dark" | "light";

const SURFACES: Record<
  Surface,
  {
    background: string;
    logo: string;
  }
> = {
  dark: {
    background: "#000000",
    logo: "#f5f5f7",
  },
  light: {
    background: "#ffffff",
    logo: "#000000",
  },
};

export interface CenteredLogoThemeProps extends OGThemeProps {
  surface: Surface;
}

export function CenteredLogoTheme({
  surface,
}: CenteredLogoThemeProps): ReactElement {
  const palette = SURFACES[surface];

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        position: "relative",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
        background: palette.background,
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "0 84px",
        }}
      >
        <FrontalWordmark color={palette.logo} width={420} />
      </div>
    </div>
  );
}
