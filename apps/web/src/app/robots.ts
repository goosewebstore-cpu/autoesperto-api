import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const base = process.env.NEXT_PUBLIC_SITE_URL || 'https://autoesperto.it';
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/account', '/accesso'],
      },
      {
        userAgent: 'Google-Extended',
        allow: '/',
      },
    ],
    sitemap: `${base}/sitemap.xml`,
    host: base,
  };
}
