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
  createdAt: string; // ISO string for easy backend migration later
}

