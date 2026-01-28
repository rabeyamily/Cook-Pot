/**
 * Cook Pot Design System — Color Palette
 * Usage: backgrounds #F0F0D7 | #D0DDD0; primary #727D73; secondary #AAB99A
 * Avoid pure white or pure black.
 */

export const colors = {
  primary: '#727D73',       // Primary Dark Green — buttons & accents
  secondary: '#AAB99A',     // Secondary Sage Green — tags, secondary elements
  backgroundBase: '#F0F0D7', // Off-White Base — main backgrounds
  backgroundMint: '#D0DDD0', // Light Mint — alternate backgrounds
  textPrimary: '#2C2C2C',   // Near-black, not pure black
  textSecondary: '#5C5C5C', // Muted text
  border: '#C0C8B8',        // Subtle border (sage tint)
} as const;

export type ColorKey = keyof typeof colors;
