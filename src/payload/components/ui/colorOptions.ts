import { themeConfig } from "@/config/theme";

export const colorOptions = [
  { label: "Primary", value: "primary", bg: themeConfig.colors.primary, text: themeConfig.colors.primaryContent },
  { label: "Secondary", value: "secondary", bg: themeConfig.colors.secondary, text: themeConfig.colors.secondaryContent },
  { label: "Accent", value: "accent", bg: themeConfig.colors.accent, text: themeConfig.colors.accentContent },
  { label: "Neutral", value: "neutral", bg: themeConfig.colors.neutral, text: themeConfig.colors.neutralContent },
  { label: "Base 100", value: "base-100", bg: themeConfig.colors.base100, text: themeConfig.colors.baseContent },
  { label: "Base 200", value: "base-200", bg: themeConfig.colors.base200, text: themeConfig.colors.baseContent },
  { label: "Base 300", value: "base-300", bg: themeConfig.colors.base300, text: themeConfig.colors.baseContent },
];
