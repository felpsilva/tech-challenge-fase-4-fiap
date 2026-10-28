import { useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, View } from 'react-native';
import { router } from 'expo-router';

import { ActionButton, Header, Message, Page, Pagination, SectionTitle, contentStyles } from '@/components/blog-ui';
import { ThemedText } from '@/components/themed-text';
import { categoryService } from '@/services/category-service';
import { Category } from '@/types/api';
import { useAuth } from '@/context/auth-context';
import { useTheme } from '@/hooks/use-theme';
import { confirmDelete } from '@/lib/confirm-delete';

export default function CategoriesScreen() {
  const theme = useTheme(); const { session, canManageContent } = useAuth();
  const [categories, setCategories] = useState<Category[]>([]); const [page, setPage] = useState(0); const [error, setError] = useState('');
  useEffect(() => { if (session) categoryService.list(session.token).then(setCategories).catch((reason: unknown) => setError(reason instanceof Error ? reason.message : 'Falha ao carregar categorias.')); }, [session]);
  async function remove(id: number, name: string) {
    if (!session || !(await confirmDelete(`a categoria "${name}"`))) return;
    try {
      await categoryService.remove(session.token, id);
      setCategories((current) => {
        const next = current.filter((category) => category.id !== id);
        setPage((currentPage) => Math.min(currentPage, Math.max(0, Math.ceil(next.length / 10) - 1)));
        return next;
      });
    } catch (reason) { setError(reason instanceof Error ? reason.message : 'Falha ao excluir categoria.'); }
  }
  const visibleCategories = categories.slice(page * 10, page * 10 + 10);
  if (!canManageContent) return <Page><Header /><ScrollView contentContainerStyle={contentStyles.content}><Message>Você não tem permissão para acessar esta página.</Message></ScrollView></Page>;
  return <Page><Header /><ScrollView contentContainerStyle={contentStyles.content}><SectionTitle title="Categorias" description="Organize as publicações do blog." /><ActionButton onPress={() => router.push('/admin/category-form')}>Nova categoria</ActionButton>{error && <Message>{error}</Message>}{!categories.length && !error && <ActivityIndicator color={theme.brand} />}{visibleCategories.map((category) => <View key={category.id} style={[styles.row, { borderColor: theme.border }]}><View style={styles.info}><ThemedText style={styles.name}>{category.name}</ThemedText><ThemedText type="small" style={{ color: theme.textSecondary }}>{category.slug}</ThemedText></View><View style={contentStyles.row}><ActionButton variant="secondary" onPress={() => router.push({ pathname: '/admin/categories/[id]', params: { id: String(category.id) } })}>Editar</ActionButton><ActionButton variant="danger" onPress={() => void remove(category.id, category.name)}>Excluir</ActionButton></View></View>)}<Pagination page={page} totalItems={categories.length} onPageChange={setPage} /></ScrollView></Page>;
}

const styles = StyleSheet.create({ row: { borderWidth: 1, borderRadius: 12, padding: 14, gap: 12 }, info: { gap: 5 }, name: { fontWeight: '700', fontSize: 17 } });
