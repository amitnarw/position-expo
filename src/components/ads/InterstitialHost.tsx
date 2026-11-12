import { useCallback, useEffect, useRef, useState } from 'react';
import { View } from 'react-native';

import { AppText } from '@/components/ui/app-text';
import { Button } from '@/components/ui/button';
import { Rule } from '@/components/ui/rule';
import { Screen } from '@/components/ui/screen';
import { useTheme } from '@/theme/ThemeProvider';
import { features } from '@/config/features';
import { registerInterstitialTrigger, getProvider, initAds } from '@/ads/adManager';
import { useSettings } from '@/store/settings';
import type { AdOutcome } from '@/ads/types';

/**
 * Root-mounted interstitial host. Renders the mock interstitial overlay (dev
 * only) so testers can see and dismiss a simulated ad. Production networks
 * (AdMob native, WebView tags) present full-screen natively and render nothing
 * here.
 *
 * Place once in the root layout, above the navigator.
 */
export function InterstitialHost({ children }: { children: React.ReactNode }) {
  const { colors } = useTheme();
  const adsConsented = useSettings((state) => state.adsConsented);
  const provider = getProvider();
  const isMock = provider?.name === 'mock';

  const [showing, setShowing] = useState(false);
  const [zoneId, setZoneId] = useState<string>('');
  const resolveRef = useRef<((outcome: AdOutcome) => void) | null>(null);

  const request = useCallback(
    async (z: string, firstOpen: boolean): Promise<AdOutcome> => {
      if (showing) return { kind: 'user-closed' };
      if (!features.interstitialAds) return { kind: 'capped', reason: 'frequency' };
      if (!adsConsented) return { kind: 'capped', reason: 'frequency' };
      if (!provider) await initAds();
      const p = provider ?? getProvider();
      if (!p) return { kind: 'error', zoneId: z, message: 'ads not initialized' };
      setZoneId(z);
      setShowing(true);

      if (isMock) {
        return new Promise((resolve) => {
          resolveRef.current = resolve;
        });
      }

      try {
        const outcome = await p.showInterstitial(z);
        setShowing(false);
        return outcome;
      } catch {
        setShowing(false);
        return { kind: 'error', zoneId: z, message: 'interstitial failed' };
      }
    },
    [showing, provider, isMock, adsConsented],
  );

  useEffect(() => {
    registerInterstitialTrigger(request);
  }, [request]);

  const dismiss = useCallback(() => {
    if (!showing) return;
    setShowing(false);
    if (isMock && resolveRef.current) {
      resolveRef.current({ kind: 'ok' });
      resolveRef.current = null;
    }
  }, [showing, isMock]);

  return (
    <>
      {children}
      {showing && (
        <Screen edges={['top', 'bottom', 'left', 'right']} padded>
          <View className="flex-1 items-center justify-center pt-20">
            <View
              className="flex-row items-center gap-2 px-3 py-1 mb-12"
              style={{
                backgroundColor: colors.surface,
                borderWidth: 1,
                borderColor: colors.line,
                borderRadius: 999,
              }}>
              <AppText variant="caption" tone="muted" className="font-sans-medium">
                Ad
              </AppText>
              <AppText variant="caption" tone="muted">
                {provider?.name} · {zoneId.slice(-8)}
              </AppText>
            </View>
            <AppText variant="title" className="text-center mb-6">
              Sponsor message
            </AppText>
            <Button label="Continue" size="md" onPress={dismiss} className="w-[200px]" />
            <Rule className="mt-8 mb-4 w-[200px]" />
            <AppText variant="small" className="text-center max-w-[260px]">
              {isMock ? 'Test interstitial (mock ad).' : 'Skip after the countdown.'}
            </AppText>
          </View>
        </Screen>
      )}
    </>
  );
}
