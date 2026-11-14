import { useEffect, useState } from 'react';
import { View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';

import { AppText } from '@/components/ui/app-text';
import { PressableScale } from '@/components/ui/pressable-scale';
import { cn } from '@/lib/cn';
import { spring } from '@/theme/scale';

export type SegmentOption<T extends string> = {
  value: T;
  label: string;
};

type SegmentedProps<T extends string> = {
  value: T;
  options: SegmentOption<T>[];
  onChange: (value: T) => void;
  className?: string;
};

/**
 * Three-up control in the reference's pill language: a hairline track with no
 * fill, and a quiet surface step under the active item — never a bright slab.
 */
export function Segmented<T extends string>({
  value,
  options,
  onChange,
  className,
}: SegmentedProps<T>) {
  const [width, setWidth] = useState(0);
  const index = Math.max(
    0,
    options.findIndex((option) => option.value === value),
  );
  const progress = useSharedValue(index);

  useEffect(() => {
    progress.value = withSpring(index, spring.pill);
  }, [index, progress]);

  const cell = width / Math.max(options.length, 1);
  const indicator = useAnimatedStyle(() => ({
    transform: [{ translateX: progress.value * cell }],
  }));

  return (
    <View
      className={cn('relative flex-row rounded-pill border border-line p-1', className)}
      style={{ height: 44 }}
      onLayout={(event) => setWidth(event.nativeEvent.layout.width - 8)}>
      {width > 0 ? (
        <Animated.View
          style={[
            {
              position: 'absolute',
              top: 3,
              bottom: 3,
              left: 4,
              width: cell,
              borderRadius: 999,
            },
            indicator,
          ]}
          className="border border-line bg-surface-2"
        />
      ) : null}

      {options.map((option) => {
        const selected = option.value === value;
        return (
          <PressableScale
            key={option.value}
            accessibilityRole="button"
            accessibilityLabel={option.label}
            accessibilityState={{ selected }}
            haptic="select"
            scaleTo={0.97}
            onPress={() => {
              if (!selected) onChange(option.value);
            }}
            className="flex-1 items-center justify-center rounded-pill">
            <AppText
              variant="small"
              tone={selected ? 'ink' : 'muted'}
              className={cn(selected ? 'font-sans-semibold' : 'font-sans-medium')}>
              {option.label}
            </AppText>
          </PressableScale>
        );
      })}
    </View>
  );
}
