import { useEffect, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { router } from 'expo-router';

import { ActionButton, Header, Message, Page, Pagination, SectionTitle, contentStyles } from '@/components/blog-ui';
import { ThemedText } from '@/components/themed-text';
import { postService } from '@/services/post-service';
import { Post } from '@/types/api';
import { useAuth } from '@/context/auth-context';
import { useTheme } from '@/hooks/use-theme';
import { confirmDelete } from '@/lib/confirm-delete';

export default function AdminPostsScreen() {
  const theme = useTheme();
  const { session, canManageContent } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [error, setError] = useState('');
  const [page, setPage] = useState(0);
  useEffect(() => {
    if (!session) return;
    postService.list(session.token).then(setPosts).catch((reason: unknown) => setError(reason instanceof Error ? reason.message : 'Falha ao carregar posts.'));
  }, [session]);
  async function remove(id: number, title: string) {
    if (!session || !(await confirmDelete(`o post "${title}"`))) return;
    try {
      await postService.remove(session.token, id);
      setPosts((current) => {
        const next = current.filter((post) => post.id !== id);
        setPage((currentPage) => Math.min(currentPage, Math.max(0, Math.ceil(next.length / 10) - 1)));
        return next;
      });
    }
    catch (reason) { setError(reason instanceof Error ? reason.message : 'Falha ao excluir post.'); }
  }
  const visiblePosts = posts.slice(page * 10, page * 10 + 10);
  if (!canManageContent) return <Page><Header /><ScrollView contentContainerStyle={contentStyles.content}><Message>Você não tem permissão para acessar esta página.</Message></ScrollView></Page>;
  return <Page><Header /><ScrollView contentContainerStyle={contentStyles.content}>
    <SectionTitle title="Posts" description="Crie, edite ou remova publicações." />
    <ActionButton onPress={() => router.push('/admin/post-form')}>Novo post</ActionButton>
    {error && <Message>{error}</Message>}
    {!posts.length && !error && <ActivityIndicator color={theme.brand} />}
    {visiblePosts.map((post) => <View key={post.id} style={[styles.row, { borderColor: theme.border, backgroundColor: theme.background }]}>
      <Pressable style={styles.info} onPress={() => router.push({ pathname: '/posts/[id]', params: { id: String(post.id) } })}><ThemedText style={styles.title}>{post.title}</ThemedText><ThemedText type="small" style={{ color: theme.textSecondary }}>Autor: {post.user?.username ?? post.author?.username ?? `#${post.user_id}`}</ThemedText><ThemedText type="small" style={{ color: theme.textSecondary }}>Status: {formatPostStatus(post.status)}</ThemedText></Pressable>
      <View style={contentStyles.row}><ActionButton variant="secondary" onPress={() => router.push({ pathname: '/admin/posts/[id]', params: { id: String(post.id) } })}>Editar</ActionButton><ActionButton variant="danger" onPress={() => void remove(post.id, post.title)}>Excluir</ActionButton></View>
    </View>)}
    <Pagination page={page} totalItems={posts.length} onPageChange={setPage} />
  </ScrollView></Page>;
}

function formatPostStatus(status: string) {
  if (status === 'draft') return 'Rascunho';
  if (status === 'published') return 'Publicado';
  return status || 'Não informado';
}

const styles = StyleSheet.create({ row: { borderWidth: 1, borderRadius: 12, padding: 14, gap: 12 }, info: { gap: 5 }, title: { fontSize: 17, fontWeight: '700' } });
