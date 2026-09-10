import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { ComponentProps } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';

import { CATEGORY_META } from '@/data/mock';
import { radius, spacing } from '@/constants/theme';
import { usePalette } from '@/hooks/usePalette';
import { useI18n } from '@/lib/i18n';
import { CategorySlug } from '@/types/domain';
import { AppText } from '@/components/ui/AppText';

export function CategoryRail({ selected, onSelect }: { selected?: CategorySlug | 'all'; onSelect: (category: CategorySlug | 'all') => void }) {
  const palette = usePalette();
  const { t } = useI18n();
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.rail}>
      {CATEGORY_META.map((category, index) => {
        const isSelected = selected === category.slug;
        return (
          <Pressable key={category.slug} onPress={() => onSelect(category.slug)} style={({ pressed }) => [styles.item, pressed && styles.pressed]}>
            <View style={[styles.icon, {
              backgroundColor: isSelected ? palette.brand : index % 3 === 0 ? palette.brandSoft : index % 3 === 1 ? palette.sageSoft : palette.amberSoft,
              borderColor: isSelected ? palette.brand : palette.line,
            }]}>
              <MaterialIcons name={category.icon as ComponentProps<typeof MaterialIcons>['name']} size={26} color={isSelected ? palette.white : palette.text} />
            </View>
            <AppText variant="caption" style={{ color: isSelected ? palette.brand : palette.text }} numberOfLines={1}>{t(`category.${category.slug}`)}</AppText>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  rail: { gap: spacing.sm, paddingVertical: spacing.xs, paddingRight: spacing.md },
  item: { width: 76, alignItems: 'center', gap: 7 },
  icon: { width: 58, height: 58, borderRadius: radius.lg, alignItems: 'center', justifyContent: 'center', borderWidth: 1 },
  pressed: { transform: [{ scale: 0.94 }] },
});

