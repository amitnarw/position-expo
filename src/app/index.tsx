import { Redirect } from 'expo-router';

import { useSettings } from '@/store/settings';

/**
 * Pure routing gate. The root layout owns the splash until fonts and stores
 * are ready, so this screen only picks the first destination.
 */
export default function Index() {
  const onboarded = useSettings((state) => state.onboarded);

  if (!onboarded) {
    return <Redirect href="/get-in" />;
  }

  return <Redirect href="/home" />;
}
