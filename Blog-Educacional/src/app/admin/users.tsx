import { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, View } from 'react-native';
import { router } from 'expo-router';

import { ActionButton, Header, Message, Page, SectionTitle, contentStyles } from '@/components/blog-ui';
import { ThemedText } from '@/components/themed-text';
import { userService } from '@/services/auth-service';
import { User } from '@/types/api';
import { useAuth } from '@/context/auth-context';
import { useTheme } from '@/hooks/use-theme';

export default function UsersScreen() {
  const theme = useTheme(); const { session, canManageUsers } = useAuth();
  const [users, setUsers] = useState<User[]>([]); const [page, setPage] = useState(0); const [error, setError] = useState('');
  useEffect(() => { if (session) userService.list(session.token).then(setUsers).catch((reason: unknown) => setError(reason instanceof Error ? reason.message : 'Falha ao carregar usuários.')); }, [session]);
  const visible = useMemo(() => users.slice(page * 10, page * 10 + 10), [page, users]);
  async function remove(id: number) { if (!session) return; try { await userService.remove(session.token, id); setUsers((current) => current.filter((user) => user.id !== id)); } catch (reason) { setError(reason instanceof Error ? reason.message : 'Falha ao excluir usuário.'); } }
  if (!canManageUsers) return <Page><Header /><ScrollView contentContainerStyle={contentStyles.content}><Message>Você não tem permissão para acessar esta página.</Message></ScrollView></Page>;
  return <Page><Header /><ScrollView contentContainerStyle={contentStyles.content}><SectionTitle title="Professores e alunos" description="Cadastre e administre os usuários do sistema." /><ActionButton onPress={() => router.push('/admin/user-form')}>Novo usuário</ActionButton>{error && <Message>{error}</Message>}{!users.length && !error && <ActivityIndicator color={theme.brand} />}{visible.map((user) => <View key={user.id} style={[styles.row, { borderColor: theme.border }]}><View style={styles.info}><ThemedText style={styles.name}>{user.username}</ThemedText><ThemedText type="small" style={{ color: theme.textSecondary }}>{user.permission}</ThemedText></View><View style={contentStyles.row}><ActionButton variant="secondary" onPress={() => router.push({ pathname: '/admin/users/[id]', params: { id: String(user.id) } })}>Editar</ActionButton><ActionButton variant="danger" onPress={() => void remove(user.id)}>Excluir</ActionButton></View></View>)}<View style={contentStyles.row}><ActionButton variant="secondary" disabled={page === 0} onPress={() => setPage((current) => current - 1)}>Anterior</ActionButton><ThemedText>Página {page + 1}</ThemedText><ActionButton variant="secondary" disabled={(page + 1) * 10 >= users.length} onPress={() => setPage((current) => current + 1)}>Próxima</ActionButton></View></ScrollView></Page>;
}

const styles = StyleSheet.create({ row: { borderWidth: 1, borderRadius: 12, padding: 14, gap: 12 }, info: { gap: 5 }, name: { fontWeight: '700', fontSize: 17 } });
