import { guides } from '../apps/web/src/lib/guides.ts';

// Analyze all articles
const stats = guides.map((g, idx) => {
  let w = (g.description || '').split(/\s+/).filter(Boolean).length;
  (g.sections || []).forEach(s => {
    (s.paragraphs || []).forEach(p => w += p.split(/\s+/).filter(Boolean).length);
    (s.list || []).forEach(l => w += l.split(/\s+/).filter(Boolean).length);
  });
  return { idx, slug: g.slug, title: g.title, words: w, sections: (g.sections || []).length, category: g.category };
});

// Sort by word count
stats.sort((a, b) => a.words - b.words);

// Distribution
const ranges = [
  { label: '< 300 parole', min: 0, max: 300 },
  { label: '300-500 parole', min: 300, max: 500 },
  { label: '500-700 parole', min: 500, max: 700 },
  { label: '700-1000 parole', min: 700, max: 1000 },
  { label: '1000+ parole', min: 1000, max: Infinity }
];

console.log('=== DISTRIBUZIONE ARTICOLI ===');
ranges.forEach(r => {
  const count = stats.filter(s => s.words >= r.min && s.words < r.max).length;
  console.log(`${r.label}: ${count} articoli`);
});

console.log(`\nMedia parole: ${Math.round(stats.reduce((s, a) => s + a.words, 0) / stats.length)}`);
console.log(`Mediana: ${stats[Math.floor(stats.length / 2)].words}`);

// Show the 30 shortest
console.log('\n=== 30 ARTICOLI PIÙ CORTI ===');
stats.slice(0, 30).forEach(s => {
  console.log(`${s.words}w | ${s.sections}s | ${s.slug}`);
});

// Show by category
console.log('\n=== MEDIA PER CATEGORIA ===');
const cats = {};
stats.forEach(s => {
  if (!cats[s.category]) cats[s.category] = [];
  cats[s.category].push(s.words);
});
Object.entries(cats).forEach(([cat, words]) => {
  console.log(`${cat}: ${Math.round(words.reduce((a, b) => a + b, 0) / words.length)} media, ${words.length} articoli`);
});
