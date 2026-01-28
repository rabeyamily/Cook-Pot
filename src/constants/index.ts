/**
 * Phase 9 — Centralized constants.
 * Storage keys, copy strings, and shared enums for consistency.
 */

/** AsyncStorage keys */
export const STORAGE_KEYS = {
  AUTH: 'cookpot:user',
  SETTINGS: 'cookpot:settings',
} as const;

/** Empty-state and UX copy */
export const COPY = {
  EMPTY_FEED:
    'No recipes yet. Create one or discover more.',
  EMPTY_PANTRY:
    'No saved recipes. Save recipes from the feed to see them here.',
  EMPTY_DISCOVERY:
    'No recipes match your filters. Try adjusting filters or ingredients.',
  EMPTY_SPACE_FEED:
    'No recipes in this space yet.',
  RECIPE_NOT_FOUND: 'Recipe not found.',
  SPACE_NOT_FOUND: 'Space not found.',
  NO_PROFILE: 'No profile loaded.',
  DEMO_MODE_BANNER: 'Demo mode – changes are not saved.',
} as const;

/** Minimum touch target size (pt) for accessibility */
export const MIN_TOUCH_TARGET = 44;
