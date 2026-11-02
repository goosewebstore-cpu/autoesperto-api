const SESSION_MARKER_KEY = 'autoesperto-session-active';

export function hasAuthSession(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    return window.sessionStorage.getItem(SESSION_MARKER_KEY) === '1';
  } catch {
    return false;
  }
}

export function markAuthSession(): void {
  if (typeof window === 'undefined') return;
  try {
    window.sessionStorage.setItem(SESSION_MARKER_KEY, '1');
  } catch {}
}

export async function setAuthToken(token: string): Promise<void> {
  const response = await fetch('/api/auth/session', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ token }),
  });
  if (!response.ok) throw new Error('Impossibile avviare la sessione. Accedi di nuovo.');
  markAuthSession();
}

export function clearAuthToken(): void {
  if (typeof window !== 'undefined') {
    try { window.sessionStorage.removeItem(SESSION_MARKER_KEY); } catch {}
  }
  void fetch('/api/auth/session', { method: 'DELETE', credentials: 'same-origin' }).catch(() => undefined);
}
