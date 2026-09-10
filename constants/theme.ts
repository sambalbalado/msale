import { Platform } from 'react-native';

export const lightPalette = {
  background: '#F7F4EE',
  surface: '#FFFDF9',
  surfaceMuted: '#EFE9DE',
  text: '#1B1A18',
  textMuted: '#6E6961',
  line: '#E4DDD1',
  brand: '#F15A3A',
  brandPressed: '#D84A2E',
  brandSoft: '#FDE5DE',
  sage: '#2F6B52',
  sageSoft: '#DDEDE3',
  amber: '#B76B22',
  amberSoft: '#F5E7D5',
  danger: '#B93D3D',
  white: '#FFFFFF',
  black: '#0E0E0D',
  overlay: 'rgba(27, 26, 24, 0.46)',
  tab: 'rgba(255, 253, 249, 0.96)',
};

export const darkPalette: typeof lightPalette = {
  background: '#111210',
  surface: '#191A17',
  surfaceMuted: '#25251F',
  text: '#F4F0E8',
  textMuted: '#AAA49A',
  line: '#31312B',
  brand: '#FF7558',
  brandPressed: '#E86246',
  brandSoft: '#40251E',
  sage: '#78B997',
  sageSoft: '#1B3327',
  amber: '#E7A25D',
  amberSoft: '#3B2B1B',
  danger: '#F07979',
  white: '#FFFFFF',
  black: '#0E0E0D',
  overlay: 'rgba(0, 0, 0, 0.62)',
  tab: 'rgba(25, 26, 23, 0.96)',
};

export type Palette = typeof lightPalette;

export const spacing = {
  xxs: 4,
  xs: 8,
  sm: 12,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
  display: 64,
} as const;

export const radius = {
  sm: 10,
  md: 16,
  lg: 22,
  xl: 30,
  pill: 999,
} as const;

export const typography = {
  display: { fontSize: 40, lineHeight: 44, fontWeight: '800' as const, letterSpacing: -1.4 },
  h1: { fontSize: 30, lineHeight: 35, fontWeight: '800' as const, letterSpacing: -0.8 },
  h2: { fontSize: 23, lineHeight: 28, fontWeight: '750' as const, letterSpacing: -0.35 },
  h3: { fontSize: 18, lineHeight: 23, fontWeight: '700' as const, letterSpacing: -0.15 },
  body: { fontSize: 16, lineHeight: 23, fontWeight: '400' as const },
  bodyStrong: { fontSize: 16, lineHeight: 23, fontWeight: '650' as const },
  label: { fontSize: 14, lineHeight: 19, fontWeight: '650' as const },
  caption: { fontSize: 12, lineHeight: 16, fontWeight: '550' as const },
} as const;

export const shadow = Platform.select({
  ios: {
    shadowColor: '#2D211B',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.08,
    shadowRadius: 20,
  },
  android: { elevation: 3 },
  default: {
    boxShadow: '0 10px 30px rgba(45, 33, 27, 0.08)',
  },
});

