import type { OGTheme } from "@/lib/og";

export interface OGThemeProps {
  description?: string;
  label?: string;
  theme: OGTheme;
  title?: string;
}
