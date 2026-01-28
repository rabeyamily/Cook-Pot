import type { Post } from './post';

export interface PantryEntry {
  id: string;
  postId: string;
  addedAt: string; // ISO
}

export interface ShoppingListItem {
  id: string;
  ingredientName: string;
  quantityDisplay: string;
}

export interface ShoppingList {
  id: string;
  postId: string;
  servings: number;
  baseServings: number;
  items: ShoppingListItem[];
}

export function createShoppingListFromPost(post: Post, servings: number, baseServings = 2): ShoppingList {
  const factor = servings / baseServings;

  const items: ShoppingListItem[] = post.recipe.ingredients.map((ing) => {
    const numeric = parseFloat(ing.quantity);
    let qty = ing.quantity;

    if (!Number.isNaN(numeric) && factor !== 1) {
      const scaled = +(numeric * factor).toFixed(2);
      const unit = ing.unit ? ` ${ing.unit}` : '';
      qty = `${scaled}${unit}`;
    } else if (ing.unit && !ing.quantity) {
      qty = ing.unit;
    } else if (ing.unit && ing.quantity) {
      qty = `${ing.quantity} ${ing.unit}`;
    }

    return {
      id: ing.id,
      ingredientName: ing.name,
      quantityDisplay: qty || '',
    };
  });

  return {
    id: `${post.postId}-shopping-${Date.now()}`,
    postId: post.postId,
    servings,
    baseServings,
    items,
  };
}

