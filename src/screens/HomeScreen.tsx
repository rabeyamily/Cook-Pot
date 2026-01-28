import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { colors, typography, spacing } from '../theme';
import { CookingCard, Button } from '../components';
import type { RootStackParamList } from '../navigation';

/** Placeholder dummy data for Phase 0 — no business logic */
const DUMMY_CARDS = [
  { id: '1', title: 'Simple Pasta Aglio e Olio', tags: ['Pasta', 'Quick'] },
  { id: '2', title: 'Roasted Vegetables', tags: ['Vegetarian', 'Oven'] },
  { id: '3', title: 'Homemade Soup', tags: ['Comfort', 'One Pot'] },
];

type HomeScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Home'>;
};

export function HomeScreen({ navigation }: HomeScreenProps) {
  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <Text style={styles.title}>Home</Text>
      <View style={styles.navRow}>
        <Button
          title="Create"
          variant="primary"
          onPress={() => navigation.navigate('Create')}
          style={styles.navButton}
        />
        <Button
          title="Profile"
          variant="secondary"
          onPress={() => navigation.navigate('Profile')}
          style={styles.navButton}
        />
      </View>
      <View style={styles.cardList}>
        {DUMMY_CARDS.map((card) => (
          <CookingCard
            key={card.id}
            title={card.title}
            tags={card.tags}
          />
        ))}
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
  navRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },
  navButton: {
    flex: 1,
  },
  cardList: {
    gap: spacing.md,
  },
});
