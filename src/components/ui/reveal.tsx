import { useEffect } from 'react';
import type { ReactNode } from 'react';
import Animated, {
  FadeOut,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withDelay,
  withTiming,
} from 'react-native-reanimated';

import { duration, easing } from '@/theme/scale';

type AppearProps = {
  children: ReactNode;
  delay?: number;
  /** Vertical offset in px. Keep it small — this is a settle, not a slide. */
  distance?: number;
  className?: string;
};

/**
 * One quiet entrance: a short fade plus a 10–14 px rise. The exit is handled
 * by Reanimated's layout animation and is deliberately much shorter.
 */
export function Appear({ children, delay = 0, distance = 10, className }: AppearProps) {
  const reduce = useReducedMotion();
  const progress = useSharedValue(0);

  useEffect(() => {
    progress.value = withDelay(
      delay,
      withTiming(1, {
        duration: reduce ? duration.quick : duration.enter,
        easing: easing.enter,
      }),
    );
  }, [delay, progress, reduce]);

  const style = useAnimatedStyle(() => ({
    opacity: progress.value,
    transform: [{ translateY: (1 - progress.value) * (reduce ? 0 : distance) }],
  }));

  return (
    <Animated.View
      className={className}
      exiting={FadeOut.duration(reduce ? 0 : duration.exit)}>
      <Animated.View style={style}>{children}</Animated.View>
    </Animated.View>
  );
}

/**
 * Caps stagger so a long grid never feels like it is loading forever. Items
 * past the cap share the last capped delay.
 */
export function staggerDelay(index: number, step = 24, cap = 5) {
  return Math.min(index, cap) * step;
}
