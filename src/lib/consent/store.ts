"use client";

import { useSyncExternalStore } from "react";
import {
  CONSENT_STORAGE_KEY,
  CONSENT_VERSION,
  DENY_ALL,
  type ConsentCategories,
  type ConsentRecord,
} from "@/lib/consent/types";

/**
 * A hand-rolled store rather than a library or a React context: consent is
 * read by scripts and components that sit in different parts of the tree,
 * has to survive a reload, and has to stay in step across tabs. That's three
 * plain browser APIs and a subscription — no dependency earns its weight
 * here, and nothing about it is React-specific except the hook at the end.
 */

type Listener = () => void;

const listeners = new Set<Listener>();

/**
 * getSnapshot has to return a stable reference or React re-renders forever,
 * so the parsed record is cached and only re-read when something actually
 * invalidates it (a write here, or a write in another tab).
 */
let cache: ConsentRecord | null = null;
let cacheLoaded = false;

function parse(raw: string | null): ConsentRecord | null {
  if (!raw) return null;
  try {
    const parsed: unknown = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object") return null;

    const record = parsed as Partial<ConsentRecord>;
    if (
      typeof record.analytics !== "boolean" ||
      typeof record.marketing !== "boolean"
    ) {
      return null;
    }
    // A decision taken against an older set of categories isn't a decision
    // about the current ones — ask again rather than assume.
    if (record.version !== CONSENT_VERSION) return null;

    return {
      analytics: record.analytics,
      marketing: record.marketing,
      version: CONSENT_VERSION,
      decidedAt: record.decidedAt ?? new Date(0).toISOString(),
    };
  } catch {
    // Corrupted or hand-edited value — treat as undecided.
    return null;
  }
}

function load(): ConsentRecord | null {
  if (typeof window === "undefined") return null;
  try {
    return parse(window.localStorage.getItem(CONSENT_STORAGE_KEY));
  } catch {
    // Storage can throw outright in private modes or under a blocking
    // cookie policy. No stored decision means the banner shows, which is
    // the safe direction to fail in.
    return null;
  }
}

function emit() {
  for (const listener of listeners) listener();
}

/** The stored decision, or null if the user hasn't made one. */
export function readConsent(): ConsentRecord | null {
  if (!cacheLoaded) {
    cache = load();
    cacheLoaded = true;
  }
  return cache;
}

export function saveConsent(categories: ConsentCategories): ConsentRecord {
  const record: ConsentRecord = {
    ...categories,
    version: CONSENT_VERSION,
    decidedAt: new Date().toISOString(),
  };

  cache = record;
  cacheLoaded = true;

  try {
    window.localStorage.setItem(CONSENT_STORAGE_KEY, JSON.stringify(record));
  } catch {
    // Couldn't persist — the decision still holds for this page view, and
    // the banner will simply ask again next time rather than assuming.
  }

  emit();
  return record;
}

/** Wipes the decision and brings the banner back. Used by the tests//QA. */
export function clearConsent() {
  cache = null;
  cacheLoaded = true;
  try {
    window.localStorage.removeItem(CONSENT_STORAGE_KEY);
  } catch {
    /* nothing to do */
  }
  emit();
}

function subscribe(listener: Listener) {
  listeners.add(listener);

  // Another tab changed the decision: drop the cache so the next snapshot
  // re-reads, then notify. Without this, two open tabs disagree.
  const onStorage = (event: StorageEvent) => {
    if (event.key !== null && event.key !== CONSENT_STORAGE_KEY) return;
    cacheLoaded = false;
    emit();
  };
  window.addEventListener("storage", onStorage);

  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", onStorage);
  };
}

/** Always null on the server — see `ready` in the hook below. */
function getServerSnapshot(): ConsentRecord | null {
  return null;
}

export type ConsentState = {
  /** The stored decision, or null while undecided. */
  consent: ConsentRecord | null;
  /** What is allowed to run right now. Everything off until told otherwise. */
  granted: ConsentCategories;
  /** False until the user has answered — this is what shows the banner. */
  hasDecided: boolean;
  /**
   * False during SSR and the first client render. Gate any UI on it: the
   * server can't know what localStorage holds, so rendering the banner
   * before this is true would mismatch on hydration.
   */
  ready: boolean;
};

export function useConsent(): ConsentState {
  const consent = useSyncExternalStore(
    subscribe,
    readConsent,
    getServerSnapshot,
  );
  const ready = useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );

  return {
    consent,
    granted: consent
      ? { analytics: consent.analytics, marketing: consent.marketing }
      : DENY_ALL,
    hasDecided: consent !== null,
    ready,
  };
}
