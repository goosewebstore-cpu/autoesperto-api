import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const base = process.env.NEXT_PUBLIC_SITE_URL || 'https://autoesperto.it';
  const disallowList = [
    '/api/',
    '/account',
    '/accesso',
    '/passport/',
    '/valutazione/*/*/*',
    '/riparazione/*/*/*',
    '/affidabilita/*/*/*',
    '/consumi/*/*/*',
  ];

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: disallowList,
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
