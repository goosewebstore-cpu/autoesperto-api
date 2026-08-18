/**
 * Consent management — GDPR-compliant granular consent per category.
 *
 * Categories:
 *   - necessary:  always active (session, auth, essential functionality)
 *   - analytics:  GA4, internal analytics, performance tracking
 *   - marketing:  AdSense, Google Ads conversion, third-party marketing
 *
 * Persistence: localStorage with 6-month TTL.
 * Events: dispatches 'ae-consent-changed' on every change (detail = ConsentPreferences).
 */

const CONSENT_KEY = 'ae-consent-v2';
const LEGACY_KEY = 'ae-consent';
const TTL_MS = 180 * 24 * 60 * 60 * 1000; // 6 months

export type ConsentCategory = 'necessary' | 'analytics' | 'marketing';

export interface ConsentPreferences {
  analytics: boolean;
  marketing: boolean;
  timestamp: number;
}

/** Legacy type kept for backward compat during migration. */
export type ConsentChoice = 'accepted' | 'refused' | null;

// ─── Read ────────────────────────────────────────────────────────────────

function readStored(): ConsentPreferences | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = window.localStorage.getItem(CONSENT_KEY);
    if (!raw) return null;
    const parsed: ConsentPreferences = JSON.parse(raw);
    if (Date.now() - parsed.timestamp > TTL_MS) {
      window.localStorage.removeItem(CONSENT_KEY);
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
}

/**
 * Migrate from old binary consent to the new granular system.
 * 'accepted' → all categories on. 'refused' → all off.
 */
function migrateLegacy(): ConsentPreferences | null {
  if (typeof window === 'undefined') return null;
  try {
    const legacy = window.localStorage.getItem(LEGACY_KEY);
    if (!legacy) return null;
    const prefs: ConsentPreferences = {
      analytics: legacy === 'accepted',
      marketing: legacy === 'accepted',
      timestamp: Date.now(),
    };
    window.localStorage.setItem(CONSENT_KEY, JSON.stringify(prefs));
    window.localStorage.removeItem(LEGACY_KEY);
    return prefs;
  } catch {
    return null;
  }
}

/** Returns null when the user hasn't decided yet (banner should show). */
export function getConsentPreferences(): ConsentPreferences | null {
  return readStored() ?? migrateLegacy();
}

/** Check whether a specific category is consented. 'necessary' is always true. */
export function hasCategory(cat: ConsentCategory): boolean {
  if (cat === 'necessary') return true;
  const prefs = getConsentPreferences();
  if (!prefs) return false;
  return prefs[cat] ?? false;
}

/** Convenience: true when the user has made any choice (banner dismissed). */
export function hasConsent(): boolean {
  return getConsentPreferences() !== null;
}

// ─── Backward-compatible helpers (used by existing components) ───────────

/** @deprecated — use getConsentPreferences() instead. */
export function getConsent(): ConsentChoice {
  const prefs = getConsentPreferences();
  if (!prefs) return null;
  return prefs.analytics || prefs.marketing ? 'accepted' : 'refused';
}

// ─── Write ───────────────────────────────────────────────────────────────

/** Save user preferences. */
export function setConsentPreferences(prefs: Omit<ConsentPreferences, 'timestamp'>): void {
  if (typeof window === 'undefined') return;
  const full: ConsentPreferences = { ...prefs, timestamp: Date.now() };
  window.localStorage.setItem(CONSENT_KEY, JSON.stringify(full));
  // Remove legacy key if present
  window.localStorage.removeItem(LEGACY_KEY);
  window.dispatchEvent(
    new CustomEvent('ae-consent-changed', { detail: full }),
  );
}

/** Accept all categories. */
export function acceptAll(): void {
  setConsentPreferences({ analytics: true, marketing: true });
}

/** Refuse all optional categories. */
export function refuseAll(): void {
  setConsentPreferences({ analytics: false, marketing: false });
}

/** @deprecated — use acceptAll/refuseAll/setConsentPreferences instead. */
export function setConsent(choice: 'accepted' | 'refused'): void {
  if (choice === 'accepted') {
    acceptAll();
  } else {
    refuseAll();
  }
}
