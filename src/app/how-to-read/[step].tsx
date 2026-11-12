import { router, useLocalSearchParams } from 'expo-router';
import { Pressable, View } from 'react-native';

import { AppText } from '@/components/ui/app-text';
import { IconButton } from '@/components/ui/icon-button';
import { Screen } from '@/components/ui/screen';
import { ChevronLeft, ChevronRight } from 'lucide-react-native';
import { PoseArt } from '@/components/art/pose-art';
import { allPositions } from '@/content';
import { haptics } from '@/lib/haptics';
import { layout } from '@/theme/scale';
import { useTheme } from '@/theme/ThemeProvider';
import { useSettings } from '@/store/settings';

const PAGES = [
  {
    id: '1' as const,
    title: 'The two figures',
    body:
      'Each plate shows two bodies as centre lines only. The front figure is drawn in ink, the back figure in clay. A paper halo around each body knocks out whatever sits behind it, so the shapes stay legible where they overlap — never a solid silhouette.',
  },
  {
    id: '2' as const,
    title: 'Pace, closeness, effort',
    body:
      'Every plate carries three quiet ratings. Pace (slow / steady / playful) suggests how much hurry the shape asks for. Closeness (1–5) is skin-to-skin contact. Effort (1–5) is strength or balance. None of them are requirements — they are a language for what you already do.',
  },
];

export default function HowToReadScreen() {
  const { colors } = useTheme();
  const setIntroDone = useSettings((state) => state.setIntroDone);
  const { step } = useLocalSearchParams<{ step: string }>();
  const page = PAGES.find((item) => item.id === step);
  const index = PAGES.findIndex((item) => item.id === step);
  const isLast = index === PAGES.length - 1;

  if (!page) {
    return null;
  }

  const goBack = () => {
    haptics.tap();
    if (index === 0) {
      router.replace('/onboarding');
    } else {
      router.replace(`/how-to-read/${PAGES[index - 1].id}`);
    }
  };

  const goNext = () => {
    haptics.tap();
    if (isLast) {
      setIntroDone();
      router.replace('/today');
    } else {
      router.replace(`/how-to-read/${PAGES[index + 1].id}`);
    }
  };

  const example = allPositions[0];

  return (
    <Screen
      scroll
      edges={['top', 'bottom']}
      padded
      bottomSpace={40}
      style={{ width: '100%', maxWidth: layout.maxWidth, alignSelf: 'center' }}>
      <View className="flex-row items-center pt-2 pb-4">
        <View className="w-11 items-start">
          {index > 0 ? (
            <IconButton
              icon={ChevronLeft}
              label="Back"
              onPress={goBack}
            />
          ) : null}
        </View>
        <View className="flex-1 items-center">
          <AppText variant="label" className="tracking-[0.32em] text-ink">
            FORMA
          </AppText>
        </View>
        <View className="w-11" />
      </View>

      <View className="mt-6 flex-row gap-1.5">
        {PAGES.map((item, i) => (
          <View
            key={item.id}
            className={cn(
              'h-[3px] flex-1 rounded-full',
              i <= index ? 'bg-clay' : 'bg-line',
            )}
          />
        ))}
      </View>

      <View className="mt-10">
        <AppText variant="label">How to read a plate</AppText>
        <AppText variant="headline" className="mt-3 max-w-[560px]">
          {page.title}
        </AppText>
        <AppText variant="body" className="mt-5 max-w-[560px]">
          {page.body}
        </AppText>
      </View>

      {index === 1 && example ? (
        <View className="mt-12">
          <AppText variant="label">Example: Plate 01</AppText>
          <View className="mt-4 overflow-hidden rounded-card border border-line bg-surface">
            <PoseArt pose={example.pose} animate />
          </View>
          <AppText variant="small" className="mt-3 max-w-[560px] tone muted text-center">
            Ink = front figure · clay = back figure · paper halo knocks out the overlap.
          </AppText>
        </View>
      ) : null}

      <View className="mt-12 flex-row items-center justify-between">
        {index > 0 ? (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Previous"
            onPress={goBack}
            className="flex-row items-center gap-2 active:opacity-60">
            <ChevronLeft size={16} color={colors.muted} strokeWidth={1.6} />
            <AppText variant="small" tone="muted" className="font-sans-medium">
              Previous
            </AppText>
          </Pressable>
        ) : null}

        <Pressable
          accessibilityRole="button"
          accessibilityLabel={isLast ? 'Finish intro' : 'Next'}
          onPress={goNext}
          className="flex-row items-center gap-2 active:opacity-60">
          <AppText variant="small" tone="muted" className="font-sans-medium">
            {isLast ? 'Finish intro' : 'Next'}
          </AppText>
          <ChevronRight size={16} color={colors.muted} strokeWidth={1.6} />
        </Pressable>
      </View>
    </Screen>
  );
}

function cn(...classes: (string | undefined | null | false)[]) {
  return classes.filter(Boolean).join(' ');
}
