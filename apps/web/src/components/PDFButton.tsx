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

function writeSectionTitle(writer: PdfWriter, text: string): void {
  ensureSpace(writer, 12);
  writer.y += 4;
  writer.doc.setFontSize(12);
  writer.doc.setFont('helvetica', 'bold');
  writer.doc.setTextColor(15, 23, 42);
  writer.doc.text(text, 20, writer.y);
  writer.y += 6;
  writer.doc.setDrawColor(226, 232, 240);
  writer.doc.setLineWidth(0.4);
  writer.doc.line(20, writer.y, 190, writer.y);
  writer.y += 4;
  writer.doc.setFont('helvetica', 'normal');
  writer.doc.setFontSize(10);
  writer.doc.setTextColor(71, 85, 105);
}

function writeKpiBox(
  writer: PdfWriter,
  label: string,
  value: string,
  sub: string | undefined,
  x: number,
  y: number,
  w: number,
  h: number,
  fill: [number, number, number],
  textColor: [number, number, number]
): void {
  const { doc } = writer;
  doc.setFillColor(fill[0], fill[1], fill[2]);
  doc.roundedRect(x, y, w, h, 3, 3, 'F');
  doc.setTextColor(100, 116, 139);
  doc.setFontSize(7);
  doc.setFont('helvetica', 'bold');
  doc.text(label.toUpperCase(), x + 5, y + 7);
  doc.setTextColor(textColor[0], textColor[1], textColor[2]);
  doc.setFontSize(13);
  doc.setFont('helvetica', 'bold');
  doc.text(value, x + 5, y + 16);
  if (sub) {
    doc.setTextColor(100, 116, 139);
    doc.setFontSize(7);
    doc.setFont('helvetica', 'normal');
    doc.text(sub, x + 5, y + 22);
  }
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(71, 85, 105);
  doc.setFontSize(10);
}

function euro(v: number): string {
  return v.toLocaleString('it-IT') + ' €';
}

function costLabel(annualMaintenance: number): string {
  if (annualMaintenance < 400) return 'Bassi';
  if (annualMaintenance < 700) return 'Medi';
  return 'Alti';
}

export async function downloadPDF(report: AutoReport) {
  try {
    const { jsPDF } = await import('jspdf');
    const doc = new jsPDF();
    const { vehicle, reliability, price } = report;
    const w: PdfWriter = { doc, y: 25 };

    doc.setFont('helvetica');

    // ── Header ──
    doc.setFillColor(15, 23, 42);
    doc.rect(0, 0, 210, 24, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text('AUTOESPERTO', 20, 14);
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(191, 219, 254);
    doc.text('Il tuo secondo parere prima di comprare o vendere un\u2019auto usata', 20, 19);
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text('REPORT AUTO', 190, 14, { align: 'right' });
    doc.setFontSize(7);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(203, 213, 225);
    doc.text(
      report.createdAt ? `analisi del ${new Date(report.createdAt).toLocaleDateString('it-IT')}` : 'analisi indicativa',
      190,
      19,
      { align: 'right' }
    );

    w.y = 34;

    // ── Vehicle identity ──
    doc.setTextColor(15, 23, 42);
    doc.setFontSize(20);
    doc.setFont('helvetica', 'bold');
    doc.text(`${vehicle.make} ${vehicle.model}`, 20, w.y);
    w.y += 9;
    const detailParts = [
      vehicle.version,
      vehicle.year ? String(vehicle.year) : '',
      price.inputKm ? `circa ${price.inputKm.toLocaleString('it-IT')} km` : '',
      vehicle.fuel || '',
    ].filter((v) => Boolean(v));
    if (detailParts.length) {
      doc.setFontSize(11);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(71, 85, 105);
      doc.text(detailParts.join('  ·  '), 20, w.y);
      w.y += 8;
    }
    doc.setDrawColor(15, 23, 42);
    doc.setLineWidth(0.8);
    doc.line(20, w.y, 190, w.y);
    w.y += 8;

    // ── KPI boxes ──
    const boxH = 26;
    const boxGap = 4;
    const boxW = (170 - boxGap * 3) / 4;
    const kpiY = w.y;
    const relColor: [number, number, number] =
      reliability.verdict === 'BUY'
        ? [240, 253, 244]
        : reliability.verdict === 'NEGOTIATE'
          ? [255, 251, 235]
          : [254, 242, 242];
    const relText: [number, number, number] =
      reliability.verdict === 'BUY'
        ? [22, 101, 52]
        : reliability.verdict === 'NEGOTIATE'
          ? [146, 64, 14]
          : [185, 28, 28];

    writeKpiBox(w, 'Valore', euro(price.estimatedValue), `${euro(price.min)} – ${euro(price.max)}`, 20, kpiY, boxW, boxH, [239, 246, 255], [29, 78, 216]);
    writeKpiBox(w, 'Affidabilità', `${reliability.score.toFixed(1)}/10`, 'punteggio 0-10', 20 + boxW + boxGap, kpiY, boxW, boxH, relColor, relText);
    writeKpiBox(w, 'Costi', costLabel(reliability.futureCosts.annualMaintenance), 'mantenimento annuo', 20 + (boxW + boxGap) * 2, kpiY, boxW, boxH, [241, 245, 249], [15, 23, 42]);
    writeKpiBox(w, 'Verdetto', reliability.verdictLabel, 'dalla combinazione dei dati', 20 + (boxW + boxGap) * 3, kpiY, boxW, boxH, relColor, relText);

    w.y = kpiY + boxH + 6;

    // ── Risultato ──
    writeSectionTitle(w, 'Risultato');
    doc.setTextColor(15, 23, 42);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text(reliability.verdictLabel.toUpperCase(), 20, w.y);
    w.y += 5;
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(71, 85, 105);
    writeLine(w, reliability.summary, 20, 6, 170);
    if (price.requestedPrice) {
      writeLine(w, `Prezzo richiesto: ${euro(price.requestedPrice)}`, 20, 6, 170);
    }
    writeLine(w, `Stima di mercato: ${euro(price.min)} – ${euro(price.max)} · valore centrale ${euro(price.estimatedValue)}`, 20, 6, 170);
    if (price.priceVsMarketPercent !== undefined) {
      writeLine(w, `Prezzo richiesto ${price.priceVsMarketPercent > 0 ? '+' : ''}${price.priceVsMarketPercent}% rispetto alla stima.`, 20, 6, 170);
    }
    writeLine(w, price.comment, 20, 6, 170);
    w.y += 2;

    // ── Punti da controllare ──
    writeSectionTitle(w, 'Punti da controllare');
    const checkList = reliability.advice.length
      ? reliability.advice
      : reliability.commonIssues.length
        ? reliability.commonIssues
        : reliability.weaknesses;
    if (checkList.length) {
      checkList.slice(0, 6).forEach((item) => writeLine(w, `• ${item}`, 22, 6, 166));
    } else {
      writeLine(w, 'Nessun punto specifico da segnalare.', 22, 6, 166);
    }

    // ── Problemi comuni ──
    if (reliability.commonIssues.length) {
      writeSectionTitle(w, 'Problemi comuni del modello');
      reliability.commonIssues.slice(0, 5).forEach((item) => writeLine(w, `• ${item}`, 22, 6, 166));
    }

    // ── Costi di riparazione e gestione ──
    writeSectionTitle(w, 'Costi di riparazione e gestione');
    const costRows: Array<[string, string]> = [
      ['Manutenzione annuale', euro(reliability.futureCosts.annualMaintenance)],
      ['Carburante ogni 100 km', `${reliability.futureCosts.fuelCostPer100Km.toFixed(1)} €`],
      ['Assicurazione annuale (stima)', euro(reliability.futureCosts.insuranceEstimate)],
    ];
    if (reliability.taxAnnual !== undefined) costRows.push(['Bollo annuale (stima)', euro(reliability.taxAnnual)]);
    costRows.push(['Svalutazione prevista in 3 anni', `-${euro(reliability.futureCosts.depreciation3Years)}`]);

    const startY = w.y;
    doc.setFontSize(9);
    costRows.forEach(([label, value], i) => {
      const rowY = startY + i * 8;
      doc.setTextColor(71, 85, 105);
      doc.setFont('helvetica', 'normal');
      doc.text(label, 22, rowY);
      doc.setTextColor(15, 23, 42);
      doc.setFont('helvetica', 'bold');
      doc.text(value, 188, rowY, { align: 'right' });
    });
    w.y = startY + costRows.length * 8 + 4;

    // ── Consumi ──
    if (reliability.consumption?.combined) {
      const { consumption } = reliability;
      writeSectionTitle(w, 'Consumi');
      writeLine(
        w,
        `Città ${consumption.city ?? '—'}${consumption.fuelType ? ` ${consumption.fuelType}/100km` : ' km/l'} · Autostrada ${consumption.highway ?? '—'}${consumption.fuelType ? ` ${consumption.fuelType}/100km` : ' km/l'} · Combinato ${consumption.combined}${consumption.fuelType ? ` ${consumption.fuelType}/100km` : ' km/l'}`,
        20,
        6,
        170
      );
    }

    // ── Note ──
    writeSectionTitle(w, 'Note');
    writeLine(
      w,
      'Questa analisi è indicativa e basata sui dati di mercato disponibili. La stima del valore usa i prezzi pubblicati negli annunci reali e può differire dal prezzo finale di vendita. Non sostituisce un\u2019ispezione fisica o una perizia professionale: per decisioni d\u2019acquisto verifica sempre l\u2019esemplare specifico.',
      20,
      6,
      170
    );

    // ── Footer ──
    const pageCount = doc.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setDrawColor(226, 232, 240);
      doc.setLineWidth(0.3);
      doc.line(20, 284, 190, 284);
      doc.setFontSize(7);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(148, 163, 184);
      doc.text('AutoEsperto — autoesperto.it · Stima indicativa, non una perizia', 20, 289);
      doc.text(`Pagina ${i} di ${pageCount}`, 190, 289, { align: 'right' });
    }

    const filename = `AutoEsperto-${vehicle.plate || `${vehicle.make}-${vehicle.model}`}.pdf`;
    doc.save(filename);
  } catch (err) {
    alert('Errore durante la generazione del PDF. Riprova o verifica la connessione.');
  }
}
