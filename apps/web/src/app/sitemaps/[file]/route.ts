import { buildSitemap, sitemapNames, toXml } from '@/lib/sitemaps';

export const dynamic = 'force-static';
export const dynamicParams = true;

export function generateStaticParams() {
  const allNames = [
    ...sitemapNames(),
    'guide',
    'make',
    'model',
    'rip-makes',
    'rip-models',
    'aff-makes',
    'aff-models',
    'cons-makes',
    'cons-models',
  ];
  return Array.from(new Set(allNames)).map((name) => ({ file: `${name}.xml` }));
}

export async function GET(_request: Request, { params }: { params: Promise<{ file: string }> }) {
  const { file } = await params;
  const name = file.replace(/\.xml$/, '');
  const urls = buildSitemap(name);
  if (urls.length === 0) return new Response('Not found', { status: 404 });
  return new Response(toXml(urls), {
    headers: { 'Content-Type': 'application/xml; charset=utf-8', 'Cache-Control': 'public, max-age=300, s-maxage=86400' },
  });
}
