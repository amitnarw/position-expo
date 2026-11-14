import Constants from 'expo-constants';
import { router } from 'expo-router';
import { ChevronRight, ShieldCheck } from 'lucide-react-native';
import { useState } from 'react';
import { View } from 'react-native';

import { AppText } from '@/components/ui/app-text';
import { ConfirmSheet } from '@/components/ui/confirm-sheet';
import { PressableScale } from '@/components/ui/pressable-scale';
import { Appear } from '@/components/ui/reveal';
import { Screen } from '@/components/ui/screen';
import { Segmented } from '@/components/ui/segmented';
import { Toggle } from '@/components/ui/toggle';
import { useLibrary } from '@/store/library';
import { useSettings, type ThemePreference } from '@/store/settings';
import { useTheme } from '@/theme/ThemeProvider';

const THEMES: { value: ThemePreference; label: string }[] = [
  { value: 'system', label: 'System' },
  { value: 'light', label: 'Light' },
  { value: 'dark', label: 'Dark' },
];

function SettingRow({
  title,
  description,
  right,
}: {
  title: string;
  description?: string;
  right: React.ReactNode;
}) {
  return (
    <View className="flex-row items-center justify-between gap-4 py-4">
      <View className="flex-1">
        <AppText variant="subtitle" className="text-[17px]">
          {title}
        </AppText>
        {description ? (
          <AppText variant="small" className="mt-1">
            {description}
          </AppText>
        ) : null}
      </View>
      {right}
    </View>
  );
}

export default function SettingsScreen() {
  const { colors } = useTheme();
  const theme = useSettings((state) => state.theme);
  const hapticsOn = useSettings((state) => state.haptics);
  const adsConsented = useSettings((state) => state.adsConsented);
  const setTheme = useSettings((state) => state.setTheme);
  const setHaptics = useSettings((state) => state.setHaptics);
  const setAdsConsented = useSettings((state) => state.setAdsConsented);

  const version = Constants.expoConfig?.version ?? '1.0.0';
  const [confirming, setConfirming] = useState(false);

  const resetEverything = () => {
    setConfirming(false);
    useSettings.getState().resetAll();
    useLibrary.getState().resetAll();
    router.replace('/get-in');
  };

  return (
    <Screen scroll edges={['top', 'left', 'right']} padded bottomSpace={220}>
      <Appear>
        <View className="pb-1 pt-2">
          <AppText variant="display" className="pb-1.5" style={{ lineHeight: 46 }}>Settings</AppText>
          <AppText variant="subtitle" tone="muted" className="mt-1 text-[15px]">
            Small choices. Nothing here is required.
          </AppText>
        </View>
      </Appear>

      <Appear delay={60} className="mt-8">
        <AppText variant="label">Appearance</AppText>
        <Segmented className="mt-3" value={theme} options={THEMES} onChange={setTheme} />
      </Appear>

      <Appear delay={100} className="mt-9">
        <AppText variant="label">Preferences</AppText>

        <View className="mt-3 overflow-hidden rounded-card bg-surface px-4">
          <SettingRow
            title="Haptics"
            description="A light tap when you touch something."
            right={
              <Toggle value={hapticsOn} label="Haptics" onValueChange={setHaptics} />
            }
          />
          <View className="h-px bg-line" />
          <SettingRow
            title="Allow advertising"
            description="Banners and occasional breaks keep Forma free."
            right={
              <Toggle
                value={adsConsented}
                label="Allow advertising"
                onValueChange={setAdsConsented}
              />
            }
          />
          <View className="h-px bg-line" />
          <PressableScale
            accessibilityRole="button"
            accessibilityLabel="Privacy policy"
            scaleTo={0.98}
            onPress={() => router.push('/privacy')}
            className="flex-row items-center gap-3 py-4">
            <ShieldCheck size={19} color={colors.ink} strokeWidth={1.6} />
            <AppText variant="subtitle" className="flex-1 text-[17px]">
              Privacy
            </AppText>
            <ChevronRight size={18} color={colors.muted} strokeWidth={1.6} />
          </PressableScale>
        </View>
      </Appear>

      <Appear delay={140}>
        <PressableScale
          accessibilityRole="button"
          accessibilityLabel="Reset everything"
          scaleTo={0.98}
          onPress={() => setConfirming(true)}
          className="mt-9 h-12 items-center justify-center rounded-pill border border-danger">
          <AppText variant="button" tone="danger">
            Reset everything
          </AppText>
        </PressableScale>

        <AppText variant="caption" tone="muted" className="mt-6 text-center">
          Forma {version} · For adults · Your library stays on this device
        </AppText>
      </Appear>

      <ConfirmSheet
        visible={confirming}
        title="Reset everything?"
        message="This clears your saved plates, history, and settings. It cannot be undone."
        confirmLabel="Reset"
        onCancel={() => setConfirming(false)}
        onConfirm={resetEverything}
      />
    </Screen>
  );
}
