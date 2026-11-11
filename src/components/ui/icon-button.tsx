import type { LucideIcon } from 'lucide-react-native';
import { Pressable } from 'react-native';

import { cn } from '@/lib/cn';
import { haptics } from '@/lib/haptics';
import { useTheme } from '@/theme/ThemeProvider';

type IconButtonProps = {
  icon: LucideIcon;
  onPress?: () => void;
  label: string;
  selected?: boolean;
  size?: number;
  className?: string;
};

export function IconButton({
  icon: Icon,
  onPress,
  label,
  selected = false,
  size = 19,
  className,
}: IconButtonProps) {
  const { colors } = useTheme();

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ selected }}
      hitSlop={8}
      onPress={() => {
        haptics.tap();
        onPress?.();
      }}
      className={cn(
        'h-11 w-11 items-center justify-center rounded-full border active:opacity-60',
        selected ? 'border-ink bg-ink' : 'border-line bg-transparent',
        className,
      )}>
      <Icon size={size} color={selected ? colors.paper : colors.ink} strokeWidth={1.6} />
    </Pressable>
  );
}
