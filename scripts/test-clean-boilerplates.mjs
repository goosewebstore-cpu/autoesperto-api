import { guides } from '../apps/web/src/lib/guides.ts';

const repeatedPatterns = [
  " Questo aspetto è particolarmente rilevante nel contesto del mercato italiano dell'usato, dove la verifica accurata di ogni dettaglio può fare la differenza tra un buon affare e una spesa imprevista.",
  " Nella pratica quotidiana, questo significa che la differenza tra un acquisto informato e uno avventato può facilmente superare i 1.000-2.000 euro — una cifra che giustifica ampiamente il tempo investito nella ricerca e nella verifica.",
  " Dedicare 15-20 minuti a un controllo approfondito prima di procedere con la trattativa può evitare spese impreviste di centinaia o migliaia di euro nei mesi successivi all'acquisto.",
  " Un veicolo con la manutenzione regolare documentata non solo dura di più, ma conserva un valore di rivendita sensibilmente superiore — mediamente tra il 10% e il 15% in più rispetto a un esemplare con storico incompleto.",
  " Il mercato dell'usato italiano muove oltre 5 milioni di transazioni ogni anno, e la differenza tra chi compra informato e chi compra d'impulso si traduce in migliaia di euro risparmiati o persi."
];

function cleanText(text) {
  let res = text;
  for (const pat of repeatedPatterns) {
    if (res.includes(pat)) {
      res = res.replaceAll(pat, '');
    }
  }
  return res.trim();
}

const cleanedStats = guides.map((g) => {
  let w = (g.description || '').split(/\s+/).filter(Boolean).length;
  (g.sections || []).forEach(s => {
    (s.paragraphs || []).forEach(p => {
      w += cleanText(p).split(/\s+/).filter(Boolean).length;
    });
    (s.list || []).forEach(l => {
      w += cleanText(l).split(/\s+/).filter(Boolean).length;
    });
  });
  return { slug: g.slug, title: g.title, words: w, sections: (g.sections || []).length, category: g.category };
});

cleanedStats.sort((a, b) => a.words - b.words);

console.log('=== DISTRIBUTION AFTER CLEANING ===');
const ranges = [
  { label: '< 300 parole', min: 0, max: 300 },
  { label: '300-500 parole', min: 300, max: 500 },
  { label: '500-700 parole', min: 500, max: 700 },
  { label: '700-1000 parole', min: 700, max: 1000 },
  { label: '1000+ parole', min: 1000, max: Infinity }
];
ranges.forEach(r => {
  const count = cleanedStats.filter(s => s.words >= r.min && s.words < r.max).length;
  console.log(`${r.label}: ${count} articoli`);
});

console.log(`\nMedia parole: ${Math.round(cleanedStats.reduce((s, a) => s + a.words, 0) / cleanedStats.length)}`);
console.log(`Mediana: ${cleanedStats[Math.floor(cleanedStats.length / 2)].words}`);

console.log('\n=== 20 ARTICOLI PIÙ CORTI DOPO PULIZIA ===');
cleanedStats.slice(0, 20).forEach(s => {
  console.log(`${s.words}w | ${s.sections}s | ${s.slug}`);
});
