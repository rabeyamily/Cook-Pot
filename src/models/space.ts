/**
 * Cooking Space — cuisine, lifestyle, or cooking context.
 * Replaces hashtags; every recipe belongs to at least one space.
 */

export interface CookingSpace {
  spaceId: string;
  name: string;
  description: string;
}

export const SPACES: CookingSpace[] = [
  { spaceId: 'bangladeshi-home', name: 'Bangladeshi Home Cooking', description: 'Everyday dishes from Bangladeshi home kitchens.' },
  { spaceId: 'student-meals', name: 'Student Meals', description: 'Budget-friendly, minimal equipment, quick meals.' },
  { spaceId: '30-min-dinners', name: '30-Minute Dinners', description: 'Weeknight dinners in about half an hour.' },
  { spaceId: 'street-food', name: 'Street Food Recreation', description: 'Recreate street food favorites at home.' },
  { spaceId: 'comfort-food', name: 'Comfort Food', description: 'Hearty, familiar, feel-good cooking.' },
  { spaceId: 'italian', name: 'Italian', description: 'Italian-inspired recipes and classics.' },
  { spaceId: 'plant-forward', name: 'Plant-Forward', description: 'Vegetables and plants at the center.' },
];

export function getSpaceById(spaceId: string): CookingSpace | undefined {
  return SPACES.find((s) => s.spaceId === spaceId);
}
