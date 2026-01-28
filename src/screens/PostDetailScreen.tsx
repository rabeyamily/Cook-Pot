import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { colors, typography, spacing } from '../theme';
import { Button } from '../components';
import { usePosts } from '../state/PostsContext';
import { usePantry } from '../state/PantryContext';
import type { RootStackParamList } from '../navigation';
import { PostCard } from '../components';
import { COPY } from '../constants';

type Props = NativeStackScreenProps<RootStackParamList, 'PostDetail'>;

export function PostDetailScreen({ route, navigation }: Props) {
  const { postId } = route.params;
  const { posts } = usePosts();
  const { isSaved, toggleSave } = usePantry();
  const post = posts.find((p) => p.postId === postId);
  const parentPost = post?.parentPostId
    ? posts.find((p) => p.postId === post.parentPostId)
    : null;

  useEffect(() => {
    if (post) {
      navigation.setOptions({ title: post.recipe.dishName });
    }
  }, [post, navigation]);

  if (!post) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>{COPY.RECIPE_NOT_FOUND}</Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      {parentPost && (
        <TouchableOpacity
          style={styles.inspiredRow}
          onPress={() => navigation.push('PostDetail', { postId: parentPost.postId })}
        >
          <Text style={styles.inspiredLabel}>Inspired by </Text>
          <Text style={styles.inspiredName}>{parentPost.author.displayName}</Text>
        </TouchableOpacity>
      )}

      {post.isExperiment && (
        <View style={styles.experimentBadge}>
          <Text style={styles.experimentText}>Experiment</Text>
        </View>
      )}

      <PostCard
        post={post}
        showActions
        saved={isSaved(post.postId)}
        onToggleSave={() => toggleSave(post.postId)}
        onCookThis={() => navigation.navigate('Cook', { postId: post.postId, initialServings: 2 })}
      />

      <View style={styles.actionsRow}>
        <Button
          title="Remix this recipe"
          variant="primary"
          onPress={() => navigation.navigate('RemixBuilder', { parentPostId: post.postId })}
          style={styles.remixButton}
        />
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
  inspiredRow: {
    flexDirection: 'row',
    marginBottom: spacing.sm,
  },
  inspiredLabel: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  inspiredName: {
    ...typography.caption,
    color: colors.primary,
  },
  experimentBadge: {
    alignSelf: 'flex-start',
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.sm,
    borderRadius: 6,
    backgroundColor: colors.secondary,
    marginBottom: spacing.sm,
  },
  experimentText: {
    ...typography.caption,
    color: colors.textPrimary,
  },
  actionsRow: {
    marginTop: spacing.lg,
    gap: spacing.sm,
  },
  remixButton: {
    width: '100%',
  },
});
