import { Redirect } from 'expo-router';
import { useSettings } from '@/store/settings';
import { features } from '@/config/features';

/**
 * Pure routing gate. The root layout owns the hydration splash, so this screen
 * only has to pick the right first destination.
 *
 * Flow:
 *   features.ageGate && !ageVerified → /age        (18+ confirmation, hidden by default)
 *   !onboarded                       → /onboarding
 *   features.introPrimer / introHowToRead && !introDone → /primer → /how-to-read/*
 *   otherwise                        → /today
 */
export default function Index() {
  const ageVerified = useSettings((state) => state.ageVerified);
  const onboarded = useSettings((state) => state.onboarded);
  const introDone = useSettings((state) => state.introDone);

  if (features.ageGate && !ageVerified) {
    return <Redirect href="/age" />;
  }

  if (!onboarded) {
    return <Redirect href="/onboarding" />;
  }

  if (!introDone) {
    return <Redirect href="/primer" />;
  }

  return <Redirect href="/today" />;
}
