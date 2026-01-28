import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { colors, typography, spacing } from '../theme';
import { Button, PostCard, Tag } from '../components';
import { usePosts, getAvailableDietTags } from '../state/PostsContext';
import { useAuth } from '../state/AuthContext';
import type { RootStackParamList } from '../navigation';
import {
  CookTimeFilter,
  Difficulty,
  PostFilterState,
  filterAndRankPosts,
} from '../utils/postFilters';
import { DietaryPreference } from '../models/user';

const COOK_TIME_OPTIONS: { label: string; value: CookTimeFilter }[] = [
  { label: 'Under 15 min', value: 'under-15' },
  { label: 'Under 30 min', value: 'under-30' },
  { label: '30+ min', value: 'over-30' },
];

const DIFFICULTY_OPTIONS: Difficulty[] = ['Easy', 'Medium', 'Hard'];

export function DiscoveryScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList, 'Discovery'>>();
  const { posts } = usePosts();
  const { user } = useAuth();

  const [ingredientInput, setIngredientInput] = useState('');
  const [ingredients, setIngredients] = useState<string[]>([]);
  const [cookTime, setCookTime] = useState<CookTimeFilter | undefined>(undefined);
  const [difficulties, setDifficulties] = useState<Difficulty[]>([]);
  const [dietTags, setDietTags] = useState<DietaryPreference[]>([]);
  const [cuisines, setCuisines] = useState<string[]>([]);

  const availableDietTags = useMemo(() => getAvailableDietTags(posts), [posts]);
  const availableCuisines = useMemo(
    () =>
      Array.from(
        new Set(
          posts
            .map((p) => p.recipe.cuisine)
            .filter((c): c is string => !!c),
        ),
      ),
    [posts],
  );

  const filters: PostFilterState = {
    ingredients,
    cookTime,
    difficulties,
    dietTags,
    cuisines,
  };

  const results = useMemo(() => filterAndRankPosts(posts, filters), [posts, filters]);

  const addIngredient = () => {
    const trimmed = ingredientInput.trim();
    if (!trimmed) return;
    if (ingredients.includes(trimmed)) {
      setIngredientInput('');
      return;
    }
    setIngredients((current) => [...current, trimmed]);
    setIngredientInput('');
  };

  const removeIngredient = (value: string) => {
    setIngredients((current) => current.filter((i) => i !== value));
  };

  const toggleDifficulty = (value: Difficulty) => {
    setDifficulties((current) =>
      current.includes(value) ? current.filter((d) => d !== value) : [...current, value],
    );
  };

  const toggleDietTag = (value: DietaryPreference) => {
    setDietTags((current) =>
      current.includes(value) ? current.filter((d) => d !== value) : [...current, value],
    );
  };

  const toggleCuisine = (value: string) => {
    setCuisines((current) =>
      current.includes(value) ? current.filter((c) => c !== value) : [...current, value],
    );
  };

  const resetFilters = () => {
    setIngredients([]);
    setIngredientInput('');
    setCookTime(undefined);
    setDifficulties([]);
    setDietTags([]);
    setCuisines([]);
  };

  return (
    <KeyboardAvoidingView
      style={styles.root}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.title}>Discover recipes</Text>

        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Ingredients you have</Text>
          <View style={styles.ingredientRow}>
            <TextInput
              value={ingredientInput}
              onChangeText={setIngredientInput}
              placeholder="e.g. chicken, garlic, rice"
              placeholderTextColor={colors.textSecondary}
              style={styles.input}
              onSubmitEditing={addIngredient}
            />
            <Button
              title="Add"
              variant="primary"
              onPress={addIngredient}
              style={styles.addButton}
              disabled={!ingredientInput.trim()}
            />
          </View>
          <View style={styles.chipsRow}>
            {ingredients.map((ing) => (
              <View key={ing} style={styles.chipWithRemove}>
                <Tag label={ing} />
                <Text
                  style={styles.removeChipText}
                  onPress={() => removeIngredient(ing)}
                >
                  ×
                </Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionLabel}>Filters</Text>
            <Text style={styles.resetText} onPress={resetFilters}>
              Reset
            </Text>
          </View>

          <Text style={styles.filterLabel}>Cook time</Text>
          <View style={styles.buttonRow}>
            {COOK_TIME_OPTIONS.map((option) => (
              <Button
                key={option.value}
                title={option.label}
                variant={cookTime === option.value ? 'primary' : 'secondary'}
                onPress={() =>
                  setCookTime((current) =>
                    current === option.value ? undefined : option.value,
                  )
                }
                style={styles.filterButton}
              />
            ))}
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

          <Text style={styles.filterLabel}>Dietary tags</Text>
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

          {availableCuisines.length > 0 && (
            <>
              <Text style={styles.filterLabel}>Cuisine / region</Text>
              <View style={styles.chipsRow}>
                {availableCuisines.map((cuisine) => (
                  <Tag
                    key={cuisine}
                    label={cuisine}
                    selected={cuisines.includes(cuisine)}
                    onPress={() => toggleCuisine(cuisine)}
                  />
                ))}
              </View>
            </>
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionLabel}>
            {results.length} recipe{results.length === 1 ? '' : 's'} found
          </Text>
          <View style={styles.resultsList}>
            {results.map((post) => {
              const parent = post.parentPostId
                ? posts.find((p) => p.postId === post.parentPostId)
                : null;
              return (
                <View key={post.postId} style={styles.resultItem}>
                  <PostCard
                    post={post}
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
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.backgroundBase,
  },
  container: {
    flex: 1,
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
    marginBottom: spacing.lg,
  },
  sectionLabel: {
    ...typography.caption,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  resetText: {
    ...typography.caption,
    color: colors.primary,
  },
  ingredientRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  input: {
    flex: 1,
    ...typography.body,
    backgroundColor: colors.backgroundMint,
    borderRadius: 8,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    color: colors.textPrimary,
    borderWidth: 1,
    borderColor: colors.border,
  },
  addButton: {
    alignSelf: 'stretch',
  },
  chipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
    marginTop: spacing.sm,
  },
  chipWithRemove: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs / 2,
  },
  removeChipText: {
    ...typography.caption,
    color: colors.textSecondary,
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
  resultsList: {
    gap: spacing.md,
  },
  resultItem: {
    marginBottom: spacing.md,
  },
});

