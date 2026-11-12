import { Redirect } from 'expo-router';
import { useSettings } from '@/store/settings';

/**
 * Pure routing gate. The root layout owns the hydration splash, so this screen
 * only has to pick the right first destination.
 *
 * Flow (age gate hidden behind feature flag):
 *   !onboarded   → /onboarding
 *   !introDone   → /primer        (first-run intro screens)
 *   otherwise    → /today
 */
export default function Index() {
  const onboarded = useSettings((state) => state.onboarded);
  const introDone = useSettings((state) => state.introDone);

  if (!onboarded) {
    return <Redirect href="/onboarding" />;
  }

  if (!introDone) {
    return <Redirect href="/primer" />;
  }

  return <Redirect href="/today" />;
}
