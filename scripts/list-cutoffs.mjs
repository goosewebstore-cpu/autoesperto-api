import { guides } from '../apps/web/src/lib/guides.ts';

for (const g of guides) {
  const cuts = [];
  if (g.sections) {
    g.sections.forEach((s, sIdx) => {
      (s.paragraphs || []).forEach((p, pIdx) => {
        const text = p.trim();
        // Check if begins with a broken lowercase word
        if (/^[a-zàèéìòù]/.test(text) && !text.startsWith('http')) {
          cuts.push(`Broken start P[${sIdx},${pIdx}]: "${text.slice(0, 40)}..."`);
        }
        // Check if ends without punctuation
        if (!/[.!?:)'"»]$/.test(text) && !text.endsWith('**')) {
          cuts.push(`Broken end P[${sIdx},${pIdx}]: "...${text.slice(-40)}"`);
        }
      });
      (s.list || []).forEach((l, lIdx) => {
        const text = l.trim();
        if (/^[a-zàèéìòù]/.test(text) && !text.startsWith('http')) {
          cuts.push(`Broken start L[${sIdx},${lIdx}]: "${text.slice(0, 40)}..."`);
        }
        if (!/[.!?:)'"»]$/.test(text) && !text.endsWith('**')) {
          cuts.push(`Broken end L[${sIdx},${lIdx}]: "...${text.slice(-40)}"`);
        }
      });
    });
  }

  if (cuts.length > 0) {
    console.log(`\n=== SLUG: ${g.slug} (${cuts.length} broken pieces) ===`);
    for (const c of cuts) {
      console.log('  ', c);
    }
  }
}
