import { useRef } from 'react';
import { StyleSheet, View } from 'react-native';
import {
  actions,
  RichEditor,
  RichToolbar,
} from 'react-native-pell-rich-editor';

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
  const editorRef = useRef<RichEditor>(null);

  return (
    <View style={styles.editor}>
      <ThemedText type="smallBold">Conteúdo</ThemedText>
      <RichToolbar
        editor={editorRef}
        actions={[
          actions.setBold,
          actions.setItalic,
          actions.heading1,
          actions.insertBulletsList,
          actions.insertOrderedList,
          actions.undo,
          actions.redo,
        ]}
        style={[
          styles.toolbar,
          {
            borderColor: theme.border,
            backgroundColor: theme.backgroundElement,
          },
        ]}
        flatContainerStyle={styles.toolbarItems}
        iconTint={theme.text}
        selectedIconTint={theme.brand}
        disabledIconTint={theme.textSecondary}
        selectedButtonStyle={{
          backgroundColor: theme.backgroundSelected,
          borderRadius: 6,
        }}
      />
      <RichEditor
        ref={editorRef}
        initialContentHTML={toInitialEditorHtml(value)}
        onChange={onChange}
        placeholder="Escreva o conteúdo da publicação..."
        editorStyle={{
          backgroundColor: theme.background,
          color: theme.text,
          placeholderColor: theme.textSecondary,
          contentCSSText: 'font-size: 16px; line-height: 1.5;',
        }}
        style={[
          styles.editorInput,
          { borderColor: theme.border, backgroundColor: theme.background },
        ]}
      />
      <ThemedText type="small" style={{ color: theme.textSecondary }}>
        Use a barra de ferramentas para formatar o conteúdo.
      </ThemedText>
    </View>
  );
}

function toInitialEditorHtml(value: string) {
  if (!value) return '';
  if (/<[a-z][\s\S]*>/i.test(value)) return value;
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/\n/g, '<br />');
}

const styles = StyleSheet.create({
  editor: { gap: 7 },
  toolbar: {
    minHeight: 44,
    borderWidth: 1,
    borderRadius: 8,
    overflow: 'hidden',
  },
  toolbarItems: { backgroundColor: 'transparent' },
  editorInput: { minHeight: 240, borderWidth: 1, borderRadius: 8 },
});
