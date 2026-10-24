import { ScrollView, StyleSheet, View } from 'react-native';
import { router } from 'expo-router';

import { ActionButton, Header, Page, SectionTitle, contentStyles } from '@/components/blog-ui';
import { ThemedText } from '@/components/themed-text';
import { useAuth } from '@/context/auth-context';

export default function AdminScreen() {
  const { canManageContent, canManageUsers, isLoading } = useAuth();
  if (isLoading) return null;
  return <Page><Header /><ScrollView contentContainerStyle={contentStyles.content}>
    <SectionTitle title="Painel administrativo" description="Gerencie publicações, categorias e usuários do blog." />
    {!canManageContent && <ThemedText>Faça login como professor para acessar o painel.</ThemedText>}
    {canManageContent && <View style={styles.grid}>
      <ActionButton onPress={() => router.push('/admin/posts')}>Gerenciar posts</ActionButton>
      <ActionButton variant="secondary" onPress={() => router.push('/admin/categories')}>Gerenciar categorias</ActionButton>
      {canManageUsers && <ActionButton variant="secondary" onPress={() => router.push('/admin/users')}>Gerenciar professores e alunos</ActionButton>}
    </View>}
  </ScrollView></Page>;
}

const styles = StyleSheet.create({ grid: { gap: 12, maxWidth: 520, width: '100%' } });
