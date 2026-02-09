/**
 * THEME CONFIGURATION
 * 
 * This is the ONLY file you need to edit for theming.
 * Run `npm run build:colors` after editing to regenerate colors.css
 * 
 * Current theme: Emerald (from DaisyUI)
 */

export const themeConfig = {
  // BRAND COLORS (hex format) - Emerald theme
  colors: {
    primary: "#66CC8A",           // Emerald green
    primaryContent: "#000000",    // Black text on primary
    
    secondary: "#377CFB",         // Blue
    secondaryContent: "#FFFFFF",  // White text on secondary
    
    accent: "#EA5234",            // Orange-red
    accentContent: "#FFFFFF",     // White text on accent
    
    neutral: "#333C4D",           // Dark blue-gray
    neutralContent: "#FFFFFF",    // White text on neutral
    
    base100: "#FFFFFF",           // White
    base200: "#F2F2F2",           // Light gray
    base300: "#E5E6E6",           // Medium gray
    baseContent: "#333C4D",       // Dark text on base colors
    
    info: "#3ABFF8",              // Cyan
    infoContent: "#000000",       // Black text on info
    
    success: "#36D399",           // Green
    successContent: "#000000",    // Black text on success
    
    warning: "#FBBD23",           // Yellow
    warningContent: "#000000",    // Black text on warning
    
    error: "#F87272",             // Red
    errorContent: "#FFFFFF",      // White text on error
  },

  // LOGO
  logo: {
    src: "/logo.png",
    alt: "ChoiceEQ",
    width: 180,
    height: 60,
  },
};
