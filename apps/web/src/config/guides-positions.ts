/**
 * ============================================================================
 * CONFIGURAZIONE POSIZIONE DELLE GUIDE — AUTOESPERTO
 * ============================================================================
 * 
 * Qui puoi cambiare in modo facile e immediato le posizioni delle guide
 * sia nella HOME PAGE che nella pagina /GUIDE.
 * 
 * ISTRUZIONI SEMPLICI:
 * - Per cambiare la posizione: sposta la riga su o giù (Posizione 1, 2, 3...)
 * - Per sostituire una guida: cambia semplicemente lo 'slug' (es. 'auto-usata-10-segnali-problema-annuncio')
 * - Titolo, categoria, tempo di lettura e immagini vengono recuperati in automatico!
 * ============================================================================
 */

import { guides, type Guide, type GuideCategory } from '@/lib/guides';

export interface GuidePositionItem {
  slug: string;
  title: string;
  category: GuideCategory;
  categoryLabel: string;
  readTime: string;
  image?: string;
  description: string;
}

/**
 * ────────────────────────────────────────────────────────────────────────────
 * 1. POSIZIONE GUIDE NELLA HOME PAGE (Sezione "Guide Utili & Analisi Usato")
 * ────────────────────────────────────────────────────────────────────────────
 * Qui decidi quali 6 guide mostrare per ogni scheda della home page.
 * L'ordine nell'elenco determina la posizione esatta:
 * Posizione 1 = prima card in alto a sinistra, Posizione 6 = ultima card in basso a destra.
 */
export const HOME_GUIDES_ORDER: Record<string, { label: string; slugs: string[] }> = {
  // Scheda 1: Tutte le guide in primo piano
  tutte: {
    label: 'Tutte',
    slugs: [
      'auto-usata-10-segnali-problema-annuncio',                 // 1ª Posizione
      '5-cose-da-controllare-prima-comprare-auto-usata',         // 2ª Posizione
      'come-vendere-auto-da-privato-guida-completa',             // 3ª Posizione
      'aria-condizionata-auto-salva-motore-batteria-caldo-2026', // 4ª Posizione
      'quanto-vale-fiat-500-usata-2026-prezzi-controlli',        // 5ª Posizione
      'analisi-auto-report-comprare-vendere',                    // 6ª Posizione
    ],
  },

  // Scheda 2: Acquisto Usato
  acquisto: {
    label: 'Acquisto Usato',
    slugs: [
      'come-vendere-auto-da-privato-guida-completa',             // 1ª Posizione
      '5-cose-da-controllare-prima-comprare-auto-usata',         // 2ª Posizione
      'auto-usata-10-segnali-problema-annuncio',                 // 3ª Posizione
      'analisi-auto-report-comprare-vendere',                    // 4ª Posizione
      'perche-auto-targa-polacca-italia-cosa-ce-dietro',         // 5ª Posizione
      'passaggio-proprieta-auto-usata-come-funziona-costi',       // 6ª Posizione
    ],
  },

  // Scheda 3: Valutazioni & Prezzi
  valutazione: {
    label: 'Valutazioni & Prezzi',
    slugs: [
      'quanto-vale-fiat-500-usata-2026-prezzi-controlli',        // 1ª Posizione
      'svalutazione-auto-quali-perdono-meno-valore',             // 2ª Posizione
      'come-capire-se-auto-usata-e-affare',                      // 3ª Posizione
      'quanto-vale-la-mia-auto-usata-guida-valutazione',         // 4ª Posizione
      'benzina-diesel-ibrida-quale-conviene-comprare-usata',      // 5ª Posizione
      'autoesperto-freelance-siciliano-dati-reali-mercato-usato', // 6ª Posizione
    ],
  },

  // Scheda 4: Affidabilità & Difetti
  affidabilita: {
    label: 'Affidabilità & Difetti',
    slugs: [
      'motori-puretech-problemi-cinghia-bagno-olio',             // 1ª Posizione
      'motori-diesel-dpf-fap-problemi-citta',                    // 2ª Posizione
      'cambio-automatico-usato-dsg-edc-convertitore-problemi',    // 3ª Posizione
      'aria-condizionata-auto-salva-motore-batteria-caldo-2026', // 4ª Posizione
      'auto-usata-10-segnali-problema-annuncio',                 // 5ª Posizione
      'danno-carrozzeria-fai-da-te-o-carrozziere',               // 6ª Posizione
    ],
  },

  // Scheda 5: Manutenzione & Costi
  manutenzione: {
    label: 'Manutenzione & Costi',
    slugs: [
      'aria-condizionata-auto-salva-motore-batteria-caldo-2026', // 1ª Posizione
      'benzina-quasi-da-record-guida-risparmiare-1500-euro',     // 2ª Posizione
      'cinghia-distribuzione-quando-cambiarla-costi',            // 3ª Posizione
      'tagliando-auto-ogni-quanto-farlo-e-cosa-cambiare',        // 4ª Posizione
      'pastiglie-e-dischi-freno-quando-sostituirli',             // 5ª Posizione
      'batteria-auto-come-capire-se-sta-morendo',                // 6ª Posizione
    ],
  },
};

/**
 * ────────────────────────────────────────────────────────────────────────────
 * 2. POSIZIONE DELLE GUIDE IN EVIDENZA NELLA PAGINA /GUIDE (Top 3 o 6)
 * ────────────────────────────────────────────────────────────────────────────
 * Queste sono le guide in evidenza nel riquadro superiore "Trending 2026".
 * Un multiplo di 3 (3 o 6) garantisce un allineamento perfetto della griglia desktop.
 */
export const GUIDE_PAGE_FEATURED: string[] = [
  'come-vendere-auto-da-privato-guida-completa',                 // 1ª In evidenza
  'perche-auto-targa-polacca-italia-cosa-ce-dietro',             // 2ª In evidenza
  'aria-condizionata-auto-salva-motore-batteria-caldo-2026',     // 3ª In evidenza
  'malta-compra-carburante-italia-prezzi-pompa-confronto',       // 4ª In evidenza
  'benzina-quasi-da-record-guida-risparmiare-1500-euro',         // 5ª In evidenza
  'auto-usata-10-segnali-problema-annuncio',                     // 6ª In evidenza
];

/**
 * ────────────────────────────────────────────────────────────────────────────
 * 3. ORDINE PRIORITARIO GENERALE PER LA PAGINA /GUIDE
 * ────────────────────────────────────────────────────────────────────────────
 * Le guide elencate qui avranno sempre la precedenza assoluta nelle prime
 * posizioni della pagina /guide, seguite da tutte le altre.
 */
export const GUIDE_PRIORITY_ORDER: string[] = [
  'auto-usata-10-segnali-problema-annuncio',
  'come-vendere-auto-da-privato-guida-completa',
  '5-cose-da-controllare-prima-comprare-auto-usata',
  'analisi-auto-report-comprare-vendere',
  'quanto-vale-fiat-500-usata-2026-prezzi-controlli',
  'motori-puretech-problemi-cinghia-bagno-olio',
  'aria-condizionata-auto-salva-motore-batteria-caldo-2026',
  'perche-auto-targa-polacca-italia-cosa-ce-dietro',
  'malta-compra-carburante-italia-prezzi-pompa-confronto',
  'benzina-quasi-da-record-guida-risparmiare-1500-euro',
  'cambio-automatico-usato-dsg-edc-convertitore-problemi',
  'motori-diesel-dpf-fap-problemi-citta',
  'passaggio-proprieta-auto-usata-come-funziona-costi',
  'svalutazione-auto-quali-perdono-meno-valore',
];

/**
 * Helper: data una lista di slug, restituisce le guide complete arricchite
 */
export function getGuidesBySlugs(slugs: string[]): Guide[] {
  const guideMap = new Map(guides.map((g) => [g.slug, g]));
  const result: Guide[] = [];
  for (const slug of slugs) {
    const g = guideMap.get(slug);
    if (g) result.push(g);
  }
  return result;
}

/**
 * Helper: risolve le 6 guide per la Home Page dato il nome della categoria
 */
export function getHomeGuidesForCategory(categoryKey: string): GuidePositionItem[] {
  const catConfig = HOME_GUIDES_ORDER[categoryKey] || HOME_GUIDES_ORDER.tutte;
  const guideMap = new Map(guides.map((g) => [g.slug, g]));

  return catConfig.slugs.map((slug) => {
    const found = guideMap.get(slug);
    if (found) {
      return {
        slug: found.slug,
        title: found.title,
        category: found.category,
        categoryLabel: found.category ? (found.category.charAt(0).toUpperCase() + found.category.slice(1)) : 'Guida',
        readTime: found.readTime || '6 min',
        image: found.image || `/images/guide/${found.slug}.jpg`,
        description: found.description,
      };
    }
    // Fallback pulito se lo slug non esiste
    return {
      slug,
      title: slug.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()),
      category: 'acquisto' as GuideCategory,
      categoryLabel: 'Guida',
      readTime: '6 min',
      image: `/images/guide/${slug}.jpg`,
      description: '',
    };
  });
}
