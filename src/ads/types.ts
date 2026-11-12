/**
 * Ad layer types.
 *
 * The provider boundary is intentionally small so AdMob (test), a tag-based
 * adult-tolerant network (production), and a local mock can all be swapped
 * without touching screens.
 */
export type AdKind = 'banner' | 'interstitial' | 'rewarded' | 'appOpen';

export type AdOutcome =
  | { kind: 'ok' }
  | { kind: 'no-fill'; zoneId: string }
  | { kind: 'error'; zoneId: string; message: string }
  | { kind: 'capped'; reason: 'frequency' | 'first-open' }
  | { kind: 'user-closed' };

export interface AdProvider {
  /** Human-readable provider name (for logs / dev panel). */
  name: string;
  /** Initialize SDK. Safe to call multiple times. */
  initialize(): Promise<void>;
  /** Reserve banner space; returns true when a creative is expected. */
  requestBanner(zoneId: string): Promise<AdOutcome>;
  /** Show a full-screen interstitial. Resolves when dismissed or blocked. */
  showInterstitial(zoneId: string): Promise<AdOutcome>;
  /** Show a rewarded ad; ok means the user earned the reward. */
  showRewarded(zoneId: string): Promise<AdOutcome>;
  /** Show an app-open ad on cold start. */
  showAppOpen(zoneId: string): Promise<AdOutcome>;
}

/**
 * Cap state tracked per session. Persists only in memory — ads are impression
 * inventory, not user data.
 */
export type AdCaps = {
  /** Whether the app-open interstitial has been shown this session. */
  appOpenShown: boolean;
  /** Interstitials shown this session. */
  interstitialCount: number;
  /** Total banner impressions this session. */
  bannerCount: number;
};
