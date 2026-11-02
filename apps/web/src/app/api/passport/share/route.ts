import { NextResponse } from 'next/server';
import { getServerPublicPassportsMap } from '@/lib/serverPassportStore';

const VEHICLE_FIELDS = ['mk', 'md', 'vr', 'y', 'f', 'p', 'dp', 'tr', 'bd', 'cl', 'ec', 'img'] as const;
const SHARE_FLAGS = [
  'enabled', 'showVehicleInfo', 'showMaintenance', 'showRepairs', 'showRevisions',
  'showHealthScore', 'showMileage', 'showOriginalDocs', 'showPhotos', 'showTimeline', 'showValuation',
] as const;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function pick(value: Record<string, unknown>, keys: readonly string[]) {
  return Object.fromEntries(keys.filter((key) => value[key] !== undefined).map((key) => [key, value[key]]));
}

function sanitizePublicPassport(value: unknown): Record<string, unknown> | null {
  if (!isRecord(value) || typeof value.c !== 'string' || !/^AE-[A-Z0-9]{5,32}$/i.test(value.c)) return null;
  if (!isRecord(value.v) || typeof value.v.mk !== 'string' || typeof value.v.md !== 'string') return null;
  if (value.v.mk.length > 80 || value.v.md.length > 100) return null;
  if (value.km !== undefined && (typeof value.km !== 'number' || !Number.isInteger(value.km) || value.km < 0 || value.km > 2_000_000)) return null;
  if (value.hs !== undefined && (typeof value.hs !== 'number' || value.hs < 0 || value.hs > 100)) return null;

  const flags = isRecord(value.sc) ? value.sc : {};

  const safe: Record<string, unknown> = {
    c: value.c.toUpperCase(),
    v: pick(value.v, flags.showVehicleInfo === false ? ['mk', 'md', 'img'] : VEHICLE_FIELDS),
  };
  if (flags.showPhotos === false) (safe.v as Record<string, unknown>).img = undefined;
  if (flags.showMileage === true && value.km !== undefined) safe.km = value.km;
  if (flags.showMileage === true && typeof value.kd === 'string' && value.kd.length <= 40) safe.kd = value.kd;
  if (flags.showHealthScore === true && value.hs !== undefined) safe.hs = value.hs;
  for (const key of ['ev', 'em', 'rp', 'ab'] as const) {
    const amount = value[key];
    if (flags.showValuation === true && typeof amount === 'number' && Number.isFinite(amount) && amount >= 0 && amount <= 10_000_000) safe[key] = amount;
  }
  if (flags.showPhotos === true && Array.isArray(value.ph)) {
    safe.ph = value.ph.slice(0, 30).filter(isRecord).map((photo) => pick(photo, ['id', 'u', 'c', 't', 'd']));
  }
  if (flags.showTimeline === true && Array.isArray(value.tm)) {
    safe.tm = value.tm.slice(0, 100).filter(isRecord).map((item) => pick(item, flags.showMileage === true ? ['id', 'd', 'k', 't', 'ti', 'de', 'c'] : ['id', 'd', 't', 'ti', 'de', 'c']));
  }
  if (isRecord(value.sc)) safe.sc = pick(value.sc, SHARE_FLAGS);
  if (isRecord(value.sl)) {
    const selling = pick(value.sl, [
      'enabled', 'askingPrice', 'negotiable', 'showValuation', 'showHealthScore',
      'showMaintenance', 'showInspection', 'showPhotos', 'allowContact',
      'contactMethod', 'contactValue', 'sellerNotes',
    ]);
    for (const key of ['contactValue', 'sellerNotes'] as const) {
      if (typeof selling[key] === 'string') selling[key] = selling[key].slice(0, key === 'sellerNotes' ? 1000 : 160);
    }
    safe.sl = selling;
  }
  if (['AI_ANALYZED', 'VERIFIED', 'INSPECTED'].includes(String(value.tb))) safe.tb = value.tb;
  if (typeof value.ca === 'string' && value.ca.length <= 40) safe.ca = value.ca;
  return safe;
}

export async function POST(req: Request) {
  try {
    const body = sanitizePublicPassport(await req.json());
    if (!body) return NextResponse.json({ success: false, error: 'Dati del profilo non validi' }, { status: 400 });
    const shareCode = String(body.c);

    // Store only the public, allowlisted vehicle fields. Never retain arbitrary request data.
    const map = getServerPublicPassportsMap();
    const existing = map.get(shareCode);
    if (existing && JSON.stringify(existing) !== JSON.stringify(body)) {
      return NextResponse.json({ success: false, error: 'Questo profilo condiviso non può essere sovrascritto' }, { status: 409 });
    }
    if (!existing) map.set(shareCode, body);

    // Also forward to Render backend if reachable
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://autoesperto-api.onrender.com';
    void fetch(`${apiUrl}/passport/share`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(5_000),
    }).catch(() => undefined);

    return NextResponse.json({ success: true, shareCode });
  } catch {
    return NextResponse.json({ success: false, error: 'Impossibile salvare il profilo condiviso' }, { status: 500 });
  }
}
