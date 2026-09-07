import fs from 'fs';
const content = fs.readFileSync('apps/web/src/lib/guides.ts', 'utf8');
const slugsToFind = [
  'autoesperto-freelance-siciliano-dati-reali-mercato-usato',
  'auto-usata-10-segnali-problema-annuncio',
  'quanto-vale-fiat-500-usata-2026-prezzi-controlli',
  'diesel-euro-5-2026-posso-ancora-comprarlo-blocchi',
  'quanto-vale-fiat-panda-usata-2026',
  'auto-usata-100000-km-conviene-comprare',
  'quanto-costa-mantenere-auto-2026-spese-reali',
  'auto-usate-che-perdono-piu-valore-2026',
  'come-capire-se-auto-usata-incidentata'
];
const lines = content.split('\n');
slugsToFind.forEach(slug => {
  const lineIdx = lines.findIndex(l => l.includes(`slug: '${slug}'`));
  console.log(slug, 'line:', lineIdx + 1);
});
