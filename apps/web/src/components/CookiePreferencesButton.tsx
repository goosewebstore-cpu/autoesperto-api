'use client';
export default function CookiePreferencesButton() {
  return <button type="button" className="inline-flex min-h-0 items-center py-0 text-left text-xs leading-5 hover:underline focus-visible:outline focus-visible:outline-blue-600" onClick={() => window.dispatchEvent(new Event('ae-open-cookie-preferences'))}>Preferenze cookie</button>;
}
