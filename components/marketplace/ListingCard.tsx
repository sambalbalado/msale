import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Image } from 'expo-image';
import { Pressable, StyleProp, StyleSheet, View, ViewStyle } from 'react-native';

import { radius, shadow, spacing } from '@/constants/theme';
import { usePalette } from '@/hooks/usePalette';
import { useI18n } from '@/lib/i18n';
import { formatPrice } from '@/lib/format';
import { Listing } from '@/types/domain';
import { AppText } from '@/components/ui/AppText';

type Props = {
  listing: Listing;
  onPress: () => void;
  onToggleFavorite: () => void;
  style?: StyleProp<ViewStyle>;
};

export function ListingCard({ listing, onPress, onToggleFavorite, style }: Props) {
  const palette = usePalette();
  const { language, t } = useI18n();
  return (
    <View style={[styles.card, { backgroundColor: palette.surface, borderColor: palette.line }, shadow, style]}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`${listing.title}, ${formatPrice(listing.price, language)}`}
        onPress={onPress}
        style={({ pressed }) => [styles.cardAction, pressed && styles.pressed]}>
        <View style={styles.imageWrap}>
          <Image source={{ uri: listing.imageUrls[0] }} style={styles.image} contentFit="cover" transition={220} />
          {listing.distanceKm != null && listing.distanceKm < 20 ? (
            <View style={[styles.distance, { backgroundColor: palette.sageSoft }]}> 
              <AppText variant="caption" tone="sage">{listing.distanceKm.toFixed(1)} km</AppText>
            </View>
          ) : null}
        </View>
        <View style={styles.copy}>
          <AppText variant="h3" numberOfLines={1}>{formatPrice(listing.price, language)}</AppText>
          <AppText variant="label" numberOfLines={2} style={styles.title}>{listing.title}</AppText>
          <View style={styles.meta}>
            <MaterialIcons name="location-on" size={14} color={palette.textMuted} />
            <AppText variant="caption" tone="muted" numberOfLines={1}>{listing.area}</AppText>
            <View style={[styles.dot, { backgroundColor: palette.textMuted }]} />
            <AppText variant="caption" tone="muted">{t(`condition.${listing.condition}`)}</AppText>
          </View>
        </View>
      </Pressable>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={listing.isFavorite ? t('listing.unfavorite') : t('listing.favorite')}
        hitSlop={8}
        onPress={onToggleFavorite}
        style={({ pressed }) => [styles.heart, { backgroundColor: 'rgba(255,255,255,0.93)' }, pressed && styles.heartPressed]}>
        <MaterialIcons name={listing.isFavorite ? 'favorite' : 'favorite-border'} size={21} color={listing.isFavorite ? palette.brand : palette.text} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { flex: 1, minWidth: 0, overflow: 'hidden', borderRadius: radius.lg, borderWidth: 1 },
  cardAction: { flex: 1 },
  pressed: { opacity: 0.78 },
  imageWrap: { aspectRatio: 0.92, overflow: 'hidden', backgroundColor: '#E9E0D2' },
  image: { width: '100%', height: '100%' },
  heart: { position: 'absolute', right: 10, top: 10, zIndex: 2, width: 38, height: 38, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
  heartPressed: { transform: [{ scale: 0.88 }] },
  distance: { position: 'absolute', left: 10, bottom: 10, borderRadius: radius.pill, paddingHorizontal: 9, paddingVertical: 5 },
  copy: { padding: spacing.sm, paddingBottom: 14, gap: 3 },
  title: { minHeight: 38 },
  meta: { marginTop: 3, flexDirection: 'row', alignItems: 'center', gap: 4, minWidth: 0 },
  dot: { width: 3, height: 3, borderRadius: 2, marginHorizontal: 2 },
});
