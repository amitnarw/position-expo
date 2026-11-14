import { useEffect } from 'react';
import { View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';

import { PressableScale } from '@/components/ui/pressable-scale';
import { spring } from '@/theme/scale';
import { useTheme } from '@/theme/ThemeProvider';

type ToggleProps = {
  value: boolean;
  onValueChange: (value: boolean) => void;
  label: string;
};

const TRACK_W = 50;
const TRACK_H = 30;
const KNOB = 24;
const INSET = 3;
const TRAVEL = TRACK_W - KNOB - INSET * 2;

/**
 * A small inverted capsule. The platform Switch draws a thumb larger than its
 * track on Android, which reads as a dark blob on the paper surface; this keeps
 * the knob inside a hairline track and matches the rest of the controls.
 */
export function Toggle({ value, onValueChange, label }: ToggleProps) {
  const { colors } = useTheme();
  const reduce = useReducedMotion();
  const progress = useSharedValue(value ? 1 : 0);

  useEffect(() => {
    progress.value = reduce ? (value ? 1 : 0) : withSpring(value ? 1 : 0, spring.pill);
  }, [progress, reduce, value]);

  const knob = useAnimatedStyle(() => ({
    transform: [{ translateX: INSET + progress.value * TRAVEL }],
  }));

  return (
    <PressableScale
      accessibilityRole="switch"
      accessibilityLabel={label}
      accessibilityState={{ checked: value }}
      haptic="select"
      scaleTo={0.94}
      hitSlop={10}
      onPress={() => onValueChange(!value)}>
      <View
        style={{
          width: TRACK_W,
          height: TRACK_H,
          borderRadius: 999,
          justifyContent: 'center',
          backgroundColor: value ? colors.ink : colors.surface3,
          borderWidth: 1,
          borderColor: value ? colors.ink : colors.line,
        }}>
        <Animated.View
          style={[
            {
              width: KNOB,
              height: KNOB,
              borderRadius: 999,
              backgroundColor: value ? colors.paper : colors.inkSoft,
            },
            knob,
          ]}
        />
      </View>
    </PressableScale>
  );
}
