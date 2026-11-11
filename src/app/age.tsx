import { router } from 'expo-router';
import { Alert, ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AppText } from '@/components/ui/app-text';
import { Button } from '@/components/ui/button';
import { Rule } from '@/components/ui/rule';
import { haptics } from '@/lib/haptics';
import { useSettings } from '@/store/settings';
import { layout } from '@/theme/scale';

export default function AgeScreen() {
  const verifyAge = useSettings((state) => state.verifyAge);

  const confirm = () => {
    haptics.success();
    verifyAge();
    router.replace('/onboarding');
  };

  const decline = () => {
    haptics.warn();
    Alert.alert(
      'FORMA is for adults',
      'Come back when you are 18 or older. Nothing is saved.',
      [{ text: 'Understood', style: 'cancel' }],
    );
  };

  return (
    <SafeAreaView edges={['top', 'bottom', 'left', 'right']} className="flex-1 bg-paper">
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        showsVerticalScrollIndicator={false}
        bounces={false}>
        <View
          className="flex-1 justify-between px-6 py-6"
          style={{ width: '100%', maxWidth: layout.maxWidth, alignSelf: 'center' }}>
          <View>
            <View className="flex-row items-center gap-2">
              <AppText variant="label" className="tracking-[0.32em] text-ink">
                FORMA
              </AppText>
              <View className="h-1.5 w-1.5 rounded-full bg-clay" />
            </View>
            <View className="mt-4">
              <Rule />
            </View>
          </View>

          <View className="my-12">
            <AppText variant="display">An atlas of closeness.</AppText>
            <AppText variant="body" className="mt-5 max-w-[560px]">
              FORMA is an illustrated, educational guide to intimacy for adults. The plates are
              abstract line drawings — nothing explicit. It is not medical advice.
            </AppText>

            <View className="mt-8 rounded-card border border-line bg-surface p-6">
              <AppText variant="display" className="text-[44px] leading-[48px]">
                18+
              </AppText>
              <AppText variant="label" className="mt-3">
                Adults only
              </AppText>
              <AppText variant="body" className="mt-3 max-w-[480px]">
                By continuing you confirm you are 18 or older and that you want to view educational
                content about sex.
              </AppText>
            </View>
          </View>

          <View>
            <View className="gap-3">
              <Button label="I am 18 or older" size="block" onPress={confirm} />
              <Button label="Not yet" variant="ghost" size="block" onPress={decline} />
            </View>

            <AppText variant="small" className="mt-5 text-center">
              Local only · No account · No tracking
            </AppText>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
