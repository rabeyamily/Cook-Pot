import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { colors, typography, spacing } from '../theme';
import { Button, PostCard, Tag } from '../components';
import { usePantry } from '../state/PantryContext';
import { usePosts } from '../state/PostsContext';
import { RootStackParamList } from '../navigation';
import { Difficulty } from '../models/post';
import { DietaryPreference } from '../models/user';

type PantryScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Pantry'>;
};

const DIFFICULTY_OPTIONS: Difficulty[] = ['Easy', 'Medium', 'Hard'];

export function PantryScreen({ navigation }: PantryScreenProps) {
  const { entries, isSaved, isCooked, markAsCooked, unmarkCooked, toggleSave } = usePantry();
  const { posts } = usePosts();

  const [cookTimeFilter, setCookTimeFilter] = useState<'under-15' | 'under-30' | 'over-30' | undefined>(undefined);
  const [difficulties, setDifficulties] = useState<Difficulty[]>([]);
  const [dietTags, setDietTags] = useState<DietaryPreference[]>([]);

  const savedPosts = useMemo(
    () =>
      entries
        .map((entry) => posts.find((p) => p.postId === entry.postId))
        .filter((p): p is NonNullable<typeof p> => !!p),
    [entries, posts],
  );

  const availableDietTags = useMemo(() => {
    const set = new Set<DietaryPreference>();
    savedPosts.forEach((post) => post.recipe.dietTags?.forEach((t) => set.add(t)));
    return Array.from(set);
  }, [savedPosts]);

  const filtered = useMemo(() => {
    return savedPosts.filter((post) => {
      if (cookTimeFilter) {
        const m = post.recipe.estimatedCookTimeMinutes;
        if (
          (cookTimeFilter === 'under-15' && m >= 15) ||
          (cookTimeFilter === 'under-30' && (m < 15 || m >= 30)) ||
          (cookTimeFilter === 'over-30' && m < 30)
        ) {
          return false;
        }
      }
      if (difficulties.length > 0 && !difficulties.includes(post.recipe.difficulty)) {
        return false;
      }
      if (dietTags.length > 0) {
        const tags = post.recipe.dietTags ?? [];
        if (!tags.some((t) => dietTags.includes(t))) {
          return false;
        }
      }
      return true;
    });
  }, [savedPosts, cookTimeFilter, difficulties, dietTags]);

  const resetFilters = () => {
    setCookTimeFilter(undefined);
    setDifficulties([]);
    setDietTags([]);
  };

  const toggleDifficulty = (level: Difficulty) => {
    setDifficulties((current) =>
      current.includes(level) ? current.filter((d) => d !== level) : [...current, level],
    );
  };

  const toggleDietTag = (tag: DietaryPreference) => {
    setDietTags((current) =>
      current.includes(tag) ? current.filter((t) => t !== tag) : [...current, tag],
    );
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <Text style={styles.title}>Pantry</Text>

      <View style={styles.sectionHeaderRow}>
        <Text style={styles.sectionLabel}>Filters</Text>
        <Text style={styles.resetText} onPress={resetFilters}>
          Reset
        </Text>
      </View>

      <Text style={styles.filterLabel}>Cook time</Text>
      <View style={styles.buttonRow}>
        <Button
          title="Under 15 min"
          variant={cookTimeFilter === 'under-15' ? 'primary' : 'secondary'}
          onPress={() =>
            setCookTimeFilter((current) => (current === 'under-15' ? undefined : 'under-15'))
          }
          style={styles.filterButton}
        />
        <Button
          title="Under 30 min"
          variant={cookTimeFilter === 'under-30' ? 'primary' : 'secondary'}
          onPress={() =>
            setCookTimeFilter((current) => (current === 'under-30' ? undefined : 'under-30'))
          }
          style={styles.filterButton}
        />
        <Button
          title="30+ min"
          variant={cookTimeFilter === 'over-30' ? 'primary' : 'secondary'}
          onPress={() =>
            setCookTimeFilter((current) => (current === 'over-30' ? undefined : 'over-30'))
          }
          style={styles.filterButton}
        />
      </View>

      <Text style={styles.filterLabel}>Difficulty</Text>
      <View style={styles.buttonRow}>
        {DIFFICULTY_OPTIONS.map((level) => (
          <Button
            key={level}
            title={level}
            variant={difficulties.includes(level) ? 'primary' : 'secondary'}
            onPress={() => toggleDifficulty(level)}
            style={styles.filterButton}
          />
        ))}
      </View>

      <Text style={styles.filterLabel}>Dietary</Text>
      <View style={styles.chipsRow}>
        {availableDietTags.map((tag) => (
          <Tag
            key={tag}
            label={tag}
            selected={dietTags.includes(tag)}
            onPress={() => toggleDietTag(tag)}
          />
        ))}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionLabel}>
          {filtered.length} saved recipe{filtered.length === 1 ? '' : 's'}
        </Text>
        <View style={styles.list}>
          {filtered.map((post) => {
            const cooked = isCooked(post.postId);
            const parent = post.parentPostId
              ? posts.find((p) => p.postId === post.parentPostId)
              : null;
            return (
              <View key={post.postId} style={styles.item}>
                <View style={styles.statusRow}>
                  <Text style={styles.statusBadge}>
                    {cooked ? 'Cooked' : 'Saved'}
                  </Text>
                </View>
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
                <View style={styles.cookedToggleRow}>
                  <Button
                    title={cooked ? 'Mark as saved' : 'Mark as cooked'}
                    variant="secondary"
                    onPress={() => (cooked ? unmarkCooked(post.postId) : markAsCooked(post.postId))}
                    style={styles.cookedToggleButton}
                  />
                </View>
              </View>
            );
          })}
        </View>
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
  section: {
    marginTop: spacing.lg,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  sectionLabel: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  resetText: {
    ...typography.caption,
    color: colors.primary,
  },
  filterLabel: {
    ...typography.caption,
    color: colors.textSecondary,
    marginTop: spacing.sm,
    marginBottom: spacing.xs,
  },
  buttonRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  filterButton: {
    flexGrow: 1,
  },
  chipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
  },
  list: {
    marginTop: spacing.sm,
    gap: spacing.md,
  },
  item: {
    marginBottom: spacing.md,
  },
  statusRow: {
    marginBottom: spacing.xs,
  },
  statusBadge: {
    ...typography.caption,
    color: colors.primary,
  },
  cookedToggleRow: {
    marginTop: spacing.sm,
  },
  cookedToggleButton: {
    alignSelf: 'flex-start',
  },
});

