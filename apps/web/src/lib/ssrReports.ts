import fs from 'fs';
import path from 'path';
import type { AutoReport } from '@autoesperto/types';
import { API_URL } from '@/lib/api';

const CACHE_DIR = path.join(process.cwd(), '.next', 'cache', 'ssr-reports');
const CACHE_TTL_MS = 7 * 24 * 60 * 60 * 1000;

const memoryCache = new Map<string, { value: AutoReport; expires: number }>();

function keyFor(make: string, model: string, year?: number): string {
  return `${make.toLowerCase()}|${model.toLowerCase()}|${year || 'any'}`;
}

function fileFor(key: string): string {
  return path.join(CACHE_DIR, `${key.replace(/[^a-z0-9|]/gi, '_')}.json`);
}

function readFromDisk(key: string): AutoReport | undefined {
  try {
    const raw = fs.readFileSync(fileFor(key), 'utf8');
    const parsed = JSON.parse(raw) as { report: AutoReport; savedAt: number };
    if (Date.now() - parsed.savedAt > CACHE_TTL_MS) return undefined;
    return parsed.report;
  } catch {
    return undefined;
  }
}

function writeToDisk(key: string, report: AutoReport): void {
  try {
    fs.mkdirSync(CACHE_DIR, { recursive: true });
    fs.writeFileSync(fileFor(key), JSON.stringify({ report, savedAt: Date.now() }), 'utf8');
  } catch {
    /* cache non persistente: il fallback è la cache in memoria */
  }
}

function readMemory(key: string): AutoReport | undefined {
  const entry = memoryCache.get(key);
  if (!entry) return undefined;
  if (entry.expires < Date.now()) {
    memoryCache.delete(key);
    return undefined;
  }
  return entry.value;
}

function writeMemory(key: string, report: AutoReport): void {
  memoryCache.set(key, { value: report, expires: Date.now() + CACHE_TTL_MS });
  if (memoryCache.size > 500) {
    const oldest = memoryCache.keys().next().value;
    if (oldest) memoryCache.delete(oldest);
  }
}

export async function getSsrReport(make: string, model: string, year?: number): Promise<AutoReport | undefined> {
  const key = keyFor(make, model, year);
  const fromMemory = readMemory(key);
  if (fromMemory) return fromMemory;
  const fromDisk = readFromDisk(key);
  if (fromDisk) {
    writeMemory(key, fromDisk);
    return fromDisk;
  }

  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 15000);
    const res = await fetch(`${API_URL}/reports/analyze`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ make, model, ...(year ? { year } : {}) }),
      signal: controller.signal,
    });
    clearTimeout(timer);
    if (!res.ok) return undefined;
    const data = (await res.json()) as { success?: boolean; report?: AutoReport };
    if (data.success && data.report) {
      writeMemory(key, data.report);
      writeToDisk(key, data.report);
      return data.report;
    }
    return undefined;
  } catch {
    return undefined;
  }
}
