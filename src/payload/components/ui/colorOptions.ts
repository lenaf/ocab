import { themeConfig } from "@/config/theme";

export const colorOptions = [
  { label: "Primary", value: "primary", bg: themeConfig.colors.primary, text: themeConfig.colors.primaryContent },
  { label: "Secondary", value: "secondary", bg: themeConfig.colors.secondary, text: themeConfig.colors.secondaryContent },
  { label: "Accent", value: "accent", bg: themeConfig.colors.accent, text: themeConfig.colors.accentContent },
  { label: "Secondary Accent", value: "accent2", bg: themeConfig.colors.accent2, text: themeConfig.colors.accent2Content },
  { label: "White", value: "base-100", bg: themeConfig.colors.base100, text: themeConfig.colors.baseContent },
  { label: "Light Gray", value: "base-200", bg: themeConfig.colors.base200, text: themeConfig.colors.baseContent },
];
