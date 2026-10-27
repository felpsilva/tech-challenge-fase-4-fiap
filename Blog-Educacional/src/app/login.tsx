import { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { router } from 'expo-router';

import { ActionButton, Field, Header, Message, Page, SectionTitle, contentStyles } from '@/components/blog-ui';
import { ThemedText } from '@/components/themed-text';
import { useAuth } from '@/context/auth-context';

export default function LoginScreen() {
  const { signIn } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  async function submit() {
    setError('');
    setSaving(true);
    try {
      await signIn(username, password);
      router.replace('/');
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'Não foi possível entrar.');
    } finally {
      setSaving(false);
    }
  }

  return <Page><Header /><ScrollView contentContainerStyle={contentStyles.content}>
    <View style={styles.form}>
      <SectionTitle title="Entrar" description="Acesse o painel administrativo do Blog Educacional." />
      <Field label="Usuário" value={username} onChangeText={setUsername} autoCapitalize="none" />
      <Field label="Senha" value={password} onChangeText={setPassword} secureTextEntry />
      {!!error && <Message>{error}</Message>}
      <ActionButton onPress={() => void submit()} disabled={saving || !username || !password}>{saving ? 'Entrando...' : 'Entrar'}</ActionButton>
      <ThemedText type="small">Somente professores e administradores podem gerenciar conteúdo.</ThemedText>
    </View>
  </ScrollView></Page>;
}

const styles = StyleSheet.create({ form: { maxWidth: 480, width: '100%', alignSelf: 'center', gap: 16 } });
