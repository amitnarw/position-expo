export type Scheme = 'light' | 'dark';

export type Palette = {
  paper: string;
  surface: string;
  surface2: string;
  ink: string;
  inkSoft: string;
  muted: string;
  line: string;
  clay: string;
  claySoft: string;
  sage: string;
  plum: string;
  ochre: string;
  accent: string;
  accentSoft: string;
  danger: string;
};

export const palettes: Record<Scheme, Palette> = {
  light: {
    paper: '#F7F2EA',
    surface: '#FFFBF4',
    surface2: '#EFE6D9',
    ink: '#171310',
    inkSoft: '#3D352F',
    muted: '#8A7F74',
    line: '#E3DACB',
    clay: '#B25E45',
    claySoft: '#E9C9BB',
    sage: '#6F7A62',
    plum: '#6D4A5D',
    ochre: '#B0813F',
    accent: '#B25E45',
    accentSoft: '#E9C9BB',
    danger: '#A33A2E',
  },
  dark: {
    paper: '#0F0D0C',
    surface: '#171412',
    surface2: '#211D1A',
    ink: '#F4EDE3',
    inkSoft: '#D6CBBE',
    muted: '#A79C8F',
    line: '#2C2622',
    clay: '#D0805F',
    claySoft: '#4A2A21',
    sage: '#9AA88B',
    plum: '#B08AA0',
    ochre: '#D3A45E',
    accent: '#D0805F',
    accentSoft: '#4A2A21',
    danger: '#E0766A',
  },
};

export type AccentEdition = 'clay' | 'sage' | 'plum' | 'ochre';

/**
 * CSS variables injected at runtime. Every key here must also be excluded
 * from NativeWind's variable inlining in metro.config.js.
 */
export function cssVariablesFor(scheme: Scheme, edition: AccentEdition = 'clay') {
  const p = palettes[scheme];
  const accent = p[edition];
  const accentSoft = scheme === 'light' ? `${accent}33` : `${accent}40`;

  return {
    '--color-paper': p.paper,
    '--color-surface': p.surface,
    '--color-surface-2': p.surface2,
    '--color-ink': p.ink,
    '--color-ink-soft': p.inkSoft,
    '--color-muted': p.muted,
    '--color-line': p.line,
    '--color-clay': p.clay,
    '--color-clay-soft': p.claySoft,
    '--color-sage': p.sage,
    '--color-plum': p.plum,
    '--color-ochre': p.ochre,
    '--color-accent': accent,
    '--color-accent-soft': accentSoft,
  } satisfies Record<`--${string}`, string>;
}
