/**
 * The two optional categories the site actually uses. Technical cookies are
 * deliberately absent: they carry no consent decision, so there is nothing
 * to store for them (see Política de Cookies, clause 2).
 */
export type ConsentCategories = {
  /** Google Analytics. */
  analytics: boolean;
  /** Meta Pixel. */
  marketing: boolean;
};

/**
 * What actually lands in localStorage. The two booleans sit at the top level
 * so the stored shape is readable on its own; `version` and `decidedAt` are
 * the housekeeping around them — the timestamp is the record of *when*
 * consent was given, which the GDPR expects you to be able to show, and the
 * version is what lets a changed cookie policy ask again (see
 * CONSENT_VERSION).
 */
export type ConsentRecord = ConsentCategories & {
  version: number;
  decidedAt: string;
};

/** Nothing runs until the user says so. */
export const DENY_ALL: ConsentCategories = {
  analytics: false,
  marketing: false,
};

export const ALLOW_ALL: ConsentCategories = {
  analytics: true,
  marketing: true,
};

/**
 * Bump when the categories or the vendors behind them change — every stored
 * decision from an older version is treated as no decision, and the banner
 * comes back. Don't bump for copy edits.
 */
export const CONSENT_VERSION = 1;

export const CONSENT_STORAGE_KEY = "cookieConsent";
