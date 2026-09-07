import { guides } from '../apps/web/src/lib/guides.ts';

const targets = [
  'autoesperto-cerca-investitori-ai-auto-usate',
  'auto-usata-10-segnali-problema-annuncio',
  'auto-usate-che-perdono-piu-valore-2026',
  'quanto-vale-fiat-panda-usata-2026',
  'quanto-vale-fiat-500-usata-2026-prezzi-controlli',
  'auto-usata-100000-km-conviene-comprare',
  'come-capire-se-auto-usata-incidentata',
  'diesel-euro-5-2026-posso-ancora-comprarlo-blocchi',
  'quanto-costa-mantenere-auto-2026-spese-reali',
  'autoesperto-freelance-siciliano-dati-reali-mercato-usato'
];

targets.forEach(slug => {
  const g = guides.find(x => x.slug === slug);
  if (!g) { console.log('NOT FOUND:', slug); return; }
  let w = (g.description || '').split(/\s+/).filter(Boolean).length;
  (g.sections || []).forEach(s => {
    (s.paragraphs || []).forEach(p => w += p.split(/\s+/).filter(Boolean).length);
    (s.list || []).forEach(l => w += l.split(/\s+/).filter(Boolean).length);
  });
  const secs = (g.sections || []).length;
  console.log(slug);
  console.log('  Title: ' + g.title);
  console.log('  Words: ' + w + ', Sections: ' + secs);
  console.log('  Category: ' + g.category + ', Image: ' + (g.image ? 'YES' : 'NO'));
  console.log('');
});
