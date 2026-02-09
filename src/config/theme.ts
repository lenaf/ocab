/**
 * THEME CONFIGURATION
 * 
 * This is the ONLY file you need to edit for theming.
 * Edit hex colors here, then manually convert to OKLCH at https://oklch.com
 * and update the matching values in /src/app/globals.css @theme section.
 */

export const themeConfig = {
  // BRAND COLORS (hex format) - ChoiceEQ inspired
  colors: {
    primary: "#0EA5E9",    // Sky blue
    secondary: "#06B6D4",  // Cyan
    accent: "#F59E0B",     // Amber accent
    neutral: "#64748B",    // Slate
    base100: "#FFFFFF",    // White
    base200: "#F8FAFC",    // Light gray
    base300: "#E2E8F0",    // Gray
  },

  // LOGO
  logo: {
    src: "/logo.png",
    alt: "ChoiceEQ",
    width: 180,
    height: 60,
  },
};
