import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Image } from 'expo-image';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, useWindowDimensions, View } from 'react-native';

import { AppScreen } from '@/components/ui/AppScreen';
import { AppText } from '@/components/ui/AppText';
import { Avatar } from '@/components/ui/Avatar';
import { Button } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/EmptyState';
import { IconButton } from '@/components/ui/IconButton';
import { radius, shadow, spacing } from '@/constants/theme';
import { useListing, useStartConversation, useToggleFavorite } from '@/hooks/useMarketplace';
import { usePalette } from '@/hooks/usePalette';
import { formatPrice, formatRelativeDate } from '@/lib/format';
import { useI18n } from '@/lib/i18n';
import { useAuth } from '@/providers/AuthProvider';

export default function ListingDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const palette = usePalette();
  const { width } = useWindowDimensions();
  const { language, t } = useI18n();
  const { isAuthenticated } = useAuth();
  const listingQuery = useListing(id);
  const favorite = useToggleFavorite();
  const conversation = useStartConversation();
  const imageWidth = Math.min(width, 900) - (width < 600 ? 32 : 48);

  if (listingQuery.isLoading) return <AppScreen contentStyle={styles.center}><ActivityIndicator size="large" color={palette.brand} /></AppScreen>;
  const listing = listingQuery.data;
  if (!listing) return <AppScreen contentStyle={styles.center}><EmptyState icon="search-off" title={t('discover.noResults')} body={t('discover.noResultsBody')} action={t('common.back')} onAction={() => router.back()} /></AppScreen>;

  const messageSeller = async () => {
    if (!isAuthenticated) return router.push('/auth');
    const conversationId = await conversation.mutateAsync(listing.id);
    router.push({ pathname: '/chat/[id]', params: { id: conversationId } });
  };

  return (
    <AppScreen edges={['top', 'bottom']} maxWidth={900}>
      <View style={styles.flex}>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
          <View style={styles.topActions}>
            <IconButton icon="arrow-back" label={t('common.back')} onPress={() => router.back()} />
            <View style={styles.actionGroup}>
              <IconButton icon="ios-share" label={t('common.share')} />
              <IconButton icon={listing.isFavorite ? 'favorite' : 'favorite-border'} label={listing.isFavorite ? t('listing.unfavorite') : t('listing.favorite')} selected={listing.isFavorite} onPress={() => {
                if (!isAuthenticated) return router.push('/auth');
                favorite.mutate({ listingId: listing.id, nextValue: !listing.isFavorite });
              }} />
            </View>
          </View>

          <ScrollView horizontal pagingEnabled showsHorizontalScrollIndicator={false} snapToInterval={imageWidth + spacing.sm} decelerationRate="fast" contentContainerStyle={styles.gallery}>
            {listing.imageUrls.map((uri, index) => (
              <View key={`${uri}-${index}`} style={[styles.imageWrap, { width: imageWidth }]}>
                <Image source={{ uri }} style={styles.image} contentFit="cover" transition={220} />
                <View style={styles.imageCount}><AppText variant="caption" tone="inverse">{index + 1} / {listing.imageUrls.length}</AppText></View>
              </View>
            ))}
          </ScrollView>

          <View style={styles.titleBlock}>
            <View style={[styles.condition, { backgroundColor: palette.sageSoft }]}><AppText variant="caption" tone="sage">{t(`condition.${listing.condition}`)}</AppText></View>
            <AppText variant="h1">{listing.title}</AppText>
            <AppText variant="h2" tone="brand">{formatPrice(listing.price, language)}</AppText>
            <AppText variant="caption" tone="muted">{t('listing.posted', { time: formatRelativeDate(listing.createdAt, language) })}</AppText>
          </View>

          <View style={[styles.rule, { backgroundColor: palette.line }]} />

          <View style={styles.section}>
            <AppText variant="h2">{t('listing.description')}</AppText>
            <AppText style={styles.longCopy}>{listing.description}</AppText>
          </View>

          <View style={[styles.locationCard, { backgroundColor: palette.surfaceMuted }]}>
            <View style={[styles.locationIcon, { backgroundColor: palette.surface }]}><MaterialIcons name="location-on" size={24} color={palette.brand} /></View>
            <View style={styles.flex}>
              <AppText variant="caption" tone="muted">{t('listing.location').toUpperCase()}</AppText>
              <AppText variant="h3">{listing.area}, {listing.state}</AppText>
              {listing.meetupNotes ? <AppText tone="muted">{listing.meetupNotes}</AppText> : null}
            </View>
          </View>

          <View style={styles.section}>
            <AppText variant="h2">{t('listing.seller')}</AppText>
            <Pressable style={[styles.sellerCard, { backgroundColor: palette.surface, borderColor: palette.line }, shadow]}>
              <Avatar uri={listing.seller.avatarUrl} name={listing.seller.displayName} size={58} />
              <View style={styles.sellerCopy}>
                <View style={styles.sellerName}><AppText variant="h3">{listing.seller.displayName}</AppText>{listing.seller.verified ? <MaterialIcons name="verified" size={18} color={palette.sage} /> : null}</View>
                <View style={styles.rating}><MaterialIcons name="star" size={17} color={palette.amber} /><AppText variant="label">{listing.seller.rating.toFixed(1)}</AppText><AppText variant="caption" tone="muted">({listing.seller.reviewCount}) · {t('listing.responses', { count: listing.seller.responseRate ?? 0 })}</AppText></View>
              </View>
              <MaterialIcons name="chevron-right" size={24} color={palette.textMuted} />
            </Pressable>
          </View>

          <View style={[styles.safety, { backgroundColor: palette.sageSoft }]}>
            <MaterialIcons name="health-and-safety" size={25} color={palette.sage} />
            <View style={styles.flex}><AppText variant="bodyStrong" tone="sage">{t('listing.safetyTitle')}</AppText><AppText style={{ color: palette.sage }}>{t('listing.safetyBody')}</AppText></View>
          </View>
        </ScrollView>

        <View style={[styles.bottomBar, { backgroundColor: palette.tab, borderColor: palette.line }]}>
          <View style={styles.bottomCopy}><AppText variant="caption" tone="muted" numberOfLines={1}>{listing.title}</AppText><AppText variant="h3">{formatPrice(listing.price, language)}</AppText></View>
          <Button label={t('listing.message')} icon="chat-bubble-outline" loading={conversation.isPending} onPress={() => void messageSeller()} />
        </View>
      </View>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  center: { alignItems: 'center', justifyContent: 'center' },
  content: { paddingTop: spacing.sm, paddingBottom: 130, gap: spacing.lg },
  topActions: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', zIndex: 2 },
  actionGroup: { flexDirection: 'row', gap: spacing.xs },
  gallery: { gap: spacing.sm },
  imageWrap: { aspectRatio: 1.06, borderRadius: radius.xl, overflow: 'hidden', backgroundColor: '#E9E0D2' },
  image: { width: '100%', height: '100%' },
  imageCount: { position: 'absolute', right: 14, bottom: 14, backgroundColor: 'rgba(20,20,18,0.68)', borderRadius: radius.pill, paddingHorizontal: 10, paddingVertical: 6 },
  titleBlock: { gap: spacing.xs },
  condition: { alignSelf: 'flex-start', borderRadius: radius.pill, paddingHorizontal: 10, paddingVertical: 6 },
  rule: { height: StyleSheet.hairlineWidth },
  section: { gap: spacing.sm },
  longCopy: { lineHeight: 26 },
  locationCard: { borderRadius: radius.lg, padding: spacing.md, flexDirection: 'row', gap: spacing.md },
  locationIcon: { width: 48, height: 48, borderRadius: radius.md, alignItems: 'center', justifyContent: 'center' },
  sellerCard: { minHeight: 88, flexDirection: 'row', alignItems: 'center', gap: spacing.md, borderRadius: radius.lg, borderWidth: 1, padding: spacing.md },
  sellerCopy: { flex: 1, gap: 4 },
  sellerName: { flexDirection: 'row', gap: 6, alignItems: 'center' },
  rating: { flexDirection: 'row', gap: 4, alignItems: 'center', flexWrap: 'wrap' },
  safety: { borderRadius: radius.lg, padding: spacing.md, flexDirection: 'row', gap: spacing.sm },
  bottomCopy: { flex: 1, minWidth: 0 },
  bottomBar: { position: 'absolute', left: 0, right: 0, bottom: 0, minHeight: 86, paddingHorizontal: spacing.md, paddingVertical: spacing.sm, borderTopWidth: StyleSheet.hairlineWidth, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: spacing.md },
});
