/**
 * Determines if a color is light or dark based on luminance
 * Returns 'light' for dark backgrounds, 'dark' for light backgrounds
 */
export function getTextColorForBackground(bgColor: string | null | undefined): 'light' | 'dark' {
  if (!bgColor) return 'dark'; // Default to dark text if no background
  
  // DaisyUI color names - map to their typical luminance
  const darkBackgrounds = ['primary', 'secondary', 'accent', 'neutral'];
  const lightBackgrounds = ['base-100', 'base-200', 'base-300'];
  
  if (darkBackgrounds.includes(bgColor)) return 'light';
  if (lightBackgrounds.includes(bgColor)) return 'dark';
  
  return 'dark'; // Default fallback
}
