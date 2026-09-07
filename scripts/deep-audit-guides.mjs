import { guides } from '../apps/web/src/lib/guides.ts';

console.log(`Total guides: ${guides.length}`);

const shortGuides = [];
const fewSectionsGuides = [];

for (const g of guides) {
  let wordCount = 0;
  if (g.description) wordCount += g.description.split(/\s+/).length;
  if (g.content) wordCount += g.content.replace(/<[^>]*>/g, ' ').split(/\s+/).length;
  if (g.sections) {
    for (const s of g.sections) {
      if (s.paragraphs) {
        for (const p of s.paragraphs) {
          wordCount += p.split(/\s+/).length;
        }
      }
      if (s.list) {
        for (const l of s.list) {
          wordCount += l.split(/\s+/).length;
        }
      }
    }
  }

  const secCount = (g.sections || []).length;

  if (wordCount < 350) {
    shortGuides.push({ slug: g.slug, title: g.title, words: wordCount, secCount });
  }

  if (secCount < 4) {
    fewSectionsGuides.push({ slug: g.slug, title: g.title, words: wordCount, secCount });
  }
}

console.log(`\n=== GUIDES WITH < 350 WORDS: ${shortGuides.length} ===`);
shortGuides.sort((a, b) => a.words - b.words);
for (const g of shortGuides) {
  console.log(`[${g.words}w, ${g.secCount}s] ${g.slug} -> "${g.title}"`);
}

console.log(`\n=== GUIDES WITH < 4 SECTIONS: ${fewSectionsGuides.length} ===`);
for (const g of fewSectionsGuides) {
  console.log(`[${g.secCount}s, ${g.words}w] ${g.slug} -> "${g.title}"`);
}
