const CONSENT_KEY = 'ae-consent';

export type ConsentChoice = 'accepted' | 'refused' | null;

export function getConsent(): ConsentChoice {
  if (typeof window === 'undefined') return null;
  const raw = window.localStorage.getItem(CONSENT_KEY);
  return raw === 'accepted' || raw === 'refused' ? raw : null;
}

export function setConsent(choice: 'accepted' | 'refused'): void {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(CONSENT_KEY, choice);
  window.dispatchEvent(new CustomEvent('ae-consent-changed', { detail: choice }));
}
