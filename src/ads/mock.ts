import type { AdOutcome, AdProvider } from './types';
import { admobTestUnits } from './config';

/**
 * Local mock ad provider. Dev default — no network, no account, nothing paid.
 * Simulates fill / no-fill / latency so every screen can be exercised offline.
 *
 * Impressions are logged to the console and to `__AD_IMPRESSIONS__` on window
 * (when available) so a dev panel can read them.
 */
export class MockAdProvider implements AdProvider {
  name = 'mock';
  fillRate = 0.8;
  latencyMs = 400;

  async initialize() {
    // nothing to initialize
  }

  private async roll(ok: { kind: 'ok' }, fail: AdOutcome): Promise<AdOutcome> {
    await new Promise((resolve) => setTimeout(resolve, this.latencyMs));
    return Math.random() < this.fillRate ? ok : fail;
  }

  async requestBanner(zoneId: string) {
    const result = await this.roll(
      { kind: 'ok' },
      { kind: 'no-fill', zoneId },
    );
    if (result.kind === 'ok') {
      console.log(`[ad:mock] banner impression zone=${zoneId}`);
    }
    return result;
  }

  async showInterstitial(zoneId: string) {
    const result = await this.roll(
      { kind: 'ok' },
      { kind: 'no-fill', zoneId },
    );
    console.log(`[ad:mock] interstitial ${result.kind === 'ok' ? 'shown' : 'no-fill'} zone=${zoneId}`);
    return result;
  }

  async showRewarded(zoneId: string) {
    const result = await this.roll(
      { kind: 'ok' },
      { kind: 'no-fill', zoneId },
    );
    console.log(`[ad:mock] rewarded ${result.kind === 'ok' ? 'earned' : 'no-fill'} zone=${zoneId}`);
    return result;
  }

  async showAppOpen(zoneId: string) {
    const result = await this.roll(
      { kind: 'ok' },
      { kind: 'no-fill', zoneId },
    );
    console.log(`[ad:mock] app-open ${result.kind === 'ok' ? 'shown' : 'no-fill'} zone=${zoneId}`);
    return result;
  }
}

/** Singleton used by the ad layer when provider === 'mock'. */
export const mockProvider = new MockAdProvider();

/** Exported so the dev Ads panel can tweak fill rate / latency at runtime. */
export function configureMock({ fillRate, latencyMs }: { fillRate?: number; latencyMs?: number }) {
  if (fillRate !== undefined) mockProvider.fillRate = Math.min(1, Math.max(0, fillRate));
  if (latencyMs !== undefined) mockProvider.latencyMs = Math.max(0, latencyMs);
}

// Expose test unit IDs (AdMob sandbox IDs — never real account IDs) for reference.
export { admobTestUnits };

declare global {
  interface Window {
    __AD_IMPRESSIONS__?: { kind: string; zoneId: string; ts: number }[];
  }
}

if (typeof window !== 'undefined') {
  window.__AD_IMPRESSIONS__ = window.__AD_IMPRESSIONS__ ?? [];
  const log = (kind: string, zoneId: string) => {
    window.__AD_IMPRESSIONS__?.push({ kind, zoneId, ts: Date.now() });
  };
  const origBanner = mockProvider.requestBanner.bind(mockProvider);
  const origInterstitial = mockProvider.showInterstitial.bind(mockProvider);
  const origRewarded = mockProvider.showRewarded.bind(mockProvider);
  const origAppOpen = mockProvider.showAppOpen.bind(mockProvider);
  mockProvider.requestBanner = async (zoneId: string) => {
    const result = await origBanner(zoneId);
    if (result.kind === 'ok') log('banner', zoneId);
    return result;
  };
  mockProvider.showInterstitial = async (zoneId: string) => {
    const result = await origInterstitial(zoneId);
    if (result.kind === 'ok') log('interstitial', zoneId);
    return result;
  };
  mockProvider.showRewarded = async (zoneId: string) => {
    const result = await origRewarded(zoneId);
    if (result.kind === 'ok') log('rewarded', zoneId);
    return result;
  };
  mockProvider.showAppOpen = async (zoneId: string) => {
    const result = await origAppOpen(zoneId);
    if (result.kind === 'ok') log('appOpen', zoneId);
    return result;
  };
}
