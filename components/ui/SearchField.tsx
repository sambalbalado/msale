import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Pressable, StyleSheet, TextInput, View } from 'react-native';

import { radius, spacing, typography } from '@/constants/theme';
import { usePalette } from '@/hooks/usePalette';

type Props = {
  placeholder: string;
  value?: string;
  onChangeText?: (value: string) => void;
  onPress?: () => void;
  autoFocus?: boolean;
};

export function SearchField({ placeholder, value, onChangeText, onPress, autoFocus }: Props) {
  const palette = usePalette();
  const content = (
    <View style={[styles.container, { backgroundColor: palette.surface, borderColor: palette.line }]}>
      <MaterialIcons name="search" size={23} color={palette.textMuted} />
      <TextInput
        accessibilityLabel={placeholder}
        editable={!onPress}
        pointerEvents={onPress ? 'none' : 'auto'}
        autoFocus={autoFocus}
        placeholder={placeholder}
        placeholderTextColor={palette.textMuted}
        selectionColor={palette.brand}
        style={[styles.input, { color: palette.text }]}
        value={value}
        onChangeText={onChangeText}
        returnKeyType="search"
      />
      {value && onChangeText ? (
        <Pressable hitSlop={8} onPress={() => onChangeText('')}><MaterialIcons name="cancel" size={21} color={palette.textMuted} /></Pressable>
      ) : null}
    </View>
  );
  return onPress ? <Pressable accessibilityRole="search" onPress={onPress}>{content}</Pressable> : content;
}

const styles = StyleSheet.create({
  container: { height: 56, borderRadius: radius.lg, borderWidth: 1, flexDirection: 'row', alignItems: 'center', paddingHorizontal: spacing.md, gap: spacing.sm },
  input: { ...typography.body, flex: 1, paddingVertical: 0 },
});

