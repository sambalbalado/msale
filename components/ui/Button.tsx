import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import * as Haptics from 'expo-haptics';
import { ComponentProps } from 'react';
import { ActivityIndicator, Pressable, PressableProps, StyleSheet, ViewStyle } from 'react-native';

import { radius, spacing } from '@/constants/theme';
import { usePalette } from '@/hooks/usePalette';
import { AppText } from './AppText';

type IconName = ComponentProps<typeof MaterialIcons>['name'];

type Props = PressableProps & {
  label: string;
  variant?: 'primary' | 'secondary' | 'ghost' | 'dark';
  icon?: IconName;
  loading?: boolean;
  fullWidth?: boolean;
};

export function Button({ label, variant = 'primary', icon, loading, fullWidth, disabled, style, onPress, ...props }: Props) {
  const palette = usePalette();
  const background = variant === 'primary' ? palette.brand : variant === 'dark' ? palette.text : variant === 'secondary' ? palette.surfaceMuted : 'transparent';
  const foreground = variant === 'primary' || variant === 'dark' ? palette.white : palette.text;
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      disabled={disabled || loading}
      onPress={(event) => {
        void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        onPress?.(event);
      }}
      style={({ pressed }) => [
        styles.base,
        { backgroundColor: background, borderColor: variant === 'ghost' ? palette.line : background, opacity: disabled ? 0.45 : 1 },
        fullWidth && styles.full,
        pressed && styles.pressed,
        style as ViewStyle,
      ]}
      {...props}>
      {loading ? <ActivityIndicator color={foreground} /> : <>
        {icon && <MaterialIcons name={icon} size={20} color={foreground} />}
        <AppText variant="label" style={{ color: foreground }}>{label}</AppText>
      </>}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: { minHeight: 52, paddingHorizontal: spacing.lg, borderRadius: radius.pill, borderWidth: 1, alignItems: 'center', justifyContent: 'center', flexDirection: 'row', gap: spacing.xs },
  full: { width: '100%' },
  pressed: { transform: [{ scale: 0.975 }], opacity: 0.9 },
});

