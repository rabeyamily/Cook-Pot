import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { PantryEntry } from '../models/pantry';

const STORAGE_KEY = 'cookpot:pantry';

interface PantryContextValue {
  entries: PantryEntry[];
  isSaved: (postId: string) => boolean;
  isCooked: (postId: string) => boolean;
  getEntry: (postId: string) => PantryEntry | undefined;
  toggleSave: (postId: string) => Promise<void>;
  markAsCooked: (postId: string) => Promise<void>;
  unmarkCooked: (postId: string) => Promise<void>;
  remove: (postId: string) => Promise<void>;
}

const PantryContext = createContext<PantryContextValue | undefined>(undefined);

export function PantryProvider({ children }: { children: ReactNode }) {
  const [entries, setEntries] = useState<PantryEntry[]>([]);

  useEffect(() => {
    const load = async () => {
      try {
        const stored = await AsyncStorage.getItem(STORAGE_KEY);
        if (stored) {
          setEntries(JSON.parse(stored));
        }
      } catch (e) {
        console.warn('Failed to load pantry', e);
      }
    };
    load();
  }, []);

  const persist = async (next: PantryEntry[]) => {
    setEntries(next);
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch (e) {
      console.warn('Failed to save pantry', e);
    }
  };

  const isSaved = (postId: string) => entries.some((e) => e.postId === postId);
  const isCooked = (postId: string) =>
    entries.some((e) => e.postId === postId && e.cookedAt != null);
  const getEntry = (postId: string) => entries.find((e) => e.postId === postId);

  const markAsCooked = async (postId: string) => {
    const existing = entries.find((e) => e.postId === postId);
    const cookedAt = new Date().toISOString();
    if (existing) {
      await persist(
        entries.map((e) =>
          e.postId === postId ? { ...e, cookedAt } : e,
        ),
      );
    } else {
      const entry: PantryEntry = {
        id: `${postId}-${Date.now()}`,
        postId,
        addedAt: cookedAt,
        cookedAt,
      };
      await persist([entry, ...entries]);
    }
  };

  const unmarkCooked = async (postId: string) => {
    const existing = entries.find((e) => e.postId === postId);
    if (!existing) return;
    const { cookedAt, ...rest } = existing;
    await persist(
      entries.map((e) => (e.postId === postId ? { ...rest } : e)),
    );
  };

  const toggleSave = async (postId: string) => {
    const existing = entries.find((e) => e.postId === postId);
    if (existing) {
      await persist(entries.filter((e) => e.postId !== postId));
    } else {
      const entry: PantryEntry = {
        id: `${postId}-${Date.now()}`,
        postId,
        addedAt: new Date().toISOString(),
      };
      await persist([entry, ...entries]);
    }
  };

  const remove = async (postId: string) => {
    await persist(entries.filter((e) => e.postId !== postId));
  };

  return (
    <PantryContext.Provider
      value={{
        entries,
        isSaved,
        isCooked,
        getEntry,
        toggleSave,
        markAsCooked,
        unmarkCooked,
        remove,
      }}
    >
      {children}
    </PantryContext.Provider>
  );
}

export function usePantry(): PantryContextValue {
  const ctx = useContext(PantryContext);
  if (!ctx) {
    throw new Error('usePantry must be used within a PantryProvider');
  }
  return ctx;
}

