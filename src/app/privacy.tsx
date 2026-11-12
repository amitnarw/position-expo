import { router } from 'expo-router';
import { ChevronLeft } from 'lucide-react-native';
import { Pressable, View } from 'react-native';

import { AppText } from '@/components/ui/app-text';
import { IconButton } from '@/components/ui/icon-button';
import { Rule } from '@/components/ui/rule';
import { Screen } from '@/components/ui/screen';
import { haptics } from '@/lib/haptics';
import { layout } from '@/theme/scale';
import { useTheme } from '@/theme/ThemeProvider';

export default function PrivacyScreen() {
  const { colors } = useTheme();

  const goBack = () => {
    haptics.tap();
    router.back();
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
          <IconButton
            icon={ChevronLeft}
            label="Back"
            onPress={goBack}
          />
        </View>
        <View className="flex-1 items-center">
          <AppText variant="label" className="tracking-[0.32em] text-ink">
            FORMA
          </AppText>
        </View>
        <View className="w-11" />
      </View>

      <View className="mt-6">
        <AppText variant="headline" className="max-w-[560px]">
          Privacy policy
        </AppText>
        <AppText variant="body" className="mt-5 max-w-[560px]">
          FORMA is an educational atlas of closeness. This policy describes what
          information the app collects, how it is used, and how advertising works.
        </AppText>
      </View>

      <Rule className="mt-10" />

      <View className="mt-6">
        <AppText variant="label">Data that stays on your device</AppText>
        <AppText variant="body" className="mt-3 max-w-[560px]">
          Your favourites, view history, theme, accent colour, and onboarding
          choices are stored locally on your device only. Nothing is uploaded to
          a server, and no account is created.
        </AppText>
      </View>

      <View className="mt-6">
        <AppText variant="label">Advertising</AppText>
        <AppText variant="body" className="mt-3 max-w-[560px]">
          FORMA shows advertising to support development. Ads may appear as
          banners on the Atlas and Learn screens, and as occasional full-screen
          interstitials at natural breaks.
        </AppText>
        <View className="mt-4 gap-3">
          <View className="flex-row items-start gap-3">
            <AppText variant="small" tone="muted" className="w-2 text-center">
              ·
            </AppText>
            <AppText variant="small" className="flex-1 max-w-[500px]">
              Ad networks may receive your device/advertising identifier and
              limited device information to serve and measure ads. You can limit
              ad tracking in your device settings.
            </AppText>
          </View>
          <View className="flex-row items-start gap-3">
            <AppText variant="small" tone="muted" className="w-2 text-center">
              ·
            </AppText>
            <AppText variant="small" className="flex-1 max-w-[500px]">
              We do not serve ads based on your plate views, favourites, or
              history. Personal app data is not shared with ad networks.
            </AppText>
          </View>
          <View className="flex-row items-start gap-3">
            <AppText variant="small" tone="muted" className="w-2 text-center">
              ·
            </AppText>
            <AppText variant="small" className="flex-1 max-w-[500px]">
              During development, test ads are used and no revenue is generated.
            </AppText>
          </View>
        </View>
      </View>

      <View className="mt-6">
        <AppText variant="label">Children</AppText>
        <AppText variant="body" className="mt-3 max-w-[560px]">
          FORMA is intended for adults. The store listing is rated 18+. Ad
          requests are marked as not child-directed and not under the age of
          consent.
        </AppText>
      </View>

      <View className="mt-6">
        <AppText variant="label">Contact</AppText>
        <AppText variant="body" className="mt-3 max-w-[560px]">
          Questions about this policy or your data can be sent through the app
          Settings screen.
        </AppText>
      </View>

      <Rule className="mt-12" />

      <View className="mt-8">
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Done"
          onPress={goBack}
          className="flex-row items-center gap-2 active:opacity-60">
          <AppText variant="small" tone="muted" className="font-sans-medium">
            Done
          </AppText>
          <ChevronLeft size={16} color={colors.muted} strokeWidth={1.6} />
        </Pressable>
      </View>
    </Screen>
  );
}
