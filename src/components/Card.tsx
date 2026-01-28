import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { colors, typography, spacing } from '../theme';
import { Tag } from './Tag';

type CookingCardProps = {
  title: string;
  tags?: string[];
  style?: ViewStyle;
};

/** Reusable card for cooking content (video/photo/recipe placeholder) */
export function CookingCard({ title, tags = [], style }: CookingCardProps) {
  return (
    <View style={[styles.card, style]}>
      <View style={styles.mediaPlaceholder} />
      <View style={styles.content}>
        <Text style={styles.title} numberOfLines={2}>
          {title}
        </Text>
        {tags.length > 0 && (
          <View style={styles.tags}>
            {tags.map((tag) => (
              <Tag key={tag} label={tag} />
            ))}
          </View>
        )}
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
  mediaPlaceholder: {
    height: 160,
    backgroundColor: colors.secondary,
    opacity: 0.5,
  },
  content: {
    padding: spacing.md,
  },
  title: {
    ...typography.title,
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
  tags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
  },
});
