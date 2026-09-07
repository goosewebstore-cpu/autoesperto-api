import fs from 'fs';
import path from 'path';

const ARTICLES_DIR = 'articolo/articolo-autoesperto';
const OUT_FILE = 'apps/web/src/lib/guides-articoli.ts';

const files = fs.readdirSync(ARTICLES_DIR).filter(f => f.endsWith('.md'));

// Mapping CTA based on topic
function getCta(slug, cat) {
  if (slug.includes('quanto-vale')) return 'auto-usata-affare';
  if (slug.includes('vendere') || slug.includes('annuncio') || slug.includes('permuta') || slug.includes('compratore')) return 'vendere-auto';
  if (slug.includes('neopatentati')) return 'auto-neopatentati';
  if (slug.includes('finanziamento') || slug.includes('asta') || slug.includes('comprare')) return 'analizza-annuncio';
  if (slug.includes('garanzia') || slug.includes('documenti') || slug.includes('contachilometri') || slug.includes('prova-su-strada')) return 'analizza-annuncio';
  if (slug.includes('cambio') || slug.includes('cinghia') || slug.includes('fap') || slug.includes('adblue') || slug.includes('batteria') || slug.includes('richiami')) return 'affidabilita-modello';
  if (cat === 'valutazione') return 'auto-svalutazione';
  if (cat === 'vendita') return 'valore-vendita';
  if (cat === 'manutenzione') return 'costi-riparazione';
  return 'analizza-annuncio';
}

function getCategory(slug, rawCat) {
  const c = rawCat.toLowerCase();
  if (c.includes('valutazione')) return 'valutazione';
  if (c.includes('vendita')) return 'vendita';
  if (c.includes('manutenzione')) return 'manutenzione';
  if (c.includes('affidabilit')) {
    if (slug.includes('cinghia') || slug.includes('fap')) return 'manutenzione';
    return 'affidabilita';
  }
  return 'acquisto';
}

function cleanMarkdownText(text) {
  return text.trim();
}

const guides = [];

for (const file of files) {
  const slug = file.replace('.md', '');
  const raw = fs.readFileSync(path.join(ARTICLES_DIR, file), 'utf8');
  const lines = raw.split('\n');

  // Metadata line
  const metaLine = lines[0] || '';
  const rawCat = (metaLine.match(/\*\*([^*]+)\*\*/) || [])[1] || 'Acquisto';
  const category = getCategory(slug, rawCat);

  // Title
  const titleLine = lines.find(l => l.startsWith('# ')) || '';
  const title = titleLine.replace('# ', '').trim();

  // Description
  const descLine = lines.find((l, i) => i > 2 && l.trim().length > 25 && !l.startsWith('#')) || '';
  const description = descLine.trim();

  // Parse existing sections
  const sections = [];
  let currentSection = null;
  let inSynthesis = false;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (line.startsWith('## ') || line.startsWith('### ')) {
      const headingText = line.replace(/^#+\s+/, '').trim();
      if (headingText.toLowerCase().includes('in sintesi') || headingText.toLowerCase().includes('punti chiave')) {
        inSynthesis = true;
      }
      currentSection = {
        heading: headingText,
        paragraphs: [],
        list: [],
      };
      sections.push(currentSection);
      continue;
    }

    if (!currentSection) continue;

    if (line.startsWith('- ') || line.startsWith('* ')) {
      const bullet = line.replace(/^[-*]\s+/, '').trim();
      currentSection.list.push(bullet);
    } else if (line.length > 0 && !line.startsWith('---') && !line.startsWith('*Fonti:')) {
      currentSection.paragraphs.push(line);
    }
  }

  // Calculate read time
  const totalWords = raw.split(/\s+/).length;
  const readTime = `${Math.max(5, Math.ceil(totalWords / 70))} min`;

  guides.push({
    slug,
    title,
    description,
    published: '2026-09-04',
    category,
    cta: getCta(slug, category),
    image: `/images/guide/${slug}.jpg`,
    readTime,
    sections: sections.filter(s => s.paragraphs.length > 0 || s.list.length > 0),
  });
}

console.log(`Parsed ${guides.length} guides from markdown.`);

// Generate the TypeScript file content
const tsContent = `import type { Guide } from './guide-types';

/**
 * ============================================================================
 * AUTOESPERTO - NUOVI 36 ARTICOLI SPECIALISTICI (DA CARTELLA ARTICOLO)
 * ============================================================================
 * Articoli editoriali per acquisto, vendita, quotazioni modelli, manutenzione
 * e tutela contro le truffe dell'usato in Italia.
 * ============================================================================
 */

export const articoliGuides: Guide[] = ${JSON.stringify(guides, null, 2)};
`;

fs.writeFileSync(OUT_FILE, tsContent, 'utf8');
console.log(`Successfully generated ${OUT_FILE} with ${guides.length} articles (${(tsContent.length / 1024).toFixed(1)} KB).`);
