/**
 * Cook Pot Design System — Typography
 * System fonts only: iOS SF Pro, Android Roboto, web system-ui
 * No custom fonts. Clean, modern, readable.
 */

import { Platform } from 'react-native';

export const fontFamily = Platform.select({
  ios: 'System',
  android: 'Roboto',
  default: 'System',
});

export const typography = {
  /** Large titles (screen headers) */
  titleLarge: {
    fontFamily,
    fontSize: 24,
    fontWeight: '600' as const,
    lineHeight: 30,
  },
  /** Card/section titles */
  title: {
    fontFamily,
    fontSize: 18,
    fontWeight: '600' as const,
    lineHeight: 24,
  },
  /** Body text */
  body: {
    fontFamily,
    fontSize: 16,
    fontWeight: '400' as const,
    lineHeight: 22,
  },
  /** Small labels, captions */
  caption: {
    fontFamily,
    fontSize: 14,
    fontWeight: '400' as const,
    lineHeight: 18,
  },
  /** Buttons, labels */
  label: {
    fontFamily,
    fontSize: 16,
    fontWeight: '600' as const,
    lineHeight: 20,
  },
} as const;
