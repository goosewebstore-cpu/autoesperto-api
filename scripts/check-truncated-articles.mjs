import { guides } from '../apps/web/src/lib/guides.ts';

const shortArticles = [];
const cutOffArticles = new Map();

for (const g of guides) {
  let wordCount = 0;
  const cuts = [];

  // Description check
  if (g.description.endsWith('...') || g.description.endsWith('..') || !/[.!?]$/.test(g.description.trim())) {
    cuts.push(`Desc cutoff: "${g.description.slice(-30)}"`);
  }

  if (g.sections) {
    for (let i = 0; i < g.sections.length; i++) {
      const s = g.sections[i];
      if (s.paragraphs) {
        for (let pIdx = 0; pIdx < s.paragraphs.length; pIdx++) {
          const p = s.paragraphs[pIdx].trim();
          wordCount += p.split(/\s+/).length;
          // Check if starts with lowercase letter or cut word
          if (/^[a-zàèéìòù]/.test(p) && !p.startsWith('http')) {
            cuts.push(`P[${i},${pIdx}] starts lowercase: "${p.slice(0, 30)}..."`);
          }
          // Check if ends without punctuation
          if (!/[.!?:)"'»]$/.test(p) && !p.endsWith('**')) {
            cuts.push(`P[${i},${pIdx}] ends abruptly: "...${p.slice(-40)}"`);
          }
        }
      }
      if (s.list) {
        for (let lIdx = 0; lIdx < s.list.length; lIdx++) {
          const li = s.list[lIdx].trim();
          wordCount += li.split(/\s+/).length;
          if (/^[a-zàèéìòù]/.test(li) && !li.startsWith('http')) {
            cuts.push(`L[${i},${lIdx}] starts lowercase: "${li.slice(0, 30)}..."`);
          }
          if (!/[.!?:)"'»]$/.test(li) && !li.endsWith('**')) {
            cuts.push(`L[${i},${lIdx}] ends abruptly: "...${li.slice(-40)}"`);
          }
        }
      }
    }
  }

  if (g.content) {
    wordCount += g.content.split(/\s+/).length;
  }

  if (wordCount < 400) {
    shortArticles.push({ slug: g.slug, title: g.title, words: wordCount });
  }

  if (cuts.length > 0) {
    cutOffArticles.set(g.slug, cuts);
  }
}

console.log(`=== ARTICLES WITH CUTOFF/TRUNCATED TEXT: ${cutOffArticles.size} ===`);
for (const [slug, cuts] of cutOffArticles.entries()) {
  console.log(`\n[${slug}] (${cuts.length} cuts)`);
  for (const c of cuts.slice(0, 8)) {
    console.log(`  - ${c}`);
  }
}

console.log(`\n=== SHORT ARTICLES (< 400 words): ${shortArticles.length} ===`);
for (const s of shortArticles) {
  console.log(`- ${s.slug} (${s.words} words): "${s.title}"`);
}
