import { Text, TextProps, TextStyle } from 'react-native';

import { typography } from '@/constants/theme';
import { usePalette } from '@/hooks/usePalette';

type Variant = keyof typeof typography;

type AppTextProps = TextProps & {
  variant?: Variant;
  tone?: 'default' | 'muted' | 'brand' | 'sage' | 'danger' | 'inverse';
};

export function AppText({ variant = 'body', tone = 'default', style, ...props }: AppTextProps) {
  const palette = usePalette();
  const color: Record<NonNullable<AppTextProps['tone']>, string> = {
    default: palette.text,
    muted: palette.textMuted,
    brand: palette.brand,
    sage: palette.sage,
    danger: palette.danger,
    inverse: palette.white,
  };
  return <Text style={[typography[variant] as TextStyle, { color: color[tone] }, style]} {...props} />;
}

