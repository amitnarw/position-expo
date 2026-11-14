import { router } from 'expo-router';
import { ChevronLeft } from 'lucide-react-native';
import { View } from 'react-native';

import { BulletList, SectionTitle } from '@/components/content/editorial';
import { AppText } from '@/components/ui/app-text';
import { IconButton } from '@/components/ui/icon-button';
import { PressableScale } from '@/components/ui/pressable-scale';
import { Rule } from '@/components/ui/rule';
import { Screen } from '@/components/ui/screen';
import { layout } from '@/theme/scale';
import { useTheme } from '@/theme/ThemeProvider';

export default function PrivacyScreen() {
  const { colors } = useTheme();

  const goBack = () => {
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
          <IconButton icon={ChevronLeft} label="Back" onPress={goBack} />
        </View>
        <View className="flex-1 items-center">
          <AppText variant="label" className="text-ink">
            Forma
          </AppText>
        </View>
        <View className="w-11" />
      </View>

      <View className="mt-6">
        <AppText variant="title" className="max-w-[560px]">
          Privacy policy
        </AppText>
        <AppText variant="body" className="mt-4 max-w-[560px]">
          Forma is an educational atlas of closeness. This policy describes what
          information the app collects, how it is used, and how advertising works.
        </AppText>
      </View>

      <Rule className="mt-10" />

      <View>
        <SectionTitle className="mt-6">Data that stays on your device</SectionTitle>
        <AppText variant="body" className="max-w-[560px]">
          Your favourites, view history, theme, and haptics settings are stored
          locally on your device only. Nothing is uploaded to a server, and no
          account is created.
        </AppText>
      </View>

      <View>
        <SectionTitle>Advertising</SectionTitle>
        <AppText variant="body" className="max-w-[560px]">
          Forma shows advertising to support development. Ads may appear as
          banners in the Plates, Guides, and Saved lists, and as occasional
          full-screen interstitials at natural breaks.
        </AppText>
        <BulletList
          className="mt-4"
          items={[
            'Ad networks may receive your device/advertising identifier and limited device information to serve and measure ads. You can limit ad tracking in your device settings.',
            'We do not serve ads based on your plate views, favourites, or history. Personal app data is not shared with ad networks.',
            'During development, test ads are used and no revenue is generated.',
          ]}
        />
      </View>

      <View>
        <SectionTitle>Children</SectionTitle>
        <AppText variant="body" className="max-w-[560px]">
          Forma is intended for adults. The store listing is rated 18+. Ad
          requests are marked as not child-directed and not under the age of
          consent.
        </AppText>
      </View>

      <View>
        <SectionTitle>Contact</SectionTitle>
        <AppText variant="body" className="max-w-[560px]">
          Questions about this policy or your data can be sent through the app
          Settings screen.
        </AppText>
      </View>

      <Rule className="mt-12" />

      <View className="mt-8">
        <PressableScale
          accessibilityRole="button"
          accessibilityLabel="Done"
          scaleTo={0.95}
          onPress={goBack}
          className="flex-row items-center gap-2 self-start">
          <AppText variant="small" tone="muted" className="font-sans-medium">
            Done
          </AppText>
          <ChevronLeft size={16} color={colors.muted} strokeWidth={1.6} />
        </PressableScale>
      </View>
    </Screen>
  );
}
