import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';
import { UserProfile, StoredAuthData, SignUpPayload } from '../models/user';
import { STORAGE_KEYS } from '../constants';

interface AuthState {
  user: UserProfile | null;
  isLoading: boolean;
}

interface AuthContextValue {
  user: UserProfile | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (payload: SignUpPayload) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (updates: Partial<UserProfile>) => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>({ user: null, isLoading: true });

  useEffect(() => {
    const restore = async () => {
      try {
        const stored = await AsyncStorage.getItem(STORAGE_KEYS.AUTH);
        if (stored) {
          const parsed: StoredAuthData = JSON.parse(stored);
          setState({ user: parsed.user, isLoading: false });
        } else {
          setState({ user: null, isLoading: false });
        }
      } catch (error) {
        console.warn('Failed to restore auth state', error);
        setState({ user: null, isLoading: false });
      }
    };

    restore();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEYS.AUTH);
      if (!stored) {
        throw new Error('No account found. Please sign up.');
      }
      const parsed: StoredAuthData = JSON.parse(stored);
      if (parsed.user.email !== email.trim().toLowerCase() || parsed.password !== password) {
        throw new Error('Invalid email or password.');
      }
      setState({ user: parsed.user, isLoading: false });
    } catch (error: any) {
      const message = error?.message ?? 'Failed to log in.';
      Alert.alert('Login error', message);
      throw error;
    }
  };

  const signup = async (payload: SignUpPayload) => {
    if (!payload.email || !payload.password || !payload.username || !payload.displayName) {
      Alert.alert('Sign up error', 'Please fill in all required fields.');
      return;
    }
    if (payload.password.length < 6) {
      Alert.alert('Sign up error', 'Password must be at least 6 characters.');
      return;
    }

    const newUser: UserProfile = {
      id: Date.now().toString(),
      email: payload.email.trim().toLowerCase(),
      username: payload.username.trim(),
      displayName: payload.displayName.trim(),
      cookingLevel: payload.cookingLevel,
      dietaryPreferences: payload.dietaryPreferences,
    };

    const authData: StoredAuthData = {
      user: newUser,
      password: payload.password,
    };

    try {
      await AsyncStorage.setItem(STORAGE_KEYS.AUTH, JSON.stringify(authData));
      setState({ user: newUser, isLoading: false });
    } catch (error) {
      console.warn('Failed to save auth data', error);
      Alert.alert('Sign up error', 'Could not save your account.');
    }
  };

  const logout = async () => {
    try {
      await AsyncStorage.removeItem(STORAGE_KEYS.AUTH);
    } finally {
      setState({ user: null, isLoading: false });
    }
  };

  const updateProfile = async (updates: Partial<UserProfile>) => {
    if (!state.user) return;
    const updatedUser: UserProfile = { ...state.user, ...updates };

    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEYS.AUTH);
      const existing: StoredAuthData | null = stored ? JSON.parse(stored) : null;
      const authData: StoredAuthData = {
        user: updatedUser,
        password: existing?.password ?? '',
      };
      await AsyncStorage.setItem(STORAGE_KEYS.AUTH, JSON.stringify(authData));
      setState((prev) => ({ ...prev, user: updatedUser }));
    } catch (error) {
      console.warn('Failed to update profile', error);
      Alert.alert('Profile error', 'Could not update your profile.');
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user: state.user,
        isLoading: state.isLoading,
        login,
        signup,
        logout,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return ctx;
}

