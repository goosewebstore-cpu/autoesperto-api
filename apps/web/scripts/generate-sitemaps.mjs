import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://autoesperto.it';
const BUILD_DATE = process.env.BUILD_DATE || new Date().toISOString().split('T')[0];

function slugify(value) {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/[-\s]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

// 1. Read catalog
const catalogoPath = path.resolve(__dirname, '../src/lib/catalogo.json');
const catalogoRaw = JSON.parse(fs.readFileSync(catalogoPath, 'utf8'));
const brands = catalogoRaw.brands || {};

const allMakes = Object.keys(brands)
  .sort((a, b) => a.localeCompare(b, 'it'))
  .map((name) => ({ name, slug: slugify(name), models: brands[name] || [] }));

// 2. Read guides
const guidesPath = path.resolve(__dirname, '../src/lib/guides.ts');
const guidesContent = fs.readFileSync(guidesPath, 'utf8');

// Match each guide's slug and published date
const guideMatches = [...guidesContent.matchAll(/slug:\s*['"]([^'"]+)['"][\s\S]*?published:\s*['"]([^'"]+)['"]/g)];
const guideSlugs = [...guidesContent.matchAll(/slug:\s*['"]([^'"]+)['"]/g)].map(m => m[1]);

const guides = guideSlugs.map((slug) => {
  const match = guideMatches.find(m => m[1] === slug);
  return {
    slug,
    published: match ? match[2] : BUILD_DATE,
  };
});

console.log(`[sitemap-gen] Loaded ${allMakes.length} makes and ${guides.length} guides.`);

const staticPages = [
  { url: siteUrl, changeFrequency: 'weekly', priority: 1.0, lastmod: BUILD_DATE },
  { url: `${siteUrl}/compra`, changeFrequency: 'weekly', priority: 0.85, lastmod: BUILD_DATE },
  { url: `${siteUrl}/vendi`, changeFrequency: 'weekly', priority: 0.85, lastmod: BUILD_DATE },
  { url: `${siteUrl}/valutazione`, changeFrequency: 'weekly', priority: 0.9, lastmod: BUILD_DATE },
  { url: `${siteUrl}/riparazione`, changeFrequency: 'weekly', priority: 0.8, lastmod: BUILD_DATE },
  { url: `${siteUrl}/affidabilita`, changeFrequency: 'weekly', priority: 0.8, lastmod: BUILD_DATE },
  { url: `${siteUrl}/consumi`, changeFrequency: 'weekly', priority: 0.8, lastmod: BUILD_DATE },
  { url: `${siteUrl}/confronta`, changeFrequency: 'weekly', priority: 0.8, lastmod: BUILD_DATE },
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

function uniqueUrls(entries) {
  const seen = new Set();
  const out = [];
  for (const entry of entries) {
    if (seen.has(entry.url)) continue;
    seen.add(entry.url);
    out.push(entry);
  }
  return out;
}

function toXml(urls) {
  const body = urls
    .map(
      ({ url, changeFrequency, priority, lastmod }) =>
        `  <url>\n    <loc>${url}</loc>\n    <changefreq>${changeFrequency}</changefreq>\n    <priority>${Number(priority).toFixed(1)}</priority>${lastmod ? `\n    <lastmod>${lastmod}</lastmod>` : ''}\n  </url>`
    )
    .join('\n');
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${body}\n</urlset>`;
}

const sitemaps = {
  static: staticPages,
  guides: guides.map((guide) => ({
    url: `${siteUrl}/guide/${guide.slug}`,
    changeFrequency: 'monthly',
    priority: 0.7,
    lastmod: guide.published || BUILD_DATE,
  })),
  makes: uniqueUrls(
    allMakes.map((make) => ({
      url: `${siteUrl}/valutazione/${make.slug}`,
      changeFrequency: 'weekly',
      priority: 0.7,
      lastmod: BUILD_DATE,
    }))
  ),
  models: uniqueUrls(
    allMakes.flatMap((make) =>
      make.models.map((model) => ({
        url: `${siteUrl}/valutazione/${make.slug}/${slugify(model)}`,
        changeFrequency: 'weekly',
        priority: 0.6,
        lastmod: BUILD_DATE,
      }))
    )
  ),
  'rip-makes': uniqueUrls(
    allMakes.map((make) => ({
      url: `${siteUrl}/riparazione/${make.slug}`,
      changeFrequency: 'weekly',
      priority: 0.7,
      lastmod: BUILD_DATE,
    }))
  ),
  'rip-models': uniqueUrls(
    allMakes.flatMap((make) =>
      make.models.map((model) => ({
        url: `${siteUrl}/riparazione/${make.slug}/${slugify(model)}`,
        changeFrequency: 'weekly',
        priority: 0.6,
        lastmod: BUILD_DATE,
      }))
    )
  ),
  'aff-makes': uniqueUrls(
    allMakes.map((make) => ({
      url: `${siteUrl}/affidabilita/${make.slug}`,
      changeFrequency: 'weekly',
      priority: 0.7,
      lastmod: BUILD_DATE,
    }))
  ),
  'aff-models': uniqueUrls(
    allMakes.flatMap((make) =>
      make.models.map((model) => ({
        url: `${siteUrl}/affidabilita/${make.slug}/${slugify(model)}`,
        changeFrequency: 'weekly',
        priority: 0.6,
        lastmod: BUILD_DATE,
      }))
    )
  ),
  'cons-makes': uniqueUrls(
    allMakes.map((make) => ({
      url: `${siteUrl}/consumi/${make.slug}`,
      changeFrequency: 'weekly',
      priority: 0.7,
      lastmod: BUILD_DATE,
    }))
  ),
  'cons-models': uniqueUrls(
    allMakes.flatMap((make) =>
      make.models.map((model) => ({
        url: `${siteUrl}/consumi/${make.slug}/${slugify(model)}`,
        changeFrequency: 'weekly',
        priority: 0.6,
        lastmod: BUILD_DATE,
      }))
    )
  ),
};

const publicDir = path.resolve(__dirname, '../public');
const sitemapsDir = path.join(publicDir, 'sitemaps');

if (!fs.existsSync(sitemapsDir)) {
  fs.mkdirSync(sitemapsDir, { recursive: true });
}

const sitemapNames = Object.keys(sitemaps);

for (const name of sitemapNames) {
  const xml = toXml(sitemaps[name]);
  const filePath = path.join(sitemapsDir, `${name}.xml`);
  fs.writeFileSync(filePath, xml, 'utf8');
  console.log(`[sitemap-gen] Generated ${filePath} with ${sitemaps[name].length} URLs (${(xml.length / 1024).toFixed(1)} KB).`);
}

// Generate sitemap.xml index with <lastmod>
const indexXml = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemapNames
  .map(
    (name) => `  <sitemap>
    <loc>${siteUrl}/sitemaps/${name}.xml</loc>
    <lastmod>${BUILD_DATE}</lastmod>
  </sitemap>`
  )
  .join('\n')}
</sitemapindex>`;

const indexPath = path.join(publicDir, 'sitemap.xml');
fs.writeFileSync(indexPath, indexXml, 'utf8');
console.log(`[sitemap-gen] Generated index at ${indexPath} (${sitemapNames.length} sitemaps).`);
