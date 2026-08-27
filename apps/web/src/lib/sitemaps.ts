import { getAllMakes, slugify } from './catalogo';
import { guides } from './guides';

export const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://autoesperto.it';

/** ISO date string used as default lastmod — falls back to today. */
const BUILD_DATE =
  process.env.BUILD_DATE ||
  new Date().toISOString().split('T')[0]; // YYYY-MM-DD

export interface UrlEntry {
  url: string;
  changeFrequency: string;
  priority: number;
  lastmod?: string;
}

const staticPages: UrlEntry[] = [
  { url: siteUrl, changeFrequency: 'weekly', priority: 1, lastmod: BUILD_DATE },
  { url: `${siteUrl}/auto-finder`, changeFrequency: 'daily', priority: 0.95, lastmod: BUILD_DATE },
  { url: `${siteUrl}/ai-car-advisor`, changeFrequency: 'daily', priority: 0.9, lastmod: BUILD_DATE },
  { url: `${siteUrl}/analizza-annuncio`, changeFrequency: 'daily', priority: 0.9, lastmod: BUILD_DATE },
  { url: `${siteUrl}/confronta`, changeFrequency: 'daily', priority: 0.9, lastmod: BUILD_DATE },
  { url: `${siteUrl}/buying-room`, changeFrequency: 'daily', priority: 0.85, lastmod: BUILD_DATE },
  { url: `${siteUrl}/compra`, changeFrequency: 'weekly', priority: 0.85, lastmod: BUILD_DATE },
  { url: `${siteUrl}/vendi`, changeFrequency: 'weekly', priority: 0.85, lastmod: BUILD_DATE },
  { url: `${siteUrl}/valutazione`, changeFrequency: 'weekly', priority: 0.9, lastmod: BUILD_DATE },
  { url: `${siteUrl}/riparazione`, changeFrequency: 'weekly', priority: 0.8, lastmod: BUILD_DATE },
  { url: `${siteUrl}/affidabilita`, changeFrequency: 'weekly', priority: 0.8, lastmod: BUILD_DATE },
  { url: `${siteUrl}/consumi`, changeFrequency: 'weekly', priority: 0.8, lastmod: BUILD_DATE },
  { url: `${siteUrl}/guide`, changeFrequency: 'weekly', priority: 0.8, lastmod: BUILD_DATE },
  { url: `${siteUrl}/chi-siamo`, changeFrequency: 'monthly', priority: 0.6, lastmod: BUILD_DATE },
  { url: `${siteUrl}/verifica-targa`, changeFrequency: 'monthly', priority: 0.8, lastmod: BUILD_DATE },
  { url: `${siteUrl}/calcolo-bollo`, changeFrequency: 'monthly', priority: 0.8, lastmod: BUILD_DATE },
  { url: `${siteUrl}/passaggio-proprieta`, changeFrequency: 'weekly', priority: 0.9, lastmod: BUILD_DATE },
  { url: `${siteUrl}/neopatentati`, changeFrequency: 'weekly', priority: 0.9, lastmod: BUILD_DATE },
  { url: `${siteUrl}/incentivi-auto`, changeFrequency: 'weekly', priority: 0.9, lastmod: BUILD_DATE },
  { url: `${siteUrl}/blocchi-traffico`, changeFrequency: 'weekly', priority: 0.9, lastmod: BUILD_DATE },
  { url: `${siteUrl}/migliori-auto-usate`, changeFrequency: 'weekly', priority: 0.9, lastmod: BUILD_DATE },
  { url: `${siteUrl}/motori-problemi`, changeFrequency: 'weekly', priority: 0.85, lastmod: BUILD_DATE },
  { url: `${siteUrl}/passport`, changeFrequency: 'weekly', priority: 0.8, lastmod: BUILD_DATE },
  { url: `${siteUrl}/condizione`, changeFrequency: 'monthly', priority: 0.7, lastmod: BUILD_DATE },
  { url: `${siteUrl}/contatti`, changeFrequency: 'yearly', priority: 0.5, lastmod: BUILD_DATE },
  { url: `${siteUrl}/lavora-con-noi`, changeFrequency: 'monthly', priority: 0.6, lastmod: BUILD_DATE },
  { url: `${siteUrl}/privacy`, changeFrequency: 'yearly', priority: 0.3, lastmod: BUILD_DATE },
  { url: `${siteUrl}/terms`, changeFrequency: 'yearly', priority: 0.3, lastmod: BUILD_DATE },
  { url: `${siteUrl}/cookie-policy`, changeFrequency: 'yearly', priority: 0.3, lastmod: BUILD_DATE },
  { url: `${siteUrl}/eula`, changeFrequency: 'yearly', priority: 0.3, lastmod: BUILD_DATE },
  { url: `${siteUrl}/dmca`, changeFrequency: 'yearly', priority: 0.3, lastmod: BUILD_DATE },
];

function uniqueUrls(entries: UrlEntry[]): UrlEntry[] {
  const seen = new Set<string>();
  const out: UrlEntry[] = [];
  for (const entry of entries) {
    if (seen.has(entry.url)) continue;
    seen.add(entry.url);
    out.push(entry);
  }
  return out;
}

export function sitemapNames(): string[] {
  return [
    'static',
    'guides',
    'makes',
    'models',
    'rip-makes',
    'rip-models',
    'aff-makes',
    'aff-models',
    'cons-makes',
    'cons-models',
  ];
}

export function buildSitemap(name: string): UrlEntry[] {
  switch (name) {
    case 'static':
      return staticPages;
    case 'guides':
      return guides.map((guide) => ({
        url: `${siteUrl}/guide/${guide.slug}`,
        changeFrequency: 'weekly',
        priority: 0.85,
        lastmod: guide.published,
      }));
    case 'makes':
      return uniqueUrls(
        getAllMakes().map((make) => ({
          url: `${siteUrl}/valutazione/${make.slug}`,
          changeFrequency: 'weekly',
          priority: 0.7,
          lastmod: BUILD_DATE,
        }))
      );
    case 'models':
      return uniqueUrls(
        getAllMakes().flatMap((make) =>
          make.models.map((model) => ({
            url: `${siteUrl}/valutazione/${make.slug}/${slugify(model)}`,
            changeFrequency: 'weekly',
            priority: 0.6,
            lastmod: BUILD_DATE,
          }))
        )
      );
    case 'rip-makes':
      return uniqueUrls(
        getAllMakes().map((make) => ({
          url: `${siteUrl}/riparazione/${make.slug}`,
          changeFrequency: 'weekly',
          priority: 0.7,
          lastmod: BUILD_DATE,
        }))
      );
    case 'rip-models':
      return uniqueUrls(
        getAllMakes().flatMap((make) =>
          make.models.map((model) => ({
            url: `${siteUrl}/riparazione/${make.slug}/${slugify(model)}`,
            changeFrequency: 'weekly',
            priority: 0.6,
            lastmod: BUILD_DATE,
          }))
        )
      );
    case 'aff-makes':
      return uniqueUrls(
        getAllMakes().map((make) => ({
          url: `${siteUrl}/affidabilita/${make.slug}`,
          changeFrequency: 'weekly',
          priority: 0.7,
          lastmod: BUILD_DATE,
        }))
      );
    case 'aff-models':
      return uniqueUrls(
        getAllMakes().flatMap((make) =>
          make.models.map((model) => ({
            url: `${siteUrl}/affidabilita/${make.slug}/${slugify(model)}`,
            changeFrequency: 'weekly',
            priority: 0.6,
            lastmod: BUILD_DATE,
          }))
        )
      );
    case 'cons-makes':
      return uniqueUrls(
        getAllMakes().map((make) => ({
          url: `${siteUrl}/consumi/${make.slug}`,
          changeFrequency: 'weekly',
          priority: 0.7,
          lastmod: BUILD_DATE,
        }))
      );
    case 'cons-models':
      return uniqueUrls(
        getAllMakes().flatMap((make) =>
          make.models.map((model) => ({
            url: `${siteUrl}/consumi/${make.slug}/${slugify(model)}`,
            changeFrequency: 'weekly',
            priority: 0.6,
            lastmod: BUILD_DATE,
          }))
        )
      );
    default:
      return [];
  }
}

export function toXml(urls: UrlEntry[]): string {
  const body = urls
    .map(
      ({ url, changeFrequency, priority, lastmod }) =>
        `  <url>\n    <loc>${url}</loc>\n    <changefreq>${changeFrequency}</changefreq>\n    <priority>${priority.toFixed(1)}</priority>${lastmod ? `\n    <lastmod>${lastmod}</lastmod>` : ''}\n  </url>`
    )
    .join('\n');
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${body}\n</urlset>`;
}
