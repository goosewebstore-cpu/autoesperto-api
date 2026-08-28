import { guides, getGuide } from '../apps/web/src/lib/guides.ts';

console.log(`Total guides loaded: ${guides.length}`);

const issues = [];
const ctaKeys = new Set([
  'auto-usata-affare', 'auto-svalutazione', 'vendere-auto', 'controllare-auto-usata',
  'auto-affidabili-2026', 'auto-incidentata', 'valutare-danno-riparazione', 'stima-riparazione',
  'riparare-o-rottamare', 'prezzo-giusto', 'passaggio-proprieta', 'elettrica-benzina',
  'consumi-auto', 'assicurazione-auto', 'revisione-auto', 'garanzia-usato',
  'trattare-prezzo', 'permuta-o-vendita', 'ibride-convengono', 'durata-auto',
  'auto-estero', 'chilometraggio-reale', 'valutazione-auto', 'controllo-usato',
  'costi-riparazione', 'consumi-modello', 'confronto-modelli', 'analisi-ai',
  'affidabilita-modello', 'valore-vendita'
]);

for (let i = 0; i < guides.length; i++) {
  const g = guides[i];
  if (!g.slug || typeof g.slug !== 'string') {
    issues.push(`Guide #${i} missing slug`);
  }
  if (!g.title || g.title.length < 10) {
    issues.push(`Guide ${g.slug} has invalid/short title: "${g.title}"`);
  }
  if (!g.description || g.description.length < 20) {
    issues.push(`Guide ${g.slug} has short description: "${g.description}"`);
  }
  if (!g.category) {
    issues.push(`Guide ${g.slug} missing category`);
  }
  if (!g.sections || g.sections.length === 0) {
    issues.push(`Guide ${g.slug} has NO sections`);
  } else {
    for (let sIdx = 0; sIdx < g.sections.length; sIdx++) {
      const s = g.sections[sIdx];
      if (!s.heading || s.heading.trim().length === 0) {
        issues.push(`Guide ${g.slug} section #${sIdx} missing heading`);
      }
      if (!s.paragraphs || s.paragraphs.length === 0) {
        if (!s.list || s.list.length === 0) {
          issues.push(`Guide ${g.slug} section "${s.heading}" has NO paragraphs and NO list`);
        }
      }
    }
  }
  if (g.cta && !ctaKeys.has(g.cta)) {
    issues.push(`Guide ${g.slug} has unmapped CTA key: "${g.cta}"`);
  }

  // Verify getGuide returns the guide
  const found = getGuide(g.slug);
  if (!found) {
    issues.push(`getGuide('${g.slug}') returned undefined!`);
  }
}

if (issues.length > 0) {
  console.error(`Found ${issues.length} issues:`);
  for (const iss of issues) {
    console.error(`- ${iss}`);
  }
} else {
  console.log(`✓ All ${guides.length} guides passed structural validation!`);
}
