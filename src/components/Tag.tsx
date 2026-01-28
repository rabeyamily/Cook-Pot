import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { colors, typography, spacing } from '../theme';

type TagProps = {
  label: string;
  style?: ViewStyle;
};

/** Chip / tag for cooking categories (e.g. Pasta, Quick, Vegetarian) */
export function Tag({ label, style }: TagProps) {
  return (
    <View style={[styles.wrapper, style]}>
      <Text style={styles.label} numberOfLines={1}>
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: colors.secondary,
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.sm,
    borderRadius: 6,
    alignSelf: 'flex-start',
  },
  label: {
    ...typography.caption,
    color: colors.textPrimary,
  },
});
