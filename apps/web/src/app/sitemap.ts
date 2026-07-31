import type { MetadataRoute } from 'next';
import { getAllMakes, slugify } from '@/lib/catalogo';

export default function sitemap(): MetadataRoute.Sitemap {
  const base = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  const now = new Date();

  const staticPages: MetadataRoute.Sitemap = [
    { url: base, lastModified: now, changeFrequency: 'weekly', priority: 1 },
    { url: `${base}/valutazione/`, lastModified: now, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${base}/confronta/`, lastModified: now, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${base}/contatti`, lastModified: now, changeFrequency: 'yearly', priority: 0.5 },
    { url: `${base}/privacy`, lastModified: now, changeFrequency: 'yearly', priority: 0.3 },
    { url: `${base}/terms`, lastModified: now, changeFrequency: 'yearly', priority: 0.3 },
    { url: `${base}/cookie-policy`, lastModified: now, changeFrequency: 'yearly', priority: 0.3 },
  ];

  const makePages: MetadataRoute.Sitemap = getAllMakes().map((make) => ({
    url: `${base}/valutazione/${make.slug}/`,
    lastModified: now,
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }));

  const modelPages: MetadataRoute.Sitemap = getAllMakes().flatMap((make) =>
    make.models.map((model) => ({
      url: `${base}/valutazione/${make.slug}/${slugify(model)}/`,
      lastModified: now,
      changeFrequency: 'weekly' as const,
      priority: 0.6,
    }))
  );

  return [...staticPages, ...makePages, ...modelPages];
}
