import { router } from 'expo-router';
import { Pressable, View } from 'react-native';

import { AppText } from '@/components/ui/app-text';
import { Button } from '@/components/ui/button';
import { Rule } from '@/components/ui/rule';
import { Screen } from '@/components/ui/screen';
import { ChevronRight } from 'lucide-react-native';
import { haptics } from '@/lib/haptics';
import { layout } from '@/theme/scale';
import { useTheme } from '@/theme/ThemeProvider';
import { useSettings } from '@/store/settings';

export default function PrimerScreen() {
  const { colors } = useTheme();
  const setIntroDone = useSettings((state) => state.setIntroDone);

  const goNext = () => {
    haptics.tap();
    router.push('/how-to-read/1');
  };

  const finishIntro = () => {
    haptics.tap();
    setIntroDone();
    router.replace('/today');
  };

  return (
    <Screen
      scroll
      edges={['top', 'bottom']}
      padded
      bottomSpace={40}
      style={{ width: '100%', maxWidth: layout.maxWidth, alignSelf: 'center' }}>
      <View className="flex-row items-center pt-2 pb-4">
        <View className="w-11" />
        <View className="flex-1 items-center">
          <AppText variant="label" className="tracking-[0.32em] text-ink">
            FORMA
          </AppText>
        </View>
        <View className="w-11" />
      </View>

      <View className="mt-10">
        <AppText variant="label">What this is</AppText>
        <AppText variant="headline" className="mt-3 max-w-[560px]">
          A quiet atlas for adults
        </AppText>
        <AppText variant="body" className="mt-5 max-w-[560px]">
          FORMA is an illustrated, educational field guide to intimacy. Every plate is an abstract
          outline — nothing photographic, nothing explicit. It is designed to be read, not looked
          at.
        </AppText>
      </View>

      <View className="mt-10">
        <AppText variant="label">What it is not</AppText>
        <View className="mt-4 gap-3">
          <View className="flex-row items-start gap-3">
            <AppText variant="small" tone="muted" className="w-2 text-center">
              ·
            </AppText>
            <AppText variant="small" className="flex-1 max-w-[500px]">
              Not medical advice, therapy, or a replacement for talking with your partner or a
              clinician.
            </AppText>
          </View>
          <View className="flex-row items-start gap-3">
            <AppText variant="small" tone="muted" className="w-2 text-center">
              ·
            </AppText>
            <AppText variant="small" className="flex-1 max-w-[500px]">
              Not a scoreboard. There are no achievements, streaks, or goals to perform.
            </AppText>
          </View>
          <View className="flex-row items-start gap-3">
            <AppText variant="small" tone="muted" className="w-2 text-center">
              ·
            </AppText>
            <AppText variant="small" className="flex-1 max-w-[500px]">
              Not a social network. Nothing is shared, no account is created, and nothing leaves
              your device.
            </AppText>
          </View>
        </View>
      </View>

      <Rule className="mt-12" />

      <View className="mt-8">
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Skip intro"
          onPress={finishIntro}
          className="flex-row items-center gap-2 active:opacity-60">
          <AppText variant="small" tone="muted" className="font-sans-medium">
            Skip intro
          </AppText>
          <ChevronRight size={16} color={colors.muted} strokeWidth={1.6} />
        </Pressable>
      </View>

      <View className="mt-16">
        <Button label="Continue" size="block" onPress={goNext} />
      </View>
    </Screen>
  );
}
