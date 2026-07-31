'use client';

import type { AutoReport } from '@autoesperto/types';

export async function downloadPDF(report: AutoReport) {
  try {
    const { jsPDF } = await import('jspdf');
    const doc = new jsPDF();
    const { vehicle, reliability, price } = report;
    let y = 25;

    doc.setFont('helvetica');

    doc.setFontSize(22);
    doc.text('AutoEsperto', 20, y);
    y += 10;
    doc.setFontSize(12);
    doc.setTextColor(120);
    doc.text('Report di analisi veicolo', 20, y);
    y += 10;
    doc.setTextColor(0);

    doc.setDrawColor(15, 23, 42);
    doc.setLineWidth(1);
    doc.line(20, y, 190, y);
    y += 10;

    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text(`Targa: ${vehicle.plate || '—'}`, 20, y);
    y += 8;
    doc.setFont('helvetica', 'normal');
    doc.text(`Veicolo: ${vehicle.make} ${vehicle.model} ${vehicle.version || ''}`, 20, y);
    y += 7;
    doc.text(`Anno: ${vehicle.year || '—'}  ·  Alimentazione: ${vehicle.fuel || '—'}  ·  Potenza: ${vehicle.power || '—'}`, 20, y);
    y += 14;

    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('Valutazione di affidabilità', 20, y);
    y += 9;
    doc.setTextColor(0);
    doc.setFontSize(16);
    doc.text(`${reliability.score.toFixed(1)}/10`, 20, y);
    y += 8;
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(`Verdetto: ${reliability.verdictLabel}`, 20, y);
    y += 7;
    doc.text(reliability.summary, 20, y, { maxWidth: 170 });
    y += 12;

    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('Punti di forza', 20, y);
    y += 8;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    reliability.strengths.forEach((s) => {
      doc.text(`• ${s}`, 22, y); y += 6;
    });
    y += 5;

    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('Possibili criticità', 20, y);
    y += 8;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    reliability.weaknesses.forEach((w) => {
      doc.text(`• ${w}`, 22, y); y += 6;
    });
    y += 5;

    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('Consigli prima dell\'acquisto', 20, y);
    y += 8;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    reliability.advice.forEach((a) => {
      doc.text(`• ${a}`, 22, y); y += 6;
      if (y > 270) { doc.addPage(); y = 25; }
    });
    y += 5;

    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('Prezzo', 20, y);
    y += 9;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(11);
    doc.text(`Stima indicativa: ${price.estimatedValue.toLocaleString('it-IT')} EUR (${price.min.toLocaleString('it-IT')} – ${price.max.toLocaleString('it-IT')})`, 22, y); y += 7;
    if (price.requestedPrice) {
      doc.text(`Prezzo richiesto: ${price.requestedPrice.toLocaleString('it-IT')} EUR`, 22, y); y += 7;
    }
    doc.text(price.comment, 22, y, { maxWidth: 166 }); y += 10;

    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('Costi stimati', 20, y);
    y += 9;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.text(`Manutenzione annuale: ${reliability.futureCosts.annualMaintenance.toLocaleString('it-IT')} EUR`, 22, y); y += 6;
    doc.text(`Carburante / 100 km: ${reliability.futureCosts.fuelCostPer100Km.toFixed(1)} EUR`, 22, y); y += 6;
    doc.text(`Assicurazione / anno: ${reliability.futureCosts.insuranceEstimate.toLocaleString('it-IT')} EUR`, 22, y); y += 6;
    doc.text(`Svalutazione 3 anni: -${reliability.futureCosts.depreciation3Years.toLocaleString('it-IT')} EUR`, 22, y); y += 10;

    doc.setFontSize(10);
    doc.setTextColor(120);
    doc.text('Le valutazioni sono indicative e basate sui dati disponibili. Non sostituiscono un\'ispezione fisica.', 20, y, { maxWidth: 170 });

    const filename = `AutoEsperto-${vehicle.plate || vehicle.make}-${vehicle.model}.pdf`;
    doc.save(filename);
  } catch (err) {
    alert('Errore durante la generazione del PDF. Riprova o verifica la connessione.');
  }
}
