/**
 * Cooking-focused reactions and comments.
 * No likes, no vanity counts. Backend-ready shapes.
 */

export type ReactionType = 'flavor' | 'presentation' | 'creativity' | 'practicality';

export const REACTIONS: Record<ReactionType, { emoji: string; label: string }> = {
  flavor: { emoji: '🔥', label: 'Flavor' },
  presentation: { emoji: '🤌', label: 'Presentation' },
  creativity: { emoji: '🧠', label: 'Creativity' },
  practicality: { emoji: '🕒', label: 'Practicality' },
};

export interface Comment {
  id: string;
  postId: string;
  userId: string;
  authorDisplayName: string;
  text: string;
  createdAt: string; // ISO
}

export const REACTION_TYPES: ReactionType[] = [
  'flavor',
  'presentation',
  'creativity',
  'practicality',
];
