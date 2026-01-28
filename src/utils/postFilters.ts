import { Post, Difficulty } from '../models/post';
import { DietaryPreference } from '../models/user';

export type CookTimeFilter = 'under-15' | 'under-30' | 'over-30';

export interface PostFilterState {
  ingredients: string[];
  cookTime?: CookTimeFilter;
  difficulties: Difficulty[];
  dietTags: DietaryPreference[];
  cuisines: string[];
}

function normalize(text: string): string {
  return text.trim().toLowerCase();
}

export function postMatchesIngredients(post: Post, ingredients: string[]): { all: boolean; matches: number } {
  if (ingredients.length === 0) {
    return { all: true, matches: 0 };
  }
  const wanted = ingredients.map(normalize);
  const ingredientNames = post.recipe.ingredients.map((i) => normalize(i.name));

  let matches = 0;
  let all = true;

  for (const term of wanted) {
    const found = ingredientNames.some((name) => name.includes(term));
    if (found) {
      matches += 1;
    } else {
      all = false;
    }
  }

  return { all, matches };
}

export function postMatchesFilters(post: Post, filters: PostFilterState): boolean {
  const { cookTime, difficulties, dietTags, cuisines } = filters;

  if (cookTime) {
    const minutes = post.recipe.estimatedCookTimeMinutes;
    if (
      (cookTime === 'under-15' && minutes >= 15) ||
      (cookTime === 'under-30' && (minutes < 15 || minutes >= 30)) ||
      (cookTime === 'over-30' && minutes < 30)
    ) {
      return false;
    }
  }

  if (difficulties.length > 0 && !difficulties.includes(post.recipe.difficulty)) {
    return false;
  }

  if (dietTags.length > 0) {
    const postTags = post.recipe.dietTags ?? [];
    const hasAny = postTags.some((tag) => dietTags.includes(tag));
    if (!hasAny) {
      return false;
    }
  }

  if (cuisines.length > 0) {
    const recipeCuisine = post.recipe.cuisine?.toLowerCase() ?? '';
    if (!cuisines.some((c) => recipeCuisine.includes(c.toLowerCase()))) {
      return false;
    }
  }

  return true;
}

export function filterAndRankPosts(posts: Post[], filters: PostFilterState): Post[] {
  return posts
    .map((post) => {
      const ingredientMatch = postMatchesIngredients(post, filters.ingredients);
      if (!postMatchesFilters(post, filters)) {
        return null;
      }

      const baseScore = ingredientMatch.all ? 2 : ingredientMatch.matches > 0 ? 1 : 0;
      const recentBoost = new Date(post.createdAt).getTime() / 1_000_000_000;

      return {
        post,
        score: baseScore + recentBoost,
      };
    })
    .filter((x): x is { post: Post; score: number } => x !== null)
    .sort((a, b) => b.score - a.score)
    .map((x) => x.post);
}

