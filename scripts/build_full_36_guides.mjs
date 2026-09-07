import fs from 'fs';
import path from 'path';

const OUT_FILE = 'apps/web/src/lib/guides-articoli.ts';

// Data dictionary for the 36 articles with rich, authoritative sections
import { ARTICLES_DATA } from './articles_data.mjs';

const guides = ARTICLES_DATA.map((art) => {
  const totalWords = art.sections.reduce((acc, sec) => {
    const pWords = (sec.paragraphs || []).join(' ').split(/\s+/).length;
    const lWords = (sec.list || []).join(' ').split(/\s+/).length;
    return acc + pWords + lWords;
  }, art.title.split(/\s+/).length + art.description.split(/\s+/).length);

  const readTime = `${Math.max(6, Math.ceil(totalWords / 160))} min`;

  return {
    slug: art.slug,
    title: art.title,
    description: art.description,
    published: art.published || '2026-09-04',
    category: art.category,
    cta: art.cta,
    image: `/images/guide/${art.slug}.jpg`,
    readTime,
    sections: art.sections,
  };
});

const fileHeader = `import type { Guide } from './guide-types';

/**
 * ============================================================================
 * AUTOESPERTO - 36 NUOVE GUIDE SPECIALISTICHE AUTOREVOLI (SETTEMBRE 2026)
 * ============================================================================
 * Approfondimenti editoriali per quotazioni modelli popolari, tutela compravendita,
 * controlli meccanici (DSG, CVT, AdBlue, FAP, Cinghia/Catena) e normative CdS 2026.
 * ============================================================================
 */

export const articoliGuides: Guide[] = ${JSON.stringify(guides, null, 2)};
`;

fs.writeFileSync(OUT_FILE, fileHeader, 'utf8');
console.log(`Generated ${OUT_FILE} with ${guides.length} guides (${(fileHeader.length / 1024).toFixed(1)} KB).`);
