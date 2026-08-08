"use client";

import { useCallback, useSyncExternalStore } from "react";

const getServerSnapshot = () => false;

/**
 * Hydration-safe media query hook. `useSyncExternalStore` is the pattern
 * React itself recommends for subscribing to a browser API like this: it
 * renders the server snapshot (`false`) through hydration, then swaps in
 * the real client value right after — without the manual "sync on mount"
 * effect that trips the `set-state-in-effect` lint rule and (as found
 * here) can leave the wrong value in place if nothing ever fires a
 * `change` event afterwards.
 */
export function useMediaQuery(query: string) {
  const subscribe = useCallback(
    (callback: () => void) => {
      const mql = window.matchMedia(query);
      mql.addEventListener("change", callback);
      return () => mql.removeEventListener("change", callback);
    },
    [query],
  );
  const getSnapshot = useCallback(
    () => window.matchMedia(query).matches,
    [query],
  );

  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
