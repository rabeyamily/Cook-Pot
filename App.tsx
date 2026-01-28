import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { RootNavigator } from './src/navigation';
import { colors } from './src/theme';
import { AuthProvider } from './src/state/AuthContext';
import { PostsProvider } from './src/state/PostsContext';
import { PantryProvider } from './src/state/PantryContext';
import { EngagementProvider } from './src/state/EngagementContext';

export default function App() {
  return (
    <AuthProvider>
      <PostsProvider>
        <PantryProvider>
          <EngagementProvider>
            <NavigationContainer>
            <StatusBar style="dark" backgroundColor={colors.backgroundBase} />
              <RootNavigator />
            </NavigationContainer>
          </EngagementProvider>
        </PantryProvider>
      </PostsProvider>
    </AuthProvider>
  );
}
