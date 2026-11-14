import type { LucideIcon } from 'lucide-react-native';

import { PressableScale } from '@/components/ui/pressable-scale';
import { cn } from '@/lib/cn';
import { useTheme } from '@/theme/ThemeProvider';

type IconButtonProps = {
  icon: LucideIcon;
  onPress?: () => void;
  label: string;
  selected?: boolean;
  size?: number;
  filled?: boolean;
  fill?: string;
  className?: string;
};

/**
 * The circular header action from the reference: a light, filled disc with a
 * glyph. Stays 40pt and unlabelled.
 */
export function IconButton({
  icon: Icon,
  onPress,
  label,
  selected = false,
  size = 18,
  filled = false,
  fill,
  className,
}: IconButtonProps) {
  const { colors } = useTheme();
  const active = selected || filled;
  const iconFill = fill !== undefined ? fill : active ? colors.paper : 'transparent';

  return (
    <PressableScale
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ selected }}
      hitSlop={8}
      scaleTo={0.9}
      haptic="tap"
      onPress={onPress}
      className={cn('h-10 w-10 items-center justify-center rounded-full', className)}
      style={{ backgroundColor: active ? colors.ink : colors.control }}>
      <Icon
        size={size}
        color={active ? colors.paper : colors.controlInk}
        fill={iconFill}
        strokeWidth={1.6}
      />
    </PressableScale>
  );
}
