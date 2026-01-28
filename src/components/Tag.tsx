import React from 'react';
import { Text, StyleSheet, ViewStyle, TouchableOpacity } from 'react-native';
import { colors, typography, spacing } from '../theme';

type TagProps = {
  label: string;
  style?: ViewStyle;
  selected?: boolean;
  onPress?: () => void;
};

/** Chip / tag for cooking categories (e.g. Pasta, Quick, Vegetarian) */
export function Tag({ label, style, selected = false, onPress }: TagProps) {
  return (
    <TouchableOpacity
      activeOpacity={onPress ? 0.8 : 1}
      onPress={onPress}
      style={[
        styles.wrapper,
        selected && styles.selected,
        style,
      ]}
    >
      <Text style={[styles.label, selected && styles.labelSelected]} numberOfLines={1}>
        {label}
      </Text>
    </TouchableOpacity>
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
  selected: {
    backgroundColor: colors.primary,
  },
  label: {
    ...typography.caption,
    color: colors.textPrimary,
  },
  labelSelected: {
    color: colors.backgroundBase,
  },
});
