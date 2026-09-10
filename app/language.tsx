import { useRouter } from 'expo-router';
import { Pressable, StyleSheet, View } from 'react-native';

import { AppScreen } from '@/components/ui/AppScreen';
import { AppText } from '@/components/ui/AppText';
import { IconButton } from '@/components/ui/IconButton';
import { radius, spacing } from '@/constants/theme';
import { usePalette } from '@/hooks/usePalette';
import { useI18n } from '@/lib/i18n';
import { LanguageCode } from '@/types/domain';

const choices: { code: LanguageCode; titleKey: string; subtitle: string }[] = [
  { code: 'en', titleKey: 'language.english', subtitle: 'English (Malaysia)' },
  { code: 'ms', titleKey: 'language.malay', subtitle: 'Bahasa Melayu' },
  { code: 'zh', titleKey: 'language.mandarin', subtitle: '简体中文' },
];

export default function LanguageScreen() {
  const router = useRouter();
  const palette = usePalette();
  const { language, setLanguage, t } = useI18n();
  return (
    <AppScreen maxWidth={640}>
      <View style={styles.header}><IconButton icon="close" label={t('common.close')} onPress={() => router.back()} /><AppText variant="h2" style={styles.title}>{t('language.title')}</AppText><View style={styles.spacer} /></View>
      <View style={styles.options}>
        {choices.map((choice) => {
          const selected = language === choice.code;
          return (
            <Pressable key={choice.code} onPress={() => void setLanguage(choice.code)} style={({ pressed }) => [styles.option, { backgroundColor: selected ? palette.brandSoft : palette.surface, borderColor: selected ? palette.brand : palette.line }, pressed && { opacity: 0.7 }]}>
              <View style={styles.optionCopy}><AppText variant="h3">{t(choice.titleKey)}</AppText><AppText tone="muted">{choice.subtitle}</AppText></View>
              <View style={[styles.radio, { borderColor: selected ? palette.brand : palette.line }]}>{selected ? <View style={[styles.radioFill, { backgroundColor: palette.brand }]} /> : null}</View>
            </Pressable>
          );
        })}
      </View>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  header: { height: 72, flexDirection: 'row', alignItems: 'center' },
  title: { flex: 1, textAlign: 'center' },
  spacer: { width: 46 },
  options: { gap: spacing.sm, paddingTop: spacing.lg },
  option: { minHeight: 84, borderRadius: radius.lg, borderWidth: 1, padding: spacing.md, flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  optionCopy: { flex: 1, gap: 3 },
  radio: { width: 24, height: 24, borderRadius: 12, borderWidth: 2, alignItems: 'center', justifyContent: 'center' },
  radioFill: { width: 12, height: 12, borderRadius: 6 },
});
