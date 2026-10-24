import { useEffect, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';

import { ActionButton, Field, Header, Message, Page, SectionTitle, contentStyles } from '@/components/blog-ui';
import { userService } from '@/services/auth-service';
import { Permission } from '@/types/api';
import { useAuth } from '@/context/auth-context';
import { useTheme } from '@/hooks/use-theme';
import { ThemedText } from '@/components/themed-text';

export default function UserFormScreen() {
  const theme = useTheme(); const { id } = useLocalSearchParams<{ id?: string }>(); const { session, canManageUsers } = useAuth();
  const [username, setUsername] = useState(''); const [password, setPassword] = useState(''); const [permission, setPermission] = useState<Permission>('professor'); const [error, setError] = useState(''); const [saving, setSaving] = useState(false);
  useEffect(() => { if (id && session) userService.get(session.token, Number(id)).then((user) => { setUsername(user.username); setPermission(user.permission); }).catch((reason: unknown) => setError(reason instanceof Error ? reason.message : 'Falha ao carregar usuário.')); }, [id, session]);
  async function save() { if (!session || !username || (!id && !password)) return; setSaving(true); setError(''); try { if (id) await userService.update(session.token, Number(id), { username, password: password || undefined, permission }); else await userService.create(session.token, { username, password, permission }); router.replace('/admin/users'); } catch (reason) { setError(reason instanceof Error ? reason.message : 'Falha ao salvar usuário.'); } finally { setSaving(false); } }
  if (!canManageUsers) return <Page><Header /><ScrollView contentContainerStyle={contentStyles.content}><Message>Você não tem permissão para acessar esta página.</Message></ScrollView></Page>;
  return <Page><Header /><ScrollView contentContainerStyle={contentStyles.content}><View style={styles.form}><SectionTitle title={id ? 'Editar usuário' : 'Cadastrar usuário'} description="Professores podem cadastrar professores e alunos." /><Field label="Usuário" value={username} onChangeText={setUsername} autoCapitalize="none" /><Field label={id ? 'Nova senha (opcional)' : 'Senha'} value={password} onChangeText={setPassword} secureTextEntry /><ThemedText type="smallBold">Perfil</ThemedText><View style={contentStyles.row}>{(['professor', 'aluno'] as Permission[]).map((option) => <Pressable key={option} onPress={() => setPermission(option)} style={[styles.role, { borderColor: permission === option ? theme.brand : theme.border, backgroundColor: permission === option ? theme.backgroundSelected : theme.background }]}><ThemedText>{option === 'aluno' ? 'Aluno' : 'Professor'}</ThemedText></Pressable>)}</View>{error && <Message>{error}</Message>}<ActionButton onPress={() => void save()} disabled={saving}>{saving ? 'Salvando...' : 'Salvar usuário'}</ActionButton></View></ScrollView></Page>;
}

const styles = StyleSheet.create({ form: { gap: 16, maxWidth: 600, width: '100%', alignSelf: 'center' }, role: { borderWidth: 1, borderRadius: 8, paddingVertical: 12, paddingHorizontal: 18 } });
