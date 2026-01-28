/**
 * Data models — single export for backend-ready shapes.
 * User, Post/Recipe, Pantry/Shopping, Spaces, Engagement.
 */

export type {
  CookingLevel,
  DietaryPreference,
  UserProfile,
  StoredAuthData,
  SignUpPayload,
} from './user';

export type {
  MediaType,
  Difficulty,
  IngredientItem,
  RecipeStep,
  RecipeCard,
  Post,
} from './post';

export type { CookingSpace } from './space';
export { SPACES, getSpaceById } from './space';

export type { PantryEntry, ShoppingListItem, ShoppingList } from './pantry';
export { createShoppingListFromPost } from './pantry';

export type { ReactionType, Comment } from './engagement';
export { REACTIONS, REACTION_TYPES } from './engagement';
