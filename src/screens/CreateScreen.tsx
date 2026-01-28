import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, ScrollView } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { colors, typography, spacing } from '../theme';
import { Button, Tag } from '../components';
import { useAuth } from '../state/AuthContext';
import { usePosts } from '../state/PostsContext';
import { SPACES } from '../models/space';
import type { RootStackParamList } from '../navigation';
import type { Post } from '../models/post';
import type { IngredientItem, RecipeStep } from '../models/post';

type CreateScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Create'>;
};

const DEFAULT_INGREDIENTS: IngredientItem[] = [
  { id: 'd1', name: 'Ingredient 1', quantity: '1', unit: '' },
  { id: 'd2', name: 'Ingredient 2', quantity: '2', unit: 'cups' },
];
const DEFAULT_STEPS: RecipeStep[] = [
  { id: 'ds1', order: 1, text: 'Step 1.' },
  { id: 'ds2', order: 2, text: 'Step 2.' },
];

export function CreateScreen({ navigation }: CreateScreenProps) {
  const { user } = useAuth();
  const { addPost } = usePosts();
  const [dishName, setDishName] = useState('');
  const [selectedSpaceIds, setSelectedSpaceIds] = useState<string[]>([]);
  const [publishing, setPublishing] = useState(false);

  const toggleSpace = (spaceId: string) => {
    setSelectedSpaceIds((current) => {
      if (current.includes(spaceId)) {
        return current.filter((id) => id !== spaceId);
      }
      if (current.length >= 2) return current;
      return [...current, spaceId];
    });
  };

  const canPublish = dishName.trim().length > 0 && selectedSpaceIds.length >= 1;

  const handlePublish = () => {
    if (!user || !canPublish) return;
    setPublishing(true);
    const post: Post = {
      postId: `user-${Date.now()}`,
      author: { id: user.id, username: user.username, displayName: user.displayName },
      mediaType: 'photo',
      mediaUris: ['https://images.pexels.com/photos/1640770/pexels-photo-1640770.jpeg'],
      recipe: {
        dishName: dishName.trim(),
        ingredients: DEFAULT_INGREDIENTS,
        steps: DEFAULT_STEPS,
        estimatedCookTimeMinutes: 30,
        difficulty: 'Easy',
        dietTags: user.dietaryPreferences?.length ? user.dietaryPreferences : undefined,
      },
      cookingSpaces: [...selectedSpaceIds],
      createdAt: new Date().toISOString(),
    };
    addPost(post);
    setPublishing(false);
    setDishName('');
    setSelectedSpaceIds([]);
    navigation.navigate('Home');
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      keyboardShouldPersistTaps="handled"
    >
      <Text style={styles.title}>New recipe</Text>

      <View style={styles.fieldGroup}>
        <Text style={styles.label}>Dish name</Text>
        <TextInput
          value={dishName}
          onChangeText={setDishName}
          placeholder="e.g. Pasta Aglio e Olio"
          placeholderTextColor={colors.textSecondary}
          style={styles.input}
        />
      </View>

      <View style={styles.fieldGroup}>
        <Text style={styles.label}>Cooking Space (required, 1–2)</Text>
        <Text style={styles.hint}>Every recipe belongs to at least one space.</Text>
        <View style={styles.tagsRow}>
          {SPACES.map((space) => (
            <Tag
              key={space.spaceId}
              label={space.name}
              selected={selectedSpaceIds.includes(space.spaceId)}
              onPress={() => toggleSpace(space.spaceId)}
              style={styles.spaceTag}
            />
          ))}
        </View>
      </View>

      <Button
        title="Publish"
        variant="primary"
        onPress={handlePublish}
        loading={publishing}
        disabled={!canPublish}
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
  title: {
    ...typography.titleLarge,
    color: colors.textPrimary,
    marginBottom: spacing.lg,
  },
  fieldGroup: {
    marginBottom: spacing.lg,
  },
  label: {
    ...typography.caption,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  hint: {
    ...typography.caption,
    color: colors.textSecondary,
    marginBottom: spacing.sm,
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
  tagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
  },
  spaceTag: {
    marginRight: 0,
  },
  publishButton: {
    marginTop: spacing.md,
  },
});
