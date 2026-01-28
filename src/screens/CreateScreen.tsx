import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useTheme, type Theme } from '../theme';
import { Button, Tag } from '../components';
import { useAuth } from '../state/AuthContext';
import { useSettings } from '../state/SettingsContext';
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

const MIN_TOUCH_TARGET = 44;

export function CreateScreen({ navigation }: CreateScreenProps) {
  const { colors, typography, spacing } = useTheme();
  const { user } = useAuth();
  const { settings, setCreation } = useSettings();
  const { addPost } = usePosts();
  const [dishName, setDishName] = useState('');
  const [selectedSpaceIds, setSelectedSpaceIds] = useState<string[]>([]);
  const [isExperiment, setIsExperiment] = useState(false);
  const [audioChoice, setAudioChoice] = useState<'muted' | 'voiceLater' | 'voiceOver'>('muted');
  const [publishing, setPublishing] = useState(false);

  const { handsOnlyMode, angleGrid, lightingHint, stabilityReminder } = settings.creation;

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
      isExperiment,
      isMuted: audioChoice === 'muted',
      hasVoiceOver: audioChoice === 'voiceOver',
      createdAt: new Date().toISOString(),
    };
    addPost(post);
    setPublishing(false);
    setDishName('');
    setSelectedSpaceIds([]);
    setIsExperiment(false);
    navigation.navigate('Home');
  };

  const styles = makeStyles(colors, typography, spacing);

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      keyboardShouldPersistTaps="handled"
    >
      <Text style={styles.title}>New recipe</Text>
      <Text style={styles.supportive}>
        No need to be perfect. Experiments welcome. Home kitchens encouraged.
      </Text>

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

      {/* Optional filming assist */}
      <View style={styles.fieldGroup}>
        <Text style={styles.sectionLabel}>Prepare to film</Text>
        {handsOnlyMode && (
          <Text style={styles.hint}>
            Hands-only mode is on: frame your countertop. No face or voice required.
          </Text>
        )}
        <View style={styles.toggleRow}>
          <TouchableOpacity
            onPress={() => setCreation({ angleGrid: !angleGrid })}
            style={styles.toggleTouch}
            activeOpacity={0.8}
          >
            <View style={[styles.checkbox, angleGrid && styles.checkboxChecked]} />
            <Text style={styles.toggleLabel}>Angle grid (top-down)</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.toggleRow}>
          <TouchableOpacity
            onPress={() => setCreation({ lightingHint: !lightingHint })}
            style={styles.toggleTouch}
            activeOpacity={0.8}
          >
            <View style={[styles.checkbox, lightingHint && styles.checkboxChecked]} />
            <Text style={styles.toggleLabel}>Lighting hint</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.toggleRow}>
          <TouchableOpacity
            onPress={() => setCreation({ stabilityReminder: !stabilityReminder })}
            style={styles.toggleTouch}
            activeOpacity={0.8}
          >
            <View style={[styles.checkbox, stabilityReminder && styles.checkboxChecked]} />
            <Text style={styles.toggleLabel}>Stability reminder</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Audio: muted, voice-over later, or voice-over */}
      <View style={styles.fieldGroup}>
        <Text style={styles.label}>Audio</Text>
        <Text style={styles.hint}>
          Muted videos with step text only are fine. Voice-over is optional.
        </Text>
        <View style={styles.audioOptions}>
          {(
            [
              { key: 'muted', label: 'Muted (steps only)' },
              { key: 'voiceLater', label: "I'll add voice-over later" },
              { key: 'voiceOver', label: 'Has voice-over' },
            ] as const
          ).map(({ key, label }) => (
            <TouchableOpacity
              key={key}
              onPress={() => setAudioChoice(key)}
              style={[styles.audioOption, audioChoice === key && styles.audioOptionSelected]}
              activeOpacity={0.8}
            >
              <Text
                style={[
                  styles.audioOptionText,
                  audioChoice === key && styles.audioOptionTextSelected,
                ]}
              >
                {label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.fieldGroup}>
        <TouchableOpacity
          onPress={() => setIsExperiment((e) => !e)}
          style={styles.experimentRow}
          activeOpacity={0.8}
        >
          <View style={[styles.checkbox, isExperiment && styles.checkboxChecked]} />
          <Text style={styles.experimentLabel}>This is an experiment</Text>
        </TouchableOpacity>
        <Text style={styles.hint}>
          Experiments are not failures. Mark when you're still testing.
        </Text>
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

function makeStyles(colors: Theme['colors'], typography: Theme['typography'], spacing: Theme['spacing']) {
  return StyleSheet.create({
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
      marginBottom: spacing.sm,
    },
    supportive: {
      ...typography.body,
      color: colors.textSecondary,
      marginBottom: spacing.lg,
    },
    sectionLabel: {
      ...typography.caption,
      color: colors.textSecondary,
      marginBottom: spacing.xs,
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
    toggleRow: {
      marginBottom: spacing.xs,
    },
    toggleTouch: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.sm,
      minHeight: MIN_TOUCH_TARGET,
      paddingVertical: spacing.xs,
    },
    toggleLabel: {
      ...typography.body,
      color: colors.textPrimary,
    },
    audioOptions: {
      marginTop: spacing.xs,
    },
    audioOption: {
      paddingVertical: spacing.sm,
      paddingHorizontal: spacing.md,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: colors.border,
      minHeight: MIN_TOUCH_TARGET,
      justifyContent: 'center',
      marginBottom: spacing.sm,
    },
    audioOptionSelected: {
      borderColor: colors.primary,
      backgroundColor: colors.backgroundMint,
    },
    audioOptionText: {
      ...typography.body,
      color: colors.textPrimary,
    },
    audioOptionTextSelected: {
      color: colors.primary,
      fontWeight: '600',
    },
    experimentRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.sm,
      minHeight: MIN_TOUCH_TARGET,
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
    experimentLabel: {
      ...typography.body,
      color: colors.textPrimary,
    },
    publishButton: {
      marginTop: spacing.md,
    },
  });
}
