import { useColorScheme } from 'react-native';

import { darkPalette, lightPalette } from '@/constants/theme';

export function usePalette() {
  return useColorScheme() === 'dark' ? darkPalette : lightPalette;
}

