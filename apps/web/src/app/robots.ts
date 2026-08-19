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
        userAgent: 'Googlebot',
        allow: '/',
      },
      {
        userAgent: 'Google-Extended',
        allow: '/',
      },
    ],
    sitemap: [
      `${base}/sitemap.xml`,
      `${base}/sitemaps/static.xml`,
      `${base}/sitemaps/guides.xml`,
      `${base}/sitemaps/makes.xml`,
      `${base}/sitemaps/models.xml`,
      `${base}/sitemaps/rip-makes.xml`,
      `${base}/sitemaps/rip-models.xml`,
      `${base}/sitemaps/aff-makes.xml`,
      `${base}/sitemaps/aff-models.xml`,
      `${base}/sitemaps/cons-makes.xml`,
      `${base}/sitemaps/cons-models.xml`,
    ],
    host: base,
  };
}
