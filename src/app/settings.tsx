import Constants from 'expo-constants';
import { router } from 'expo-router';
import { ShieldCheck } from 'lucide-react-native';
import type { ReactNode } from 'react';
import { Alert, Pressable, Switch, View } from 'react-native';

import { ModalHeader } from '@/components/content/modal-header';
import { AppText } from '@/components/ui/app-text';
import { Button } from '@/components/ui/button';
import { Rule } from '@/components/ui/rule';
import { Screen } from '@/components/ui/screen';
import { cn } from '@/lib/cn';
import { haptics } from '@/lib/haptics';
import { useLibrary } from '@/store/library';
import {
  useSettings,
  type ThemePreference,
} from '@/store/settings';
import { layout } from '@/theme/scale';
import { palettes, type AccentEdition } from '@/theme/tokens';
import { useTheme } from '@/theme/ThemeProvider';

const themeOptions: { value: ThemePreference; label: string }[] = [
  { value: 'system', label: 'System' },
  { value: 'light', label: 'Light' },
  { value: 'dark', label: 'Dark' },
];

const editions: AccentEdition[] = ['clay', 'sage', 'plum', 'ochre'];

function SettingsSection({ label, children }: { label: string; children: ReactNode }) {
  return (
    <View className="py-6">
      <AppText variant="label" className="mb-4">
        {label}
      </AppText>
      {children}
    </View>
  );
}

function DangerButton({ label, onPress }: { label: string; onPress: () => void }) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      onPress={() => {
        haptics.warn();
        onPress();
      }}
      className="h-12 w-full items-center justify-center rounded-pill border border-danger active:opacity-60">
      <AppText variant="button" tone="danger">
        {label}
      </AppText>
    </Pressable>
  );
}

export default function SettingsScreen() {
  const { colors, scheme } = useTheme();

  const theme = useSettings((state) => state.theme);
  const edition = useSettings((state) => state.edition);
  const hapticsOn = useSettings((state) => state.haptics);
  const intent = useSettings((state) => state.intent);
  const comfort = useSettings((state) => state.comfort);
  const ageVerified = useSettings((state) => state.ageVerified);
  const adsConsented = useSettings((state) => state.adsConsented);

  const setTheme = useSettings((state) => state.setTheme);
  const setEdition = useSettings((state) => state.setEdition);
  const setHaptics = useSettings((state) => state.setHaptics);
  const setAdsConsented = useSettings((state) => state.setAdsConsented);
  const personalizeAgain = useSettings((state) => state.personalizeAgain);

  const version = Constants.expoConfig?.version ?? '1.0.0';

  const confirmClearHistory = () => {
    Alert.alert(
      'Clear history?',
      'This removes the plates you have opened. Saved plates stay.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear',
          style: 'destructive',
          onPress: () => useLibrary.getState().clearHistory(),
        },
      ],
    );
  };

  const confirmReset = () => {
    Alert.alert(
      'Reset everything?',
      'This clears your saved plates, history, and settings. It cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reset',
          style: 'destructive',
          onPress: () => {
            useSettings.getState().resetAll();
            useLibrary.getState().resetAll();
            router.replace('/age');
          },
        },
      ],
    );
  };

  return (
    <Screen
      scroll
      edges={['top', 'bottom']}
      padded
      bottomSpace={48}
      style={{ width: '100%', maxWidth: layout.maxWidth, alignSelf: 'center' }}>
      <ModalHeader label="SETTINGS" />

      <SettingsSection label="Appearance">
        <View className="flex-row gap-2">
          {themeOptions.map((option) => {
            const selected = theme === option.value;
            return (
              <Pressable
                key={option.value}
                accessibilityRole="button"
                accessibilityLabel={`${option.label} appearance`}
                accessibilityState={{ selected }}
                onPress={() => {
                  setTheme(option.value);
                  haptics.select();
                }}
                className={cn(
                  'h-11 flex-1 items-center justify-center rounded-pill border active:opacity-70',
                  selected ? 'border-ink bg-ink' : 'border-line bg-transparent',
                )}>
                <AppText
                  variant="small"
                  tone={selected ? 'paper' : 'soft'}
                  className="font-sans-medium">
                  {option.label}
                </AppText>
              </Pressable>
            );
          })}
        </View>
      </SettingsSection>

      <Rule />

      <SettingsSection label="Accent">
        <View className="flex-row gap-3">
          {editions.map((name) => {
            const selected = edition === name;
            return (
              <Pressable
                key={name}
                accessibilityRole="button"
                accessibilityLabel={`${name} accent`}
                accessibilityState={{ selected }}
                onPress={() => {
                  setEdition(name);
                  haptics.select();
                }}
                className={cn(
                  'h-12 w-12 items-center justify-center rounded-full border-2 active:opacity-70',
                  selected ? 'border-ink' : 'border-transparent',
                )}>
                <View
                  className="h-10 w-10 rounded-full"
                  style={{ backgroundColor: palettes[scheme][name] }}
                />
              </Pressable>
            );
          })}
        </View>
        <AppText variant="small" className="mt-3 capitalize">
          {edition}
        </AppText>
      </SettingsSection>

      <Rule />

      <SettingsSection label="Haptics">
        <View className="flex-row items-center justify-between gap-4">
          <View className="flex-1">
            <AppText variant="subtitle" className="text-[17px] leading-6">
              Haptics
            </AppText>
            <AppText variant="small" className="mt-1 max-w-[420px]">
              A light tap on selection and save. Off if you prefer silence.
            </AppText>
          </View>

          <Switch
            value={hapticsOn}
            accessibilityLabel="Haptics"
            onValueChange={(value) => {
              setHaptics(value);
              if (value) haptics.select();
            }}
            trackColor={{ false: colors.line, true: colors.accent }}
            thumbColor={colors.paper}
            ios_backgroundColor={colors.line}
          />
        </View>
      </SettingsSection>

      <Rule />

      <SettingsSection label="Personalise">
        <View className="gap-2">
          <View className="flex-row items-baseline justify-between gap-4">
            <AppText variant="small">Intent</AppText>
            <AppText variant="small" tone="ink" className="font-sans-medium capitalize">
              {intent ?? 'Not set'}
            </AppText>
          </View>
          <View className="flex-row items-baseline justify-between gap-4">
            <AppText variant="small">Comfort</AppText>
            <AppText variant="small" tone="ink" className="font-sans-medium capitalize">
              {comfort ?? 'Not set'}
            </AppText>
          </View>
        </View>

        <Button
          label="Redo personalisation"
          variant="secondary"
          size="block"
          onPress={() => {
            personalizeAgain();
            router.replace('/onboarding');
          }}
          className="mt-5"
        />
      </SettingsSection>

      <Rule />

      <SettingsSection label="Safety">
        <View className="flex-row items-center gap-4">
          <View className="h-10 w-10 items-center justify-center rounded-full border border-line">
            <ShieldCheck size={18} color={colors.ink} strokeWidth={1.6} />
          </View>

          <View className="flex-1">
            <AppText variant="subtitle" className="text-[17px] leading-6">
              Age gate
            </AppText>
            <AppText variant="small" className="mt-0.5">
              {ageVerified ? '18+ verified' : 'Not verified'}
            </AppText>
          </View>
        </View>

        <AppText variant="small" className="mt-4 max-w-[480px]">
          FORMA is educational, for adults, and not medical advice.
        </AppText>
      </SettingsSection>

      <Rule />

      <SettingsSection label="About">
        <View className="flex-row items-center gap-2">
          <AppText className="font-display text-[28px] leading-8 tracking-[0.08em]">FORMA</AppText>
          <View className="h-1.5 w-1.5 rounded-full bg-clay" />
        </View>
        <AppText variant="subtitle" className="mt-2 text-[17px] leading-6">
          An atlas of closeness.
        </AppText>
        <AppText variant="numeric" className="mt-3">
          Version {version}
        </AppText>
        <AppText variant="small" className="mt-3 max-w-[480px]">
          Educational content for adults. Your favourites and history stay on
          your device — nothing is uploaded. FORMA shows advertising to support
          development; see Privacy for details.
        </AppText>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Privacy policy"
          onPress={() => {
            haptics.tap();
            router.push('/privacy');
          }}
          className="mt-4 flex-row items-center gap-2 active:opacity-60">
          <AppText variant="small" tone="muted" className="font-sans-medium">
            Privacy policy
          </AppText>
        </Pressable>

        <View className="mt-8">
          <View className="flex-row items-center justify-between gap-4">
            <View className="flex-1">
              <AppText variant="subtitle" className="text-[17px] leading-6">
                Allow advertising
              </AppText>
              <AppText variant="small" className="mt-1 max-w-[420px]">
                FORMA shows banners and occasional interstitials. Turning this
                off hides ads.
              </AppText>
            </View>
            <Switch
              value={adsConsented}
              accessibilityLabel="Allow advertising"
              onValueChange={(value) => {
                setAdsConsented(value);
                haptics.select();
              }}
              trackColor={{ false: colors.line, true: colors.accent }}
              thumbColor={colors.paper}
              ios_backgroundColor={colors.line}
            />
          </View>
        </View>
      </SettingsSection>

      <Rule />

      <SettingsSection label="Data">
        <View className="gap-3">
          <Button
            label="Clear history"
            variant="secondary"
            size="block"
            onPress={confirmClearHistory}
          />
          <DangerButton label="Reset everything" onPress={confirmReset} />
        </View>
      </SettingsSection>

      <View style={{ height: layout.gutter }} />
    </Screen>
  );
}
