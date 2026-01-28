/**
 * Phase 8 — Creation & accessibility preferences.
 * All features optional; hands-only mode ON by default for new users.
 */

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = 'cookpot:settings';

export interface CreationSettings {
  /** Default ON: countertop framing, no face prompts */
  handsOnlyMode: boolean;
  /** Optional angle grid for top-down shots */
  angleGrid: boolean;
  /** Optional lighting hint (too dark / okay) */
  lightingHint: boolean;
  /** Optional stability reminder */
  stabilityReminder: boolean;
}

export interface AccessibilitySettings {
  /** Larger text option */
  largerText: boolean;
  /** High-contrast using existing palette */
  highContrast: boolean;
}

export interface SettingsState {
  creation: CreationSettings;
  accessibility: AccessibilitySettings;
}

const DEFAULT_CREATION: CreationSettings = {
  handsOnlyMode: true,
  angleGrid: false,
  lightingHint: false,
  stabilityReminder: false,
};

const DEFAULT_ACCESSIBILITY: AccessibilitySettings = {
  largerText: false,
  highContrast: false,
};

const DEFAULT_SETTINGS: SettingsState = {
  creation: DEFAULT_CREATION,
  accessibility: DEFAULT_ACCESSIBILITY,
};

interface SettingsContextValue {
  settings: SettingsState;
  isLoading: boolean;
  setCreation: (updates: Partial<CreationSettings>) => Promise<void>;
  setAccessibility: (updates: Partial<AccessibilitySettings>) => Promise<void>;
}

const SettingsContext = createContext<SettingsContextValue | undefined>(undefined);

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<SettingsState>(DEFAULT_SETTINGS);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const restore = async () => {
      try {
        const stored = await AsyncStorage.getItem(STORAGE_KEY);
        if (stored) {
          const parsed = JSON.parse(stored) as Partial<SettingsState>;
          setSettings({
            creation: { ...DEFAULT_CREATION, ...parsed.creation },
            accessibility: { ...DEFAULT_ACCESSIBILITY, ...parsed.accessibility },
          });
        }
      } catch (error) {
        console.warn('Failed to restore settings', error);
      } finally {
        setIsLoading(false);
      }
    };
    restore();
  }, []);

  const persist = async (next: SettingsState) => {
    setSettings(next);
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch (error) {
      console.warn('Failed to persist settings', error);
    }
  };

  const setCreation = async (updates: Partial<CreationSettings>) => {
    await persist({
      ...settings,
      creation: { ...settings.creation, ...updates },
    });
  };

  const setAccessibility = async (updates: Partial<AccessibilitySettings>) => {
    await persist({
      ...settings,
      accessibility: { ...settings.accessibility, ...updates },
    });
  };

  return (
    <SettingsContext.Provider
      value={{
        settings,
        isLoading,
        setCreation,
        setAccessibility,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings(): SettingsContextValue {
  const ctx = useContext(SettingsContext);
  if (!ctx) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return ctx;
}
