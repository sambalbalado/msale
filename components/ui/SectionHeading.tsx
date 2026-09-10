import { Pressable, StyleSheet, View } from 'react-native';

import { spacing } from '@/constants/theme';
import { AppText } from './AppText';

export function SectionHeading({ title, subtitle, action, onAction }: { title: string; subtitle?: string; action?: string; onAction?: () => void }) {
  return (
    <View style={styles.row}>
      <View style={styles.copy}>
        <AppText variant="h2">{title}</AppText>
        {subtitle ? <AppText tone="muted">{subtitle}</AppText> : null}
      </View>
      {action ? <Pressable hitSlop={10} onPress={onAction}><AppText variant="label" tone="brand">{action}</AppText></Pressable> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', gap: spacing.md },
  copy: { flex: 1, gap: spacing.xxs },
});

