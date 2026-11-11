import { Redirect } from 'expo-router';

import { useSettings } from '@/store/settings';

/**
 * Pure routing gate. The root layout owns the hydration splash, so this screen
 * only has to pick the right first destination.
 */
export default function Index() {
  const ageVerified = useSettings((state) => state.ageVerified);
  const onboarded = useSettings((state) => state.onboarded);

  if (!ageVerified) {
    return <Redirect href="/age" />;
  }

  if (!onboarded) {
    return <Redirect href="/onboarding" />;
  }

  return <Redirect href="/today" />;
}
