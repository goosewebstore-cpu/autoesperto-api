import { getAllMakes, slugify } from './catalogo';
import { guides } from './guides';

export const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://autoesperto.it';

export interface UrlEntry {
  url: string;
  changeFrequency: string;
  priority: number;
}

const staticPages: UrlEntry[] = [
  { url: siteUrl, changeFrequency: 'weekly', priority: 1 },
  { url: `${siteUrl}/compra`, changeFrequency: 'weekly', priority: 0.85 },
  { url: `${siteUrl}/vendi`, changeFrequency: 'weekly', priority: 0.85 },
  { url: `${siteUrl}/valutazione`, changeFrequency: 'weekly', priority: 0.9 },
  { url: `${siteUrl}/riparazione`, changeFrequency: 'weekly', priority: 0.8 },
  { url: `${siteUrl}/affidabilita`, changeFrequency: 'weekly', priority: 0.8 },
  { url: `${siteUrl}/consumi`, changeFrequency: 'weekly', priority: 0.8 },
  { url: `${siteUrl}/confronta`, changeFrequency: 'weekly', priority: 0.8 },
  { url: `${siteUrl}/guide`, changeFrequency: 'weekly', priority: 0.8 },
  ...guides.map((guide) => ({
    url: `${siteUrl}/guide/${guide.slug}`,
    changeFrequency: 'monthly',
    priority: 0.7,
  })),
  { url: `${siteUrl}/contatti`, changeFrequency: 'yearly', priority: 0.5 },
  { url: `${siteUrl}/lavora-con-noi`, changeFrequency: 'monthly', priority: 0.6 },
  { url: `${siteUrl}/privacy`, changeFrequency: 'yearly', priority: 0.3 },
  { url: `${siteUrl}/terms`, changeFrequency: 'yearly', priority: 0.3 },
  { url: `${siteUrl}/cookie-policy`, changeFrequency: 'yearly', priority: 0.3 },
  { url: `${siteUrl}/eula`, changeFrequency: 'yearly', priority: 0.3 },
  { url: `${siteUrl}/dmca`, changeFrequency: 'yearly', priority: 0.3 },
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
    case 'makes':
      return uniqueUrls(
        getAllMakes().map((make) => ({
          url: `${siteUrl}/valutazione/${make.slug}`,
          changeFrequency: 'weekly',
          priority: 0.7,
        }))
      );
    case 'models':
      return uniqueUrls(
        getAllMakes().flatMap((make) =>
          make.models.map((model) => ({
            url: `${siteUrl}/valutazione/${make.slug}/${slugify(model)}`,
            changeFrequency: 'weekly',
            priority: 0.6,
          }))
        )
      );
    case 'rip-makes':
      return uniqueUrls(
        getAllMakes().map((make) => ({
          url: `${siteUrl}/riparazione/${make.slug}`,
          changeFrequency: 'weekly',
          priority: 0.7,
        }))
      );
    case 'rip-models':
      return uniqueUrls(
        getAllMakes().flatMap((make) =>
          make.models.map((model) => ({
            url: `${siteUrl}/riparazione/${make.slug}/${slugify(model)}`,
            changeFrequency: 'weekly',
            priority: 0.6,
          }))
        )
      );
    case 'aff-makes':
      return uniqueUrls(
        getAllMakes().map((make) => ({
          url: `${siteUrl}/affidabilita/${make.slug}`,
          changeFrequency: 'weekly',
          priority: 0.7,
        }))
      );
    case 'aff-models':
      return uniqueUrls(
        getAllMakes().flatMap((make) =>
          make.models.map((model) => ({
            url: `${siteUrl}/affidabilita/${make.slug}/${slugify(model)}`,
            changeFrequency: 'weekly',
            priority: 0.6,
          }))
        )
      );
    case 'cons-makes':
      return uniqueUrls(
        getAllMakes().map((make) => ({
          url: `${siteUrl}/consumi/${make.slug}`,
          changeFrequency: 'weekly',
          priority: 0.7,
        }))
      );
    case 'cons-models':
      return uniqueUrls(
        getAllMakes().flatMap((make) =>
          make.models.map((model) => ({
            url: `${siteUrl}/consumi/${make.slug}/${slugify(model)}`,
            changeFrequency: 'weekly',
            priority: 0.6,
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
      ({ url, changeFrequency, priority }) =>
        `  <url>\n    <loc>${url}</loc>\n    <changefreq>${changeFrequency}</changefreq>\n    <priority>${priority.toFixed(1)}</priority>\n  </url>`
    )
    .join('\n');
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${body}\n</urlset>`;
}
