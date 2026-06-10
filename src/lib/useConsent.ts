// Cookie/tracking consent store + hook.
//
// MusterDeck uses only strictly-necessary storage today, so the only real
// category is "essential" (always on). "analytics" is opt-in scaffolding for
// when/if a tracker is ever added — nothing reads it yet, but future
// tracker-loading code MUST gate on `analyticsAllowed` before running.
//
// State lives in a small module-level store (not React context) so the banner
// and the footer "Cookie preferences" link stay in sync without threading a
// provider through the app. Consumers subscribe via useSyncExternalStore.

import { useSyncExternalStore } from 'react';

export const CONSENT_VERSION = 1;
const STORAGE_KEY = 'md-consent';

export type ConsentCategories = {
  essential: true;
  analytics: boolean;
};

export type ConsentRecord = {
  version: number;
  timestamp: string;
  categories: ConsentCategories;
};

export const acceptAllCategories: ConsentCategories = { essential: true, analytics: true };
export const rejectAllCategories: ConsentCategories = { essential: true, analytics: false };

type ConsentState = {
  record: ConsentRecord | null;
  isManagerOpen: boolean;
};

function readRecord(): ConsentRecord | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as ConsentRecord;
    // A version bump invalidates prior consent and re-prompts the user.
    if (parsed.version !== CONSENT_VERSION) return null;
    return parsed;
  } catch {
    // Storage blocked/unavailable or corrupt — treat as "no decision yet".
    return null;
  }
}

let state: ConsentState = { record: readRecord(), isManagerOpen: false };
const listeners = new Set<() => void>();

function emit() {
  for (const listener of listeners) listener();
}

function setState(next: Partial<ConsentState>) {
  state = { ...state, ...next };
  emit();
}

function subscribe(callback: () => void) {
  listeners.add(callback);
  return () => {
    listeners.delete(callback);
  };
}

function getSnapshot() {
  return state;
}

export function saveConsent(categories: ConsentCategories) {
  const record: ConsentRecord = {
    version: CONSENT_VERSION,
    timestamp: new Date().toISOString(),
    categories,
  };
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(record));
  } catch {
    // If we can't persist, still honor the choice for this session.
  }
  setState({ record, isManagerOpen: false });
}

export function openConsentManager() {
  setState({ isManagerOpen: true });
}

export function closeConsentManager() {
  setState({ isManagerOpen: false });
}

export function useConsent() {
  const snapshot = useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
  return {
    record: snapshot.record,
    hasDecided: snapshot.record !== null,
    isManagerOpen: snapshot.isManagerOpen,
    analyticsAllowed: snapshot.record?.categories.analytics ?? false,
  };
}
