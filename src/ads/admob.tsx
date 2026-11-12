import {
  MobileAds,
  InterstitialAd,
  RewardedAd,
  AppOpenAd,
  AdEventType,
  MaxAdContentRating,
} from 'react-native-google-mobile-ads';

import type { AdOutcome, AdProvider } from './types';

type FullScreenAd = {
  addAdEventListener: (type: any, cb: any) => void;
  load: () => void;
  show: () => Promise<void>;
};

/**
 * AdMob provider wired to sandbox test unit IDs.
 *
 * Uses the imperative `createForAdRequest` + `addAdEventListener` API so it
 * works outside React components. These IDs always return test creatives —
 * they never serve paid inventory and never touch a real AdMob account.
 */
export class AdMobProvider implements AdProvider {
  name = 'admob';
  private initialized = false;

  async initialize(): Promise<void> {
    if (this.initialized) return;
    await MobileAds().setRequestConfiguration({
      maxAdContentRating: MaxAdContentRating.PG,
      tagForChildDirectedTreatment: false,
      tagForUnderAgeOfConsent: false,
      testDeviceIdentifiers: [],
    });
    await MobileAds().initialize();
    this.initialized = true;
  }

  async requestBanner(zoneId: string): Promise<AdOutcome> {
    // Banner is rendered as a React <BannerAd> component inside AdSlot, not
    // imperatively. Acknowledge the slot here.
    return { kind: 'ok' } as const;
  }

  async showInterstitial(zoneId: string): Promise<AdOutcome> {
    return this.fullScreen(() => InterstitialAd.createForAdRequest(zoneId), zoneId);
  }

  async showRewarded(zoneId: string): Promise<AdOutcome> {
    return this.fullScreen(() => RewardedAd.createForAdRequest(zoneId), zoneId);
  }

  async showAppOpen(zoneId: string): Promise<AdOutcome> {
    return this.fullScreen(() => AppOpenAd.createForAdRequest(zoneId), zoneId);
  }

  private fullScreen(createAd: () => FullScreenAd, zoneId: string): Promise<AdOutcome> {
    return new Promise((resolve) => {
      let resolved = false;
      let timer: ReturnType<typeof setTimeout> | null = null;
      const finish = (outcome: AdOutcome) => {
        if (!resolved) {
          resolved = true;
          if (timer) clearTimeout(timer);
          resolve(outcome);
        }
      };

      // 30s safety timeout: a hung SDK must not lock the app forever.
      timer = setTimeout(() => finish({ kind: 'error', zoneId, message: 'ad timeout' }), 30000);

      const ad = createAd();

      const onLoaded = () => {
        ad.show()
          .then(() => finish({ kind: 'ok' } as const))
          .catch((error) => finish(this.fail(zoneId, error)));
      };
      const onError = (error: unknown) => finish(this.fail(zoneId, error));
      const onClosed = () => {
        if (!resolved) finish({ kind: 'user-closed' } as const);
      };

      ad.addAdEventListener(AdEventType.LOADED, onLoaded);
      ad.addAdEventListener(AdEventType.ERROR, onError);
      ad.addAdEventListener(AdEventType.CLOSED, onClosed);

      ad.load();
    });
  }

  private fail(zoneId: string, error: unknown): AdOutcome {
    const message = error instanceof Error ? error.message : String(error);
    const isNoFill =
      typeof message === 'string' &&
      (message.includes('no fill') ||
        message.includes('NO_FILL') ||
        message.includes('ad not available') ||
        message.includes('load failed'));
    return isNoFill ? { kind: 'no-fill', zoneId } : { kind: 'error', zoneId, message };
  }
}

export const admobProvider = new AdMobProvider();
