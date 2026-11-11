import { Easing } from 'react-native-reanimated';

export const duration = {
  fast: 160,
  base: 300,
  slow: 560,
  hero: 900,
} as const;

export const easing = {
  out: Easing.out(Easing.cubic),
  inOut: Easing.inOut(Easing.cubic),
  expo: Easing.out(Easing.exp),
} as const;

export const space = {
  xs: 4,
  sm: 8,
  md: 12,
  base: 16,
  lg: 20,
  xl: 24,
  '2xl': 32,
  '3xl': 40,
  '4xl': 48,
  '5xl': 64,
  '6xl': 80,
} as const;

export const layout = {
  gutter: 24,
  tabBarSpace: 124,
  maxWidth: 760,
  hitSlop: { top: 8, bottom: 8, left: 8, right: 8 },
} as const;
