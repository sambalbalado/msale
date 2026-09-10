import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useRouter } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';

import { ListingCard } from '@/components/marketplace/ListingCard';
import { AppScreen } from '@/components/ui/AppScreen';
import { AppText } from '@/components/ui/AppText';
import { Avatar } from '@/components/ui/Avatar';
import { Button } from '@/components/ui/Button';
import { radius, shadow, spacing } from '@/constants/theme';
import { useListings, useToggleFavorite } from '@/hooks/useMarketplace';
import { usePalette } from '@/hooks/usePalette';
import { useI18n } from '@/lib/i18n';
import { useAuth } from '@/providers/AuthProvider';

export default function ProfileScreen() {
  const palette = usePalette();
  const router = useRouter();
  const { t } = useI18n();
  const { profile, configured, isAuthenticated, signOut } = useAuth();
  const listings = useListings();
  const favorite = useToggleFavorite();
  const saved = (listings.data ?? []).filter((listing) => listing.isFavorite);

  if (!isAuthenticated || !profile) {
    return (
      <AppScreen contentStyle={styles.gate}>
        <View style={[styles.gateIcon, { backgroundColor: palette.brandSoft }]}><MaterialIcons name="person-outline" size={38} color={palette.brand} /></View>
        <AppText variant="h1" style={styles.center}>{t('auth.title')}</AppText>
        <AppText tone="muted" style={styles.center}>{t('auth.subtitle')}</AppText>
        <Button label={t('profile.signIn')} onPress={() => router.push('/auth')} />
      </AppScreen>
    );
  }

  return (
    <AppScreen>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        <View style={styles.profileHeader}>
          <View style={styles.avatarWrap}>
            <Avatar uri={profile.avatarUrl} name={profile.displayName} size={88} />
            {profile.verified ? <View style={[styles.verified, { backgroundColor: palette.sage, borderColor: palette.background }]}><MaterialIcons name="check" size={15} color={palette.white} /></View> : null}
          </View>
          <View style={styles.profileCopy}>
            <View style={styles.nameRow}><AppText variant="h1">{profile.displayName}</AppText>{!configured ? <View style={[styles.demoBadge, { backgroundColor: palette.amberSoft }]}><AppText variant="caption" style={{ color: palette.amber }}>{t('common.demo')}</AppText></View> : null}</View>
            <AppText tone="muted">{profile.bio}</AppText>
            <AppText variant="caption" tone="muted">{t('profile.memberSince', { year: new Date(profile.joinedAt).getFullYear() })} · {profile.state}</AppText>
          </View>
        </View>

        <View style={[styles.stats, { backgroundColor: palette.surface, borderColor: palette.line }, shadow]}>
          <Stat value={profile.rating.toFixed(1)} label={t('profile.rating')} icon="star" />
          <View style={[styles.divider, { backgroundColor: palette.line }]} />
          <Stat value={`${profile.responseRate ?? 0}%`} label={t('profile.responses')} icon="bolt" />
          <View style={[styles.divider, { backgroundColor: palette.line }]} />
          <Stat value={String(profile.reviewCount)} label={t('profile.reviews')} icon="reviews" />
        </View>

        <View style={styles.section}>
          <View style={styles.sectionTitle}><AppText variant="h2">{t('profile.saved')}</AppText><AppText variant="label" tone="muted">{saved.length}</AppText></View>
          {saved.length ? (
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.savedRow}>
              {saved.map((listing) => <ListingCard key={listing.id} listing={listing} style={styles.savedCard} onPress={() => router.push({ pathname: '/listing/[id]', params: { id: listing.id } })} onToggleFavorite={() => favorite.mutate({ listingId: listing.id, nextValue: false })} />)}
            </ScrollView>
          ) : <AppText tone="muted">{t('discover.noResultsBody')}</AppText>}
        </View>

        <View style={[styles.menu, { backgroundColor: palette.surface, borderColor: palette.line }]}>
          <MenuRow icon="language" label={t('profile.language')} onPress={() => router.push('/language')} />
          <MenuRow icon="inventory-2" label={t('profile.listings')} />
          <MenuRow icon="shield" label={t('profile.help')} />
          <MenuRow icon="settings" label={t('profile.settings')} last />
        </View>

        {configured ? <Button label={t('profile.signOut')} variant="ghost" onPress={() => void signOut()} /> : null}
      </ScrollView>
    </AppScreen>
  );
}

function Stat({ value, label, icon }: { value: string; label: string; icon: React.ComponentProps<typeof MaterialIcons>['name'] }) {
  const palette = usePalette();
  return <View style={styles.stat}><MaterialIcons name={icon} size={19} color={palette.brand} /><AppText variant="h3">{value}</AppText><AppText variant="caption" tone="muted">{label}</AppText></View>;
}

function MenuRow({ icon, label, onPress, last }: { icon: React.ComponentProps<typeof MaterialIcons>['name']; label: string; onPress?: () => void; last?: boolean }) {
  const palette = usePalette();
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.menuRow, !last && { borderBottomColor: palette.line, borderBottomWidth: StyleSheet.hairlineWidth }, pressed && { opacity: 0.6 }]}>
      <View style={[styles.menuIcon, { backgroundColor: palette.surfaceMuted }]}><MaterialIcons name={icon} size={21} color={palette.text} /></View>
      <AppText variant="bodyStrong" style={styles.flex}>{label}</AppText>
      <MaterialIcons name="chevron-right" size={22} color={palette.textMuted} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  content: { paddingTop: spacing.lg, paddingBottom: 140, gap: spacing.xl },
  profileHeader: { flexDirection: 'row', alignItems: 'center', gap: spacing.lg },
  avatarWrap: { position: 'relative' },
  verified: { position: 'absolute', right: -2, bottom: 2, width: 25, height: 25, borderRadius: 13, borderWidth: 3, alignItems: 'center', justifyContent: 'center' },
  profileCopy: { flex: 1, gap: 6 },
  nameRow: { flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap', gap: spacing.xs },
  demoBadge: { borderRadius: radius.pill, paddingHorizontal: 9, paddingVertical: 5 },
  stats: { flexDirection: 'row', alignItems: 'stretch', borderRadius: radius.lg, borderWidth: 1, paddingVertical: spacing.md },
  stat: { flex: 1, alignItems: 'center', gap: 2 },
  divider: { width: StyleSheet.hairlineWidth },
  section: { gap: spacing.md },
  sectionTitle: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs },
  savedRow: { gap: spacing.sm, paddingRight: spacing.md },
  savedCard: { width: 210 },
  menu: { borderRadius: radius.lg, borderWidth: 1, overflow: 'hidden' },
  menuRow: { minHeight: 66, flexDirection: 'row', alignItems: 'center', gap: spacing.md, paddingHorizontal: spacing.md },
  menuIcon: { width: 38, height: 38, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  flex: { flex: 1 },
  gate: { alignItems: 'center', justifyContent: 'center', gap: spacing.md, paddingHorizontal: spacing.xl },
  gateIcon: { width: 76, height: 76, borderRadius: radius.xl, alignItems: 'center', justifyContent: 'center' },
  center: { textAlign: 'center', maxWidth: 430 },
});
