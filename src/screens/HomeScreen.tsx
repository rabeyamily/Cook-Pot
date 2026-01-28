import React, { useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { colors, typography, spacing } from '../theme';
import { Button, PostCard } from '../components';
import type { RootStackParamList } from '../navigation';
import { usePosts } from '../state/PostsContext';
import { useAuth } from '../state/AuthContext';
import { usePantry } from '../state/PantryContext';
import { useSettings } from '../state/SettingsContext';
import { COPY } from '../constants';

type HomeScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Home'>;
};

export function HomeScreen({ navigation }: HomeScreenProps) {
  const { posts } = usePosts();
  const { user } = useAuth();
  const { isSaved, toggleSave } = usePantry();
  const { settings } = useSettings();

  const feed = useMemo(() => {
    const sorted = [...posts].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );

    const preferredSpaceIds = user?.preferredSpaces ?? [];
    const dietaryPrefs = user?.dietaryPreferences ?? [];

    if (preferredSpaceIds.length > 0) {
      const inSpaces = sorted.filter((post) =>
        (post.cookingSpaces ?? []).some((id) => preferredSpaceIds.includes(id)),
      );
      const rest = sorted.filter(
        (post) => !inSpaces.some((p) => p.postId === post.postId),
      );
      return [...inSpaces, ...rest];
    }

    if (dietaryPrefs.length > 0) {
      const preferred = sorted.filter((post) =>
        (post.recipe.dietTags ?? []).some((tag) => dietaryPrefs.includes(tag)),
      );
      const others = sorted.filter(
        (post) => !preferred.some((p) => p.postId === post.postId),
      );
      return [...preferred, ...others];
    }

    return sorted;
  }, [posts, user]);

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <Text style={styles.title}>Home</Text>
      {settings.demo.isDemoMode && (
        <View style={styles.demoBanner}>
          <Text style={styles.demoBannerText}>{COPY.DEMO_MODE_BANNER}</Text>
        </View>
      )}
      <View style={styles.navRow}>
        <Button
          title="Create"
          variant="primary"
          onPress={() => navigation.navigate('Create')}
          style={styles.navButton}
        />
        <Button
          title="Discover"
          variant="secondary"
          onPress={() => navigation.navigate('Discovery')}
          style={styles.navButton}
        />
        <Button
          title="Pantry"
          variant="secondary"
          onPress={() => navigation.navigate('Pantry')}
          style={styles.navButton}
        />
        <Button
          title="Spaces"
          variant="secondary"
          onPress={() => navigation.navigate('Spaces')}
          style={styles.navButton}
        />
        <Button
          title="Profile"
          variant="secondary"
          onPress={() => navigation.navigate('Profile')}
          style={styles.navButton}
        />
      </View>
      <View style={styles.feedList}>
        {feed.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>{COPY.EMPTY_FEED}</Text>
          </View>
        ) : (
          feed.map((post) => {
            const parent = post.parentPostId
              ? posts.find((p) => p.postId === post.parentPostId)
              : null;
            return (
              <View key={post.postId} style={styles.feedItem}>
                <PostCard
                  post={post}
                  showActions
                  saved={isSaved(post.postId)}
                  onToggleSave={() => toggleSave(post.postId)}
                  onCookThis={() =>
                    navigation.navigate('Cook', { postId: post.postId, initialServings: 2 })
                  }
                  onViewPost={(id) => navigation.navigate('PostDetail', { postId: id })}
                  onViewParent={
                    post.parentPostId
                      ? (id) => navigation.navigate('PostDetail', { postId: id })
                      : undefined
                  }
                  parentAuthor={parent?.author}
                />
              </View>
            );
          })
        )}
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
    marginBottom: spacing.lg,
  },
  navRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },
  navButton: {
    flex: 1,
  },
  feedList: {
    gap: spacing.md,
  },
  feedItem: {
    marginBottom: spacing.md,
  },
  demoBanner: {
    backgroundColor: colors.secondary,
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.sm,
    borderRadius: 8,
    marginBottom: spacing.md,
  },
  demoBannerText: {
    ...typography.caption,
    color: colors.textPrimary,
  },
  emptyState: {
    paddingVertical: spacing.xl,
    paddingHorizontal: spacing.md,
  },
  emptyText: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: 'center',
  },
});
