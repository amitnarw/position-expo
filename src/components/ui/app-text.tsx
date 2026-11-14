import type { TextProps } from 'react-native';
import { Text } from 'react-native';

import { cn } from '@/lib/cn';

export type TextVariant =
  | 'display'
  | 'title'
  | 'headline'
  | 'subtitle'
  | 'body'
  | 'small'
  | 'caption'
  | 'label'
  | 'numeric'
  | 'quote'
  | 'button';

export type TextTone =
  | 'ink'
  | 'soft'
  | 'muted'
  | 'accent'
  | 'accentOn'
  | 'paper'
  | 'warm'
  | 'warmInk'
  | 'danger';

const variantClass: Record<TextVariant, string> = {
  display: 'font-display text-display',
  title: 'font-display text-title',
  headline: 'font-display text-headline',
  subtitle: 'font-sans-medium text-subtitle',
  body: 'font-sans text-body',
  small: 'font-sans text-small',
  caption: 'font-sans text-caption',
  label: 'font-sans-semibold text-label',
  numeric: 'font-sans-medium text-numeric tabular-nums',
  quote: 'font-display-italic text-headline',
  button: 'font-sans-semibold text-[14px] leading-5',
};

const toneClass: Record<TextTone, string> = {
  ink: 'text-ink',
  soft: 'text-ink-soft',
  muted: 'text-muted',
  accent: 'text-accent',
  accentOn: 'text-accent-on',
  paper: 'text-paper',
  warm: 'text-warm',
  warmInk: 'text-warm-ink',
  danger: 'text-danger',
};

const defaultTone: Record<TextVariant, TextTone> = {
  display: 'ink',
  title: 'ink',
  headline: 'ink',
  subtitle: 'ink',
  body: 'soft',
  small: 'muted',
  caption: 'muted',
  label: 'muted',
  numeric: 'muted',
  quote: 'soft',
  button: 'paper',
};

const maxScale: Partial<Record<TextVariant, number>> = {
  display: 1.1,
  title: 1.15,
  headline: 1.2,
};

export type AppTextProps = TextProps & {
  variant?: TextVariant;
  tone?: TextTone;
};

export function AppText({
  variant = 'body',
  tone,
  className,
  children,
  maxFontSizeMultiplier,
  ...rest
}: AppTextProps) {
  return (
    <Text
      className={cn(variantClass[variant], toneClass[tone ?? defaultTone[variant]], className)}
      maxFontSizeMultiplier={maxFontSizeMultiplier ?? maxScale[variant] ?? 1.35}
      {...rest}>
      {children}
    </Text>
  );
}
