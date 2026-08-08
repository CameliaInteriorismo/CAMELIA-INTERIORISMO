"use client";

import { useCallback, useEffect, useState } from "react";
import { CookieBanner } from "@/components/consent/CookieBanner";
import { ConsentScripts } from "@/components/consent/ConsentScripts";
import { ConsentSettings } from "@/components/consent/ConsentSettings";
import { saveConsent, useConsent } from "@/lib/consent/store";
import {
  ALLOW_ALL,
  DENY_ALL,
  type ConsentCategories,
} from "@/lib/consent/types";

/** Fired by the footer's "Configuración de cookies" link. */
export const OPEN_CONSENT_SETTINGS_EVENT = "camelia:open-consent-settings";

export function openConsentSettings() {
  window.dispatchEvent(new Event(OPEN_CONSENT_SETTINGS_EVENT));
}

/**
 * The single mount point for the whole consent system — banner, settings
 * panel and the gated third-party tags. Lives in the root layout so it
 * covers every route, including the form and the confirmation screens.
 */
export function CookieConsent() {
  const { granted, hasDecided, ready } = useConsent();
  const [settingsOpen, setSettingsOpen] = useState(false);

  // Lets anything on the page reopen the panel without prop-drilling a
  // setter through the tree — a window event is the smallest thing that
  // crosses a layout boundary, and the footer is the only caller.
  useEffect(() => {
    const open = () => setSettingsOpen(true);
    window.addEventListener(OPEN_CONSENT_SETTINGS_EVENT, open);
    return () => window.removeEventListener(OPEN_CONSENT_SETTINGS_EVENT, open);
  }, []);

  const decide = useCallback(
    (categories: ConsentCategories) => {
      // Withdrawing a permission that was already granted can't be undone by
      // React alone: the vendor script is in the document and has its own
      // globals and timers. A reload is the only honest way to be rid of it.
      const isWithdrawal =
        (granted.analytics && !categories.analytics) ||
        (granted.marketing && !categories.marketing);

      saveConsent(categories);
      setSettingsOpen(false);

      if (isWithdrawal) window.location.reload();
    },
    [granted],
  );

  return (
    <>
      <CookieBanner
        // Only after `ready` — before that we don't yet know whether this
        // visitor has already answered, and flashing the banner at someone
        // who accepted months ago is exactly the annoyance to avoid.
        open={ready && !hasDecided && !settingsOpen}
        onAcceptAll={() => decide(ALLOW_ALL)}
        onRejectAll={() => decide(DENY_ALL)}
        onConfigure={() => setSettingsOpen(true)}
      />

      <ConsentSettings
        open={settingsOpen}
        initial={granted}
        onSave={decide}
        onClose={() => setSettingsOpen(false)}
      />

      <ConsentScripts />
    </>
  );
}
