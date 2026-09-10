import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import * as Haptics from 'expo-haptics';
import { ComponentProps } from 'react';
import { Pressable, StyleSheet, ViewStyle } from 'react-native';

import { radius } from '@/constants/theme';
import { usePalette } from '@/hooks/usePalette';

type Props = {
  icon: ComponentProps<typeof MaterialIcons>['name'];
  label: string;
  onPress?: () => void;
  selected?: boolean;
  size?: number;
  style?: ViewStyle;
};

export function IconButton({ icon, label, onPress, selected, size = 46, style }: Props) {
  const palette = usePalette();
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ selected }}
      hitSlop={8}
      onPress={() => {
        void Haptics.selectionAsync();
        onPress?.();
      }}
      style={({ pressed }) => [styles.button, {
        width: size, height: size,
        backgroundColor: selected ? palette.brand : palette.surface,
        borderColor: selected ? palette.brand : palette.line,
      }, pressed && styles.pressed, style]}>
      <MaterialIcons name={icon} size={size * 0.48} color={selected ? palette.white : palette.text} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: { borderRadius: radius.pill, alignItems: 'center', justifyContent: 'center', borderWidth: 1 },
  pressed: { transform: [{ scale: 0.92 }] },
});

