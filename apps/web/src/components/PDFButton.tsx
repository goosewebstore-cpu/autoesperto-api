'use client';

import type { AutoReport } from '@autoesperto/types';

interface PdfWriter {
  doc: import('jspdf').jsPDF;
  y: number;
}

const PAGE_HEIGHT = 297;
const BOTTOM_MARGIN = 27;

function ensureSpace(writer: PdfWriter, needed: number): void {
  if (writer.y + needed > PAGE_HEIGHT - BOTTOM_MARGIN) {
    writer.doc.addPage();
    writer.y = 25;
  }
}

function writeLine(writer: PdfWriter, text: string, x = 20, lineHeight = 6, maxWidth?: number): void {
  const lines = maxWidth ? writer.doc.splitTextToSize(text, maxWidth) : [text];
  for (const line of lines) {
    ensureSpace(writer, lineHeight);
    writer.doc.text(line, x, writer.y);
    writer.y += lineHeight;
  }
}

function writeHeading(writer: PdfWriter, text: string, lineHeight = 9): void {
  ensureSpace(writer, lineHeight + 2);
  writer.doc.setFontSize(14);
  writer.doc.setFont('helvetica', 'bold');
  writer.doc.text(text, 20, writer.y);
  writer.y += lineHeight;
  writer.doc.setFont('helvetica', 'normal');
  writer.doc.setFontSize(10);
}

export async function downloadPDF(report: AutoReport) {
  try {
    const { jsPDF } = await import('jspdf');
    const doc = new jsPDF();
    const { vehicle, reliability, price } = report;
    const w: PdfWriter = { doc, y: 25 };

    doc.setFont('helvetica');

    doc.setFontSize(22);
    doc.text('AutoEsperto', 20, w.y);
    w.y += 10;
    doc.setFontSize(12);
    doc.setTextColor(120);
    doc.text('Report di analisi veicolo', 20, w.y);
    w.y += 10;
    doc.setTextColor(0);

    doc.setDrawColor(15, 23, 42);
    doc.setLineWidth(1);
    doc.line(20, w.y, 190, w.y);
    w.y += 10;

    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text(`Targa: ${vehicle.plate || '—'}`, 20, w.y);
    w.y += 8;
    doc.setFont('helvetica', 'normal');
    writeLine(w, `Veicolo: ${vehicle.make} ${vehicle.model} ${vehicle.version || ''}`, 20, 7, 170);
    writeLine(w, `Anno: ${vehicle.year || '—'}  ·  Alimentazione: ${vehicle.fuel || '—'}  ·  Potenza: ${vehicle.power || '—'}`, 20, 7, 170);
    w.y += 6;

    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('Valutazione di affidabilità', 20, w.y);
    w.y += 9;
    doc.setTextColor(0);
    doc.setFontSize(16);
    doc.text(`${reliability.score.toFixed(1)}/10`, 20, w.y);
    w.y += 8;
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(`Verdetto: ${reliability.verdictLabel}`, 20, w.y);
    w.y += 7;
    writeLine(w, reliability.summary, 20, 6, 170);
    w.y += 4;

    writeHeading(w, 'Punti di forza');
    reliability.strengths.forEach((s) => writeLine(w, `• ${s}`, 22, 6, 166));
    w.y += 4;

    writeHeading(w, 'Possibili criticità');
    reliability.weaknesses.forEach((weak) => writeLine(w, `• ${weak}`, 22, 6, 166));
    w.y += 4;

    writeHeading(w, "Consigli prima dell'acquisto");
    reliability.advice.forEach((a) => writeLine(w, `• ${a}`, 22, 6, 166));
    w.y += 4;

    writeHeading(w, 'Prezzo');
    doc.setFontSize(11);
    writeLine(w, `Stima indicativa: ${price.estimatedValue.toLocaleString('it-IT')} EUR (${price.min.toLocaleString('it-IT')} – ${price.max.toLocaleString('it-IT')})`, 22, 7, 166);
    if (price.requestedPrice) {
      writeLine(w, `Prezzo richiesto: ${price.requestedPrice.toLocaleString('it-IT')} EUR`, 22, 7, 166);
    }
    writeLine(w, price.comment, 22, 7, 166);
    w.y += 4;

    writeHeading(w, 'Costi stimati');
    doc.setFontSize(10);
    writeLine(w, `Manutenzione annuale: ${reliability.futureCosts.annualMaintenance.toLocaleString('it-IT')} EUR`, 22, 6, 166);
    writeLine(w, `Carburante / 100 km: ${reliability.futureCosts.fuelCostPer100Km.toFixed(1)} EUR`, 22, 6, 166);
    writeLine(w, `Assicurazione / anno: ${reliability.futureCosts.insuranceEstimate.toLocaleString('it-IT')} EUR`, 22, 6, 166);
    writeLine(w, `Svalutazione 3 anni: -${reliability.futureCosts.depreciation3Years.toLocaleString('it-IT')} EUR`, 22, 6, 166);
    w.y += 4;

    doc.setFontSize(10);
    doc.setTextColor(120);
    writeLine(w, "Le valutazioni sono indicative e basate sui dati disponibili. Non sostituiscono un'ispezione fisica.", 20, 6, 170);

    const filename = `AutoEsperto-${vehicle.plate || vehicle.make}-${vehicle.model}.pdf`;
    doc.save(filename);
  } catch (err) {
    alert('Errore durante la generazione del PDF. Riprova o verifica la connessione.');
  }
}
