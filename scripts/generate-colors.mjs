#!/usr/bin/env node
import { readFileSync, writeFileSync } from 'fs';
import { converter, formatHex } from 'culori';

const toOklch = converter('oklch');
const toHex = converter('rgb');

// Read theme config
const themeConfig = readFileSync('./src/config/theme.ts', 'utf-8');

// Extract colors
const colors = {
  primary: themeConfig.match(/primary:\s*"(#[0-9A-Fa-f]{6})"/)?.[1],
  primaryContent: themeConfig.match(/primaryContent:\s*"(#[0-9A-Fa-f]{6})"/)?.[1],
  secondary: themeConfig.match(/secondary:\s*"(#[0-9A-Fa-f]{6})"/)?.[1],
  secondaryContent: themeConfig.match(/secondaryContent:\s*"(#[0-9A-Fa-f]{6})"/)?.[1],
  accent: themeConfig.match(/accent:\s*"(#[0-9A-Fa-f]{6})"/)?.[1],
  accentContent: themeConfig.match(/accentContent:\s*"(#[0-9A-Fa-f]{6})"/)?.[1],
  neutral: themeConfig.match(/neutral:\s*"(#[0-9A-Fa-f]{6})"/)?.[1],
  neutralContent: themeConfig.match(/neutralContent:\s*"(#[0-9A-Fa-f]{6})"/)?.[1],
  base100: themeConfig.match(/base100:\s*"(#[0-9A-Fa-f]{6})"/)?.[1],
  base200: themeConfig.match(/base200:\s*"(#[0-9A-Fa-f]{6})"/)?.[1],
  base300: themeConfig.match(/base300:\s*"(#[0-9A-Fa-f]{6})"/)?.[1],
  baseContent: themeConfig.match(/baseContent:\s*"(#[0-9A-Fa-f]{6})"/)?.[1],
  info: themeConfig.match(/info:\s*"(#[0-9A-Fa-f]{6})"/)?.[1],
  infoContent: themeConfig.match(/infoContent:\s*"(#[0-9A-Fa-f]{6})"/)?.[1],
  success: themeConfig.match(/success:\s*"(#[0-9A-Fa-f]{6})"/)?.[1],
  successContent: themeConfig.match(/successContent:\s*"(#[0-9A-Fa-f]{6})"/)?.[1],
  warning: themeConfig.match(/warning:\s*"(#[0-9A-Fa-f]{6})"/)?.[1],
  warningContent: themeConfig.match(/warningContent:\s*"(#[0-9A-Fa-f]{6})"/)?.[1],
  error: themeConfig.match(/error:\s*"(#[0-9A-Fa-f]{6})"/)?.[1],
  errorContent: themeConfig.match(/errorContent:\s*"(#[0-9A-Fa-f]{6})"/)?.[1],
};

// Convert hex to OKLCH string
const hexToOklch = (hex) => {
  const oklch = toOklch(hex);
  return `${oklch.l.toFixed(2)} ${oklch.c.toFixed(2)} ${oklch.h?.toFixed(0) || 0}`;
};

const css = `/* Auto-generated from /src/config/theme.ts - DO NOT EDIT */
@theme {
  --color-primary: oklch(${hexToOklch(colors.primary)});        /* ${colors.primary} */
  --color-primary-content: oklch(${hexToOklch(colors.primaryContent)});  /* ${colors.primaryContent} */
  
  --color-secondary: oklch(${hexToOklch(colors.secondary)});      /* ${colors.secondary} */
  --color-secondary-content: oklch(${hexToOklch(colors.secondaryContent)});  /* ${colors.secondaryContent} */
  
  --color-accent: oklch(${hexToOklch(colors.accent)});          /* ${colors.accent} */
  --color-accent-content: oklch(${hexToOklch(colors.accentContent)});  /* ${colors.accentContent} */
  
  --color-neutral: oklch(${hexToOklch(colors.neutral)});        /* ${colors.neutral} */
  --color-neutral-content: oklch(${hexToOklch(colors.neutralContent)});  /* ${colors.neutralContent} */
  
  --color-base-100: oklch(${hexToOklch(colors.base100)});       /* ${colors.base100} */
  --color-base-200: oklch(${hexToOklch(colors.base200)});       /* ${colors.base200} */
  --color-base-300: oklch(${hexToOklch(colors.base300)});       /* ${colors.base300} */
  --color-base-content: oklch(${hexToOklch(colors.baseContent)});  /* ${colors.baseContent} */
  
  --color-info: oklch(${hexToOklch(colors.info)});          /* ${colors.info} */
  --color-info-content: oklch(${hexToOklch(colors.infoContent)});  /* ${colors.infoContent} */
  
  --color-success: oklch(${hexToOklch(colors.success)});    /* ${colors.success} */
  --color-success-content: oklch(${hexToOklch(colors.successContent)});  /* ${colors.successContent} */
  
  --color-warning: oklch(${hexToOklch(colors.warning)});    /* ${colors.warning} */
  --color-warning-content: oklch(${hexToOklch(colors.warningContent)});  /* ${colors.warningContent} */
  
  --color-error: oklch(${hexToOklch(colors.error)});        /* ${colors.error} */
  --color-error-content: oklch(${hexToOklch(colors.errorContent)});  /* ${colors.errorContent} */
  
  --rounded-btn: 0.5rem;
}
`;

writeFileSync('./src/app/colors.css', css);
console.log('✅ Generated colors.css with all DaisyUI color names');
