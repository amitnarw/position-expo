import { forwardRef } from 'react';
import type { ReactNode } from 'react';
import { Pressable, type PressableProps, type StyleProp, type ViewStyle } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';

import { haptics } from '@/lib/haptics';
import { spring } from '@/theme/scale';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

type PressableScaleProps = Omit<PressableProps, 'style' | 'children'> & {
  children: ReactNode;
  /** How far the surface compresses. 0.97 is subtle; 0.94 is toy-like. */
  scaleTo?: number;
  haptic?: 'tap' | 'select' | 'press' | 'none';
  style?: StyleProp<ViewStyle>;
};

/**
 * Physical press feedback used by every tappable surface in the app.
 * A short spring keeps it feeling native instead of the default opacity fade.
 */
export const PressableScale = forwardRef<React.ComponentRef<typeof Pressable>, PressableScaleProps>(
  function PressableScale(
    { children, scaleTo = 0.97, haptic = 'tap', onPressIn, onPressOut, onPress, disabled, style, ...rest },
    ref,
  ) {
    const reduce = useReducedMotion();
    const pressed = useSharedValue(0);

    const animatedStyle = useAnimatedStyle(() => ({
      transform: [{ scale: 1 - pressed.value * (1 - scaleTo) }],
    }));

    return (
      <AnimatedPressable
        ref={ref}
        {...rest}
        disabled={disabled}
        style={[style, animatedStyle]}
        onPressIn={(event) => {
          pressed.value = reduce ? 0 : withSpring(1, spring.press);
          onPressIn?.(event);
        }}
        onPressOut={(event) => {
          pressed.value = withSpring(0, spring.release);
          onPressOut?.(event);
        }}
        onPress={(event) => {
          if (haptic !== 'none') {
            if (haptic === 'select') haptics.select();
            else if (haptic === 'press') haptics.press();
            else haptics.tap();
          }
          onPress?.(event);
        }}>
        {children}
      </AnimatedPressable>
    );
  },
);
