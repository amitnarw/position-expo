import { router } from 'expo-router';
import { View } from 'react-native';

import { PlateArt } from '@/components/art/plate-art';
import { AppText } from '@/components/ui/app-text';
import { PressableScale } from '@/components/ui/pressable-scale';
import { Appear } from '@/components/ui/reveal';
import { Screen } from '@/components/ui/screen';
import { useSettings } from '@/store/settings';

/**
 * The entire first-run experience: one promise, one button. No questions,
 * no walkthrough. It also stands in for the hidden 18+ confirmation.
 */
export default function GetInScreen() {
  const enter = useSettings((state) => state.enter);

  const start = () => {
    enter();
    router.replace('/home');
  };

  return (
    <Screen edges={['top', 'bottom', 'left', 'right']} padded>
      <View className="flex-1 justify-between py-8">
        <Appear distance={10}>
          <AppText variant="label">An atlas of closeness</AppText>
        </Appear>

        <Appear delay={70} distance={16} className="items-center">
          <View className="w-full max-w-[300px] overflow-hidden rounded-sheet">
            <PlateArt slug="first-light" />
          </View>
          <AppText variant="display" className="mt-9 text-center text-[56px]">
            Forma
          </AppText>
          <AppText variant="body" className="mt-3 max-w-[300px] text-center">
            Quiet shapes for two people. For adults.
          </AppText>
        </Appear>

        <Appear delay={150} distance={10}>
          <PressableScale
            accessibilityRole="button"
            accessibilityLabel="Get in"
            scaleTo={0.97}
            onPress={start}
            className="h-13 w-full items-center justify-center rounded-pill bg-ink">
            <AppText variant="button" tone="paper">
              Get in
            </AppText>
          </PressableScale>
          <AppText variant="caption" tone="muted" className="mt-4 text-center">
            Your library stays on this device.
          </AppText>
        </Appear>
      </View>
    </Screen>
  );
}
