/**
 * Phase 8 — Creation & accessibility preferences.
 * All features optional; hands-only mode ON by default for new users.
 */

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_KEYS } from '../constants';

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

/** Demo mode: preload sample data, disable destructive actions (for presentations) */
export interface DemoSettings {
  isDemoMode: boolean;
}

export interface SettingsState {
  creation: CreationSettings;
  accessibility: AccessibilitySettings;
  demo: DemoSettings;
}

const DEFAULT_DEMO: DemoSettings = {
  isDemoMode: false,
};

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
  demo: DEFAULT_DEMO,
};

interface SettingsContextValue {
  settings: SettingsState;
  isLoading: boolean;
  setCreation: (updates: Partial<CreationSettings>) => Promise<void>;
  setAccessibility: (updates: Partial<AccessibilitySettings>) => Promise<void>;
  setDemo: (updates: Partial<DemoSettings>) => Promise<void>;
}

const SettingsContext = createContext<SettingsContextValue | undefined>(undefined);

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<SettingsState>(DEFAULT_SETTINGS);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const restore = async () => {
      try {
        const stored = await AsyncStorage.getItem(STORAGE_KEYS.SETTINGS);
        if (stored) {
          const parsed = JSON.parse(stored) as Partial<SettingsState>;
          setSettings({
            creation: { ...DEFAULT_CREATION, ...parsed.creation },
            accessibility: { ...DEFAULT_ACCESSIBILITY, ...parsed.accessibility },
            demo: { ...DEFAULT_DEMO, ...parsed.demo },
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
      await AsyncStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(next));
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

  const setDemo = async (updates: Partial<DemoSettings>) => {
    await persist({
      ...settings,
      demo: { ...settings.demo, ...updates },
    });
  };

  return (
    <SettingsContext.Provider
      value={{
        settings,
        isLoading,
        setCreation,
        setAccessibility,
        setDemo,
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
