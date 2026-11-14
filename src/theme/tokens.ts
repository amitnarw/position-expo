export type Scheme = 'light' | 'dark';

export type Palette = {
  paper: string;
  surface: string;
  surface2: string;
  surface3: string;
  ink: string;
  inkSoft: string;
  muted: string;
  line: string;
  warm: string;
  warmInk: string;
  control: string;
  controlInk: string;
  clay: string;
  accent: string;
  accentOn: string;
  danger: string;
};

/**
 * "Noir" — the palette taken from the reference: a neutral near-black field,
 * warm-white type, one warm taupe block, and visible hairlines. Depth comes
 * from the surface steps and hairlines, never from shadows or gradients.
 */
export const palettes: Record<Scheme, Palette> = {
  light: {
    paper: '#F8F6F2',
    surface: '#FFFFFF',
    surface2: '#F2EFE9',
    surface3: '#E6E1D8',
    ink: '#161412',
    inkSoft: '#38332E',
    muted: '#7A7268',
    line: '#DCD6CC',
    warm: '#6A5847',
    warmInk: '#FDFBF7',
    control: '#EAE5DE',
    controlInk: '#161412',
    clay: '#946D4B',
    accent: '#946D4B',
    accentOn: '#FFFDFA',
    danger: '#A33A2E',
  },
  dark: {
    paper: '#060606',
    surface: '#1C1715',
    surface2: '#352C27',
    surface3: '#443831',
    ink: '#F5EFE8',
    inkSoft: '#D4CCC1',
    muted: '#9E938B',
    line: '#3D332D',
    warm: '#625346',
    warmInk: '#F6F1EA',
    control: '#352C27',
    controlInk: '#F5EFE8',
    clay: '#C89B74',
    accent: '#C89B74',
    accentOn: '#161311',
    danger: '#E0766A',
  },
};

/**
 * CSS variables injected at runtime. Every key here must also be excluded
 * from NativeWind's variable inlining in metro.config.js.
 */
export function cssVariablesFor(scheme: Scheme) {
  const p = palettes[scheme];

  return {
    '--color-paper': p.paper,
    '--color-surface': p.surface,
    '--color-surface-2': p.surface2,
    '--color-surface-3': p.surface3,
    '--color-ink': p.ink,
    '--color-ink-soft': p.inkSoft,
    '--color-muted': p.muted,
    '--color-line': p.line,
    '--color-warm': p.warm,
    '--color-warm-ink': p.warmInk,
    '--color-control': p.control,
    '--color-control-ink': p.controlInk,
    '--color-clay': p.clay,
    '--color-accent': p.accent,
    '--color-accent-on': p.accentOn,
    '--color-danger': p.danger,
  } satisfies Record<`--${string}`, string>;
}
