import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { colors, typography, spacing } from '../theme';
import { Button } from '../components';
import { useAuth } from '../state/AuthContext';
import { usePosts } from '../state/PostsContext';
import type { RootStackParamList } from '../navigation';
import type { Post } from '../models/post';
import type { Difficulty } from '../models/post';

type Props = NativeStackScreenProps<RootStackParamList, 'RemixBuilder'>;

const DIFFICULTIES: Difficulty[] = ['Easy', 'Medium', 'Hard'];

export function RemixBuilderScreen({ route, navigation }: Props) {
  const { parentPostId } = route.params;
  const { user } = useAuth();
  const { posts, addPost } = usePosts();
  const parent = useMemo(
    () => posts.find((p) => p.postId === parentPostId),
    [posts, parentPostId],
  );

  const [dishName, setDishName] = useState(parent?.recipe.dishName + ' (remix)' ?? '');
  const [cookTime, setCookTime] = useState(
    String(parent?.recipe.estimatedCookTimeMinutes ?? 30),
  );
  const [difficulty, setDifficulty] = useState<Difficulty>(
    parent?.recipe.difficulty ?? 'Easy',
  );
  const [reuseMedia, setReuseMedia] = useState(true);
  const [publishing, setPublishing] = useState(false);

  if (!parent || !user) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>Recipe not found.</Text>
      </View>
    );
  }

  const handlePublish = () => {
    const minutes = parseInt(cookTime, 10);
    const estimatedCookTimeMinutes = Number.isNaN(minutes) || minutes < 1 ? 30 : minutes;

    const post: Post = {
      postId: `remix-${Date.now()}`,
      author: { id: user.id, username: user.username, displayName: user.displayName },
      mediaType: parent.mediaType,
      mediaUris: reuseMedia ? [...parent.mediaUris] : [parent.mediaUris[0]],
      recipe: {
        dishName: dishName.trim() || parent.recipe.dishName + ' (remix)',
        ingredients: parent.recipe.ingredients.map((i) => ({
          ...i,
          id: `${i.id}-${Date.now()}`,
        })),
        steps: parent.recipe.steps.map((s) => ({
          ...s,
          id: `${s.id}-${Date.now()}`,
        })),
        estimatedCookTimeMinutes,
        difficulty,
        dietTags: parent.recipe.dietTags,
        cuisine: parent.recipe.cuisine,
      },
      cookingSpaces: [...parent.cookingSpaces],
      parentPostId,
      createdAt: new Date().toISOString(),
    };

    setPublishing(true);
    addPost(post);
    setPublishing(false);
    navigation.navigate('Home');
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      keyboardShouldPersistTaps="handled"
    >
      <Text style={styles.title}>Remix recipe</Text>
      <View style={styles.attribution}>
        <Text style={styles.attributionText}>Inspired by {parent.author.displayName}</Text>
      </View>

      <View style={styles.fieldGroup}>
        <Text style={styles.label}>Dish name</Text>
        <TextInput
          value={dishName}
          onChangeText={setDishName}
          placeholder="Your version of the dish"
          placeholderTextColor={colors.textSecondary}
          style={styles.input}
        />
      </View>

      <View style={styles.fieldGroup}>
        <Text style={styles.label}>Cook time (minutes)</Text>
        <TextInput
          value={cookTime}
          onChangeText={setCookTime}
          placeholder="30"
          placeholderTextColor={colors.textSecondary}
          keyboardType="number-pad"
          style={styles.input}
        />
      </View>

      <View style={styles.fieldGroup}>
        <Text style={styles.label}>Difficulty</Text>
        <View style={styles.difficultyRow}>
          {DIFFICULTIES.map((d) => (
            <Button
              key={d}
              title={d}
              variant={difficulty === d ? 'primary' : 'secondary'}
              onPress={() => setDifficulty(d)}
              style={styles.difficultyButton}
            />
          ))}
        </View>
      </View>

      <View style={styles.fieldGroup}>
        <TouchableOpacity
          onPress={() => setReuseMedia((r) => !r)}
          style={styles.checkRow}
        >
          <View style={[styles.checkbox, reuseMedia && styles.checkboxChecked]} />
          <Text style={styles.checkLabel}>Reuse original media</Text>
        </TouchableOpacity>
      </View>

      <Button
        title="Publish remix"
        variant="primary"
        onPress={handlePublish}
        loading={publishing}
        style={styles.publishButton}
      />
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
  title: {
    ...typography.titleLarge,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  attribution: {
    marginBottom: spacing.lg,
  },
  attributionText: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  fieldGroup: {
    marginBottom: spacing.md,
  },
  label: {
    ...typography.caption,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  input: {
    ...typography.body,
    backgroundColor: colors.backgroundMint,
    borderRadius: 8,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    color: colors.textPrimary,
    borderWidth: 1,
    borderColor: colors.border,
  },
  difficultyRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  difficultyButton: {
    flex: 1,
  },
  checkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: colors.border,
  },
  checkboxChecked: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  checkLabel: {
    ...typography.body,
    color: colors.textPrimary,
  },
  publishButton: {
    marginTop: spacing.lg,
  },
});
