import { Pressable, View } from 'react-native';

import { AppText } from '@/components/ui/app-text';
import { cn } from '@/lib/cn';
import { haptics } from '@/lib/haptics';

type ChipProps = {
  label: string;
  selected?: boolean;
  onPress?: () => void;
  className?: string;
};

export function Chip({ label, selected = false, onPress, className }: ChipProps) {
  const content = (
    <View
      className={cn(
        'rounded-pill border px-4 py-2',
        selected ? 'border-ink bg-ink' : 'border-line bg-transparent',
        className,
      )}>
      <AppText
        variant="small"
        tone={selected ? 'paper' : 'soft'}
        className="font-sans-medium">
        {label}
      </AppText>
    </View>
  );

  if (!onPress) return content;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ selected }}
      onPress={() => {
        haptics.select();
        onPress();
      }}
      className="active:opacity-70">
      {content}
    </Pressable>
  );
}

export function DotScale({
  value,
  max = 5,
  activeClassName = 'bg-accent',
  inactiveClassName = 'bg-line',
}: {
  value: number;
  max?: number;
  activeClassName?: string;
  inactiveClassName?: string;
}) {
  return (
    <View className="flex-row items-center gap-1">
      {Array.from({ length: max }, (_, i) => (
        <View
          key={i}
          className={cn('h-1.5 w-1.5 rounded-full', i < value ? activeClassName : inactiveClassName)}
        />
      ))}
    </View>
  );
}
