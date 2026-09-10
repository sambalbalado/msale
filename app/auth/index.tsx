import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, TextInput, View } from 'react-native';

import { AppScreen } from '@/components/ui/AppScreen';
import { AppText } from '@/components/ui/AppText';
import { BrandMark } from '@/components/ui/BrandMark';
import { Button } from '@/components/ui/Button';
import { IconButton } from '@/components/ui/IconButton';
import { radius, spacing, typography } from '@/constants/theme';
import { usePalette } from '@/hooks/usePalette';
import { useI18n } from '@/lib/i18n';
import { useAuth } from '@/providers/AuthProvider';

export default function AuthScreen() {
  const router = useRouter();
  const palette = usePalette();
  const { t } = useI18n();
  const { configured, signIn, signUp } = useAuth();
  const [mode, setMode] = useState<'signIn' | 'signUp'>('signIn');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    if (!email.includes('@') || password.length < 8) {
      Alert.alert(t('sell.validation'), t('auth.validation'));
      return;
    }
    setLoading(true);
    try {
      if (mode === 'signIn') await signIn({ email: email.trim(), password });
      else {
        const confirmationRequired = await signUp({ email: email.trim(), password });
        if (confirmationRequired) Alert.alert(t('auth.checkEmail'));
      }
      router.back();
    } catch (error) {
      Alert.alert(t('common.retry'), error instanceof Error ? error.message : String(error));
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppScreen maxWidth={680}>
      <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
          <View style={styles.close}><IconButton icon="close" label={t('common.close')} onPress={() => router.back()} /></View>
          <LinearGradient colors={[palette.brandSoft, palette.amberSoft]} style={styles.art}>
            <View style={[styles.artCircleOne, { backgroundColor: palette.brand }]} />
            <View style={[styles.artCircleTwo, { borderColor: palette.sage }]} />
            <BrandMark />
            <MaterialIcons name="waving-hand" size={48} color={palette.brand} style={styles.wave} />
          </LinearGradient>
          <View style={styles.heading}>
            <AppText variant="caption" tone="brand" style={styles.eyebrow}>{t('auth.eyebrow')}</AppText>
            <AppText variant="h1">{t('auth.title')}</AppText>
            <AppText tone="muted">{t('auth.subtitle')}</AppText>
          </View>

          {!configured ? (
            <View style={[styles.notice, { backgroundColor: palette.amberSoft }]}>
              <MaterialIcons name="info-outline" size={21} color={palette.amber} />
              <AppText style={{ color: palette.amber, flex: 1 }}>{t('auth.demoNotice')}</AppText>
            </View>
          ) : (
            <View style={styles.form}>
              <View style={styles.field}><AppText variant="label">{t('auth.email')}</AppText><TextInput value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" autoComplete="email" placeholder="you@example.com" placeholderTextColor={palette.textMuted} selectionColor={palette.brand} style={[styles.input, { color: palette.text, backgroundColor: palette.surface, borderColor: palette.line }]} /></View>
              <View style={styles.field}><AppText variant="label">{t('auth.password')}</AppText><TextInput value={password} onChangeText={setPassword} secureTextEntry autoComplete={mode === 'signUp' ? 'new-password' : 'current-password'} placeholder="••••••••" placeholderTextColor={palette.textMuted} selectionColor={palette.brand} style={[styles.input, { color: palette.text, backgroundColor: palette.surface, borderColor: palette.line }]} /></View>
              <Button label={mode === 'signIn' ? t('auth.signIn') : t('auth.signUp')} loading={loading} fullWidth onPress={() => void submit()} />
              <Pressable onPress={() => setMode(mode === 'signIn' ? 'signUp' : 'signIn')} style={styles.switch}><AppText variant="label" tone="brand">{mode === 'signIn' ? t('auth.switchSignUp') : t('auth.switchSignIn')}</AppText></Pressable>
            </View>
          )}

          {!configured ? <Button label={t('common.continue')} onPress={() => router.back()} /> : null}
        </ScrollView>
      </KeyboardAvoidingView>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  content: { paddingTop: spacing.sm, paddingBottom: spacing.xl, gap: spacing.lg },
  close: { alignSelf: 'flex-end' },
  art: { height: 190, borderRadius: radius.xl, padding: spacing.lg, justifyContent: 'flex-end', overflow: 'hidden' },
  artCircleOne: { position: 'absolute', width: 128, height: 128, borderRadius: 64, right: -18, top: -28, opacity: 0.88 },
  artCircleTwo: { position: 'absolute', width: 104, height: 104, borderRadius: 52, borderWidth: 18, left: -24, bottom: -30, opacity: 0.6 },
  wave: { position: 'absolute', right: 34, bottom: 25, transform: [{ rotate: '-12deg' }] },
  heading: { gap: spacing.xs },
  eyebrow: { letterSpacing: 1.2 },
  notice: { borderRadius: radius.lg, padding: spacing.md, flexDirection: 'row', gap: spacing.sm },
  form: { gap: spacing.md },
  field: { gap: spacing.xs },
  input: { ...typography.body, minHeight: 54, borderRadius: radius.md, borderWidth: 1, paddingHorizontal: spacing.md },
  switch: { alignItems: 'center', padding: spacing.sm },
});
