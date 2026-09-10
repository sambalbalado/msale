import { Image } from 'expo-image';
import { StyleSheet, View } from 'react-native';

import { usePalette } from '@/hooks/usePalette';
import { AppText } from './AppText';

export function Avatar({ uri, name, size = 44 }: { uri?: string; name: string; size?: number }) {
  const palette = usePalette();
  const style = { width: size, height: size, borderRadius: size / 2 };
  if (uri) return <Image source={{ uri }} style={style} contentFit="cover" transition={180} />;
  return (
    <View style={[styles.fallback, style, { backgroundColor: palette.brandSoft }]}>
      <AppText variant="label" tone="brand">{name.slice(0, 1).toUpperCase()}</AppText>
    </View>
  );
}

const styles = StyleSheet.create({ fallback: { alignItems: 'center', justifyContent: 'center' } });

