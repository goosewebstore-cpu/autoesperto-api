import { buildSitemap, sitemapNames, toXml } from '@/lib/sitemaps';

export const dynamic = 'force-static';
export const dynamicParams = false;

export function generateStaticParams() {
  return sitemapNames().map((name) => ({ file: `${name}.xml` }));
}

export async function GET(_request: Request, { params }: { params: Promise<{ file: string }> }) {
  const { file } = await params;
  const name = file.replace(/\.xml$/, '');
  const urls = buildSitemap(name);
  if (urls.length === 0) return new Response('Not found', { status: 404 });
  return new Response(toXml(urls), { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
}
