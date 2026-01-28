import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { colors, typography } from '../theme';
import { getSpaceById } from '../models/space';
import { HomeScreen } from '../screens/HomeScreen';
import { CreateScreen } from '../screens/CreateScreen';
import { ProfileScreen } from '../screens/ProfileScreen';
import { DiscoveryScreen } from '../screens/DiscoveryScreen';
import { PantryScreen } from '../screens/PantryScreen';
import { CookScreen } from '../screens/CookScreen';
import { SpacesScreen } from '../screens/SpacesScreen';
import { SpaceFeedScreen } from '../screens/SpaceFeedScreen';
import { PostDetailScreen } from '../screens/PostDetailScreen';
import { RemixBuilderScreen } from '../screens/RemixBuilderScreen';

export type RootStackParamList = {
  Home: undefined;
  Create: undefined;
  Profile: undefined;
  Discovery: undefined;
  Pantry: undefined;
  Spaces: undefined;
  SpaceFeed: { spaceId: string };
  Cook: { postId: string; initialServings?: number };
  PostDetail: { postId: string };
  RemixBuilder: { parentPostId: string };
};

function getSpaceTitle(spaceId: string): string {
  return getSpaceById(spaceId)?.name ?? 'Space';
}

const Stack = createNativeStackNavigator<RootStackParamList>();

export function RootStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: colors.backgroundBase },
        headerTintColor: colors.textPrimary,
        headerTitleStyle: { ...typography.title, fontWeight: '600' },
        headerShadowVisible: false,
        contentStyle: { backgroundColor: colors.backgroundBase },
      }}
    >
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="Create" component={CreateScreen} />
      <Stack.Screen name="Profile" component={ProfileScreen} />
      <Stack.Screen
        name="Discovery"
        component={DiscoveryScreen}
        options={{ title: 'Discover' }}
      />
      <Stack.Screen
        name="Pantry"
        component={PantryScreen}
        options={{ title: 'Pantry' }}
      />
      <Stack.Screen
        name="Cook"
        component={CookScreen}
        options={{ title: 'Cook this' }}
      />
      <Stack.Screen
        name="Spaces"
        component={SpacesScreen}
        options={{ title: 'Spaces' }}
      />
      <Stack.Screen
        name="SpaceFeed"
        component={SpaceFeedScreen}
        options={({ route }) => ({ title: getSpaceTitle(route.params.spaceId) })}
      />
      <Stack.Screen
        name="PostDetail"
        component={PostDetailScreen}
        options={{ title: 'Recipe' }}
      />
      <Stack.Screen
        name="RemixBuilder"
        component={RemixBuilderScreen}
        options={{ title: 'Remix recipe' }}
      />
    </Stack.Navigator>
  );
}
