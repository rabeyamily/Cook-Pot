import React, { useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { colors, typography, spacing } from '../theme';
import { SPACES } from '../models/space';
import { usePosts } from '../state/PostsContext';
import type { RootStackParamList } from '../navigation';

type SpacesScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Spaces'>;
};

export function SpacesScreen({ navigation }: SpacesScreenProps) {
  const { posts } = usePosts();

  const recipeCountBySpace = useMemo(() => {
    const counts: Record<string, number> = {};
    SPACES.forEach((s) => {
      counts[s.spaceId] = posts.filter((p) => p.cookingSpaces?.includes(s.spaceId)).length;
    });
    return counts;
  }, [posts]);

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <Text style={styles.title}>Cooking Spaces</Text>
      <Text style={styles.subtitle}>
        Browse recipes by cuisine, lifestyle, or context.
      </Text>
      <View style={styles.list}>
        {SPACES.map((space) => (
          <TouchableOpacity
            key={space.spaceId}
            style={styles.card}
            activeOpacity={0.8}
            onPress={() => navigation.navigate('SpaceFeed', { spaceId: space.spaceId })}
          >
            <Text style={styles.spaceName}>{space.name}</Text>
            <Text style={styles.spaceDescription}>{space.description}</Text>
            <Text style={styles.recipeCount}>
              {recipeCountBySpace[space.spaceId] ?? 0} recipe{(recipeCountBySpace[space.spaceId] ?? 0) === 1 ? '' : 's'}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.backgroundBase,
  },
  content: {
    padding: spacing.md,
    paddingBottom: spacing.xxl,
  },
  title: {
    ...typography.titleLarge,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  subtitle: {
    ...typography.caption,
    color: colors.textSecondary,
    marginBottom: spacing.lg,
  },
  list: {
    gap: spacing.md,
  },
  card: {
    backgroundColor: colors.backgroundMint,
    borderRadius: 12,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  spaceName: {
    ...typography.title,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  spaceDescription: {
    ...typography.caption,
    color: colors.textSecondary,
    marginBottom: spacing.sm,
  },
  recipeCount: {
    ...typography.caption,
    color: colors.primary,
  },
});
