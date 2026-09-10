import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Tabs } from 'expo-router';
import { Platform, StyleSheet, View } from 'react-native';

import { usePalette } from '@/hooks/usePalette';
import { useI18n } from '@/lib/i18n';

export default function TabLayout() {
  const palette = usePalette();
  const { t } = useI18n();
  return (
    <Tabs screenOptions={{
      headerShown: false,
      tabBarActiveTintColor: palette.brand,
      tabBarInactiveTintColor: palette.textMuted,
      tabBarHideOnKeyboard: true,
      tabBarLabelStyle: styles.label,
      tabBarItemStyle: styles.item,
      tabBarStyle: [styles.bar, { backgroundColor: palette.tab, borderTopColor: palette.line }],
    }}>
      <Tabs.Screen name="index" options={{ title: t('nav.discover'), tabBarIcon: ({ color }) => <MaterialIcons name="explore" size={25} color={color} /> }} />
      <Tabs.Screen name="search" options={{ title: t('nav.search'), tabBarIcon: ({ color }) => <MaterialIcons name="search" size={25} color={color} /> }} />
      <Tabs.Screen name="sell" options={{
        title: t('nav.sell'),
        tabBarIcon: ({ focused }) => <View style={[styles.sellIcon, { backgroundColor: palette.brand, borderColor: palette.background }, focused && styles.sellIconFocused]}><MaterialIcons name="add" size={29} color={palette.white} /></View>,
      }} />
      <Tabs.Screen name="inbox" options={{ title: t('nav.inbox'), tabBarIcon: ({ color }) => <MaterialIcons name="chat-bubble-outline" size={23} color={color} /> }} />
      <Tabs.Screen name="profile" options={{ title: t('nav.profile'), tabBarIcon: ({ color }) => <MaterialIcons name="person-outline" size={25} color={color} /> }} />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  bar: { height: Platform.OS === 'ios' ? 88 : 72, paddingTop: 8, borderTopWidth: StyleSheet.hairlineWidth },
  item: { paddingVertical: 2 },
  label: { fontSize: 11, fontWeight: '600', marginTop: 2 },
  sellIcon: { width: 50, height: 50, borderRadius: 25, alignItems: 'center', justifyContent: 'center', borderWidth: 4, marginTop: -21 },
  sellIconFocused: { transform: [{ scale: 1.06 }] },
});
