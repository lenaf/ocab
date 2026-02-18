/**
 * THEME CONFIGURATION
 * 
 * This is the ONLY file you need to edit for theming.
 * Run `npm run build:colors` after editing to regenerate colors.css
 * 
 * Current theme: Natural Equestrian (landscape-inspired colors)
 */

export const themeConfig = {
  // BRAND COLORS (hex format) - Natural Equestrian theme
  colors: {
    primary: "#556B5E",           // Cool sage (darker green)
    primaryContent: "#FFFFFF",    // White text on primary
    
    secondary: "#6B5B7F",         // Heather purple (wildflower, muted)
    secondaryContent: "#FFFFFF",  // White text on secondary
    
    accent: "#5B9A92",            // Sage teal (natural water/stone)
    accentContent: "#FFFFFF",     // White text on accent
    
    neutral: "#1A2B3C",           // Dark navy
    neutralContent: "#FFFFFF",    // White text on neutral
    
    base100: "#FFFFFF",           // Pure white (clean, modern)
    base200: "#F7F7F7",           // Light gray
    base300: "#E8E8E8",           // Medium gray
    baseContent: "#2A3B2D",       // Dark text
    
    info: "#5FA3D0",              // Sky blue
    infoContent: "#FFFFFF",       // White text on info
    
    success: "#5FAD56",           // Grass green
    successContent: "#FFFFFF",    // White text on success
    
    warning: "#E8B44F",           // Bright gold
    warningContent: "#2A2A2A",    // Dark text on warning
    
    error: "#D65D5D",             // Coral red
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
