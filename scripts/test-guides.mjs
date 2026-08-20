import fs from 'fs';
import path from 'path';

const guidesPath = path.resolve('apps/web/src/lib/guides.ts');
const content = fs.readFileSync(guidesPath, 'utf8');

const slugMatches = [...content.matchAll(/slug:\s*['"]([^'"]+)['"]/g)].map(m => m[1]);
console.log('Total guide slugs found:', slugMatches.length);

const unique = new Set(slugMatches);
console.log('Unique slugs:', unique.size);

const titleMatches = [...content.matchAll(/title:\s*['"]([^'"]+)['"]/g)].map(m => m[1]);
console.log('Total titles found:', titleMatches.length);

const ctaMatches = [...content.matchAll(/cta:\s*['"]([^'"]+)['"]/g)].map(m => m[1]);
console.log('Total ctas found:', ctaMatches.length);

// Check if any slug has spaces or weird chars
for (const s of slugMatches) {
  if (s.includes(' ') || s.includes('?') || s.includes('#') || s !== encodeURIComponent(s)) {
    console.error('Invalid slug characters:', s);
  }
}

console.log('Test completed successfully.');
