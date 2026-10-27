import { useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, useWindowDimensions, View } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import RenderHtml from '@native-html/render';

import { postService } from '@/services/post-service';
import { Post } from '@/types/api';
import { Header, Message, Page, contentStyles } from '@/components/blog-ui';
import { ThemedText } from '@/components/themed-text';
import { useTheme } from '@/hooks/use-theme';
import { PostThumbnail } from '@/components/post-thumbnail';
import { formatPublicationDate } from '@/lib/format-date';
import { sanitizePostHtml } from '@/lib/post-content';

export default function PostScreen() {
  const theme = useTheme();
  const { width } = useWindowDimensions();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [post, setPost] = useState<Post | null>(null);
  const [error, setError] = useState('');
  const invalidId = !Number.isInteger(Number(id));
  useEffect(() => {
    const postId = Number(id);
    if (!Number.isInteger(postId)) return;
    postService.get(postId).then(setPost).catch((reason: unknown) => setError(reason instanceof Error ? reason.message : 'Não foi possível carregar o post.'));
  }, [id]);

  return <Page><Header /><ScrollView contentContainerStyle={contentStyles.content}>
    {!post && !error && <ActivityIndicator color={theme.brand} />}
    {(error || invalidId) && <Message>{error || 'Post inválido.'}</Message>}
    {post && <View style={styles.article}>
      <PostThumbnail postId={post.id} imageUrl={post.image_url} version={post.updated_at} />
      <ThemedText style={[styles.kicker, { color: theme.brand }]}>Por {post.user?.username ?? post.author?.username ?? `${post.user_id}`}</ThemedText>
      {!!post.created_at && <ThemedText style={{ color: theme.textSecondary }}>{formatPublicationDate(post.created_at)}</ThemedText>}
      <ThemedText type="heading">{post.title}</ThemedText>
      {!!post.categories?.length && <ThemedText style={{ color: theme.textSecondary }}>{post.categories.map((category) => category.name).join(' · ')}</ThemedText>}
      <RenderHtml
        contentWidth={Math.max(width - 40, 280)}
        source={{ html: sanitizePostHtml(post.content) }}
        baseStyle={{ color: theme.text, fontSize: 17, lineHeight: 29 }}
      />
    </View>}
  </ScrollView></Page>;
}

const styles = StyleSheet.create({
  article: { gap: 14, maxWidth: 760, width: '100%', alignSelf: 'center' },
  kicker: { fontWeight: '700' },
  body: { fontSize: 17, lineHeight: 29, marginTop: 8 },
});
