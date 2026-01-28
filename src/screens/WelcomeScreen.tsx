import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { colors, typography, spacing } from '../theme';
import { Button } from '../components';
import type { AuthStackParamList } from '../navigation/AuthStack';

type WelcomeScreenProps = {
  navigation: NativeStackNavigationProp<AuthStackParamList, 'Welcome'>;
};

export function WelcomeScreen({ navigation }: WelcomeScreenProps) {
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.appName}>Cook Pot</Text>
        <Text style={styles.subtitle}>
          A calm, cooking-only space for real kitchens and real food.
        </Text>
      </View>
      <View style={styles.actions}>
        <Button
          title="Get started"
          variant="primary"
          onPress={() => navigation.navigate('SignUp')}
          style={styles.button}
        />
        <Button
          title="Log in"
          variant="secondary"
          onPress={() => navigation.navigate('Login')}
          style={styles.button}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.backgroundBase,
    padding: spacing.lg,
    justifyContent: 'space-between',
  },
  content: {
    marginTop: spacing.xl,
  },
  appName: {
    ...typography.titleLarge,
    fontSize: 32,
    lineHeight: 36,
    color: colors.textPrimary,
    marginBottom: spacing.md,
  },
  subtitle: {
    ...typography.body,
    color: colors.textSecondary,
  },
  actions: {
    gap: spacing.sm,
    marginBottom: spacing.xl,
  },
  button: {
    width: '100%',
  },
});

