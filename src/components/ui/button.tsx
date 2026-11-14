import type { ReactNode } from 'react';
import { View } from 'react-native';

import { AppText } from '@/components/ui/app-text';
import { PressableScale } from '@/components/ui/pressable-scale';
import { cn } from '@/lib/cn';

type ButtonVariant = 'primary' | 'secondary' | 'ghost';
type ButtonSize = 'sm' | 'md' | 'lg' | 'block';

/**
 * Primary is the inverted pill: the fill is `ink` and the label is `paper`,
 * which reads as the reference's bright control in both schemes. Everything
 * else is an outline — no second fill weight exists.
 */
const containerClass: Record<ButtonVariant, string> = {
  primary: 'bg-ink',
  secondary: 'border border-line',
  ghost: 'bg-transparent',
};

const textTone: Record<ButtonVariant, 'paper' | 'ink'> = {
  primary: 'paper',
  secondary: 'ink',
  ghost: 'ink',
};

const sizeClass: Record<ButtonSize, string> = {
  sm: 'h-10 px-5',
  md: 'h-12 px-6',
  lg: 'h-13 px-7',
  block: 'h-13 w-full px-6',
};

type ButtonProps = {
  label: string;
  onPress?: () => void;
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: ReactNode;
  disabled?: boolean;
  className?: string;
  accessibilityHint?: string;
};

export function Button({
  label,
  onPress,
  variant = 'primary',
  size = 'md',
  icon,
  disabled = false,
  className,
  accessibilityHint,
}: ButtonProps) {
  return (
    <PressableScale
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityHint={accessibilityHint}
      accessibilityState={{ disabled }}
      disabled={disabled}
      scaleTo={0.98}
      onPress={onPress}
      className={cn(
        'flex-row items-center justify-center gap-2 rounded-pill',
        containerClass[variant],
        sizeClass[size],
        disabled && 'opacity-40',
        className,
      )}>
      {icon}
      <AppText variant="button" tone={textTone[variant]}>
        {label}
      </AppText>
    </PressableScale>
  );
}

export function ButtonRow({ children }: { children: ReactNode }) {
  return <View className="flex-row gap-3">{children}</View>;
}
