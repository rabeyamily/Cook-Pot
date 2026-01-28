/**
 * User model — profile and auth payloads.
 * Backend-ready: id, email, username, displayName, preferences.
 */

export type CookingLevel = 'Beginner' | 'Home Cook' | 'Advanced';

export type DietaryPreference = 'Vegetarian' | 'Vegan' | 'Halal' | 'Keto' | 'None';

export interface UserProfile {
  id: string;
  email: string;
  username: string;
  displayName: string;
  cookingLevel: CookingLevel;
  dietaryPreferences: DietaryPreference[];
  profilePhotoUri?: string;
  /** Optional: space IDs to surface first on Home */
  preferredSpaces?: string[];
}

export interface StoredAuthData {
  user: UserProfile;
  password: string; // mock only, will be replaced by real backend later
}

export interface SignUpPayload {
  email: string;
  password: string;
  username: string;
  displayName: string;
  cookingLevel: CookingLevel;
  dietaryPreferences: DietaryPreference[];
}

