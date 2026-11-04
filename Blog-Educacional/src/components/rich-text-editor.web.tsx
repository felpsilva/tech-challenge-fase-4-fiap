import { StyleSheet, TextInput, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { useTheme } from '@/hooks/use-theme';

export function RichTextEditor({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  const theme = useTheme();

  return (
    <View style={styles.editor}>
      <ThemedText type="smallBold">Conteúdo</ThemedText>
      <TextInput
        multiline
        value={value}
        onChangeText={onChange}
        placeholder="Escreva o conteúdo da publicação..."
        placeholderTextColor={theme.textSecondary}
        textAlignVertical="top"
        style={[
          styles.editorInput,
          {
            borderColor: theme.border,
            backgroundColor: theme.background,
            color: theme.text,
          },
        ]}
      />
      <ThemedText type="small" style={{ color: theme.textSecondary }}>
        No navegador, a formatação avançada fica disponível após publicar pelo
        aplicativo.
      </ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  editor: { gap: 7 },
  editorInput: {
    minHeight: 240,
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
  },
});
