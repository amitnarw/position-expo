import type { ReactNode } from 'react';
import type { StyleProp, ViewStyle } from 'react-native';
import Animated, { FadeIn, FadeInDown, useReducedMotion } from 'react-native-reanimated';

type RevealProps = {
  children: ReactNode;
  delay?: number;
  style?: StyleProp<ViewStyle>;
};

export function Reveal({ children, delay = 0, style }: RevealProps) {
  const reduceMotion = useReducedMotion();

  return (
    <Animated.View
      entering={reduceMotion ? FadeIn.duration(200) : FadeInDown.delay(delay).duration(620)}
      style={style}>
      {children}
    </Animated.View>
  );
}
