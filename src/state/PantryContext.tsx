import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { PantryEntry } from '../models/pantry';

const STORAGE_KEY = 'cookpot:pantry';

interface PantryContextValue {
  entries: PantryEntry[];
  isSaved: (postId: string) => boolean;
  toggleSave: (postId: string) => Promise<void>;
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
    <PantryContext.Provider value={{ entries, isSaved, toggleSave, remove }}>
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

