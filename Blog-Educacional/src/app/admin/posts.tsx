import { useEffect, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { router } from 'expo-router';

import { ActionButton, Header, Message, Page, SectionTitle, contentStyles } from '@/components/blog-ui';
import { ThemedText } from '@/components/themed-text';
import { postService } from '@/services/post-service';
import { Post } from '@/types/api';
import { useAuth } from '@/context/auth-context';
import { useTheme } from '@/hooks/use-theme';

export default function AdminPostsScreen() {
  const theme = useTheme();
  const { session, canManageContent } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [error, setError] = useState('');
  useEffect(() => {
    if (!session) return;
    postService.list(session.token).then(setPosts).catch((reason: unknown) => setError(reason instanceof Error ? reason.message : 'Falha ao carregar posts.'));
  }, [session]);
  async function remove(id: number) {
    if (!session) return;
    try { await postService.remove(session.token, id); setPosts((current) => current.filter((post) => post.id !== id)); }
    catch (reason) { setError(reason instanceof Error ? reason.message : 'Falha ao excluir post.'); }
  }
  if (!canManageContent) return <Page><Header /><ScrollView contentContainerStyle={contentStyles.content}><Message>Você não tem permissão para acessar esta página.</Message></ScrollView></Page>;
  return <Page><Header /><ScrollView contentContainerStyle={contentStyles.content}>
    <SectionTitle title="Posts" description="Crie, edite ou remova publicações." />
    <ActionButton onPress={() => router.push('/admin/post-form')}>Novo post</ActionButton>
    {error && <Message>{error}</Message>}
    {!posts.length && !error && <ActivityIndicator color={theme.brand} />}
    {posts.map((post) => <View key={post.id} style={[styles.row, { borderColor: theme.border, backgroundColor: theme.background }]}>
      <Pressable style={styles.info} onPress={() => router.push({ pathname: '/posts/[id]', params: { id: String(post.id) } })}><ThemedText style={styles.title}>{post.title}</ThemedText><ThemedText type="small" style={{ color: theme.textSecondary }}>Autor: {post.user?.username ?? post.author?.username ?? `#${post.user_id}`}</ThemedText></Pressable>
      <View style={contentStyles.row}><ActionButton variant="secondary" onPress={() => router.push({ pathname: '/admin/posts/[id]', params: { id: String(post.id) } })}>Editar</ActionButton><ActionButton variant="danger" onPress={() => void remove(post.id)}>Excluir</ActionButton></View>
    </View>)}
  </ScrollView></Page>;
}

const styles = StyleSheet.create({ row: { borderWidth: 1, borderRadius: 12, padding: 14, gap: 12 }, info: { gap: 5 }, title: { fontSize: 17, fontWeight: '700' } });
