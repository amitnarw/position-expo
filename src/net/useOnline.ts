import { useCallback, useEffect, useState } from 'react';
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

  const setReachable = useCallback((value: boolean | null) => {
    setOnline(value);
  }, []);

  const check = useCallback(async () => {
    try {
      const state = await Network.getNetworkStateAsync();
      setReachable(state.isInternetReachable ?? false);
    } catch {
      setReachable(false);
    }
  }, [setReachable]);

  useEffect(() => {
    let mounted = true;

    // Initial reachability read. The setState happens inside an async callback,
    // not synchronously in the effect body, so it cannot cascade renders.
    void (async () => {
      try {
        const state = await Network.getNetworkStateAsync();
        if (mounted) setOnline(state.isInternetReachable ?? false);
      } catch {
        if (mounted) setOnline(false);
      }
    })();

    const subscription = Network.addNetworkStateListener((state) => {
      if (mounted) setOnline(state.isInternetReachable ?? false);
    });

    return () => {
      mounted = false;
      subscription.remove();
    };
  }, []);

  return { online, refetch: check };
}
