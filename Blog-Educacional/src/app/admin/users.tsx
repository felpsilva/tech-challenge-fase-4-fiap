import { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, View } from 'react-native';
import { router } from 'expo-router';

import { ActionButton, Header, Message, Page, Pagination, SectionTitle, contentStyles } from '@/components/blog-ui';
import { ThemedText } from '@/components/themed-text';
import { userService } from '@/services/auth-service';
import { User } from '@/types/api';
import { useAuth } from '@/context/auth-context';
import { useTheme } from '@/hooks/use-theme';
import { confirmDelete } from '@/lib/confirm-delete';

export default function UsersScreen() {
  const theme = useTheme(); const { session, canManageUsers } = useAuth();
  const [users, setUsers] = useState<User[]>([]); const [professorPage, setProfessorPage] = useState(0); const [studentPage, setStudentPage] = useState(0); const [error, setError] = useState('');
  useEffect(() => { if (session) userService.list(session.token).then(setUsers).catch((reason: unknown) => setError(reason instanceof Error ? reason.message : 'Falha ao carregar usuários.')); }, [session]);
  const professors = useMemo(() => users.filter((user) => user.permission === 'professor'), [users]);
  const students = useMemo(() => users.filter((user) => user.permission === 'aluno'), [users]);
  async function remove(id: number, username: string) {
    if (!session || !(await confirmDelete(`o usuário "${username}"`))) return;
    try {
      await userService.remove(session.token, id);
      setUsers((current) => {
        const next = current.filter((user) => user.id !== id);
        const nextProfessors = next.filter((user) => user.permission === 'professor').length;
        const nextStudents = next.filter((user) => user.permission === 'aluno').length;
        setProfessorPage((currentPage) => Math.min(currentPage, Math.max(0, Math.ceil(nextProfessors / 10) - 1)));
        setStudentPage((currentPage) => Math.min(currentPage, Math.max(0, Math.ceil(nextStudents / 10) - 1)));
        return next;
      });
    } catch (reason) { setError(reason instanceof Error ? reason.message : 'Falha ao excluir usuário.'); }
  }
  if (!canManageUsers) return <Page><Header /><ScrollView contentContainerStyle={contentStyles.content}><Message>Você não tem permissão para acessar esta página.</Message></ScrollView></Page>;
  return <Page><Header /><ScrollView contentContainerStyle={contentStyles.content}><SectionTitle title="Professores e alunos" description="Cadastre e administre os usuários do sistema." /><ActionButton onPress={() => router.push('/admin/user-form')}>Novo usuário</ActionButton>{error && <Message>{error}</Message>}{!users.length && !error && <ActivityIndicator color={theme.brand} />}<UserSection title="Professores" users={professors} page={professorPage} onPageChange={setProfessorPage} onRemove={remove} theme={theme} /><UserSection title="Alunos" users={students} page={studentPage} onPageChange={setStudentPage} onRemove={remove} theme={theme} /></ScrollView></Page>;
}

function UserSection({ title, users, page, onPageChange, onRemove, theme }: { title: string; users: User[]; page: number; onPageChange: (page: number) => void; onRemove: (id: number, username: string) => Promise<void>; theme: ReturnType<typeof useTheme> }) {
  const visible = users.slice(page * 10, page * 10 + 10);
  return <View style={styles.section}><SectionTitle title={title} /><ThemedText type="small" style={{ color: theme.textSecondary }}>{users.length} usuário(s)</ThemedText>{!users.length && <ThemedText style={{ color: theme.textSecondary }}>Nenhum usuário cadastrado.</ThemedText>}{visible.map((user) => <View key={user.id} style={[styles.row, { borderColor: theme.border }]}><View style={styles.info}><ThemedText style={styles.name}>{user.username}</ThemedText><ThemedText type="small" style={{ color: theme.textSecondary }}>{user.permission}</ThemedText></View><View style={contentStyles.row}><ActionButton variant="secondary" onPress={() => router.push({ pathname: '/admin/users/[id]', params: { id: String(user.id) } })}>Editar</ActionButton><ActionButton variant="danger" onPress={() => void onRemove(user.id, user.username)}>Excluir</ActionButton></View></View>)}<Pagination page={page} totalItems={users.length} onPageChange={onPageChange} /></View>;
}

const styles = StyleSheet.create({ section: { gap: 12 }, row: { borderWidth: 1, borderRadius: 12, padding: 14, gap: 12 }, info: { gap: 5 }, name: { fontWeight: '700', fontSize: 17 } });
