import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Image } from 'expo-image';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useRef, useState } from 'react';
import { FlatList, KeyboardAvoidingView, Platform, Pressable, StyleSheet, TextInput, View } from 'react-native';

import { AppScreen } from '@/components/ui/AppScreen';
import { AppText } from '@/components/ui/AppText';
import { Avatar } from '@/components/ui/Avatar';
import { IconButton } from '@/components/ui/IconButton';
import { radius, spacing, typography } from '@/constants/theme';
import { useConversations, useMessages, useSendMessage } from '@/hooks/useMarketplace';
import { usePalette } from '@/hooks/usePalette';
import { formatPrice } from '@/lib/format';
import { useI18n } from '@/lib/i18n';
import { useAuth } from '@/providers/AuthProvider';
import { Message } from '@/types/domain';

export default function ChatScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const palette = usePalette();
  const { language, t } = useI18n();
  const { profile } = useAuth();
  const conversations = useConversations();
  const messages = useMessages(id);
  const sendMessage = useSendMessage(id);
  const conversation = conversations.data?.find((item) => item.id === id);
  const [draft, setDraft] = useState('');
  const listRef = useRef<FlatList<Message>>(null);

  const send = async () => {
    const body = draft.trim();
    if (!body || sendMessage.isPending) return;
    setDraft('');
    await sendMessage.mutateAsync(body);
    requestAnimationFrame(() => listRef.current?.scrollToEnd({ animated: true }));
  };

  return (
    <AppScreen edges={['top', 'bottom']} maxWidth={760}>
      <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <View style={[styles.header, { borderBottomColor: palette.line }]}>
          <IconButton icon="arrow-back" label={t('common.back')} onPress={() => router.back()} />
          <Avatar uri={conversation?.otherUser.avatarUrl} name={conversation?.otherUser.displayName ?? 'M'} size={42} />
          <View style={styles.headerCopy}><AppText variant="bodyStrong" numberOfLines={1}>{conversation?.otherUser.displayName ?? t('nav.inbox')}</AppText><AppText variant="caption" tone="sage">{t('chat.quickReply')}</AppText></View>
          <IconButton icon="more-horiz" label={t('common.more')} />
        </View>

        {conversation ? (
          <Pressable onPress={() => router.push({ pathname: '/listing/[id]', params: { id: conversation.listing.id } })} style={[styles.listingStrip, { backgroundColor: palette.surfaceMuted }]}>
            <Image source={{ uri: conversation.listing.imageUrls[0] }} style={styles.listingImage} contentFit="cover" />
            <View style={styles.headerCopy}><AppText variant="label" numberOfLines={1}>{conversation.listing.title}</AppText><AppText variant="bodyStrong" tone="brand">{formatPrice(conversation.listing.price, language)}</AppText></View>
            <MaterialIcons name="chevron-right" size={22} color={palette.textMuted} />
          </Pressable>
        ) : null}

        <View style={[styles.safety, { backgroundColor: palette.sageSoft }]}><MaterialIcons name="shield" size={16} color={palette.sage} /><AppText variant="caption" tone="sage">{t('chat.safety')}</AppText></View>

        <FlatList
          ref={listRef}
          data={messages.data ?? []}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.messages}
          showsVerticalScrollIndicator={false}
          onContentSizeChange={() => listRef.current?.scrollToEnd({ animated: false })}
          renderItem={({ item }) => <MessageBubble message={item} mine={item.senderId === profile?.id} />}
        />

        <View style={[styles.composer, { borderTopColor: palette.line, backgroundColor: palette.background }]}>
          <Pressable style={[styles.addButton, { backgroundColor: palette.surfaceMuted }]}><MaterialIcons name="add" size={23} color={palette.text} /></Pressable>
          <TextInput
            value={draft}
            onChangeText={setDraft}
            placeholder={t('chat.placeholder')}
            placeholderTextColor={palette.textMuted}
            selectionColor={palette.brand}
            multiline
            maxLength={2000}
            style={[styles.input, { color: palette.text, backgroundColor: palette.surface, borderColor: palette.line }]}
          />
          <Pressable accessibilityLabel={t('common.send')} onPress={() => void send()} style={[styles.send, { backgroundColor: draft.trim() ? palette.brand : palette.surfaceMuted }]}>
            <MaterialIcons name="arrow-upward" size={22} color={draft.trim() ? palette.white : palette.textMuted} />
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </AppScreen>
  );
}

function MessageBubble({ message, mine }: { message: Message; mine: boolean }) {
  const palette = usePalette();
  const time = new Intl.DateTimeFormat(undefined, { hour: 'numeric', minute: '2-digit' }).format(new Date(message.createdAt));
  return (
    <View style={[styles.bubbleRow, mine && styles.bubbleRowMine]}>
      <View style={[styles.bubble, mine ? { backgroundColor: palette.brand } : { backgroundColor: palette.surface, borderColor: palette.line, borderWidth: 1 }]}>
        <AppText style={{ color: mine ? palette.white : palette.text }}>{message.body}</AppText>
        <AppText variant="caption" style={{ color: mine ? 'rgba(255,255,255,0.72)' : palette.textMuted, alignSelf: 'flex-end' }}>{time}</AppText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  header: { minHeight: 64, flexDirection: 'row', alignItems: 'center', gap: spacing.sm, borderBottomWidth: StyleSheet.hairlineWidth },
  headerCopy: { flex: 1, minWidth: 0 },
  listingStrip: { borderRadius: radius.md, marginTop: spacing.sm, padding: spacing.xs, flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  listingImage: { width: 50, height: 50, borderRadius: radius.sm },
  safety: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, marginTop: spacing.xs, borderRadius: radius.pill, paddingHorizontal: spacing.sm, paddingVertical: 7, alignSelf: 'center' },
  messages: { flexGrow: 1, justifyContent: 'flex-end', paddingVertical: spacing.lg, gap: spacing.xs },
  bubbleRow: { alignItems: 'flex-start' },
  bubbleRowMine: { alignItems: 'flex-end' },
  bubble: { maxWidth: '82%', borderRadius: radius.lg, paddingHorizontal: spacing.md, paddingVertical: 10, gap: 3 },
  composer: { flexDirection: 'row', alignItems: 'flex-end', gap: spacing.xs, paddingVertical: spacing.sm, borderTopWidth: StyleSheet.hairlineWidth },
  addButton: { width: 42, height: 42, borderRadius: 21, alignItems: 'center', justifyContent: 'center' },
  input: { ...typography.body, flex: 1, minHeight: 44, maxHeight: 116, borderRadius: 22, borderWidth: 1, paddingHorizontal: spacing.md, paddingTop: 10, paddingBottom: 10 },
  send: { width: 42, height: 42, borderRadius: 21, alignItems: 'center', justifyContent: 'center' },
});
