/**
 * Post and recipe models — cooking content.
 * Backend-ready: postId, author, mediaUris, recipe, cookingSpaces, createdAt, optional remix/audio flags.
 */

import type { UserProfile, DietaryPreference } from './user';

export type MediaType = 'video' | 'photo';

export type Difficulty = 'Easy' | 'Medium' | 'Hard';

export interface IngredientItem {
  id: string;
  name: string;
  quantity: string; // free-form, e.g. "2", "1/2", "pinch"
  unit?: string; // e.g. "g", "tbsp"
}

export interface RecipeStep {
  id: string;
  order: number;
  text: string;
  timestampSeconds?: number; // optional step-synced video timestamp
  /** Optional caption for muted / step-text-only videos */
  caption?: string;
}

export interface RecipeCard {
  dishName: string;
  ingredients: IngredientItem[];
  steps: RecipeStep[];
  estimatedCookTimeMinutes: number;
  difficulty: Difficulty;
  dietTags?: DietaryPreference[];
  cuisine?: string;
}

export interface Post {
  postId: string;
  author: Pick<UserProfile, 'id' | 'username' | 'displayName'>;
  mediaType: MediaType;
  mediaUris: string[]; // first is primary; later ready for carousel
  recipe: RecipeCard;
  /** At least one, up to two Cooking Space IDs */
  cookingSpaces: string[];
  /** Marked as experiment; not treated as failure */
  isExperiment?: boolean;
  /** Set when this post is a remix; original is always credited */
  parentPostId?: string | null;
  /** Video is muted; step text / captions only (no voice required) */
  isMuted?: boolean;
  /** Has voice-over narration (optional; never required) */
  hasVoiceOver?: boolean;
  createdAt: string; // ISO string for easy backend migration later
}

