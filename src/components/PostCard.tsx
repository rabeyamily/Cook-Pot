import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import { colors, typography, spacing } from '../theme';
import { Post } from '../models/post';
import { Tag } from './Tag';
import { Button } from './Button';
import { useEngagement } from '../state/EngagementContext';
import { usePantry } from '../state/PantryContext';
import { useAuth } from '../state/AuthContext';
import { REACTIONS, REACTION_TYPES } from '../models/engagement';

type PostCardProps = {
  post: Post;
  showActions?: boolean;
  saved?: boolean;
  onToggleSave?: () => void;
  onCookThis?: () => void;
  /** Open recipe detail */
  onViewPost?: (postId: string) => void;
  /** Open parent recipe (for remixes); pass parent author for "Inspired by" */
  onViewParent?: (parentPostId: string) => void;
  parentAuthor?: { displayName: string };
};

function isEmojiOnly(str: string): boolean {
  const trimmed = str.trim();
  if (!trimmed) return true;
  const noLetters = /^[\s\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]*$/u;
  return trimmed.length <= 4 && noLetters.test(trimmed);
}

/** Memoized for smooth scrolling in feed lists */
export const PostCard = React.memo(function PostCard({
  post,
  showActions = false,
  saved = false,
  onToggleSave,
  onCookThis,
  onViewPost,
  onViewParent,
  parentAuthor,
}: PostCardProps) {
  const primaryUri = post.mediaUris?.[0];
  const { getReactionsForPost, getMyReactionsForPost, toggleReaction, getCommentsForPost, addComment } =
    useEngagement();
  const { isCooked, markAsCooked } = usePantry();
  const { user } = useAuth();

  const [commentsExpanded, setCommentsExpanded] = useState(false);
  const [commentDraft, setCommentDraft] = useState('');
  const [commentSending, setCommentSending] = useState(false);

  const myReactions = getMyReactionsForPost(post.postId);
  const cooked = isCooked(post.postId);
  const comments = getCommentsForPost(post.postId);

  const handleAddComment = async () => {
    const t = commentDraft.trim();
    if (!t || isEmojiOnly(t) || !user) return;
    setCommentSending(true);
    await addComment(post.postId, t, user.displayName, user.id);
    setCommentDraft('');
    setCommentSending(false);
  };

  return (
    <View style={styles.card}>
      <View style={styles.mediaWrapper}>
        {primaryUri ? (
          <Image source={{ uri: primaryUri }} style={styles.media} />
        ) : (
          <View style={styles.mediaPlaceholder} />
        )}
        <View style={styles.mediaTypeBadge}>
          <Text style={styles.mediaTypeText}>
            {post.mediaType === 'video' ? 'Video' : 'Photo'}
          </Text>
        </View>
        {cooked && (
          <View style={styles.cookedBadge}>
            <Text style={styles.cookedText}>Cooked</Text>
          </View>
        )}
      </View>
      <View style={styles.content}>
        {post.parentPostId && parentAuthor && (
          <TouchableOpacity
            onPress={() => onViewParent?.(post.parentPostId!)}
            style={styles.inspiredRow}
          >
            <Text style={styles.inspiredLabel}>Inspired by </Text>
            <Text style={styles.inspiredName}>{parentAuthor.displayName}</Text>
          </TouchableOpacity>
        )}
        {post.isExperiment && (
          <View style={styles.experimentBadge}>
            <Text style={styles.experimentText}>Experiment</Text>
          </View>
        )}
        <TouchableOpacity
          onPress={() => onViewPost?.(post.postId)}
          disabled={!onViewPost}
          activeOpacity={onViewPost ? 0.7 : 1}
        >
          <Text style={styles.dishName} numberOfLines={2}>
            {post.recipe.dishName}
          </Text>
        </TouchableOpacity>
        <Text style={styles.meta}>
          {post.recipe.estimatedCookTimeMinutes} min • {post.recipe.difficulty}
        </Text>

        <View style={styles.reactionsRow}>
          {REACTION_TYPES.map((type) => (
            <TouchableOpacity
              key={type}
              onPress={() => toggleReaction(post.postId, type)}
              style={[
                styles.reactionChip,
                myReactions.includes(type) && styles.reactionChipActive,
              ]}
            >
              <Text style={styles.reactionEmoji}>{REACTIONS[type].emoji}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {!cooked && (
          <TouchableOpacity
            onPress={() => markAsCooked(post.postId)}
            style={styles.cookedButton}
          >
            <Text style={styles.cookedButtonText}>I Cooked This</Text>
          </TouchableOpacity>
        )}

        <View style={styles.tagsRow}>
          {post.recipe.dietTags?.slice(0, 3).map((tag) => (
            <Tag key={tag} label={tag} />
          ))}
          {post.recipe.cuisine && <Tag label={post.recipe.cuisine} />}
        </View>

        <TouchableOpacity
          onPress={() => setCommentsExpanded((e) => !e)}
          style={styles.commentsToggle}
        >
          <Text style={styles.commentsToggleText}>
            Comments ({comments.length})
          </Text>
        </TouchableOpacity>

        {commentsExpanded && (
          <View style={styles.commentsSection}>
            {comments.map((c) => (
              <View key={c.id} style={styles.commentRow}>
                <Text style={styles.commentAuthor}>{c.authorDisplayName}</Text>
                <Text style={styles.commentText}>{c.text}</Text>
              </View>
            ))}
            {user && (
              <View style={styles.commentInputRow}>
                <TextInput
                  value={commentDraft}
                  onChangeText={setCommentDraft}
                  placeholder="Cooking feedback only..."
                  placeholderTextColor={colors.textSecondary}
                  style={styles.commentInput}
                  multiline={false}
                />
                <Button
                  title="Add"
                  variant="secondary"
                  onPress={handleAddComment}
                  loading={commentSending}
                  disabled={!commentDraft.trim() || isEmojiOnly(commentDraft)}
                  style={styles.commentAddButton}
                />
              </View>
            )}
          </View>
        )}

        {showActions && (
          <View style={styles.actionsRow}>
            <Button
              title={saved ? 'Remove from Pantry' : 'Save to Pantry'}
              variant="secondary"
              onPress={onToggleSave}
              style={styles.actionButton}
            />
            <Button
              title="Cook This"
              variant="primary"
              onPress={onCookThis}
              style={styles.actionButton}
            />
          </View>
        )}
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.backgroundMint,
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.border,
  },
  mediaWrapper: {
    position: 'relative',
  },
  media: {
    width: '100%',
    height: 220,
    backgroundColor: colors.secondary,
  },
  mediaPlaceholder: {
    width: '100%',
    height: 220,
    backgroundColor: colors.secondary,
    opacity: 0.6,
  },
  mediaTypeBadge: {
    position: 'absolute',
    bottom: spacing.sm,
    right: spacing.sm,
    backgroundColor: colors.primary,
    borderRadius: 999,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
  },
  mediaTypeText: {
    ...typography.caption,
    color: colors.backgroundBase,
  },
  cookedBadge: {
    position: 'absolute',
    top: spacing.sm,
    left: spacing.sm,
    backgroundColor: colors.primary,
    borderRadius: 6,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
  },
  cookedText: {
    ...typography.caption,
    color: colors.backgroundBase,
  },
  content: {
    padding: spacing.md,
  },
  dishName: {
    ...typography.title,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  inspiredRow: {
    marginBottom: spacing.xs,
  },
  inspiredLabel: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  inspiredName: {
    ...typography.caption,
    color: colors.primary,
  },
  experimentBadge: {
    alignSelf: 'flex-start',
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.sm,
    borderRadius: 6,
    backgroundColor: colors.secondary,
    marginBottom: spacing.xs,
  },
  experimentText: {
    ...typography.caption,
    color: colors.textPrimary,
  },
  meta: {
    ...typography.caption,
    color: colors.textSecondary,
    marginBottom: spacing.sm,
  },
  reactionsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
    marginBottom: spacing.sm,
  },
  reactionChip: {
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.sm,
    borderRadius: 999,
    backgroundColor: colors.backgroundBase,
  },
  reactionChipActive: {
    backgroundColor: colors.secondary,
  },
  reactionEmoji: {
    fontSize: 16,
  },
  cookedButton: {
    alignSelf: 'flex-start',
    marginBottom: spacing.sm,
  },
  cookedButtonText: {
    ...typography.caption,
    color: colors.primary,
  },
  tagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
  },
  commentsToggle: {
    marginTop: spacing.sm,
    marginBottom: spacing.xs,
  },
  commentsToggleText: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  commentsSection: {
    marginTop: spacing.xs,
    paddingTop: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  commentRow: {
    marginBottom: spacing.sm,
  },
  commentAuthor: {
    ...typography.caption,
    color: colors.textSecondary,
    marginBottom: 2,
  },
  commentText: {
    ...typography.caption,
    fontSize: 13,
    color: colors.textPrimary,
  },
  commentInputRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginTop: spacing.sm,
  },
  commentInput: {
    flex: 1,
    ...typography.caption,
    backgroundColor: colors.backgroundBase,
    borderRadius: 6,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    color: colors.textPrimary,
    borderWidth: 1,
    borderColor: colors.border,
  },
  commentAddButton: {
    minWidth: 60,
  },
  actionsRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginTop: spacing.md,
  },
  actionButton: {
    flex: 1,
  },
});
