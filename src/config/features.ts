/**
 * Feature flags.
 *
 * Flip these to roll out / roll back behaviour without redeploying code.
 * Keep them plain booleans so every branch is easy to audit.
 */
export const features = {
  /** Show the 18+ confirmation gate before onboarding. */
  ageGate: false,
  /** Show the intro primer ("what this is / isn't") before Today. */
  introPrimer: true,
  /** Show the "how to read a plate" walkthrough before Today. */
  introHowToRead: true,
  /** Show interstitial ads at natural breaks. */
  interstitialAds: true,
  /** Show banner ads on Atlas / Learn. */
  bannerAds: true,
  /** Show rewarded ads to unlock a collection early. */
  rewardedAds: true,
} as const;

export type FeatureKey = keyof typeof features;
