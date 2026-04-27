import type { ReactElement } from "react";
import type { OGTheme } from "@/lib/og";
import { CenteredLogoTheme } from "./themes/centered-logo-theme";
import { LeftCopyTheme } from "./themes/left-copy-theme";

export interface OGImageProps {
  description?: string;
  label?: string;
  theme: OGTheme;
  title?: string;
}

export function OGImage({
  description,
  label,
  theme,
  title,
}: OGImageProps): ReactElement {
  const surface = theme === "light" ? "light" : "dark";
  const hasContent =
    typeof title === "string" ||
    typeof description === "string" ||
    typeof label === "string";

  if (hasContent) {
    return (
      <LeftCopyTheme
        description={description}
        label={label}
        surface={surface}
        theme={theme}
        title={title}
      />
    );
  }

  return (
    <CenteredLogoTheme
      description={description}
      label={label}
      surface={surface}
      theme={theme}
      title={title}
    />
  );
}
