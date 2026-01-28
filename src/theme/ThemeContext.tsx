/**
 * Phase 8 — Theme derived from accessibility settings.
 * Larger text and high-contrast use existing palette only.
 */

import React, { createContext, useContext, useMemo, ReactNode } from 'react';
import { colors as baseColors } from './colors';
import { typography as baseTypography, fontFamily } from './typography';
import { spacing } from './spacing';
import { useSettings } from '../state/SettingsContext';

/** High-contrast palette: same keys, stronger contrast (existing palette only) */
const highContrastColors = {
  ...baseColors,
  textPrimary: '#1a1a1a',
  textSecondary: '#3a3a3a',
  border: '#8a928a',
} as const;

/** Larger typography scale (~1.15x) */
const largerTypography = {
  titleLarge: {
    fontFamily,
    fontSize: 28,
    fontWeight: '600' as const,
    lineHeight: 34,
  },
  title: {
    fontFamily,
    fontSize: 20,
    fontWeight: '600' as const,
    lineHeight: 26,
  },
  body: {
    fontFamily,
    fontSize: 18,
    fontWeight: '400' as const,
    lineHeight: 24,
  },
  caption: {
    fontFamily,
    fontSize: 16,
    fontWeight: '400' as const,
    lineHeight: 20,
  },
  label: {
    fontFamily,
    fontSize: 18,
    fontWeight: '600' as const,
    lineHeight: 22,
  },
} as const;

export interface Theme {
  colors: typeof baseColors;
  typography: typeof baseTypography;
  spacing: typeof spacing;
}

const defaultTheme: Theme = {
  colors: baseColors,
  typography: baseTypography,
  spacing,
};

const ThemeContext = createContext<Theme>(defaultTheme);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const { settings } = useSettings();
  const theme = useMemo(() => {
    const colors = settings.accessibility.highContrast ? highContrastColors : baseColors;
    const typography = settings.accessibility.largerText ? largerTypography : baseTypography;
    return { colors, typography, spacing };
  }, [
    settings.accessibility.highContrast,
    settings.accessibility.largerText,
  ]);

  return <ThemeContext.Provider value={theme}>{children}</ThemeContext.Provider>;
}

export function useTheme(): Theme {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error('useTheme must be used within a ThemeProvider (inside SettingsProvider)');
  }
  return ctx;
}
