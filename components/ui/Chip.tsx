import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { ComponentProps } from 'react';
import { Pressable, StyleSheet } from 'react-native';

import { radius, spacing } from '@/constants/theme';
import { usePalette } from '@/hooks/usePalette';
import { AppText } from './AppText';

type Props = {
  label: string;
  selected?: boolean;
  icon?: ComponentProps<typeof MaterialIcons>['name'];
  onPress?: () => void;
};

export function Chip({ label, selected, icon, onPress }: Props) {
  const palette = usePalette();
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ selected }}
      onPress={onPress}
      style={({ pressed }) => [styles.chip, {
        backgroundColor: selected ? palette.text : palette.surface,
        borderColor: selected ? palette.text : palette.line,
      }, pressed && styles.pressed]}>
      {icon && <MaterialIcons name={icon} size={17} color={selected ? palette.background : palette.textMuted} />}
      <AppText variant="label" style={{ color: selected ? palette.background : palette.text }}>{label}</AppText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  chip: { height: 42, borderRadius: radius.pill, paddingHorizontal: spacing.md, flexDirection: 'row', alignItems: 'center', gap: 7, borderWidth: 1 },
  pressed: { transform: [{ scale: 0.97 }] },
});

