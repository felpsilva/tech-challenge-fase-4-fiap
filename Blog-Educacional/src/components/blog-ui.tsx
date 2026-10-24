import { PropsWithChildren, ReactNode } from 'react';
import { Pressable, StyleSheet, TextInput, View } from 'react-native';
import { router } from 'expo-router';

import { useAuth } from '@/context/auth-context';
import { useTheme } from '@/hooks/use-theme';
import { ThemedText } from './themed-text';
import { ThemedView } from './themed-view';

export function Page({ children }: PropsWithChildren) {
  const theme = useTheme();
  return <ThemedView style={[styles.page, { backgroundColor: theme.background }]}>{children}</ThemedView>;
}

export function Header() {
  const theme = useTheme();
  const { session, canManageContent, signOut } = useAuth();
  return (
    <View style={[styles.header, { backgroundColor: theme.background, borderBottomColor: theme.border }]}>
      <Pressable onPress={() => router.replace('/')}>
        <ThemedText style={[styles.brand, { color: theme.brand }]}>Blog Educacional</ThemedText>
      </Pressable>
      <View style={styles.headerActions}>
        {canManageContent && <Pressable onPress={() => router.push('/admin')}>
          <ThemedText style={{ color: theme.brand }}>Painel</ThemedText>
        </Pressable>}
        {session ? (
          <Pressable onPress={() => void signOut()}>
            <ThemedText style={{ color: theme.textSecondary }}>Sair</ThemedText>
          </Pressable>
        ) : (
          <Pressable onPress={() => router.push('/login')}>
            <ThemedText style={{ color: theme.brand }}>Entrar</ThemedText>
          </Pressable>
        )}
      </View>
    </View>
  );
}

export function Field({ label, ...props }: { label: string } & React.ComponentProps<typeof TextInput>) {
  const theme = useTheme();
  return (
    <View style={styles.field}>
      <ThemedText type="smallBold">{label}</ThemedText>
      <TextInput
        {...props}
        placeholderTextColor={theme.textSecondary}
        style={[styles.input, { color: theme.text, borderColor: theme.border, backgroundColor: theme.background }]}
      />
    </View>
  );
}

export function ActionButton({ children, variant = 'primary', onPress, disabled }: PropsWithChildren<{
  variant?: 'primary' | 'danger' | 'secondary';
  onPress: () => void;
  disabled?: boolean;
}>) {
  const theme = useTheme();
  const backgroundColor = variant === 'primary' ? theme.brand : variant === 'danger' ? theme.danger : theme.backgroundElement;
  const color = variant === 'secondary' ? theme.text : '#FFFFFF';
  return (
    <Pressable disabled={disabled} onPress={onPress} style={({ pressed }) => [
      styles.button, { backgroundColor, opacity: disabled ? 0.5 : pressed ? 0.75 : 1 },
    ]}>
      <ThemedText style={[styles.buttonText, { color }]}>{children}</ThemedText>
    </Pressable>
  );
}

export function Message({ children }: { children: ReactNode }) {
  const theme = useTheme();
  return <ThemedText style={[styles.message, { color: theme.danger }]}>{children}</ThemedText>;
}

export function SectionTitle({ title, description }: { title: string; description?: string }) {
  const theme = useTheme();
  return (
    <View style={styles.sectionTitle}>
      <ThemedText type="heading">{title}</ThemedText>
      {description && <ThemedText style={{ color: theme.textSecondary }}>{description}</ThemedText>}
    </View>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1 },
  header: { minHeight: 68, paddingHorizontal: 20, paddingVertical: 14, borderBottomWidth: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  brand: { fontSize: 19, fontWeight: '700' },
  headerActions: { flexDirection: 'row', gap: 18, alignItems: 'center' },
  content: { padding: 20, gap: 18, maxWidth: 900, width: '100%', alignSelf: 'center' },
  field: { gap: 7 },
  input: { minHeight: 46, borderWidth: 1, borderRadius: 8, paddingHorizontal: 13, paddingVertical: 10, fontSize: 16 },
  button: { minHeight: 46, borderRadius: 8, paddingHorizontal: 18, alignItems: 'center', justifyContent: 'center' },
  buttonText: { fontWeight: '700' },
  message: { paddingVertical: 8 },
  sectionTitle: { gap: 6, marginBottom: 4 },
});

export const contentStyles = StyleSheet.create({
  scroll: { flex: 1 },
  content: styles.content,
  row: { flexDirection: 'row', gap: 10, flexWrap: 'wrap', alignItems: 'center' },
  card: { borderWidth: 1, borderRadius: 16, padding: 18, gap: 9 },
  divider: { height: 1 },
});
