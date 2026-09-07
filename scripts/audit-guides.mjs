import { guides } from '../apps/web/src/lib/guides.ts';

console.log('Total guides:', guides.length);

// 1. Find duplicates
const slugCount = {};
guides.forEach(g => { slugCount[g.slug] = (slugCount[g.slug] || 0) + 1; });
const dupes = Object.entries(slugCount).filter(([,c]) => c > 1);
console.log('\n=== DUPLICATES ===');
if (dupes.length === 0) console.log('None');
else dupes.forEach(([slug, count]) => console.log(slug + ': ' + count + ' times'));

// 2. Find short articles (less than 200 words total)
console.log('\n=== SHORT ARTICLES (< 200 words) ===');
guides.forEach((g, idx) => {
  let w = (g.description || '').split(/\s+/).filter(Boolean).length;
  (g.sections || []).forEach(s => {
    (s.paragraphs || []).forEach(p => w += p.split(/\s+/).filter(Boolean).length);
    (s.list || []).forEach(l => w += l.split(/\s+/).filter(Boolean).length);
  });
  if (w < 200) console.log(idx + '. ' + g.slug + ': ' + w + ' words, ' + (g.sections || []).length + ' sections');
});

// 3. Find truncated articles (ending mid-sentence)
console.log('\n=== POSSIBLY TRUNCATED ===');
guides.forEach((g, idx) => {
  const secs = g.sections || [];
  if (secs.length === 0) { console.log(idx + '. ' + g.slug + ': NO SECTIONS'); return; }
  const lastSec = secs[secs.length - 1];
  const lastTexts = [...(lastSec.paragraphs || []), ...(lastSec.list || [])];
  if (lastTexts.length === 0) { console.log(idx + '. ' + g.slug + ': EMPTY LAST SECTION'); return; }
  const lastText = lastTexts[lastTexts.length - 1].trim();
  if (!lastText.endsWith('.') && !lastText.endsWith('!') && !lastText.endsWith('?') && !lastText.endsWith(':') && !lastText.endsWith(')') && !lastText.endsWith('"')) {
    console.log(idx + '. ' + g.slug + ': ends with -> ...' + lastText.slice(-80));
  }
});

// 4. Find investor articles
console.log('\n=== INVESTOR ARTICLES ===');
guides.filter(g => g.slug.includes('investitori') || g.title.toLowerCase().includes('investitor')).forEach((g) => {
  let w = (g.description || '').split(/\s+/).filter(Boolean).length;
  (g.sections || []).forEach(s => {
    (s.paragraphs || []).forEach(p => w += p.split(/\s+/).filter(Boolean).length);
    (s.list || []).forEach(l => w += l.split(/\s+/).filter(Boolean).length);
  });
  console.log(g.slug + ': ' + w + ' words, title: ' + g.title);
});

// 5. Articles with no image
let noImg = 0;
const noImgList = [];
guides.forEach((g) => {
  if (!g.image || g.image.trim() === '') { noImg++; noImgList.push(g.slug); }
});
console.log('\n=== NO IMAGE ===');
console.log(noImg + ' articles without image');
if (noImgList.length > 0) noImgList.forEach(s => console.log('  - ' + s));

// 6. Articles with very few sections
console.log('\n=== FEW SECTIONS (<= 2) ===');
guides.forEach((g, idx) => {
  const secs = (g.sections || []).length;
  if (secs <= 2) console.log(idx + '. ' + g.slug + ': ' + secs + ' sections');
});
