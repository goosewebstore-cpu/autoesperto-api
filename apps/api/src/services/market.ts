import type { MarketLink, MarketListing, MarketStats, VehicleData } from '@autoesperto/types';
import { cacheGet, cacheSet } from './cache';

const SUBITO_BASE = 'https://www.subito.it';
const SUBITO_TTL = 6 * 60 * 60 * 1000;
const FETCH_TIMEOUT_MS = 6000;
const USER_AGENT =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0 Safari/537.36';

export function getMarketSearchUrls(vehicle: VehicleData): MarketLink[] {
  const year = vehicle.year || 2020;
  const make = encodeURIComponent(vehicle.make);
  const model = encodeURIComponent(vehicle.model);

  return [
    {
      source: 'AutoScout24',
      url: `https://www.autoscout24.it/risultati/?cy=IT&make=${make}&model=${model}&fregfrom=${year - 1}&fregto=${year + 1}&sort=standard`,
    },
    {
      source: 'Subito.it',
      url: getSubitoSearchUrl(vehicle.make, vehicle.model),
    },
    {
      source: 'Automobile.it',
      url: `https://www.automobile.it/annunci/${vehicle.make.toLowerCase()}-${vehicle.model.toLowerCase().replace(/\s+/g, '-')}/?annoDa=${year - 1}&annoA=${year + 1}`,
    },
  ];
}

export function getSubitoSearchUrl(make: string, model: string): string {
  return `${SUBITO_BASE}/annunci-italia/vendita/auto/${subitoSlug(make)}/${subitoSlug(model)}/`;
}

function subitoSlug(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/&/g, ' e ')
    .replace(/[-\s]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

interface SubitoAd {
  subject?: string;
  urls?: { default?: string };
  geo?: {
    region?: { value?: string };
    city?: { value?: string };
    town?: { value?: string };
  };
  features?: Record<
    string,
    {
      values?: Array<{ key?: string; value?: string; label?: string }>;
    }
  >;
}

interface SubitoItems {
  total?: number;
  originalList?: SubitoAd[];
}

function featValue(ad: SubitoAd, key: string): string | undefined {
  const f = ad.features?.[key];
  return f?.values?.[0]?.value;
}

function featNum(ad: SubitoAd, key: string): number | undefined {
  const f = ad.features?.[key];
  const raw = f?.values?.[0]?.key;
  if (raw === undefined || raw === null) return undefined;
  const n = Number(String(raw).replace(/\D/g, ''));
  return Number.isFinite(n) && n > 0 ? n : undefined;
}

function listingFromAd(ad: SubitoAd, index: number): MarketListing | undefined {
  const price = featNum(ad, '/price');
  if (!price) return undefined;
  const relativeUrl = ad.urls?.default;
  const sourceUrl = relativeUrl
    ? (relativeUrl.startsWith('http') ? relativeUrl : `${SUBITO_BASE}${relativeUrl}`)
    : SUBITO_BASE;
  return {
    id: `${ad.subject || 'annuncio'}-${index}-${price}`,
    title: ad.subject || 'Annuncio auto usata',
    price,
    km: featNum(ad, '/mileage_scalar') || 0,
    year: featNum(ad, '/year') || 0,
    city: ad.geo?.city?.value || ad.geo?.town?.value || ad.geo?.region?.value || '',
    source: 'subito.it',
    sourceUrl,
  };
}

export async function fetchSubitoMarketStats(
  make: string,
  model: string,
  year?: number,
  km?: number
): Promise<MarketStats | undefined> {
  const url = getSubitoSearchUrl(make, model);
  const cacheKey = `subito:${make.toLowerCase()}:${model.toLowerCase()}:${year || 'any'}:${km || 'any'}`;
  const cached = cacheGet<MarketStats>(cacheKey);
  if (cached) return cached;

  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);
    let text = '';
    try {
      const res = await fetch(url, {
        headers: {
          'User-Agent': USER_AGENT,
          'Accept-Language': 'it-IT,it;q=0.9',
          Accept: 'text/html,application/xhtml+xml',
        },
        signal: controller.signal,
      });
      if (!res.ok) return undefined;
      text = await res.text();
    } finally {
      clearTimeout(timer);
    }

    const match = text.match(/<script id="__NEXT_DATA__" type="application\/json"[^>]*>([\s\S]*?)<\/script>/);
    if (!match) return undefined;

    const data = JSON.parse(match[1]);
    const items: SubitoItems | undefined =
      data?.props?.pageProps?.initialState?.items;
    const ads = items?.originalList || [];
    if (!Array.isArray(ads) || ads.length === 0) return undefined;

    const priceOf = (ad: SubitoAd) => featNum(ad, '/price');
    const kmOf = (ad: SubitoAd) => featNum(ad, '/mileage_scalar');
    const yearOf = (ad: SubitoAd) => featNum(ad, '/year');

    const yearPool = year ? ads.filter((a) => {
      const y = yearOf(a);
      return y !== undefined && y >= year - 1 && y <= year + 1;
    }) : ads;
    const yearMatched = !year || yearPool.length >= 3;
    const kmTolerance = km ? Math.max(15000, Math.round(km * 0.3)) : 0;
    const kmPool = km
      ? yearPool.filter((a) => {
          const adKm = kmOf(a);
          return adKm !== undefined && Math.abs(adKm - km) <= kmTolerance;
        })
      : yearPool;
    const kmMatched = !km || kmPool.length >= 3;
    // Prefer the closest comparable group. When the market is too thin we fall back
    // gradually and disclose that in the report instead of presenting it as exact.
    const filtered = kmPool.length >= 3 ? kmPool : yearPool.length >= 3 ? yearPool : ads;

    const prices = filtered.map(priceOf).filter((p): p is number => p !== undefined);
    const kms = filtered.map(kmOf).filter((k): k is number => k !== undefined);
    const years = filtered.map(yearOf).filter((y): y is number => y !== undefined);

    if (prices.length < 3) return undefined;
    const priceAvg = Math.round(prices.reduce((a, b) => a + b, 0) / prices.length / 100) * 100;

    const listings = filtered
      .map(listingFromAd)
      .filter((listing): listing is MarketListing => Boolean(listing))
      .sort((a, b) => Math.abs(a.price - priceAvg) - Math.abs(b.price - priceAvg))
      .slice(0, 3);

    const stats: MarketStats = {
      source: 'subito.it',
      total: prices.length,
      priceAvg,
      priceMin: Math.min(...prices),
      priceMax: Math.max(...prices),
      kmAvg: kms.length ? Math.round(kms.reduce((a, b) => a + b, 0) / kms.length / 100) * 100 : undefined,
      yearMin: years.length ? Math.min(...years) : undefined,
      yearMax: years.length ? Math.max(...years) : undefined,
      url,
      fetchedAt: new Date().toISOString(),
      listings,
      comparison: {
        targetYear: year,
        targetKm: km,
        yearMatched,
        kmMatched,
      },
    };

    cacheSet(cacheKey, stats, SUBITO_TTL);
    return stats;
  } catch {
    return undefined;
  }
}
