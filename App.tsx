import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { RootNavigator } from './src/navigation';
import { colors } from './src/theme';
import { AuthProvider } from './src/state/AuthContext';

export default function App() {
  return (
    <AuthProvider>
      <NavigationContainer>
        <StatusBar style="dark" backgroundColor={colors.backgroundBase} />
        <RootNavigator />
      </NavigationContainer>
    </AuthProvider>
  );
}
