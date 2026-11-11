import type { ReactNode } from 'react';
import { Pressable, View } from 'react-native';

import { AppText } from '@/components/ui/app-text';
import { cn } from '@/lib/cn';
import { haptics } from '@/lib/haptics';

type ButtonVariant = 'primary' | 'ink' | 'secondary' | 'ghost';
type ButtonSize = 'sm' | 'md' | 'lg' | 'block';

const containerClass: Record<ButtonVariant, string> = {
  primary: 'bg-accent',
  ink: 'bg-ink',
  secondary: 'border border-line bg-surface',
  ghost: 'bg-transparent',
};

const textTone: Record<ButtonVariant, 'paper' | 'ink'> = {
  primary: 'paper',
  ink: 'paper',
  secondary: 'ink',
  ghost: 'ink',
};

const sizeClass: Record<ButtonSize, string> = {
  sm: 'h-9 px-4',
  md: 'h-12 px-6',
  lg: 'h-14 px-7',
  block: 'h-12 w-full px-6',
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
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityHint={accessibilityHint}
      accessibilityState={{ disabled }}
      disabled={disabled}
      onPress={() => {
        haptics.tap();
        onPress?.();
      }}
      className={cn(
        'flex-row items-center justify-center gap-2 rounded-pill active:opacity-70',
        containerClass[variant],
        sizeClass[size],
        disabled && 'opacity-40',
        className,
      )}>
      {icon}
      <AppText variant="button" tone={textTone[variant]}>
        {label}
      </AppText>
    </Pressable>
  );
}

export function ButtonRow({ children }: { children: ReactNode }) {
  return <View className="flex-row gap-3">{children}</View>;
}
