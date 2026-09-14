import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const base = process.env.NEXT_PUBLIC_SITE_URL || 'https://autoesperto.it';
  const disallowList = [
    '/api/',
    '/account',
    '/accesso',
    '/buying-room',
    // Protezione Crawl Budget: blocca l'esplosione combinatoria delle ~200k pagine anno
    // che ha causato il sovraccarico CPU del worker e 3.169 errori 5xx
    '/valutazione/*/*/*',
    '/affidabilita/*/*/*',
    '/consumi/*/*/*',
    '/riparazione/*/*/*',
  ];

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: disallowList,
      },
      {
        userAgent: 'Mediapartners-Google',
        allow: '/',
      },
      {
        userAgent: 'Googlebot',
        allow: '/',
        disallow: disallowList,
      },
      {
        userAgent: 'Bingbot',
        allow: '/',
        disallow: disallowList,
      },
      {
        userAgent: 'GPTBot',
        allow: '/',
        disallow: disallowList,
      },
      {
        userAgent: 'Applebot',
        allow: '/',
        disallow: disallowList,
      },
    ],
    sitemap: `${base}/sitemap.xml`,
    host: base,
  };
}
