import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';

import { ListingGrid } from '@/components/marketplace/ListingGrid';
import { AppScreen } from '@/components/ui/AppScreen';
import { AppText } from '@/components/ui/AppText';
import { Chip } from '@/components/ui/Chip';
import { EmptyState } from '@/components/ui/EmptyState';
import { SearchField } from '@/components/ui/SearchField';
import { CATEGORY_META, MALAYSIAN_STATES } from '@/data/mock';
import { spacing } from '@/constants/theme';
import { useListings, useToggleFavorite } from '@/hooks/useMarketplace';
import { useI18n } from '@/lib/i18n';
import { useAuth } from '@/providers/AuthProvider';
import { CategorySlug, Listing, ListingCondition } from '@/types/domain';

export default function SearchScreen() {
  const router = useRouter();
  const { t } = useI18n();
  const { isAuthenticated } = useAuth();
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState<CategorySlug | 'all'>('all');
  const [condition, setCondition] = useState<ListingCondition | 'all'>('all');
  const [state, setState] = useState<string | undefined>();
  const [sort, setSort] = useState<'newest' | 'nearby' | 'price_low' | 'price_high'>('newest');
  const filters = useMemo(() => ({ query, category, condition, state, sort }), [category, condition, query, sort, state]);
  const listings = useListings(filters);
  const favorite = useToggleFavorite();

  const header = (
    <View style={styles.header}>
      <View style={styles.titleRow}>
        <View style={styles.titleCopy}>
          <AppText variant="h1">{t('search.title')}</AppText>
          <AppText tone="muted">{t('search.results', { count: listings.data?.length ?? 0 })}</AppText>
        </View>
        <MaterialIcons name="travel-explore" size={32} color="#F15A3A" />
      </View>
      <SearchField placeholder={t('search.placeholder')} value={query} onChangeText={setQuery} />

      <View style={styles.filterGroup}>
        <AppText variant="caption" tone="muted" style={styles.filterLabel}>{t('search.category').toUpperCase()}</AppText>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chips}>
          <Chip label={t('search.all')} selected={category === 'all'} onPress={() => setCategory('all')} />
          {CATEGORY_META.map((item) => <Chip key={item.slug} label={t(`category.${item.slug}`)} selected={category === item.slug} onPress={() => setCategory(item.slug)} />)}
        </ScrollView>
      </View>

      <View style={styles.filterGroup}>
        <AppText variant="caption" tone="muted" style={styles.filterLabel}>{t('search.condition').toUpperCase()}</AppText>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chips}>
          {(['all', 'new', 'like_new', 'good', 'fair'] as const).map((item) => <Chip key={item} label={item === 'all' ? t('search.all') : t(`condition.${item}`)} selected={condition === item} onPress={() => setCondition(item)} />)}
        </ScrollView>
      </View>

      <View style={styles.filterGroup}>
        <AppText variant="caption" tone="muted" style={styles.filterLabel}>{t('search.location').toUpperCase()}</AppText>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chips}>
          <Chip label={t('search.all')} selected={!state} onPress={() => setState(undefined)} />
          {MALAYSIAN_STATES.slice(0, 8).map((item) => <Chip key={item} label={item} selected={state === item} onPress={() => setState(item)} />)}
        </ScrollView>
      </View>

      <View style={styles.filterGroup}>
        <AppText variant="caption" tone="muted" style={styles.filterLabel}>{t('search.sort').toUpperCase()}</AppText>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chips}>
          {([
            ['newest', t('search.newest')], ['nearby', t('search.nearby')], ['price_low', t('search.priceLow')], ['price_high', t('search.priceHigh')],
          ] as const).map(([value, label]) => <Chip key={value} label={label} selected={sort === value} onPress={() => setSort(value)} />)}
        </ScrollView>
      </View>
    </View>
  );

  return (
    <AppScreen>
      <ListingGrid
        listings={listings.data ?? []}
        onPress={(listing) => router.push({ pathname: '/listing/[id]', params: { id: listing.id } })}
        onToggleFavorite={(listing: Listing) => {
          if (!isAuthenticated) return router.push('/auth');
          favorite.mutate({ listingId: listing.id, nextValue: !listing.isFavorite });
        }}
        ListHeaderComponent={header}
        ListEmptyComponent={<EmptyState icon="search-off" title={t('discover.noResults')} body={t('discover.noResultsBody')} action={t('common.retry')} onAction={() => { setQuery(''); setCategory('all'); setCondition('all'); setState(undefined); }} />}
      />
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  header: { paddingTop: spacing.lg, paddingBottom: spacing.lg, gap: spacing.lg },
  titleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', gap: spacing.md },
  titleCopy: { flex: 1, gap: spacing.xs },
  filterGroup: { gap: spacing.xs },
  filterLabel: { letterSpacing: 1.1 },
  chips: { gap: spacing.xs, paddingRight: spacing.md },
});

