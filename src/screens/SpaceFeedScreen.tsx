import React, { useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { colors, typography, spacing } from '../theme';
import { PostCard } from '../components';
import { usePosts } from '../state/PostsContext';
import { usePantry } from '../state/PantryContext';
import { getSpaceById } from '../models/space';
import type { RootStackParamList } from '../navigation';
import { COPY } from '../constants';

type Props = NativeStackScreenProps<RootStackParamList, 'SpaceFeed'>;

export function SpaceFeedScreen({ route, navigation }: Props) {
  const { spaceId } = route.params;
  const { posts } = usePosts();
  const { isSaved, toggleSave } = usePantry();

  const space = getSpaceById(spaceId);

  const feed = useMemo(() => {
    const filtered = posts.filter((p) => p.cookingSpaces?.includes(spaceId));
    return [...filtered].sort((a, b) => {
      const dateA = new Date(a.createdAt).getTime();
      const dateB = new Date(b.createdAt).getTime();
      if (dateB !== dateA) return dateB - dateA;
      return a.recipe.estimatedCookTimeMinutes - b.recipe.estimatedCookTimeMinutes;
    });
  }, [posts, spaceId]);

  if (!space) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>{COPY.SPACE_NOT_FOUND}</Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <Text style={styles.spaceName}>{space.name}</Text>
      <Text style={styles.spaceDescription}>{space.description}</Text>
      <Text style={styles.countLabel}>
        {feed.length} recipe{feed.length === 1 ? '' : 's'}
      </Text>
      {feed.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyText}>{COPY.EMPTY_SPACE_FEED}</Text>
        </View>
      ) : (
      <View style={styles.feedList}>
        {feed.map((post) => {
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
        })}
      </View>
      )}
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
  emptyContainer: {
    flex: 1,
    backgroundColor: colors.backgroundBase,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    ...typography.body,
    color: colors.textSecondary,
  },
  spaceName: {
    ...typography.titleLarge,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  spaceDescription: {
    ...typography.caption,
    color: colors.textSecondary,
    marginBottom: spacing.sm,
  },
  countLabel: {
    ...typography.caption,
    color: colors.primary,
    marginBottom: spacing.lg,
  },
  feedList: {
    gap: spacing.md,
  },
  feedItem: {
    marginBottom: spacing.md,
  },
  emptyState: {
    paddingVertical: spacing.xl,
    paddingHorizontal: spacing.md,
  },
});
