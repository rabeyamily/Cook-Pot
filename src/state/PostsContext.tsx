import React, { createContext, useContext, useMemo, useState, ReactNode } from 'react';
import { Post } from '../models/post';
import { DietaryPreference } from '../models/user';

interface PostsContextValue {
  posts: Post[];
  addPost: (post: Post) => void;
}

const PostsContext = createContext<PostsContextValue | undefined>(undefined);

// Simple mocked posts for now — no backend.
const MOCK_POSTS: Post[] = [
  {
    postId: '1',
    author: { id: 'demo-1', username: 'pastanight', displayName: 'Pasta Night' },
    mediaType: 'video',
    mediaUris: [
      'https://d23dyxeqlo5psv.cloudfront.net/big_buck_bunny.mp4', // Expo sample video
    ],
    recipe: {
      dishName: 'Simple Pasta Aglio e Olio',
      estimatedCookTimeMinutes: 20,
      difficulty: 'Easy',
      ingredients: [
        { id: 'i1', name: 'Spaghetti', quantity: '200', unit: 'g' },
        { id: 'i2', name: 'Garlic', quantity: '3', unit: 'cloves' },
        { id: 'i3', name: 'Olive oil', quantity: '3', unit: 'tbsp' },
        { id: 'i4', name: 'Chili flakes', quantity: '1', unit: 'tsp' },
        { id: 'i5', name: 'Parsley', quantity: '2', unit: 'tbsp' },
        { id: 'i6', name: 'Salt', quantity: '', unit: undefined },
      ],
      steps: [
        { id: 's1', order: 1, text: 'Boil salted water and cook spaghetti until al dente.', timestampSeconds: 5 },
        { id: 's2', order: 2, text: 'Gently cook garlic and chili in olive oil.', timestampSeconds: 25 },
        { id: 's3', order: 3, text: 'Toss pasta with the garlic oil and parsley.', timestampSeconds: 45 },
      ],
      dietTags: ['Vegetarian'],
      cuisine: 'Italian',
    },
    cookingSpaces: ['italian', '30-min-dinners'],
    createdAt: new Date().toISOString(),
  },
  {
    postId: '2',
    author: { id: 'demo-2', username: 'sheetpan', displayName: 'Sheet Pan Suppers' },
    mediaType: 'photo',
    mediaUris: [
      'https://images.pexels.com/photos/1437267/pexels-photo-1437267.jpeg',
    ],
    recipe: {
      dishName: 'Roasted Vegetables with Herbs',
      estimatedCookTimeMinutes: 40,
      difficulty: 'Medium',
      ingredients: [
        { id: 'i1', name: 'Carrots', quantity: '3', unit: '' },
        { id: 'i2', name: 'Potatoes', quantity: '4', unit: '' },
        { id: 'i3', name: 'Olive oil', quantity: '3', unit: 'tbsp' },
        { id: 'i4', name: 'Rosemary', quantity: '1', unit: 'tbsp' },
        { id: 'i5', name: 'Salt', quantity: '', unit: undefined },
      ],
      steps: [
        { id: 's1', order: 1, text: 'Chop vegetables into even pieces.' },
        { id: 's2', order: 2, text: 'Toss with oil, herbs, and salt.' },
        { id: 's3', order: 3, text: 'Roast until golden and tender.' },
      ],
      dietTags: ['Vegetarian', 'Vegan'],
      cuisine: 'European',
    },
    cookingSpaces: ['plant-forward', 'comfort-food'],
    isExperiment: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
  },
  {
    postId: '3',
    author: { id: 'demo-3', username: 'weeknightonepot', displayName: 'Weeknight One Pot' },
    mediaType: 'photo',
    mediaUris: [
      'https://images.pexels.com/photos/1640770/pexels-photo-1640770.jpeg',
    ],
    recipe: {
      dishName: 'One-Pot Chickpea Stew',
      estimatedCookTimeMinutes: 30,
      difficulty: 'Easy',
      ingredients: [
        { id: 'i1', name: 'Chickpeas', quantity: '1', unit: 'can' },
        { id: 'i2', name: 'Tomatoes', quantity: '1', unit: 'can' },
        { id: 'i3', name: 'Onion', quantity: '1', unit: '' },
        { id: 'i4', name: 'Garlic', quantity: '2', unit: 'cloves' },
      ],
      steps: [
        { id: 's1', order: 1, text: 'Sauté onion and garlic.' },
        { id: 's2', order: 2, text: 'Add tomatoes and chickpeas.' },
        { id: 's3', order: 3, text: 'Simmer until thickened.' },
      ],
      dietTags: ['Vegetarian', 'Vegan', 'Halal'],
      cuisine: 'Middle Eastern–inspired',
    },
    cookingSpaces: ['30-min-dinners', 'student-meals'],
    createdAt: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
  },
];

export function PostsProvider({ children }: { children: ReactNode }) {
  const [userPosts, setUserPosts] = useState<Post[]>([]);

  const value = useMemo<PostsContextValue>(
    () => ({
      posts: [...userPosts, ...MOCK_POSTS],
      addPost: (post: Post) => {
        setUserPosts((current) => [post, ...current]);
      },
    }),
    [userPosts],
  );

  return <PostsContext.Provider value={value}>{children}</PostsContext.Provider>;
}

export function usePosts(): PostsContextValue {
  const ctx = useContext(PostsContext);
  if (!ctx) {
    throw new Error('usePosts must be used within a PostsProvider');
  }
  return ctx;
}

export function getAvailableDietTags(posts: Post[]): DietaryPreference[] {
  const set = new Set<DietaryPreference>();
  posts.forEach((post) => {
    post.recipe.dietTags?.forEach((tag) => set.add(tag));
  });
  return Array.from(set);
}

