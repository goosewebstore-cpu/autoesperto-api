import { NextResponse } from 'next/server';
import { getServerPublicPassportsMap } from '@/lib/serverPassportStore';

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ code: string }> }
) {
  try {
    const { code } = await params;
    const clean = (code || '').toUpperCase().trim();
    if (!/^AE-[A-Z0-9]{5,32}$/.test(clean)) {
      return NextResponse.json({ success: false, error: 'Codice non valido' }, { status: 400 });
    }

    // 1. Check in-memory server store
    const map = getServerPublicPassportsMap();
    const cached = map.get(clean);
    if (cached) {
      return NextResponse.json({ success: true, payload: cached }, { headers: { 'Cache-Control': 'no-store' } });
    }

    // 2. Fallback to Render backend API
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://autoesperto-api.onrender.com';
    try {
      const res = await fetch(`${apiUrl}/passport/public/${clean}`, {
        headers: { Accept: 'application/json' },
        cache: 'no-store',
      });
      if (res.ok) {
        const data = await res.json();
        if (data.success && (data.payload || data.passport)) {
          const payload = data.payload || data.passport;
          map.set(clean, payload);
          return NextResponse.json({ success: true, payload }, { headers: { 'Cache-Control': 'no-store' } });
        }
      }
    } catch {}

    return NextResponse.json({ success: false, error: 'Profilo non trovato' }, { status: 404 });
  } catch {
    return NextResponse.json({ success: false, error: 'Impossibile recuperare il profilo condiviso' }, { status: 500 });
  }
}
