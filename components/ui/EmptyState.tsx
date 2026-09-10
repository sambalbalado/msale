import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { ComponentProps } from 'react';
import { StyleSheet, View } from 'react-native';

import { radius, spacing } from '@/constants/theme';
import { usePalette } from '@/hooks/usePalette';
import { AppText } from './AppText';
import { Button } from './Button';

export function EmptyState({ icon, title, body, action, onAction }: {
  icon: ComponentProps<typeof MaterialIcons>['name']; title: string; body: string; action?: string; onAction?: () => void;
}) {
  const palette = usePalette();
  return (
    <View style={styles.container}>
      <View style={[styles.icon, { backgroundColor: palette.brandSoft }]}><MaterialIcons name={icon} size={30} color={palette.brand} /></View>
      <AppText variant="h3" style={styles.center}>{title}</AppText>
      <AppText tone="muted" style={styles.center}>{body}</AppText>
      {action ? <Button label={action} variant="secondary" onPress={onAction} /> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { alignItems: 'center', justifyContent: 'center', paddingVertical: spacing.display, paddingHorizontal: spacing.xl, gap: spacing.sm },
  icon: { width: 64, height: 64, borderRadius: radius.lg, alignItems: 'center', justifyContent: 'center', marginBottom: spacing.xs },
  center: { textAlign: 'center', maxWidth: 380 },
});

