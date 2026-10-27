import { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, TextInput, View } from 'react-native';
import { router } from 'expo-router';

import { postService } from '@/services/post-service';
import { Post } from '@/types/api';
import { Header, Page, contentStyles } from '@/components/blog-ui';
import { ThemedText } from '@/components/themed-text';
import { PostThumbnail } from '@/components/post-thumbnail';
import { useTheme } from '@/hooks/use-theme';
import { formatPublicationDate } from '@/lib/format-date';

export default function HomeScreen() {
  const theme = useTheme();
  const [posts, setPosts] = useState<Post[]>([]);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    postService.list()
      .then(setPosts)
      .catch((reason: unknown) => setError(reason instanceof Error ? reason.message : 'Não foi possível carregar os posts.'))
      .finally(() => setLoading(false));
  }, []);

  const filteredPosts = useMemo(() => {
    const term = query.trim().toLowerCase();
    if (!term) return posts;
    return posts.filter((post) => `${post.title} ${post.content} ${post.slug}`.toLowerCase().includes(term));
  }, [posts, query]);

  return (
    <Page>
      <Header />
      <ScrollView style={contentStyles.scroll} contentContainerStyle={contentStyles.content}>
        <View style={styles.hero}>
          <ThemedText type="heading">Materiais publicados por docentes</ThemedText>
          <ThemedText style={{ color: theme.textSecondary }}>Encontre conteúdos para apoiar sua jornada de aprendizagem.</ThemedText>
        </View>
        <TextInput
          value={query}
          onChangeText={setQuery}
          placeholder="Buscar posts por palavras-chave"
          placeholderTextColor={theme.textSecondary}
          style={[styles.search, { color: theme.text, borderColor: theme.border, backgroundColor: theme.background }]}
        />
        {loading && <ActivityIndicator color={theme.brand} />}
        {!!error && <ThemedText style={{ color: theme.danger }}>{error}</ThemedText>}
        {!loading && !filteredPosts.length && <ThemedText style={{ color: theme.textSecondary }}>Nenhum post encontrado.</ThemedText>}
        {filteredPosts.map((post) => (
          <Pressable key={post.id} onPress={() => router.push({ pathname: '/posts/[id]', params: { id: String(post.id) } })} style={({ pressed }) => [styles.card, { borderColor: theme.border, backgroundColor: theme.background }, pressed && { opacity: 0.75 }]}>
            <PostThumbnail postId={post.id} imageUrl={post.image_url} version={post.updated_at} />
            <ThemedText style={[styles.author, { color: theme.brand }]}>{post.user?.username ?? post.author?.username ?? `#${post.user_id}`}</ThemedText>
            {!!post.created_at && <ThemedText type="small" style={{ color: theme.textSecondary }}>{formatPublicationDate(post.created_at)}</ThemedText>}
            <ThemedText style={styles.title}>{post.title}</ThemedText>
            <ThemedText numberOfLines={3} style={{ color: theme.textSecondary }}>{post.content}</ThemedText>
            {!!post.categories?.length && <ThemedText type="small" style={{ color: theme.brand }}>{post.categories.map((category) => category.name).join(' · ')}</ThemedText>}
          </Pressable>
        ))}
      </ScrollView>
    </Page>
  );
}

const styles = StyleSheet.create({
  hero: { gap: 7, marginBottom: 4 },
  search: { minHeight: 48, borderWidth: 1, borderRadius: 8, paddingHorizontal: 14, fontSize: 16 },
  card: { borderWidth: 1, borderRadius: 16, padding: 18, gap: 9 },
  author: { fontSize: 13, fontWeight: '700' },
  title: { fontSize: 20, lineHeight: 27, fontWeight: '700' },
});
