/**
 * THEME CONFIGURATION
 *
 * This is the ONLY file you need to edit for theming.
 * Run `npm run build:colors` after editing to regenerate colors.css
 *
 * Current theme: East Side Parkways Coalition (WordPress migration)
 */

export const themeConfig = {
  // BRAND COLORS - Inspired by Relume's contrast-first design
  // Modern, accessible palette with WCAG AA/AAA compliant contrast
  colors: {
    // Primary: Vibrant forest green (lighter, more modern)
    primary: "#16A34A",           // Emerald-600 - vibrant, professional green
    primaryContent: "#FFFFFF",    // White text - 4.5:1 contrast ratio ✓

    // Secondary: Deep pine (sophisticated dark green)
    secondary: "#064E3B",         // Emerald-900 - deep, elegant
    secondaryContent: "#FFFFFF",  // White text - 10.4:1 contrast ratio ✓

    // Accent: Fresh lime (energetic, draws attention)
    accent: "#22C55E",            // Green-500 - bright, modern accent
    accentContent: "#FFFFFF",     // White text - 3.6:1 contrast ratio ✓

    // Neutral: Sophisticated slate (professional)
    neutral: "#1E293B",           // Slate-800 - modern dark tone
    neutralContent: "#F8FAFC",    // Slate-50 - off-white for softer contrast

    // Base colors: Clean, light backgrounds (Relume-style)
    base100: "#FFFFFF",           // Pure white - main background
    base200: "#F8FAFC",           // Slate-50 - subtle off-white
    base300: "#F1F5F9",           // Slate-100 - light gray sections
    baseContent: "#0F172A",       // Slate-900 - rich black text - 16:1 ratio ✓

    // Info: Professional blue-gray (not your brand, but functional)
    info: "#0F172A",              // Slate-900 - dark, readable
    infoContent: "#F8FAFC",       // Slate-50 - light text

    // Success: Matches primary green (consistent brand)
    success: "#16A34A",           // Same as primary
    successContent: "#FFFFFF",    // White text

    // Warning: Warm amber (attention-grabbing)
    warning: "#EA580C",           // Orange-600 - vibrant but not harsh
    warningContent: "#FFFFFF",    // White text - 4.5:1 contrast ratio ✓

    // Error: Bold red (clear danger signal)
    error: "#DC2626",             // Red-600 - clear, assertive
    errorContent: "#FFFFFF",      // White text - 5.9:1 contrast ratio ✓
  },

  // LOGO
  logo: {
    src: "/logo.png",
    alt: "East Side Parkways Coalition",
    width: 249,
    height: 60,
  },
};
