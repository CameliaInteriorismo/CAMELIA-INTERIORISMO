"use client";

import { openConsentSettings } from "@/components/consent/CookieConsent";

/**
 * The permanent way back into the preferences panel, promised by clause 3
 * of the Política de Cookies ("puedes modificar tu consentimiento en
 * cualquier momento"). Sits in the footer beside the legal links, styled as
 * one of them.
 */
export function ConsentSettingsLink({ className }: { className?: string }) {
  return (
    <button type="button" onClick={openConsentSettings} className={className}>
      Configuración de cookies
    </button>
  );
}
