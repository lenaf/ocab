#!/usr/bin/env node
import { readFileSync, writeFileSync } from 'fs';
import { converter } from 'culori';

const toOklch = converter('oklch');

// Read theme config
const themeConfig = readFileSync('./src/config/theme.ts', 'utf-8');

// Extract colors
const colors = {
  primary: themeConfig.match(/primary:\s*"(#[0-9A-Fa-f]{6})"/)?.[1],
  secondary: themeConfig.match(/secondary:\s*"(#[0-9A-Fa-f]{6})"/)?.[1],
  accent: themeConfig.match(/accent:\s*"(#[0-9A-Fa-f]{6})"/)?.[1],
  neutral: themeConfig.match(/neutral:\s*"(#[0-9A-Fa-f]{6})"/)?.[1],
  base100: themeConfig.match(/base100:\s*"(#[0-9A-Fa-f]{6})"/)?.[1],
  base200: themeConfig.match(/base200:\s*"(#[0-9A-Fa-f]{6})"/)?.[1],
  base300: themeConfig.match(/base300:\s*"(#[0-9A-Fa-f]{6})"/)?.[1],
};

// Convert hex to OKLCH
const hexToOklch = (hex) => {
  const oklch = toOklch(hex);
  return `${oklch.l.toFixed(2)} ${oklch.c.toFixed(2)} ${oklch.h?.toFixed(0) || 0}`;
};

// Generate colors CSS
const css = `/* Auto-generated from /src/config/theme.ts - DO NOT EDIT */
@theme {
  --color-primary: oklch(${hexToOklch(colors.primary)});        /* ${colors.primary} */
  --color-secondary: oklch(${hexToOklch(colors.secondary)});      /* ${colors.secondary} */
  --color-accent: oklch(${hexToOklch(colors.accent)});          /* ${colors.accent} */
  --color-neutral: oklch(${hexToOklch(colors.neutral)});        /* ${colors.neutral} */
  --color-base-100: oklch(${hexToOklch(colors.base100)});               /* ${colors.base100} */
  --color-base-200: oklch(${hexToOklch(colors.base200)});            /* ${colors.base200} */
  --color-base-300: oklch(${hexToOklch(colors.base300)});            /* ${colors.base300} */
  --color-info: oklch(0.75 0.13 220);
  --color-success: oklch(0.75 0.15 160);
  --color-warning: oklch(0.80 0.15 85);
  --color-error: oklch(0.70 0.20 25);
  --rounded-btn: 0.5rem;
}
`;

writeFileSync('./src/app/colors.css', css);
console.log('✅ Generated colors.css from theme config');
