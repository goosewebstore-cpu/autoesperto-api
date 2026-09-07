// Script to clean up the guides.ts file: remove duplicate investor article and fix any JSON structure issues
import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

const filePath = join(process.cwd(), 'apps/web/src/lib/guides.ts');

// Import the guides dynamically to get the clean data
const mod = await import('../apps/web/src/lib/guides.ts');
const guides = mod.guides;

console.log('Total guides before dedup:', guides.length);

// Remove duplicates by slug, keeping the first occurrence
const seen = new Set();
const deduped = [];
for (const g of guides) {
  if (seen.has(g.slug)) {
    console.log('REMOVING DUPLICATE:', g.slug);
    continue;
  }
  seen.add(g.slug);
  deduped.push(g);
}

console.log('Total guides after dedup:', deduped.length);

// Reconstruct the file with header, array, and footer functions
const header = `/**
 * ============================================================================
 * AUTOESPERTO - AUTHORITATIVE GUIDES DATABASE (${deduped.length} COMPREHENSIVE GUIDES)
 * ============================================================================
 * CRITICAL WARNING FOR AI ASSISTANTS:
 * DO NOT OVERWRITE, TRUNCATE, OR DELETE THIS FILE!
 * THIS FILE CONTAINS 19 USER CUSTOM ARTICLES (MUST REMAIN INTACT) PLUS AT LEAST
 * 30 COMPREHENSIVE GUIDES PER CATEGORY (ACQUISTO, VENDITA, VALUTAZIONE, MANUTENZIONE, AFFIDABILITÀ).
 * ============================================================================
 */

import type { Guide, GuideCategory } from './guide-types';
import { GUIDE_CATEGORIES } from './guide-types';
export type { Guide, GuideCategory };
export { GUIDE_CATEGORIES };

export const guides: Guide[] = `;

const footer = `

export function getGuide(slug: string): Guide | undefined {
  return guides.find((g) => g.slug === slug);
}

export function getGuidesByCategory(category: GuideCategory): Guide[] {
  return guides.filter((g) => g.category === category);
}

export function getFeaturedGuides(): Guide[] {
  return guides.filter((g) => g.featured);
}
`;

const jsonArray = JSON.stringify(deduped, null, 2);
const newContent = header + jsonArray + ';' + footer;

writeFileSync(filePath, newContent, 'utf-8');
console.log('File written successfully!');

// Verify
const verifyContent = readFileSync(filePath, 'utf-8');
console.log('File size:', verifyContent.length, 'bytes');
console.log('Lines:', verifyContent.split('\n').length);
