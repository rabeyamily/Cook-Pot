import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Switch,
  Share,
} from 'react-native';
import * as Clipboard from 'expo-clipboard';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { colors, typography, spacing } from '../theme';
import { Button } from '../components';
import { RootStackParamList } from '../navigation';
import { usePosts } from '../state/PostsContext';
import { createShoppingListFromPost } from '../models/pantry';

type Props = NativeStackScreenProps<RootStackParamList, 'Cook'>;

export function CookScreen({ route }: Props) {
  const { postId, initialServings = 2 } = route.params;
  const { posts } = usePosts();
  const post = posts.find((p) => p.postId === postId);

  const [servings, setServings] = useState(initialServings);
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({});

  const shoppingList = useMemo(() => {
    if (!post) return null;
    return createShoppingListFromPost(post, servings, initialServings);
  }, [post, servings, initialServings]);

  if (!post || !shoppingList) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>Recipe not found.</Text>
      </View>
    );
  }

  const increment = () => setServings((s) => Math.min(12, s + 1));
  const decrement = () => setServings((s) => Math.max(1, s - 1));

  const toggleItem = (id: string) => {
    setCheckedItems((current) => ({
      ...current,
      [id]: !current[id],
    }));
  };

  const asText = () => {
    const lines = [
      `${post.recipe.dishName} – Shopping list for ${servings} serving${servings === 1 ? '' : 's'}`,
      '',
      ...shoppingList.items.map((item) => {
        const prefix = checkedItems[item.id] ? '[x]' : '[ ]';
        const qty = item.quantityDisplay ? ` – ${item.quantityDisplay}` : '';
        return `${prefix} ${item.ingredientName}${qty}`;
      }),
    ];
    return lines.join('\n');
  };

  const copyToClipboard = async () => {
    await Clipboard.setStringAsync(asText());
  };

  const shareList = async () => {
    await Share.share({ message: asText() });
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <Text style={styles.title}>Cook this</Text>
      <Text style={styles.dishName}>{post.recipe.dishName}</Text>

      <View style={styles.servingsRow}>
        <Text style={styles.servingsLabel}>Servings</Text>
        <View style={styles.servingsControls}>
          <Button title="–" variant="secondary" onPress={decrement} style={styles.servingsButton} />
          <Text style={styles.servingsValue}>{servings}</Text>
          <Button title="+" variant="secondary" onPress={increment} style={styles.servingsButton} />
        </View>
      </View>

      <Text style={styles.sectionLabel}>Shopping list</Text>
      <View style={styles.list}>
        {shoppingList.items.map((item) => (
          <View key={item.id} style={styles.listItem}>
            <Switch
              value={!!checkedItems[item.id]}
              onValueChange={() => toggleItem(item.id)}
            />
            <View style={styles.listItemTextWrapper}>
              <Text style={styles.listItemName}>{item.ingredientName}</Text>
              {!!item.quantityDisplay && (
                <Text style={styles.listItemQty}>{item.quantityDisplay}</Text>
              )}
            </View>
          </View>
        ))}
      </View>

      <View style={styles.actionsRow}>
        <Button
          title="Copy as text"
          variant="secondary"
          onPress={copyToClipboard}
          style={styles.actionButton}
        />
        <Button
          title="Share"
          variant="primary"
          onPress={shareList}
          style={styles.actionButton}
        />
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
    ...typography.caption,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  dishName: {
    ...typography.titleLarge,
    color: colors.textPrimary,
    marginBottom: spacing.lg,
  },
  servingsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  servingsLabel: {
    ...typography.body,
    color: colors.textPrimary,
  },
  servingsControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  servingsButton: {
    minWidth: 44,
  },
  servingsValue: {
    ...typography.title,
    color: colors.textPrimary,
  },
  sectionLabel: {
    ...typography.caption,
    color: colors.textSecondary,
    marginBottom: spacing.sm,
  },
  list: {
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.backgroundMint,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.xs,
    gap: spacing.sm,
  },
  listItemTextWrapper: {
    flex: 1,
  },
  listItemName: {
    ...typography.body,
    color: colors.textPrimary,
  },
  listItemQty: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  actionsRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginTop: spacing.lg,
  },
  actionButton: {
    flex: 1,
  },
});

