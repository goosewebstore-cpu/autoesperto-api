import { getAllMakes, slugify } from './catalogo';

export const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://autoesperto.vercel.app';

export const CURRENT_YEAR = new Date().getFullYear();
export const YEAR_RANGE: number[] = [];
for (let y = CURRENT_YEAR; y >= 2015; y--) YEAR_RANGE.push(y);

const YEAR_CHUNK_SIZE = 25000;

export interface UrlEntry {
  url: string;
  changeFrequency: string;
  priority: number;
}

const staticPages: UrlEntry[] = [
  { url: siteUrl, changeFrequency: 'weekly', priority: 1 },
  { url: `${siteUrl}/valutazione`, changeFrequency: 'weekly', priority: 0.9 },
  { url: `${siteUrl}/confronta`, changeFrequency: 'weekly', priority: 0.8 },
  { url: `${siteUrl}/contatti`, changeFrequency: 'yearly', priority: 0.5 },
  { url: `${siteUrl}/lavora-con-noi`, changeFrequency: 'monthly', priority: 0.6 },
  { url: `${siteUrl}/privacy`, changeFrequency: 'yearly', priority: 0.3 },
  { url: `${siteUrl}/terms`, changeFrequency: 'yearly', priority: 0.3 },
  { url: `${siteUrl}/cookie-policy`, changeFrequency: 'yearly', priority: 0.3 },
];

function allYearUrls(): UrlEntry[] {
  const urls: UrlEntry[] = [];
  for (const make of getAllMakes()) {
    for (const model of make.models) {
      for (const year of YEAR_RANGE) {
        urls.push({
          url: `${siteUrl}/valutazione/${make.slug}/${slugify(model)}/${year}`,
          changeFrequency: 'monthly',
          priority: 0.5,
        });
      }
    }
  }
  return urls;
}

export function sitemapNames(): string[] {
  const chunks = Math.ceil(allYearUrls().length / YEAR_CHUNK_SIZE);
  return ['static', 'makes', 'models', ...Array.from({ length: chunks }, (_, i) => `years-${i + 1}`)];
}

export function buildSitemap(name: string): UrlEntry[] {
  switch (name) {
    case 'static':
      return staticPages;
    case 'makes':
      return getAllMakes().map((make) => ({
        url: `${siteUrl}/valutazione/${make.slug}`,
        changeFrequency: 'weekly',
        priority: 0.7,
      }));
    case 'models':
      return getAllMakes().flatMap((make) =>
        make.models.map((model) => ({
          url: `${siteUrl}/valutazione/${make.slug}/${slugify(model)}`,
          changeFrequency: 'weekly',
          priority: 0.6,
        }))
      );
    default: {
      const match = /^years-(\d+)$/.exec(name);
      if (!match) return [];
      const start = (Number(match[1]) - 1) * YEAR_CHUNK_SIZE;
      return allYearUrls().slice(start, start + YEAR_CHUNK_SIZE);
    }
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
