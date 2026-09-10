import { StyleSheet, View } from 'react-native';

import { radius } from '@/constants/theme';
import { usePalette } from '@/hooks/usePalette';
import { AppText } from './AppText';

export function BrandMark({ compact = false }: { compact?: boolean }) {
  const palette = usePalette();
  return (
    <View style={styles.row} accessibilityLabel="msale">
      <View style={[styles.mark, { backgroundColor: palette.brand }, compact && styles.markCompact]}>
        <View style={[styles.spark, { backgroundColor: palette.surface }]} />
        <View style={[styles.sparkSmall, { backgroundColor: palette.surface }]} />
      </View>
      {!compact && <AppText variant="h2" style={styles.wordmark}>msale</AppText>}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  mark: { width: 36, height: 36, borderRadius: radius.md, transform: [{ rotate: '-5deg' }] },
  markCompact: { width: 32, height: 32, borderRadius: 13 },
  spark: { position: 'absolute', width: 14, height: 5, borderRadius: 4, left: 7, top: 11, transform: [{ rotate: '32deg' }] },
  sparkSmall: { position: 'absolute', width: 7, height: 5, borderRadius: 4, right: 6, bottom: 9, transform: [{ rotate: '-28deg' }] },
  wordmark: { letterSpacing: -0.7 },
});

