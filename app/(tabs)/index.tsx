import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, View } from 'react-native';

import { CategoryRail } from '@/components/marketplace/CategoryRail';
import { ListingGrid } from '@/components/marketplace/ListingGrid';
import { AppScreen } from '@/components/ui/AppScreen';
import { AppText } from '@/components/ui/AppText';
import { Avatar } from '@/components/ui/Avatar';
import { BrandMark } from '@/components/ui/BrandMark';
import { EmptyState } from '@/components/ui/EmptyState';
import { SearchField } from '@/components/ui/SearchField';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { radius, spacing } from '@/constants/theme';
import { useListings, useToggleFavorite } from '@/hooks/useMarketplace';
import { usePalette } from '@/hooks/usePalette';
import { useI18n } from '@/lib/i18n';
import { useAuth } from '@/providers/AuthProvider';
import { CategorySlug, Listing } from '@/types/domain';

export default function DiscoverScreen() {
  const palette = usePalette();
  const router = useRouter();
  const { t } = useI18n();
  const { profile, isAuthenticated } = useAuth();
  const [category, setCategory] = useState<CategorySlug | 'all'>('all');
  const filters = useMemo(() => ({ category, sort: 'newest' as const }), [category]);
  const listings = useListings(filters);
  const favorite = useToggleFavorite();

  const openListing = (listing: Listing) => router.push({ pathname: '/listing/[id]', params: { id: listing.id } });
  const toggleFavorite = (listing: Listing) => {
    if (!isAuthenticated) return router.push('/auth');
    favorite.mutate({ listingId: listing.id, nextValue: !listing.isFavorite });
  };

  const header = (
    <View style={styles.header}>
      <View style={styles.topRow}>
        <BrandMark />
        <Pressable onPress={() => router.push('/(tabs)/profile')} accessibilityLabel={t('nav.profile')}>
          <Avatar uri={profile?.avatarUrl} name={profile?.displayName ?? 'Guest'} size={42} />
        </Pressable>
      </View>

      <View style={styles.intro}>
        <AppText variant="caption" tone="brand" style={styles.eyebrow}>{t('discover.eyebrow')}</AppText>
        <AppText variant="display" style={styles.display}>{t('discover.greeting')}</AppText>
        <View style={styles.locationRow}>
          <MaterialIcons name="near-me" size={17} color={palette.sage} />
          <AppText variant="label" tone="sage">{t('discover.location', { location: profile?.state ?? 'Malaysia' })}</AppText>
        </View>
      </View>

      <SearchField placeholder={t('discover.search')} onPress={() => router.push('/(tabs)/search')} />

      <LinearGradient colors={[palette.brand, '#D6452E']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.hero}>
        <View style={styles.heroCircleLarge} />
        <View style={styles.heroCircleSmall} />
        <View style={styles.heroCopy}>
          <View style={styles.heroIcon}><MaterialIcons name="handshake" size={24} color={palette.brand} /></View>
          <AppText variant="h2" tone="inverse" style={styles.heroTitle}>{t('discover.heroTitle')}</AppText>
          <AppText tone="inverse" style={styles.heroBody}>{t('discover.heroBody')}</AppText>
          <Pressable onPress={() => router.push('/(tabs)/search')} style={styles.heroAction}>
            <AppText variant="label" style={{ color: palette.text }}>{t('discover.heroAction')}</AppText>
            <MaterialIcons name="arrow-forward" size={18} color={palette.text} />
          </Pressable>
        </View>
      </LinearGradient>

      <SectionHeading title={t('discover.categories')} />
      <CategoryRail selected={category} onSelect={(next) => setCategory(category === next ? 'all' : next)} />
      <SectionHeading title={t('discover.fresh')} subtitle={t('discover.freshSubtitle')} action={t('common.viewAll')} onAction={() => router.push('/(tabs)/search')} />
    </View>
  );

  return (
    <AppScreen>
      {listings.isLoading ? <View style={styles.loading}>{header}<ActivityIndicator size="large" color={palette.brand} /></View> : (
        <ListingGrid
          listings={listings.data ?? []}
          onPress={openListing}
          onToggleFavorite={toggleFavorite}
          ListHeaderComponent={header}
          ListEmptyComponent={<EmptyState icon="storefront" title={t('discover.noResults')} body={t('discover.noResultsBody')} action={t('common.viewAll')} onAction={() => setCategory('all')} />}
        />
      )}
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  header: { gap: spacing.lg, paddingTop: spacing.sm, paddingBottom: spacing.lg },
  topRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  intro: { gap: spacing.xs, marginTop: spacing.sm, maxWidth: 720 },
  eyebrow: { letterSpacing: 1.3 },
  display: { maxWidth: 680 },
  locationRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: spacing.xs },
  hero: { borderRadius: radius.xl, padding: spacing.lg, overflow: 'hidden', minHeight: 230, justifyContent: 'center' },
  heroCopy: { maxWidth: 490, gap: spacing.sm, zIndex: 1 },
  heroIcon: { width: 44, height: 44, borderRadius: 16, alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(255,255,255,0.92)' },
  heroTitle: { marginTop: 2 },
  heroBody: { opacity: 0.88, maxWidth: 450 },
  heroAction: { marginTop: spacing.xs, height: 44, alignSelf: 'flex-start', flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: spacing.md, borderRadius: radius.pill, backgroundColor: '#FFFDF9' },
  heroCircleLarge: { position: 'absolute', width: 250, height: 250, borderRadius: 125, backgroundColor: 'rgba(255,255,255,0.09)', right: -45, top: -80 },
  heroCircleSmall: { position: 'absolute', width: 120, height: 120, borderRadius: 60, backgroundColor: 'rgba(255,255,255,0.08)', right: 75, bottom: -65 },
  loading: { flex: 1, gap: spacing.xl },
});
