import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { RootNavigator } from './src/navigation';
import { AuthProvider } from './src/state/AuthContext';
import { SettingsProvider } from './src/state/SettingsContext';
import { PostsProvider } from './src/state/PostsContext';
import { PantryProvider } from './src/state/PantryContext';
import { EngagementProvider } from './src/state/EngagementContext';
import { ThemeProvider, useTheme } from './src/theme';

function AppContent() {
  const { colors } = useTheme();
  return (
    <>
      <StatusBar style="dark" backgroundColor={colors.backgroundBase} />
      <NavigationContainer>
        <RootNavigator />
      </NavigationContainer>
    </>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <SettingsProvider>
        <ThemeProvider>
          <PostsProvider>
            <PantryProvider>
              <EngagementProvider>
                <AppContent />
              </EngagementProvider>
            </PantryProvider>
          </PostsProvider>
        </ThemeProvider>
      </SettingsProvider>
    </AuthProvider>
  );
}
