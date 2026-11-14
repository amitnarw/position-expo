import { Easing } from 'react-native-reanimated';

/**
 * Motion contract.
 *
 * Exits are always shorter than entrances: leaving has to feel like it got out
 * of the way. Anything that only fades spends even less time.
 */
export const duration = {
  instant: 90,
  exit: 160,
  quick: 120,
  enter: 300,
  hero: 340,
} as const;

export const easing = {
  enter: Easing.bezier(0.16, 1, 0.3, 1),
  exit: Easing.bezier(0.4, 0, 1, 1),
  inOut: Easing.bezier(0.4, 0, 0.2, 1),
} as const;

export const spring = {
  press: { damping: 16, stiffness: 420, mass: 0.55 },
  release: { damping: 14, stiffness: 380, mass: 0.6 },
  pill: { damping: 22, stiffness: 260, mass: 0.7 },
  sheet: { damping: 24, stiffness: 240, mass: 0.8 },
  pop: { damping: 12, stiffness: 320, mass: 0.6 },
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
  gutter: 20,
  tabBarSpace: 124,
  maxWidth: 760,
  hitSlop: { top: 8, bottom: 8, left: 8, right: 8 },
} as const;
