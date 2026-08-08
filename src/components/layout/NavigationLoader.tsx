"use client";

import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

// Navigations that resolve faster than this never show the overlay, so
// instant (prefetched/static) route changes don't flash a loader.
const SHOW_AFTER_MS = 150;
// Failsafe: if a route change never lands (blocked navigation, external
// handler calling preventDefault later, a download), don't strand the
// overlay on screen.
const MAX_VISIBLE_MS = 8000;

/**
 * Global route-transition overlay.
 *
 * Next's own `loading.tsx` replaces a segment's content, and `useLinkStatus`
 * only works inside a single `<Link>` — neither can show the outgoing page
 * blurred underneath, which is the effect asked for here. So this listens
 * for internal link clicks to know a navigation started, and clears itself
 * when `usePathname()` reports the new route has committed.
 */
export function NavigationLoader() {
  const pathname = usePathname();
  const [visible, setVisible] = useState(false);
  const shouldReduceMotion = useReducedMotion();
  const showTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const failsafeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  function clearTimers() {
    if (showTimer.current) clearTimeout(showTimer.current);
    if (failsafeTimer.current) clearTimeout(failsafeTimer.current);
    showTimer.current = null;
    failsafeTimer.current = null;
  }

  // The new route has rendered — tear the overlay down. Adjusted during
  // render (React's recommended pattern, same as Navbar.tsx closing its
  // menu on navigation) rather than in an effect, which would be a
  // cascading synchronous setState.
  const [prevPathname, setPrevPathname] = useState(pathname);
  if (pathname !== prevPathname) {
    setPrevPathname(pathname);
    setVisible(false);
  }

  useEffect(() => {
    // Side effect only, no setState — safe in an effect.
    clearTimers();
  }, [pathname]);

  useEffect(() => {
    function handleClick(event: MouseEvent) {
      // Ignore anything the browser will handle itself: new tabs, modified
      // clicks, non-primary buttons, or a handler that already opted out.
      if (
        event.defaultPrevented ||
        event.button !== 0 ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey
      ) {
        return;
      }

      const anchor = (event.target as Element | null)?.closest?.("a");
      if (!anchor) return;
      if (anchor.target && anchor.target !== "_self") return;
      if (anchor.hasAttribute("download")) return;

      const href = anchor.getAttribute("href");
      if (!href || href.startsWith("#")) return;

      let url: URL;
      try {
        url = new URL(anchor.href, window.location.href);
      } catch {
        return;
      }
      // External links and mailto:/tel: leave the app entirely.
      if (url.origin !== window.location.origin) return;
      // Same route (or a pure hash jump) never triggers a page load.
      if (
        url.pathname === window.location.pathname &&
        url.search === window.location.search
      ) {
        return;
      }

      clearTimers();
      // Re-check the location when the timer fires: if the route already
      // landed within the grace period, the navigation was instant and
      // the overlay should never appear at all.
      const from = window.location.pathname + window.location.search;
      showTimer.current = setTimeout(() => {
        if (window.location.pathname + window.location.search === from) {
          setVisible(true);
        }
      }, SHOW_AFTER_MS);
      failsafeTimer.current = setTimeout(() => {
        clearTimers();
        setVisible(false);
      }, MAX_VISIBLE_MS);
    }

    document.addEventListener("click", handleClick, true);
    return () => {
      document.removeEventListener("click", handleClick, true);
      clearTimers();
    };
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="navigation-loader"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
          // Sits above the navbar (z-50) so nothing pokes through, and the
          // translucent cream over a backdrop blur leaves the outgoing page
          // faintly legible underneath rather than blanking it out.
          className="bg-background/70 fixed inset-0 z-[100] flex flex-col items-center justify-center gap-5 backdrop-blur-md"
          role="status"
          aria-live="polite"
        >
          <motion.div
            animate={
              shouldReduceMotion
                ? undefined
                : { scale: [1, 1.08, 1], opacity: [0.75, 1, 0.75] }
            }
            transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
          >
            <Image
              src="/assets/logo/trimmed/Favicon vino.png"
              alt=""
              aria-hidden
              width={322}
              height={270}
              priority
              className="h-7 w-auto"
            />
          </motion.div>
          <p className="text-primary/70 text-sm tracking-wide">Cargando...</p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
