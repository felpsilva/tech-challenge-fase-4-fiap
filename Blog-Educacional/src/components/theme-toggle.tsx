import { SymbolView } from 'expo-symbols';
import { Pressable, StyleSheet, View } from 'react-native';

import { useTheme } from '@/hooks/use-theme';
import { useThemeMode } from '@/context/theme-context';

export function ThemeToggle() {
  const theme = useTheme();
  const { resolvedMode, toggle } = useThemeMode();

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel="Alternar entre tema claro e escuro"
      accessibilityState={{ checked: resolvedMode === 'dark' }}
      onPress={toggle}
      style={({ pressed }) => [
        styles.toggle,
        { backgroundColor: theme.backgroundElement },
        pressed && styles.pressed,
      ]}>
      <View>
        <SymbolView
          name={resolvedMode === 'dark'
            ? { ios: 'moon.fill', android: 'dark_mode', web: 'dark_mode' }
            : { ios: 'sun.max.fill', android: 'light_mode', web: 'light_mode' }}
          tintColor={theme.textSecondary}
          size={18}
        />
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  toggle: {
    width: 40,
    height: 40,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pressed: { opacity: 0.7 },
});
