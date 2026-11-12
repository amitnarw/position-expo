import { useEffect, useState } from 'react';
import * as Network from 'expo-network';

/**
 * Returns true only when the internet is actually reachable, not just when a
 * Wi-Fi / cellular radio exists. Cold-start returns `null` until the first
 * reading lands, so callers can show a brief "checking" state instead of a
 * flash of offline.
 *
 * `isConnected` alone is insufficient: a captive portal or dead Wi-Fi still
 * reports `isConnected: true`. `isInternetReachable` is the gate we use.
 */
export function useOnline() {
  const [online, setOnline] = useState<boolean | null>(null);

  useEffect(() => {
    let mounted = true;

    const check = async () => {
      try {
        const state = await Network.getNetworkStateAsync();
        if (mounted) setOnline(state.isInternetReachable ?? false);
      } catch {
        if (mounted) setOnline(false);
      }
    };

    check();

    const subscription = Network.addNetworkStateListener((state) => {
      if (mounted) setOnline(state.isInternetReachable ?? false);
    });

    return () => {
      mounted = false;
      subscription.remove();
    };
  }, []);

  return online;
}
