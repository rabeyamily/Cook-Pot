import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { colors, typography, spacing } from '../theme';
import { Button, Tag } from '../components';
import type { AuthStackParamList } from '../navigation/AuthStack';
import { useAuth } from '../state/AuthContext';
import { CookingLevel, DietaryPreference } from '../models/user';

type SignUpScreenProps = {
  navigation: NativeStackNavigationProp<AuthStackParamList, 'SignUp'>;
};

const COOKING_LEVELS: CookingLevel[] = ['Beginner', 'Home Cook', 'Advanced'];

const DIETARY_OPTIONS: DietaryPreference[] = [
  'Vegetarian',
  'Vegan',
  'Halal',
  'Keto',
  'None',
];

export function SignUpScreen({ navigation }: SignUpScreenProps) {
  const { signup } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [cookingLevel, setCookingLevel] = useState<CookingLevel>('Home Cook');
  const [dietaryPreferences, setDietaryPreferences] = useState<DietaryPreference[]>([]);
  const [loading, setLoading] = useState(false);

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

  const handleSignUp = async () => {
    try {
      setLoading(true);
      await signup({
        email,
        password,
        username,
        displayName,
        cookingLevel,
        dietaryPreferences,
      });
    } finally {
      setLoading(false);
    }
  };

  const canSubmit = email && password && username && displayName;

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.inner}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.title}>Create your cooking profile</Text>

        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Email</Text>
          <TextInput
            value={email}
            onChangeText={setEmail}
            placeholder="you@example.com"
            placeholderTextColor={colors.textSecondary}
            keyboardType="email-address"
            autoCapitalize="none"
            style={styles.input}
          />
        </View>

        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Password</Text>
          <TextInput
            value={password}
            onChangeText={setPassword}
            placeholder="At least 6 characters"
            placeholderTextColor={colors.textSecondary}
            secureTextEntry
            style={styles.input}
          />
        </View>

        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Username</Text>
          <TextInput
            value={username}
            onChangeText={setUsername}
            placeholder="cooklover"
            placeholderTextColor={colors.textSecondary}
            autoCapitalize="none"
            style={styles.input}
          />
        </View>

        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Display name</Text>
          <TextInput
            value={displayName}
            onChangeText={setDisplayName}
            placeholder="Name in the kitchen"
            placeholderTextColor={colors.textSecondary}
            style={styles.input}
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
                  style={[
                    styles.tag,
                    selected && styles.tagSelected,
                  ]}
                />
              );
            })}
          </View>
          <Text style={styles.helper}>
            Tap tags to toggle. Choose \"None\" if you have no preferences.
          </Text>
        </View>

        <Button
          title="Create account"
          onPress={handleSignUp}
          loading={loading}
          disabled={!canSubmit}
          style={styles.submit}
        />

        <View style={styles.footerRow}>
          <Text style={styles.footerText}>Already have an account?</Text>
          <Text
            style={styles.footerLink}
            onPress={() => navigation.navigate('Login')}
          >
            Log in
          </Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.backgroundBase,
  },
  scroll: {
    flex: 1,
  },
  inner: {
    padding: spacing.lg,
    paddingBottom: spacing.xxl,
  },
  title: {
    ...typography.titleLarge,
    color: colors.textPrimary,
    marginBottom: spacing.lg,
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
  levelRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  levelButton: {
    flex: 1,
  },
  tagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
  },
  tag: {
    marginRight: 0,
  },
  tagSelected: {
    backgroundColor: colors.primary,
  },
  helper: {
    ...typography.caption,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  submit: {
    marginTop: spacing.lg,
  },
  footerRow: {
    flexDirection: 'row',
    marginTop: spacing.lg,
    alignItems: 'center',
  },
  footerText: {
    ...typography.caption,
    color: colors.textSecondary,
    marginRight: spacing.xs,
  },
  footerLink: {
    ...typography.caption,
    color: colors.primary,
  },
});

