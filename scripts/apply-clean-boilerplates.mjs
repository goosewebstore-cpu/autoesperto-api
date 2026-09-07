import fs from 'fs';
import { guides } from '../apps/web/src/lib/guides.ts';

const repeatedPatterns = [
  " Questo aspetto è particolarmente rilevante nel contesto del mercato italiano dell'usato, dove la verifica accurata di ogni dettaglio può fare la differenza tra un buon affare e una spesa imprevista.",
  " Nella pratica quotidiana, questo significa che la differenza tra un acquisto informato e uno avventato può facilmente superare i 1.000-2.000 euro — una cifra che giustifica ampiamente il tempo investito nella ricerca e nella verifica.",
  " Dedicare 15-20 minuti a un controllo approfondito prima di procedere con la trattativa può evitare spese impreviste di centinaia o migliaia di euro nei mesi successivi all'acquisto.",
  " Un veicolo con la manutenzione regolare documentata non solo dura di più, ma conserva un valore di rivendita sensibilmente superiore — mediamente tra il 10% e il 15% in più rispetto a un esemplare con storico incompleto.",
  " Il mercato dell'usato italiano muove oltre 5 milioni di transazioni ogni anno, e la differenza tra chi compra informato e chi compra d'impulso si traduce in migliaia di euro risparmiati o persi."
];

let cleanedCount = 0;

for (const g of guides) {
  for (const s of (g.sections || [])) {
    if (s.paragraphs) {
      s.paragraphs = s.paragraphs.map(p => {
        let cleanP = p;
        for (const pat of repeatedPatterns) {
          if (cleanP.includes(pat)) {
            cleanP = cleanP.replaceAll(pat, '');
            cleanedCount++;
          }
        }
        return cleanP.trim();
      }).filter(Boolean);
    }
    if (s.list) {
      s.list = s.list.map(item => {
        let cleanItem = item;
        for (const pat of repeatedPatterns) {
          if (cleanItem.includes(pat)) {
            cleanItem = cleanItem.replaceAll(pat, '');
            cleanedCount++;
          }
        }
        return cleanItem.trim();
      }).filter(Boolean);
    }
  }
}

console.log(`Cleaned ${cleanedCount} occurrences of repeated boilerplate phrases.`);

// Generate the updated guides.ts content
const fileHeader = `/**
 * ============================================================================
 * AUTOESPERTO - AUTHORITATIVE GUIDES DATABASE (194 COMPREHENSIVE GUIDES)
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

export const guides: Guide[] = ${JSON.stringify(guides, null, 2)};

export function getGuide(slug: string): Guide | undefined {
  return guides.find(g => g.slug === slug);
}

export function getGuidesByCategory(category: GuideCategory): Guide[] {
  return guides.filter(g => g.category === category);
}

export function getAllCategories(): GuideCategory[] {
  return Object.keys(GUIDE_CATEGORIES) as GuideCategory[];
}

export function getFeaturedGuides(): Guide[] {
  return guides.filter(g => g.featured);
}
`;

fs.writeFileSync('apps/web/src/lib/guides.ts', fileHeader, 'utf8');
console.log('Successfully wrote cleaned guides.ts!');
