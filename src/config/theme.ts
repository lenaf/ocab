/**
 * THEME CONFIGURATION
 *
 * This is the ONLY file you need to edit for theming.
 * Run `npm run build:colors` after editing to regenerate colors.css
 *
 * Current theme: East Side Parkways Coalition (WordPress migration)
 */

export const themeConfig = {
  // BRAND COLORS (hex format) - East Side Parkways Coalition theme
  // Using original darker greens with white text for maximum contrast
  colors: {
    primary: "#2D6200",           // Dark green (original from site)
    primaryContent: "#FFFFFF",    // White text on primary

    secondary: "#1E4200",         // Deeper green (darker than primary)
    secondaryContent: "#FFFFFF",  // White text on secondary

    accent: "#377A00",            // Coalition green (original primary)
    accentContent: "#FFFFFF",     // White text on accent

    neutral: "#1F2937",           // Dark gray
    neutralContent: "#FFFFFF",    // White text on neutral

    base100: "#FFFFFF",           // Pure white background
    base200: "#F9FAFB",           // Very light gray
    base300: "#E5E7EB",           // Light gray
    baseContent: "#1F2937",       // Dark text on light backgrounds

    info: "#1F2937",              // Dark gray (not blue)
    infoContent: "#FFFFFF",       // White text

    success: "#2D6200",           // Same as primary green
    successContent: "#FFFFFF",    // White text

    warning: "#D97706",           // Amber
    warningContent: "#FFFFFF",    // White text

    error: "#DC2626",             // Red
    errorContent: "#FFFFFF",      // White text
  },

  // LOGO
  logo: {
    src: "/logo.png",
    alt: "East Side Parkways Coalition",
    width: 249,
    height: 60,
  },
};
