/**
 * Native Bridge per AutoEsperto
 * Fornisce un'interfaccia unificata per le funzionalità native (Vibrazione/Haptics, Condivisione,
 * Rilevamento PWA/Mobile) sia su browser web/PWA che su build nativa Capacitor (iOS/Android).
 */

export function isClient(): boolean {
  return typeof window !== 'undefined';
}

export function isMobileDevice(): boolean {
  if (!isClient()) return false;
  return /Android|iPhone|iPad|iPod|Opera Mini|IEMobile|WPDesktop/i.test(navigator.userAgent);
}

export function isIOS(): boolean {
  if (!isClient()) return false;
  return /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
}

export function isAndroid(): boolean {
  if (!isClient()) return false;
  return /Android/i.test(navigator.userAgent);
}

export function isPWA(): boolean {
  if (!isClient()) return false;
  return (
    window.matchMedia('(display-mode: standalone)').matches ||
    (window.navigator as any).standalone === true ||
    document.referrer.includes('android-app://')
  );
}

export function triggerHaptic(type: 'light' | 'medium' | 'heavy' | 'success' = 'light'): void {
  if (!isClient()) return;
  try {
    if ('vibrate' in navigator) {
      if (type === 'light') navigator.vibrate(12);
      else if (type === 'medium') navigator.vibrate(25);
      else if (type === 'heavy') navigator.vibrate([40, 30, 40]);
      else if (type === 'success') navigator.vibrate([15, 50, 20]);
    }
  } catch {
    // Ignore fallback if permissions denied
  }
}

export async function shareReportNative(data: {
  title: string;
  text?: string;
  url: string;
}): Promise<boolean> {
  if (!isClient()) return false;
  try {
    if (navigator.share && navigator.canShare && navigator.canShare(data)) {
      await navigator.share(data);
      triggerHaptic('success');
      return true;
    }
  } catch (err: any) {
    if (err?.name === 'AbortError') return false;
  }

  // Fallback: Copy to clipboard
  try {
    await navigator.clipboard.writeText(data.url);
    triggerHaptic('light');
    return true;
  } catch {
    return false;
  }
}
