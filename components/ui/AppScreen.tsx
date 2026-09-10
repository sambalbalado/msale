import { PropsWithChildren } from 'react';
import { StyleProp, StyleSheet, useWindowDimensions, View, ViewStyle } from 'react-native';
import { SafeAreaView, Edge } from 'react-native-safe-area-context';

import { spacing } from '@/constants/theme';
import { usePalette } from '@/hooks/usePalette';

type Props = PropsWithChildren<{
  style?: StyleProp<ViewStyle>;
  contentStyle?: StyleProp<ViewStyle>;
  edges?: Edge[];
  maxWidth?: number;
}>;

export function AppScreen({ children, style, contentStyle, edges = ['top'], maxWidth = 1180 }: Props) {
  const palette = usePalette();
  const { width } = useWindowDimensions();
  const horizontalPadding = width >= 1024 ? spacing.xl : width >= 600 ? spacing.lg : spacing.md;

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: palette.background }, style]} edges={edges}>
      <View style={[styles.content, { maxWidth, paddingHorizontal: horizontalPadding }, contentStyle]}>{children}</View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  content: { flex: 1, width: '100%', alignSelf: 'center' },
});

