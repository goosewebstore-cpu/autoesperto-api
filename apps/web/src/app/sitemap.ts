import type { MetadataRoute } from 'next';
import { getAllMakes, slugify } from '@/lib/catalogo';

export default function sitemap(): MetadataRoute.Sitemap {
  const base = process.env.NEXT_PUBLIC_SITE_URL || 'https://autoesperto.vercel.app';

  const staticPages: MetadataRoute.Sitemap = [
    { url: base, changeFrequency: 'weekly', priority: 1 },
    { url: `${base}/valutazione/`, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${base}/confronta/`, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${base}/contatti`, changeFrequency: 'yearly', priority: 0.5 },
    { url: `${base}/privacy`, changeFrequency: 'yearly', priority: 0.3 },
    { url: `${base}/terms`, changeFrequency: 'yearly', priority: 0.3 },
    { url: `${base}/cookie-policy`, changeFrequency: 'yearly', priority: 0.3 },
  ];

  const makePages: MetadataRoute.Sitemap = getAllMakes().map((make) => ({
    url: `${base}/valutazione/${make.slug}/`,
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }));

  const modelPages: MetadataRoute.Sitemap = getAllMakes().flatMap((make) =>
    make.models.map((model) => ({
      url: `${base}/valutazione/${make.slug}/${slugify(model)}/`,
      changeFrequency: 'weekly' as const,
      priority: 0.6,
    }))
  );

  return [...staticPages, ...makePages, ...modelPages];
}
