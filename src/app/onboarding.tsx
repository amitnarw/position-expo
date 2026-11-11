import { router } from 'expo-router';
import { ChevronLeft } from 'lucide-react-native';
import { useState } from 'react';
import { Pressable, View } from 'react-native';

import { AppText } from '@/components/ui/app-text';
import { Button } from '@/components/ui/button';
import { IconButton } from '@/components/ui/icon-button';
import { Reveal } from '@/components/ui/reveal';
import { Screen } from '@/components/ui/screen';
import { cn } from '@/lib/cn';
import { haptics } from '@/lib/haptics';
import { useSettings, type Comfort, type Intent } from '@/store/settings';
import { layout } from '@/theme/scale';

type Option<T extends string> = {
  id: T;
  label: string;
  description: string;
};

const intentOptions: Option<Intent>[] = [
  { id: 'learn', label: 'Learn', description: 'I want a clearer understanding.' },
  { id: 'explore', label: 'Explore', description: 'I want to find something new.' },
  {
    id: 'connect',
    label: 'Connect',
    description: 'I want more closeness, less performance.',
  },
];

const comfortOptions: Option<Comfort>[] = [
  { id: 'gentle', label: 'Gentle', description: 'Low effort, lots of contact.' },
  { id: 'curious', label: 'Curious', description: 'A little novelty, no pressure.' },
  {
    id: 'adventurous',
    label: 'Adventurous',
    description: 'I am happy to rearrange the furniture.',
  },
];

function Progress({ step }: { step: number }) {
  return (
    <View className="flex-row gap-1.5">
      {[0, 1, 2].map((segment) => (
        <View
          key={segment}
          className={cn('h-[3px] flex-1 rounded-full', segment <= step ? 'bg-clay' : 'bg-line')}
        />
      ))}
    </View>
  );
}

function ChoiceCard<T extends string>({
  option,
  selected,
  onSelect,
}: {
  option: Option<T>;
  selected: boolean;
  onSelect: () => void;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={option.label}
      accessibilityHint={option.description}
      accessibilityState={{ selected }}
      onPress={onSelect}
      className={cn(
        'rounded-card border p-5 active:opacity-70',
        selected ? 'border-ink bg-ink' : 'border-line bg-surface',
      )}>
      <AppText variant="subtitle" tone={selected ? 'paper' : 'ink'}>
        {option.label}
      </AppText>
      <AppText variant="small" tone={selected ? 'paper' : 'soft'} className="mt-1.5">
        {option.description}
      </AppText>
    </Pressable>
  );
}

export default function OnboardingScreen() {
  const completeOnboarding = useSettings((state) => state.completeOnboarding);
  const storedIntent = useSettings((state) => state.intent);

  const [step, setStep] = useState(0);
  const [intent, setIntent] = useState<Intent | null>(storedIntent);
  const [comfort, setComfort] = useState<Comfort | null>(null);

  const chooseIntent = (next: Intent) => {
    haptics.select();
    setIntent(next);
  };

  const chooseComfort = (next: Comfort) => {
    haptics.select();
    setComfort(next);
  };

  const finish = () => {
    if (!intent || !comfort) return;
    completeOnboarding({ intent, comfort });
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
        <View className="w-11 items-start">
          {step > 0 ? (
            <IconButton
              icon={ChevronLeft}
              label="Back"
              onPress={() => setStep((current) => Math.max(0, current - 1))}
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

      <Progress step={step} />

      <Reveal key={step} style={{ flex: 1 }}>
        {step === 0 ? (
          <View className="pt-10">
            <AppText variant="label">Welcome</AppText>
            <AppText variant="display" className="mt-4 max-w-[560px]">
              A quieter kind of field guide.
            </AppText>
            <AppText variant="body" className="mt-5 max-w-[560px]">
              Thirty-six abstract plates, eight short guides, and a language for what you already
              do. No scores. No goals.
            </AppText>

            <View className="mt-10">
              <Button label="Begin" size="block" onPress={() => setStep(1)} />
              <AppText variant="small" className="mt-4">
                You can change any of this later in Settings.
              </AppText>
            </View>
          </View>
        ) : null}

        {step === 1 ? (
          <View className="pt-10">
            <AppText variant="label">Step one</AppText>
            <AppText variant="headline" className="mt-3 text-[32px] leading-[38px]">
              What brings you here?
            </AppText>

            <View className="mt-8 gap-3">
              {intentOptions.map((option) => (
                <ChoiceCard
                  key={option.id}
                  option={option}
                  selected={intent === option.id}
                  onSelect={() => chooseIntent(option.id)}
                />
              ))}
            </View>

            <View className="mt-8">
              <Button
                label="Continue"
                size="block"
                disabled={!intent}
                onPress={() => setStep(2)}
              />
            </View>
          </View>
        ) : null}

        {step === 2 ? (
          <View className="pt-10">
            <AppText variant="label">Step two</AppText>
            <AppText variant="headline" className="mt-3 text-[32px] leading-[38px]">
              How would you like to begin?
            </AppText>

            <View className="mt-8 gap-3">
              {comfortOptions.map((option) => (
                <ChoiceCard
                  key={option.id}
                  option={option}
                  selected={comfort === option.id}
                  onSelect={() => chooseComfort(option.id)}
                />
              ))}
            </View>

            <View className="mt-8">
              <Button
                label="Continue"
                size="block"
                disabled={!comfort}
                onPress={() => setStep(3)}
              />
            </View>
          </View>
        ) : null}

        {step === 3 ? (
          <View className="pt-10">
            <AppText variant="label">Ready</AppText>
            <AppText variant="display" className="mt-4 max-w-[560px]">
              The atlas is open.
            </AppText>
            <AppText variant="body" className="mt-5 max-w-[560px]">
              Start with a collection, or open the first plate and read.
            </AppText>

            <View className="mt-10">
              <Button
                label="Enter the atlas"
                size="block"
                disabled={!intent || !comfort}
                onPress={finish}
              />
            </View>
          </View>
        ) : null}
      </Reveal>
    </Screen>
  );
}
