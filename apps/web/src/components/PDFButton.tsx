'use client';

import type { AutoReport } from '@autoesperto/types';

export async function downloadPDF(report: AutoReport) {
  try {
    const { jsPDF } = await import('jspdf');
    const doc = new jsPDF();
    const { vehicle, reliability, price } = report;
    let y = 25;

    doc.setFont('helvetica');

    doc.setFontSize(24);
    doc.text('AutoEsperto', 20, y);
    y += 12;
    doc.setFontSize(14);
    doc.setTextColor(100);
    doc.text('Report di analisi veicolo', 20, y);
    y += 12;
    doc.setTextColor(0);

    doc.setDrawColor(37, 99, 235);
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

    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(37, 99, 235);
    doc.text('Indice di affidabilità', 20, y);
    y += 9;
    doc.setTextColor(0);
    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.text(`${reliability.score.toFixed(1)}/10`, 20, y);
    y += 8;
    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    doc.text(`Verdetto: ${reliability.verdictLabel}`, 20, y);
    y += 7;
    doc.text(reliability.summary, 20, y, { maxWidth: 170 });
    y += 12;

    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(37, 99, 235);
    doc.text('Valutazione di mercato', 20, y);
    y += 9;
    doc.setTextColor(0);
    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    doc.text(`Valore stimato: ${price.estimatedValue.toLocaleString('it-IT')} EUR`, 20, y); y += 7;
    doc.text(`Range: ${price.min.toLocaleString('it-IT')} – ${price.max.toLocaleString('it-IT')} EUR`, 20, y); y += 7;
    if (price.inputKm && price.adjustedForKm) {
      doc.text(`Valore con ${price.inputKm.toLocaleString('it-IT')} km: ${price.adjustedForKm.toLocaleString('it-IT')} EUR`, 20, y); y += 7;
    }
    if (price.requestedPrice) {
      doc.text(`Prezzo richiesto: ${price.requestedPrice.toLocaleString('it-IT')} EUR`, 20, y); y += 7;
      doc.text(price.comment, 20, y, { maxWidth: 170 }); y += 7;
    }
    y += 5;

    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(37, 99, 235);
    doc.text('Problemi comuni', 20, y);
    y += 9;
    doc.setTextColor(0);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    reliability.commonIssues.forEach((issue) => {
      doc.text(`• ${issue}`, 22, y); y += 6;
      if (y > 270) { doc.addPage(); y = 25; }
    });
    y += 5;

    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(37, 99, 235);
    doc.text('Costi stimati', 20, y);
    y += 9;
    doc.setTextColor(0);
    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    doc.text(`Manutenzione annuale: ${reliability.futureCosts.annualMaintenance.toLocaleString('it-IT')} EUR`, 22, y); y += 6;
    doc.text(`Carburante / 100 km: ${reliability.futureCosts.fuelCostPer100Km.toFixed(1)} EUR`, 22, y); y += 6;
    doc.text(`Assicurazione / anno: ${reliability.futureCosts.insuranceEstimate.toLocaleString('it-IT')} EUR`, 22, y); y += 6;
    doc.text(`Svalutazione 3 anni: -${reliability.futureCosts.depreciation3Years.toLocaleString('it-IT')} EUR`, 22, y); y += 10;

    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(37, 99, 235);
    doc.text('Annunci simili', 20, y);
    y += 9;
    doc.setTextColor(0);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    price.listings.forEach((l) => {
      const line = `${l.source}: ${l.title} — ${l.price.toLocaleString('it-IT')} EUR (${l.km.toLocaleString('it-IT')} km)`;
      doc.text(line, 22, y); y += 5;
      if (y > 270) { doc.addPage(); y = 25; }
    });

    const filename = `AutoEsperto-${vehicle.plate || vehicle.make}-${vehicle.model}.pdf`;
    doc.save(filename);
  } catch (err) {
    alert('Errore durante la generazione del PDF. Riprova o verifica la connessione.');
  }
}
