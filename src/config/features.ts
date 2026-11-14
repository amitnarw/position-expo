/**
 * Feature flags.
 *
 * Keep these plain booleans so every branch is easy to audit.
 */
export const features = {
  /** Hidden 18+ gate. The Get-in screen carries the note instead. */
  ageGate: false,
  /** Show interstitial ads at natural breaks. */
  interstitialAds: true,
  /** Show banner ads in list footers. */
  bannerAds: true,
} as const;

export type FeatureKey = keyof typeof features;
