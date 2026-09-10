import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { zodResolver } from '@hookform/resolvers/zod';
import { Image } from 'expo-image';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import { PropsWithChildren, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Alert, KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, TextInput, View } from 'react-native';
import { z } from 'zod';

import { AppScreen } from '@/components/ui/AppScreen';
import { AppText } from '@/components/ui/AppText';
import { Button } from '@/components/ui/Button';
import { Chip } from '@/components/ui/Chip';
import { CATEGORY_META, MALAYSIAN_STATES } from '@/data/mock';
import { radius, spacing, typography } from '@/constants/theme';
import { useCreateListing } from '@/hooks/useMarketplace';
import { usePalette } from '@/hooks/usePalette';
import { useI18n } from '@/lib/i18n';
import { useAuth } from '@/providers/AuthProvider';
import { CategorySlug, ListingCondition } from '@/types/domain';

const listingSchema = z.object({
  title: z.string().trim().min(5).max(80),
  description: z.string().trim().min(20).max(2000),
  price: z.string().trim().refine((value) => Number(value) > 0 && Number(value) <= 1_000_000),
  category: z.enum(['furniture', 'electronics', 'fashion', 'vehicles', 'hobbies', 'home', 'sports', 'other']),
  condition: z.enum(['new', 'like_new', 'good', 'fair']),
  state: z.string().min(2),
  area: z.string().trim().min(2).max(80),
  meetupNotes: z.string().trim().max(240),
});

type ListingForm = z.infer<typeof listingSchema>;

export default function SellScreen() {
  const palette = usePalette();
  const router = useRouter();
  const { t } = useI18n();
  const { isAuthenticated } = useAuth();
  const createListing = useCreateListing();
  const { control, handleSubmit, reset, formState: { errors } } = useForm<ListingForm>({
    resolver: zodResolver(listingSchema),
    defaultValues: {
      title: '', description: '', price: '', category: 'furniture', condition: 'good',
      state: 'Selangor', area: '', meetupNotes: '',
    },
  });
  const [imageUris, setImageUris] = useState<string[]>([]);

  if (!isAuthenticated) {
    return (
      <AppScreen contentStyle={styles.authGate}>
        <View style={[styles.gateIcon, { backgroundColor: palette.brandSoft }]}><MaterialIcons name="add-a-photo" size={36} color={palette.brand} /></View>
        <AppText variant="h1" style={styles.center}>{t('sell.title')}</AppText>
        <AppText tone="muted" style={styles.center}>{t('auth.subtitle')}</AppText>
        <Button label={t('profile.signIn')} onPress={() => router.push('/auth')} />
      </AppScreen>
    );
  }

  const pickImages = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'], allowsMultipleSelection: true, selectionLimit: 8, quality: 0.86,
    });
    if (!result.canceled) setImageUris((current) => [...current, ...result.assets.map((asset) => asset.uri)].slice(0, 8));
  };

  const onSubmit = handleSubmit(async (values) => {
    try {
      const listing = await createListing.mutateAsync({ ...values, price: Number(values.price), imageUris });
      reset();
      setImageUris([]);
      Alert.alert(t('sell.success'), t('sell.successBody'), [{ text: t('common.done'), onPress: () => router.push({ pathname: '/listing/[id]', params: { id: listing.id } }) }]);
    } catch (error) {
      Alert.alert(t('common.retry'), error instanceof Error ? error.message : String(error));
    }
  }, () => Alert.alert(t('sell.validation')));

  return (
    <AppScreen>
      <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined} keyboardVerticalOffset={90}>
        <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled" contentContainerStyle={styles.content}>
          <View style={styles.heading}>
            <AppText variant="caption" tone="brand" style={styles.eyebrow}>{t('sell.eyebrow')}</AppText>
            <AppText variant="h1">{t('sell.title')}</AppText>
            <AppText tone="muted">{t('sell.subtitle')}</AppText>
          </View>

          <FormSection title={t('sell.photos')} subtitle={t('sell.photosHint')}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.photoRow}>
              <Pressable onPress={pickImages} style={({ pressed }) => [styles.photoPicker, { borderColor: palette.brand, backgroundColor: palette.brandSoft }, pressed && styles.pressed]}>
                <MaterialIcons name="add-a-photo" size={26} color={palette.brand} />
                <AppText variant="caption" tone="brand" style={styles.center}>{t('sell.addPhotos')}</AppText>
              </Pressable>
              {imageUris.map((uri, index) => (
                <View key={`${uri}-${index}`} style={styles.photoWrap}>
                  <Image source={{ uri }} style={styles.photo} contentFit="cover" />
                  <Pressable onPress={() => setImageUris((current) => current.filter((_, itemIndex) => itemIndex !== index))} style={styles.removePhoto} accessibilityLabel={t('common.close')}>
                    <MaterialIcons name="close" size={17} color="#FFFFFF" />
                  </Pressable>
                </View>
              ))}
            </ScrollView>
          </FormSection>

          <FormSection title={t('sell.details')}>
            <Controller control={control} name="title" render={({ field: { value, onChange, onBlur } }) => (
              <FormField label={t('sell.titleLabel')} error={Boolean(errors.title)}>
                <TextInput value={value} onChangeText={onChange} onBlur={onBlur} placeholder={t('sell.titlePlaceholder')} placeholderTextColor={palette.textMuted} selectionColor={palette.brand} style={[styles.input, { color: palette.text, borderColor: errors.title ? palette.danger : palette.line, backgroundColor: palette.surface }]} />
              </FormField>
            )} />
            <Controller control={control} name="description" render={({ field: { value, onChange, onBlur } }) => (
              <FormField label={t('sell.descriptionLabel')} error={Boolean(errors.description)}>
                <TextInput value={value} onChangeText={onChange} onBlur={onBlur} multiline textAlignVertical="top" placeholder={t('sell.descriptionPlaceholder')} placeholderTextColor={palette.textMuted} selectionColor={palette.brand} style={[styles.input, styles.textarea, { color: palette.text, borderColor: errors.description ? palette.danger : palette.line, backgroundColor: palette.surface }]} />
              </FormField>
            )} />
            <Controller control={control} name="price" render={({ field: { value, onChange, onBlur } }) => (
              <FormField label={t('sell.priceLabel')} error={Boolean(errors.price)}>
                <View style={[styles.priceInput, { borderColor: errors.price ? palette.danger : palette.line, backgroundColor: palette.surface }]}>
                  <AppText variant="bodyStrong">RM</AppText>
                  <TextInput value={value} onChangeText={onChange} onBlur={onBlur} keyboardType="decimal-pad" placeholder="0" placeholderTextColor={palette.textMuted} selectionColor={palette.brand} style={[styles.priceText, { color: palette.text }]} />
                </View>
              </FormField>
            )} />

            <Controller control={control} name="category" render={({ field: { value, onChange } }) => (
              <FormField label={t('sell.categoryLabel')} error={Boolean(errors.category)}>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipRow}>
                  {CATEGORY_META.map((item) => <Chip key={item.slug} label={t(`category.${item.slug}`)} selected={value === item.slug} onPress={() => onChange(item.slug as CategorySlug)} />)}
                </ScrollView>
              </FormField>
            )} />

            <Controller control={control} name="condition" render={({ field: { value, onChange } }) => (
              <FormField label={t('sell.conditionLabel')} error={Boolean(errors.condition)}>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipRow}>
                  {(['new', 'like_new', 'good', 'fair'] as ListingCondition[]).map((item) => <Chip key={item} label={t(`condition.${item}`)} selected={value === item} onPress={() => onChange(item)} />)}
                </ScrollView>
              </FormField>
            )} />
          </FormSection>

          <FormSection title={t('sell.meetup')}>
            <Controller control={control} name="state" render={({ field: { value, onChange } }) => (
              <FormField label={t('sell.stateLabel')} error={Boolean(errors.state)}>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipRow}>
                  {MALAYSIAN_STATES.map((item) => <Chip key={item} label={item} selected={value === item} onPress={() => onChange(item)} />)}
                </ScrollView>
              </FormField>
            )} />
            <Controller control={control} name="area" render={({ field: { value, onChange, onBlur } }) => (
              <FormField label={t('sell.areaLabel')} error={Boolean(errors.area)}>
                <TextInput value={value} onChangeText={onChange} onBlur={onBlur} placeholder={t('sell.areaPlaceholder')} placeholderTextColor={palette.textMuted} selectionColor={palette.brand} style={[styles.input, { color: palette.text, borderColor: errors.area ? palette.danger : palette.line, backgroundColor: palette.surface }]} />
              </FormField>
            )} />
            <Controller control={control} name="meetupNotes" render={({ field: { value, onChange, onBlur } }) => (
              <FormField label={t('sell.meetupNotesLabel')}>
                <TextInput value={value} onChangeText={onChange} onBlur={onBlur} multiline placeholder={t('sell.meetupNotesPlaceholder')} placeholderTextColor={palette.textMuted} selectionColor={palette.brand} style={[styles.input, styles.shortTextarea, { color: palette.text, borderColor: palette.line, backgroundColor: palette.surface }]} />
              </FormField>
            )} />
          </FormSection>

          <Button label={t('sell.publish')} icon="arrow-forward" loading={createListing.isPending} fullWidth onPress={onSubmit} />
        </ScrollView>
      </KeyboardAvoidingView>
    </AppScreen>
  );
}

function FormSection({ title, subtitle, children }: PropsWithChildren<{ title: string; subtitle?: string }>) {
  return <View style={styles.section}><View style={styles.sectionHeading}><AppText variant="h2">{title}</AppText>{subtitle ? <AppText tone="muted">{subtitle}</AppText> : null}</View>{children}</View>;
}

function FormField({ label, error, children }: PropsWithChildren<{ label: string; error?: boolean }>) {
  return <View style={styles.field}><AppText variant="label" tone={error ? 'danger' : 'default'}>{label}</AppText>{children}</View>;
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  content: { paddingTop: spacing.lg, paddingBottom: 140, gap: spacing.xl, maxWidth: 760, width: '100%', alignSelf: 'center' },
  heading: { gap: spacing.xs },
  eyebrow: { letterSpacing: 1.2 },
  section: { gap: spacing.md },
  sectionHeading: { gap: spacing.xxs },
  field: { gap: spacing.xs },
  photoRow: { gap: spacing.sm },
  photoPicker: { width: 112, height: 112, borderRadius: radius.lg, borderWidth: 1.5, borderStyle: 'dashed', alignItems: 'center', justifyContent: 'center', padding: spacing.sm, gap: spacing.xs },
  photoWrap: { width: 112, height: 112 },
  photo: { width: 112, height: 112, borderRadius: radius.lg },
  removePhoto: { position: 'absolute', right: 6, top: 6, width: 28, height: 28, borderRadius: 14, backgroundColor: 'rgba(20,20,20,0.7)', alignItems: 'center', justifyContent: 'center' },
  input: { ...typography.body, minHeight: 54, borderWidth: 1, borderRadius: radius.md, paddingHorizontal: spacing.md, paddingVertical: spacing.sm },
  textarea: { height: 148 },
  shortTextarea: { minHeight: 96 },
  priceInput: { minHeight: 54, borderWidth: 1, borderRadius: radius.md, paddingHorizontal: spacing.md, flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  priceText: { ...typography.h3, flex: 1, paddingVertical: 0 },
  chipRow: { gap: spacing.xs, paddingRight: spacing.md },
  pressed: { transform: [{ scale: 0.97 }] },
  authGate: { alignItems: 'center', justifyContent: 'center', gap: spacing.md, paddingHorizontal: spacing.xl },
  gateIcon: { width: 76, height: 76, borderRadius: radius.xl, alignItems: 'center', justifyContent: 'center' },
  center: { textAlign: 'center', maxWidth: 430 },
});
