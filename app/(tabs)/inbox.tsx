import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { FlatList, Pressable, StyleSheet, View } from 'react-native';

import { AppScreen } from '@/components/ui/AppScreen';
import { AppText } from '@/components/ui/AppText';
import { Avatar } from '@/components/ui/Avatar';
import { EmptyState } from '@/components/ui/EmptyState';
import { radius, spacing } from '@/constants/theme';
import { useConversations } from '@/hooks/useMarketplace';
import { usePalette } from '@/hooks/usePalette';
import { formatPrice, formatRelativeDate } from '@/lib/format';
import { useI18n } from '@/lib/i18n';
import { useAuth } from '@/providers/AuthProvider';
import { Conversation } from '@/types/domain';

export default function InboxScreen() {
  const palette = usePalette();
  const router = useRouter();
  const { language, t } = useI18n();
  const { isAuthenticated } = useAuth();
  const conversations = useConversations();

  if (!isAuthenticated) {
    return <AppScreen contentStyle={styles.gate}><EmptyState icon="forum" title={t('inbox.empty')} body={t('auth.subtitle')} action={t('profile.signIn')} onAction={() => router.push('/auth')} /></AppScreen>;
  }

  return (
    <AppScreen>
      <FlatList
        data={conversations.data ?? []}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
        ListHeaderComponent={<View style={styles.header}><AppText variant="h1">{t('inbox.title')}</AppText><AppText tone="muted">{t('inbox.subtitle')}</AppText></View>}
        ListEmptyComponent={<EmptyState icon="mark-chat-unread" title={t('inbox.empty')} body={t('inbox.emptyBody')} action={t('discover.heroAction')} onAction={() => router.push('/(tabs)/search')} />}
        ItemSeparatorComponent={() => <View style={[styles.separator, { backgroundColor: palette.line }]} />}
        renderItem={({ item }) => <ConversationRow conversation={item} onPress={() => router.push({ pathname: '/chat/[id]', params: { id: item.id } })} language={language} />}
      />
    </AppScreen>
  );
}

function ConversationRow({ conversation, onPress, language }: { conversation: Conversation; onPress: () => void; language: 'en' | 'ms' | 'zh' }) {
  const palette = usePalette();
  const { t } = useI18n();
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.row, pressed && { opacity: 0.66 }]}>
      <View>
        <Image source={{ uri: conversation.listing.imageUrls[0] }} style={styles.listingImage} contentFit="cover" />
        <View style={[styles.avatarFloat, { borderColor: palette.background }]}><Avatar uri={conversation.otherUser.avatarUrl} name={conversation.otherUser.displayName} size={30} /></View>
      </View>
      <View style={styles.rowCopy}>
        <View style={styles.nameRow}>
          <AppText variant="bodyStrong" numberOfLines={1} style={styles.flex}>{conversation.otherUser.displayName}</AppText>
          <AppText variant="caption" tone="muted">{formatRelativeDate(conversation.updatedAt, language)}</AppText>
        </View>
        <AppText variant="label" numberOfLines={1}>{conversation.listing.title} · {formatPrice(conversation.listing.price, language)}</AppText>
        <AppText tone="muted" numberOfLines={1}>{conversation.lastMessage || t('chat.startConversation')}</AppText>
      </View>
      {conversation.unreadCount > 0 ? <View style={[styles.unread, { backgroundColor: palette.brand }]}><AppText variant="caption" tone="inverse">{conversation.unreadCount}</AppText></View> : <MaterialIcons name="chevron-right" size={22} color={palette.textMuted} />}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  content: { paddingTop: spacing.lg, paddingBottom: 120 },
  header: { gap: spacing.xs, paddingBottom: spacing.xl },
  row: { minHeight: 104, flexDirection: 'row', alignItems: 'center', gap: spacing.md, paddingVertical: spacing.md },
  listingImage: { width: 72, height: 82, borderRadius: radius.md, backgroundColor: '#E9E0D2' },
  avatarFloat: { position: 'absolute', right: -7, bottom: -5, borderWidth: 3, borderRadius: 18 },
  rowCopy: { flex: 1, gap: 4, minWidth: 0 },
  nameRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs },
  flex: { flex: 1 },
  unread: { minWidth: 23, height: 23, borderRadius: 12, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 6 },
  separator: { height: StyleSheet.hairlineWidth, marginLeft: 88 },
  gate: { justifyContent: 'center' },
});
