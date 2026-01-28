import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TextInput,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useTheme, type Theme } from '../theme';
import { useAuth } from '../state/AuthContext';
import { useSettings } from '../state/SettingsContext';
import { Button, Tag } from '../components';
import { CookingLevel, DietaryPreference } from '../models/user';
import { SPACES, getSpaceById } from '../models/space';

const MIN_TOUCH_TARGET = 44;

const COOKING_LEVELS: CookingLevel[] = ['Beginner', 'Home Cook', 'Advanced'];

const DIETARY_OPTIONS: DietaryPreference[] = [
  'Vegetarian',
  'Vegan',
  'Halal',
  'Keto',
  'None',
];

export function ProfileScreen() {
  const { colors, typography, spacing } = useTheme();
  const { user, updateProfile, logout } = useAuth();
  const { settings, setCreation, setAccessibility } = useSettings();
  const [isEditing, setIsEditing] = useState(false);
  const [displayName, setDisplayName] = useState(user?.displayName ?? '');
  const [cookingLevel, setCookingLevel] = useState<CookingLevel>(
    user?.cookingLevel ?? 'Home Cook',
  );
  const [dietaryPreferences, setDietaryPreferences] = useState<DietaryPreference[]>(
    user?.dietaryPreferences ?? [],
  );
  const [preferredSpaces, setPreferredSpaces] = useState<string[]>(
    user?.preferredSpaces ?? [],
  );
  const [saving, setSaving] = useState(false);

  const toggleDietary = (pref: DietaryPreference) => {
    setDietaryPreferences((current) => {
      if (current.includes(pref)) {
        return current.filter((p) => p !== pref);
      }
      if (pref === 'None') {
        return ['None'];
      }
      return [...current.filter((p) => p !== 'None'), pref];
    });
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      await updateProfile({
        displayName,
        cookingLevel,
        dietaryPreferences,
        preferredSpaces,
      });
      setIsEditing(false);
    } finally {
      setSaving(false);
    }
  };

  const togglePreferredSpace = (spaceId: string) => {
    setPreferredSpaces((current) =>
      current.includes(spaceId)
        ? current.filter((id) => id !== spaceId)
        : [...current, spaceId],
    );
  };

  const savedRecipesCount = 12; // static placeholder
  const styles = makeStyles(colors, typography, spacing);

  if (!user) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>No profile loaded.</Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.header}>
        <View style={styles.avatarWrapper}>
          {user.profilePhotoUri ? (
            <Image source={{ uri: user.profilePhotoUri }} style={styles.avatar} />
          ) : (
            <View style={styles.avatarPlaceholder}>
              <Text style={styles.avatarInitials}>
                {user.displayName?.[0]?.toUpperCase() ?? user.username[0]?.toUpperCase()}
              </Text>
            </View>
          )}
        </View>
        <View style={styles.headerText}>
          <Text style={styles.displayName}>{user.displayName}</Text>
          <Text style={styles.username}>@{user.username}</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionLabel}>Cooking level</Text>
        <View style={styles.badgeRow}>
          <View style={styles.levelBadge}>
            <Text style={styles.levelBadgeText}>{user.cookingLevel}</Text>
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionLabel}>Dietary preferences</Text>
        <View style={styles.tagsRow}>
          {(user.dietaryPreferences.length ? user.dietaryPreferences : ['None']).map(
            (pref) => (
              <Tag key={pref} label={pref} />
            ),
          )}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionLabel}>Preferred spaces</Text>
        <View style={styles.tagsRow}>
          {(user.preferredSpaces?.length
            ? user.preferredSpaces.map((id) => getSpaceById(id)?.name ?? id)
            : ['None']
          ).map((label) => (
            <Tag key={label} label={label} />
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionLabel}>Saved recipes</Text>
        <Text style={styles.savedCount}>{savedRecipesCount}</Text>
      </View>

      <View style={styles.divider} />

      <Text style={styles.sectionLabel}>Accessibility</Text>
      <View style={styles.toggleRow}>
        <TouchableOpacity
          onPress={() => setAccessibility({ largerText: !settings.accessibility.largerText })}
          style={styles.toggleTouch}
          activeOpacity={0.8}
        >
          <View
            style={[
              styles.checkbox,
              settings.accessibility.largerText && styles.checkboxChecked,
            ]}
          />
          <Text style={styles.toggleLabel}>Larger text</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.toggleRow}>
        <TouchableOpacity
          onPress={() =>
            setAccessibility({ highContrast: !settings.accessibility.highContrast })
          }
          style={styles.toggleTouch}
          activeOpacity={0.8}
        >
          <View
            style={[
              styles.checkbox,
              settings.accessibility.highContrast && styles.checkboxChecked,
            ]}
          />
          <Text style={styles.toggleLabel}>High contrast</Text>
        </TouchableOpacity>
      </View>

      <Text style={[styles.sectionLabel, styles.sectionLabelTop]}>Creation & filming</Text>
      <View style={styles.toggleRow}>
        <TouchableOpacity
          onPress={() =>
            setCreation({ handsOnlyMode: !settings.creation.handsOnlyMode })
          }
          style={styles.toggleTouch}
          activeOpacity={0.8}
        >
          <View
            style={[
              styles.checkbox,
              settings.creation.handsOnlyMode && styles.checkboxChecked,
            ]}
          />
          <Text style={styles.toggleLabel}>Hands-only mode (countertop focus)</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.toggleRow}>
        <TouchableOpacity
          onPress={() => setCreation({ angleGrid: !settings.creation.angleGrid })}
          style={styles.toggleTouch}
          activeOpacity={0.8}
        >
          <View
            style={[styles.checkbox, settings.creation.angleGrid && styles.checkboxChecked]}
          />
          <Text style={styles.toggleLabel}>Angle grid</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.toggleRow}>
        <TouchableOpacity
          onPress={() =>
            setCreation({ lightingHint: !settings.creation.lightingHint })
          }
          style={styles.toggleTouch}
          activeOpacity={0.8}
        >
          <View
            style={[
              styles.checkbox,
              settings.creation.lightingHint && styles.checkboxChecked,
            ]}
          />
          <Text style={styles.toggleLabel}>Lighting hint</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.toggleRow}>
        <TouchableOpacity
          onPress={() =>
            setCreation({ stabilityReminder: !settings.creation.stabilityReminder })
          }
          style={styles.toggleTouch}
          activeOpacity={0.8}
        >
          <View
            style={[
              styles.checkbox,
              settings.creation.stabilityReminder && styles.checkboxChecked,
            ]}
          />
          <Text style={styles.toggleLabel}>Stability reminder</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.divider} />

      <Text style={styles.sectionLabel}>Edit profile</Text>

      {isEditing ? (
        <>
          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Display name</Text>
            <TextInput
              value={displayName}
              onChangeText={setDisplayName}
              style={styles.input}
              placeholder={user.displayName}
              placeholderTextColor={colors.textSecondary}
            />
          </View>

          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Cooking level</Text>
            <View style={styles.levelRow}>
              {COOKING_LEVELS.map((level) => {
                const selected = level === cookingLevel;
                return (
                  <Button
                    key={level}
                    title={level}
                    variant={selected ? 'primary' : 'secondary'}
                    onPress={() => setCookingLevel(level)}
                    style={styles.levelButton}
                  />
                );
              })}
            </View>
          </View>

          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Dietary preferences</Text>
            <View style={styles.tagsRow}>
              {DIETARY_OPTIONS.map((pref) => {
                const selected = dietaryPreferences.includes(pref);
                return (
                  <Tag
                    key={pref}
                    label={pref}
                    selected={selected}
                    onPress={() => toggleDietary(pref)}
                    style={[styles.tag, selected && styles.tagSelected]}
                  />
                );
              })}
            </View>
          </View>

          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Preferred spaces</Text>
            <Text style={styles.hint}>Surfaces these spaces first on Home.</Text>
            <View style={styles.tagsRow}>
              {SPACES.map((space) => {
                const selected = preferredSpaces.includes(space.spaceId);
                return (
                  <Tag
                    key={space.spaceId}
                    label={space.name}
                    selected={selected}
                    onPress={() => togglePreferredSpace(space.spaceId)}
                    style={[styles.tag, selected && styles.tagSelected]}
                  />
                );
              })}
            </View>
          </View>

          <View style={styles.actionsRow}>
            <Button
              title="Cancel"
              variant="secondary"
              onPress={() => {
                setIsEditing(false);
                setDisplayName(user.displayName);
                setCookingLevel(user.cookingLevel);
                setDietaryPreferences(user.dietaryPreferences);
                setPreferredSpaces(user.preferredSpaces ?? []);
              }}
              style={styles.actionButton}
            />
            <Button
              title="Save"
              onPress={handleSave}
              loading={saving}
              style={styles.actionButton}
            />
          </View>
        </>
      ) : (
        <Button
          title="Edit profile"
          variant="secondary"
          onPress={() => setIsEditing(true)}
          style={styles.editButton}
        />
      )}

      <Button
        title="Log out"
        variant="secondary"
        onPress={logout}
        style={styles.logoutButton}
      />
    </ScrollView>
  );
}

function makeStyles(
  colors: Theme['colors'],
  typography: Theme['typography'],
  spacing: Theme['spacing'],
) {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.backgroundBase,
    },
    content: {
      padding: spacing.lg,
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
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: spacing.lg,
    },
    avatarWrapper: {
      marginRight: spacing.md,
    },
    avatar: {
      width: 72,
      height: 72,
      borderRadius: 36,
    },
    avatarPlaceholder: {
      width: 72,
      height: 72,
      borderRadius: 36,
      backgroundColor: colors.secondary,
      justifyContent: 'center',
      alignItems: 'center',
    },
    avatarInitials: {
      ...typography.title,
      color: colors.textPrimary,
    },
    headerText: {
      flex: 1,
    },
    displayName: {
      ...typography.titleLarge,
      color: colors.textPrimary,
    },
    username: {
      ...typography.caption,
      color: colors.textSecondary,
      marginTop: spacing.xs,
    },
    section: {
      marginBottom: spacing.md,
    },
    sectionLabel: {
      ...typography.caption,
      color: colors.textSecondary,
      marginBottom: spacing.xs,
    },
    sectionLabelTop: {
      marginTop: spacing.sm,
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
    badgeRow: {
      flexDirection: 'row',
    },
    levelBadge: {
      paddingVertical: spacing.xs,
      paddingHorizontal: spacing.sm,
      borderRadius: 999,
      backgroundColor: colors.primary,
    },
    levelBadgeText: {
      ...typography.caption,
      color: colors.backgroundBase,
    },
    tagsRow: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: spacing.xs,
    },
    savedCount: {
      ...typography.body,
      color: colors.textPrimary,
    },
    divider: {
      height: 1,
      backgroundColor: colors.border,
      marginVertical: spacing.lg,
    },
    fieldGroup: {
      marginBottom: spacing.md,
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
    levelRow: {
      flexDirection: 'row',
      gap: spacing.sm,
    },
    levelButton: {
      flex: 1,
    },
    tag: {
      marginRight: 0,
    },
    tagSelected: {
      backgroundColor: colors.primary,
    },
    actionsRow: {
      flexDirection: 'row',
      gap: spacing.sm,
      marginTop: spacing.md,
    },
    actionButton: {
      flex: 1,
    },
    editButton: {
      marginTop: spacing.sm,
    },
    logoutButton: {
      marginTop: spacing.lg,
    },
  });
}

