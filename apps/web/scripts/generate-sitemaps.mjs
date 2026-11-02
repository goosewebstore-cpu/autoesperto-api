import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { build } from 'esbuild';

const directory = path.dirname(fileURLToPath(import.meta.url));
// Import the same catalog and URL rules used by the application. Text matching
// missed imported guides and associated publication dates with the wrong slug.
const bundle = await build({
  entryPoints: [path.resolve(directory, '../src/lib/sitemaps.ts')],
  bundle: true,
  platform: 'node',
  format: 'esm',
  write: false,
});
const { buildSitemap, sitemapNames, siteUrl, toXml } = await import(
  `data:text/javascript;base64,${Buffer.from(bundle.outputFiles[0].text).toString('base64')}`
);
const publicDir = path.resolve(directory, '../public');
const destination = path.join(publicDir, 'sitemaps');
fs.mkdirSync(destination, { recursive: true });
const names = sitemapNames();
for (const name of names) {
  const entries = buildSitemap(name);
  if (new Set(entries.map(entry => entry.url)).size !== entries.length) {
    throw new Error(`Duplicate URLs in ${name}`);
  }
  fs.writeFileSync(path.join(destination, `${name}.xml`), toXml(entries));
  console.log(`[sitemap-gen] ${name}: ${entries.length} URLs`);
}
for (const [alias, name] of Object.entries({ guide: 'guides', make: 'makes', model: 'models' })) {
  fs.writeFileSync(path.join(destination, `${alias}.xml`), toXml(buildSitemap(name)));
}
const xml = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${names.map(name => `  <sitemap><loc>${siteUrl}/sitemaps/${name}.xml</loc></sitemap>`).join('\n')}
</sitemapindex>`;
fs.writeFileSync(path.join(publicDir, 'sitemap.xml'), xml);
