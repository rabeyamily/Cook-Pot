import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  ReactionType,
  Comment,
  REACTION_TYPES,
} from '../models/engagement';

const REACTIONS_KEY = 'cookpot:reactions';
const COMMENTS_KEY = 'cookpot:comments';

/** Mock reactions for display (no counts shown) */
const MOCK_REACTIONS: Record<string, ReactionType[]> = {
  '1': ['flavor', 'practicality'],
  '2': ['presentation', 'creativity'],
  '3': ['flavor'],
};

/** Mock comments for a couple of posts */
const MOCK_COMMENTS: Record<string, Comment[]> = {
  '1': [
    {
      id: 'mc1',
      postId: '1',
      userId: 'demo-1',
      authorDisplayName: 'Pasta Night',
      text: 'Works great with whole wheat spaghetti too.',
      createdAt: new Date(Date.now() - 86400000).toISOString(),
    },
  ],
  '2': [
    {
      id: 'mc2',
      postId: '2',
      userId: 'demo-2',
      authorDisplayName: 'Sheet Pan Suppers',
      text: 'I add a pinch of smoked paprika.',
      createdAt: new Date(Date.now() - 172800000).toISOString(),
    },
  ],
};

interface EngagementContextValue {
  /** Reaction types present on this post (merged user + mock). No counts. */
  getReactionsForPost: (postId: string) => ReactionType[];
  /** Current user's reaction types on this post */
  getMyReactionsForPost: (postId: string) => ReactionType[];
  toggleReaction: (postId: string, type: ReactionType) => Promise<void>;
  getCommentsForPost: (postId: string) => Comment[];
  addComment: (
    postId: string,
    text: string,
    authorDisplayName: string,
    userId: string,
  ) => Promise<void>;
}

const EngagementContext = createContext<EngagementContextValue | undefined>(undefined);

export function EngagementProvider({ children }: { children: ReactNode }) {
  const [userReactions, setUserReactions] = useState<Record<string, ReactionType[]>>({});
  const [userComments, setUserComments] = useState<Record<string, Comment[]>>({});

  useEffect(() => {
    const load = async () => {
      try {
        const [r, c] = await Promise.all([
          AsyncStorage.getItem(REACTIONS_KEY),
          AsyncStorage.getItem(COMMENTS_KEY),
        ]);
        if (r) setUserReactions(JSON.parse(r));
        if (c) setUserComments(JSON.parse(c));
      } catch (e) {
        console.warn('Failed to load engagement', e);
      }
    };
    load();
  }, []);

  const persistReactions = async (next: Record<string, ReactionType[]>) => {
    setUserReactions(next);
    try {
      await AsyncStorage.setItem(REACTIONS_KEY, JSON.stringify(next));
    } catch (e) {
      console.warn('Failed to save reactions', e);
    }
  };

  const persistComments = async (next: Record<string, Comment[]>) => {
    setUserComments(next);
    try {
      await AsyncStorage.setItem(COMMENTS_KEY, JSON.stringify(next));
    } catch (e) {
      console.warn('Failed to save comments', e);
    }
  };

  const getMyReactionsForPost = (postId: string): ReactionType[] => {
    return userReactions[postId] ?? [];
  };

  const getReactionsForPost = (postId: string): ReactionType[] => {
    const mine = userReactions[postId] ?? [];
    const mock = MOCK_REACTIONS[postId] ?? [];
    const set = new Set<ReactionType>([...mine, ...mock]);
    return REACTION_TYPES.filter((t) => set.has(t));
  };

  const toggleReaction = async (postId: string, type: ReactionType) => {
    const current = userReactions[postId] ?? [];
    const next = current.includes(type)
      ? current.filter((t) => t !== type)
      : [...current, type];
    const nextMap = { ...userReactions, [postId]: next };
    await persistReactions(nextMap);
  };

  const getCommentsForPost = (postId: string): Comment[] => {
    const mine = userComments[postId] ?? [];
    const mock = MOCK_COMMENTS[postId] ?? [];
    return [...mine, ...mock].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );
  };

  const addComment = async (
    postId: string,
    text: string,
    authorDisplayName: string,
    userId: string,
  ) => {
    const trimmed = text.trim();
    if (!trimmed) return;
    const comment: Comment = {
      id: `comment-${Date.now()}`,
      postId,
      userId,
      authorDisplayName,
      text: trimmed,
      createdAt: new Date().toISOString(),
    };
    const existing = userComments[postId] ?? [];
    const next = { ...userComments, [postId]: [comment, ...existing] };
    await persistComments(next);
  };

  return (
    <EngagementContext.Provider
      value={{
        getReactionsForPost,
        getMyReactionsForPost,
        toggleReaction,
        getCommentsForPost,
        addComment,
      }}
    >
      {children}
    </EngagementContext.Provider>
  );
}

export function useEngagement(): EngagementContextValue {
  const ctx = useContext(EngagementContext);
  if (!ctx) {
    throw new Error('useEngagement must be used within an EngagementProvider');
  }
  return ctx;
}
