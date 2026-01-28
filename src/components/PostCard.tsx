import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { colors, typography, spacing } from '../theme';
import { Post } from '../models/post';
import { Tag } from './Tag';

type PostCardProps = {
  post: Post;
};

export function PostCard({ post }: PostCardProps) {
  const primaryUri = post.mediaUris[0];

  return (
    <View style={styles.card}>
      <View style={styles.mediaWrapper}>
        <Image source={{ uri: primaryUri }} style={styles.media} />
        <View style={styles.mediaTypeBadge}>
          <Text style={styles.mediaTypeText}>
            {post.mediaType === 'video' ? 'Video' : 'Photo'}
          </Text>
        </View>
      </View>
      <View style={styles.content}>
        <Text style={styles.dishName} numberOfLines={2}>
          {post.recipe.dishName}
        </Text>
        <Text style={styles.meta}>
          {post.recipe.estimatedCookTimeMinutes} min • {post.recipe.difficulty}
        </Text>
        <View style={styles.tagsRow}>
          {post.recipe.dietTags?.slice(0, 3).map((tag) => (
            <Tag key={tag} label={tag} />
          ))}
          {post.recipe.cuisine && (
            <Tag label={post.recipe.cuisine} />
          )}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.backgroundMint,
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.border,
  },
  mediaWrapper: {
    position: 'relative',
  },
  media: {
    width: '100%',
    height: 220,
    backgroundColor: colors.secondary,
  },
  mediaTypeBadge: {
    position: 'absolute',
    bottom: spacing.sm,
    right: spacing.sm,
    backgroundColor: colors.primary,
    borderRadius: 999,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
  },
  mediaTypeText: {
    ...typography.caption,
    color: colors.backgroundBase,
  },
  content: {
    padding: spacing.md,
  },
  dishName: {
    ...typography.title,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  meta: {
    ...typography.caption,
    color: colors.textSecondary,
    marginBottom: spacing.sm,
  },
  tagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
  },
});

