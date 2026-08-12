'use client';

import type { AutoReport } from '@autoesperto/types';

export interface PDFConditionData {
  refinedYear: number;
  refinedKm: number;
  accidentHistoryLabel: string;
  costModeLabel: string;
  recalculatedValue: number;
  verdictLabel: string;
  verdictDescription: string;
  verdictType: 'repair' | 'evaluate' | 'sell';
  totalDiyMin: number;
  totalDiyMax: number;
  totalMechMin: number;
  totalMechMax: number;
  items: Array<{
    type: 'spia' | 'danno';
    label: string;
    detail?: string;
    diyCost: string;
    mechCost: string;
    urgencyLabel?: string;
    canDiy: boolean;
  }>;
}

interface PdfWriter {
  doc: import('jspdf').jsPDF;
  y: number;
}

const PAGE_HEIGHT = 297;
const BOTTOM_MARGIN = 27;
const MARGIN = 20;
const CONTENT_W = 170;

const C = {
  dark: [15, 23, 42] as [number, number, number],
  primary: [37, 99, 235] as [number, number, number],
  primaryLight: [219, 234, 254] as [number, number, number],
  slateText: [71, 85, 105] as [number, number, number],
  slateMuted: [100, 116, 139] as [number, number, number],
  slateLight: [148, 163, 184] as [number, number, number],
  border: [226, 232, 240] as [number, number, number],
  surface: [241, 245, 249] as [number, number, number],
  white: [255, 255, 255] as [number, number, number],
  success: [22, 101, 52] as [number, number, number],
  successBg: [240, 253, 244] as [number, number, number],
  warning: [146, 64, 14] as [number, number, number],
  warningBg: [255, 251, 235] as [number, number, number],
  danger: [185, 28, 28] as [number, number, number],
  dangerBg: [254, 242, 242] as [number, number, number],
};

function ensureSpace(writer: PdfWriter, needed: number): void {
  if (writer.y + needed > PAGE_HEIGHT - BOTTOM_MARGIN) {
    writer.doc.addPage();
    writer.y = 25;
  }
}

function writeLine(writer: PdfWriter, text: string, x = MARGIN, lineHeight = 6, maxWidth?: number): void {
  const lines = maxWidth ? writer.doc.splitTextToSize(text, maxWidth) : [text];
  for (const line of lines) {
    ensureSpace(writer, lineHeight);
    writer.doc.text(line, x, writer.y);
    writer.y += lineHeight;
  }
}

function sectionTitle(writer: PdfWriter, text: string): void {
  const { doc } = writer;
  ensureSpace(writer, 14);
  writer.y += 4;
  doc.setFillColor(C.primary[0], C.primary[1], C.primary[2]);
  doc.roundedRect(MARGIN, writer.y - 4.5, 2.4, 7, 1.2, 1.2, 'F');
  doc.setFontSize(13);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(C.dark[0], C.dark[1], C.dark[2]);
  doc.text(text, MARGIN + 7, writer.y);
  doc.setDrawColor(C.border[0], C.border[1], C.border[2]);
  doc.setLineWidth(0.4);
  doc.line(MARGIN + 7, writer.y + 2, 190, writer.y + 2);
  writer.y += 7;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(C.slateText[0], C.slateText[1], C.slateText[2]);
}

function writeList(writer: PdfWriter, items: string[], x: number, maxW: number, marker: string, maxItems = 6): void {
  items.slice(0, maxItems).forEach((item) => writeLine(writer, `${marker} ${item}`, x, 6, maxW));
}

function box(writer: PdfWriter, x: number, y: number, w: number, h: number, fill: [number, number, number]): void {
  const { doc } = writer;
  doc.setFillColor(fill[0], fill[1], fill[2]);
  doc.roundedRect(x, y, w, h, 3, 3, 'F');
}

function kpiBox(
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
  box(writer, x, y, w, h, fill);
  doc.setTextColor(C.slateMuted[0], C.slateMuted[1], C.slateMuted[2]);
  doc.setFontSize(7);
  doc.setFont('helvetica', 'bold');
  doc.text(label.toUpperCase(), x + 6, y + 8);
  doc.setTextColor(textColor[0], textColor[1], textColor[2]);
  doc.setFontSize(13);
  doc.setFont('helvetica', 'bold');
  doc.text(value, x + 6, y + 18);
  if (sub) {
    doc.setTextColor(C.slateMuted[0], C.slateMuted[1], C.slateMuted[2]);
    doc.setFontSize(7);
    doc.setFont('helvetica', 'normal');
    doc.text(sub, x + 6, y + 25);
  }
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(C.slateText[0], C.slateText[1], C.slateText[2]);
  doc.setFontSize(10);
}

function scoreBar(writer: PdfWriter, x: number, y: number, w: number, score: number, color: [number, number, number]): void {
  const { doc } = writer;
  doc.setFillColor(C.border[0], C.border[1], C.border[2]);
  doc.roundedRect(x, y, w, 6, 3, 3, 'F');
  const frac = Math.max(0.03, Math.min(1, score / 10));
  doc.setFillColor(color[0], color[1], color[2]);
  doc.roundedRect(x, y, w * frac, 6, 3, 3, 'F');
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(C.dark[0], C.dark[1], C.dark[2]);
  doc.text(`${score.toFixed(1)} / 10`, x + w + 5, y + 4.5);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(C.slateText[0], C.slateText[1], C.slateText[2]);
  doc.setFontSize(10);
}

function verdictColors(verdict: string): { bg: [number, number, number]; text: [number, number, number] } {
  if (verdict === 'BUY') return { bg: C.successBg, text: C.success };
  if (verdict === 'NEGOTIATE') return { bg: C.warningBg, text: C.warning };
  return { bg: C.dangerBg, text: C.danger };
}

function fillPolygon(doc: import('jspdf').jsPDF, pts: number[], style: 'F' | 'S' | 'FD'): void {
  if (pts.length < 6) return;
  let path = `M ${pts[0]} ${pts[1]}`;
  for (let i = 2; i < pts.length; i += 2) {
    path += ` L ${pts[i]} ${pts[i + 1]}`;
  }
  path += ' Z';
  (doc as unknown as { path: (p: string, s?: string) => void }).path(path, style);
}

function drawCar(doc: import('jspdf').jsPDF, cx: number, cy: number, w: number): void {
  const s = w / 100;
  const P = (pts: Array<[number, number]>) => pts.map(([px, py]) => [cx + (px - 50) * s, cy + (py - 20) * s]);
  const flat = (pts: Array<[number, number]>) => P(pts).flat();
  doc.setFillColor(C.surface[0], C.surface[1], C.surface[2]);
  doc.roundedRect(cx - w / 2 - 6, cy + 17.5, w + 12, 5, 2.5, 2.5, 'F');
  doc.setFillColor(C.dark[0], C.dark[1], C.dark[2]);
  fillPolygon(
    doc,
    flat([
      [2, 32],
      [4, 20],
      [12, 11],
      [40, 6],
      [72, 6],
      [88, 19],
      [97, 32],
    ]),
    'F'
  );
  doc.setFillColor(C.slateLight[0], C.slateLight[1], C.slateLight[2]);
  fillPolygon(
    doc,
    flat([
      [16, 12],
      [38, 8.5],
      [66, 8.5],
      [78, 17],
      [20, 17],
    ]),
    'F'
  );
  doc.setFillColor(C.dark[0], C.dark[1], C.dark[2]);
  doc.circle(cx + (78 - 50) * s, cy + (32 - 20) * s, 6.2 * s, 'F');
  doc.circle(cx + (22 - 50) * s, cy + (32 - 20) * s, 6.2 * s, 'F');
  doc.setFillColor(255, 255, 255);
  doc.circle(cx + (78 - 50) * s, cy + (32 - 20) * s, 2.4 * s, 'F');
  doc.circle(cx + (22 - 50) * s, cy + (32 - 20) * s, 2.4 * s, 'F');
}

function drawRadar(
  doc: import('jspdf').jsPDF,
  cx: number,
  cy: number,
  R: number,
  labels: string[],
  scores: number[]
): void {
  const n = labels.length;
  const angle = (i: number) => -Math.PI / 2 + (i * 2 * Math.PI) / n;
  for (const frac of [0.25, 0.5, 0.75, 1]) {
    const pts: number[] = [];
    for (let i = 0; i < n; i++) {
      pts.push(cx + R * frac * Math.cos(angle(i)), cy + R * frac * Math.sin(angle(i)));
    }
    doc.setDrawColor(C.border[0], C.border[1], C.border[2]);
    doc.setLineWidth(0.3);
    fillPolygon(doc, pts, 'S');
  }
  doc.setDrawColor(C.slateLight[0], C.slateLight[1], C.slateLight[2]);
  doc.setLineWidth(0.3);
  for (let i = 0; i < n; i++) {
    doc.line(cx, cy, cx + R * Math.cos(angle(i)), cy + R * Math.sin(angle(i)));
  }
  const dataPts: number[] = [];
  for (let i = 0; i < n; i++) {
    const f = Math.max(0, Math.min(1, scores[i] / 10));
    dataPts.push(cx + R * f * Math.cos(angle(i)), cy + R * f * Math.sin(angle(i)));
  }
  doc.setFillColor(C.primaryLight[0], C.primaryLight[1], C.primaryLight[2]);
  doc.setDrawColor(C.primary[0], C.primary[1], C.primary[2]);
  doc.setLineWidth(0.7);
  fillPolygon(doc, dataPts, 'FD');
  for (let i = 0; i < n; i++) {
    const a = angle(i);
    const lx = cx + R * 1.22 * Math.cos(a);
    const ly = cy + R * 1.22 * Math.sin(a);
    doc.setFontSize(8.5);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(C.slateText[0], C.slateText[1], C.slateText[2]);
    const align = Math.abs(Math.cos(a)) < 0.2 ? 'center' : Math.cos(a) > 0 ? 'left' : 'right';
    doc.text(labels[i], lx, ly, { align: align as 'left' | 'center' | 'right' });
  }
  doc.setTextColor(C.slateText[0], C.slateText[1], C.slateText[2]);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
}

function drawDepreciation(
  doc: import('jspdf').jsPDF,
  x: number,
  y: number,
  plotW: number,
  plotH: number,
  values: number[]
): void {
  const xs = [0, 1, 3, 5];
  const min = Math.min(...values) * 0.94;
  const max = Math.max(...values) * 1.02;
  const px = (v: number) => x + (v / 5) * plotW;
  const py = (v: number) => y + plotH - ((v - min) / (max - min)) * plotH;

  doc.setDrawColor(C.border[0], C.border[1], C.border[2]);
  doc.setLineWidth(0.3);
  for (const v of values) {
    doc.setFontSize(7.5);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(C.slateLight[0], C.slateLight[1], C.slateLight[2]);
    doc.text(v.toLocaleString('it-IT'), x - 3, py(v) + 2, { align: 'right' });
  }

  const pts: number[] = [];
  values.forEach((v, i) => {
    pts.push(px(xs[i]), py(v));
  });
  doc.setFillColor(C.primaryLight[0], C.primaryLight[1], C.primaryLight[2]);
  doc.setDrawColor(C.primary[0], C.primary[1], C.primary[2]);
  doc.setLineWidth(0.8);
  fillPolygon(doc, [x, y + plotH, ...pts, x + plotW, y + plotH], 'FD');

  doc.setFillColor(C.primary[0], C.primary[1], C.primary[2]);
  values.forEach((v, i) => {
    doc.circle(px(xs[i]), py(v), 1.6, 'F');
  });

  const labels = ['Oggi', '+1 anno', '+3 anni', '+5 anni'];
  labels.forEach((label, i) => {
    doc.setFontSize(8.5);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(C.slateText[0], C.slateText[1], C.slateText[2]);
    doc.text(label, px(xs[i]), y + plotH + 6, { align: 'center' });
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(C.slateLight[0], C.slateLight[1], C.slateLight[2]);
    doc.text(values[i].toLocaleString('it-IT') + ' €', px(xs[i]), y + plotH + 11.5, { align: 'center' });
  });
  doc.setTextColor(C.slateText[0], C.slateText[1], C.slateText[2]);
  doc.setFontSize(10);
}

function drawPriceBand(
  doc: import('jspdf').jsPDF,
  x: number,
  y: number,
  w: number,
  min: number,
  est: number,
  max: number,
  requested?: number
): void {
  const px = (v: number) => x + ((v - min) / (max - min)) * w;
  doc.setFillColor(C.primaryLight[0], C.primaryLight[1], C.primaryLight[2]);
  doc.roundedRect(x, y, w, 8, 4, 4, 'F');
  doc.setFillColor(C.primary[0], C.primary[1], C.primary[2]);
  doc.roundedRect(x + (est - min) / (max - min) * w - 2.2, y - 1.5, 4.4, 11, 2.2, 2.2, 'F');
  if (requested !== undefined) {
    const rx = px(Math.min(Math.max(requested, min), max));
    doc.setDrawColor(C.warning[0], C.warning[1], C.warning[2]);
    doc.setLineWidth(1);
    doc.line(rx, y - 3.5, rx, y + 12.5);
  }
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(C.slateMuted[0], C.slateMuted[1], C.slateMuted[2]);
  doc.text(min.toLocaleString('it-IT') + ' €', x, y + 19);
  doc.text(max.toLocaleString('it-IT') + ' €', x + w, y + 19, { align: 'right' });
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(C.primary[0], C.primary[1], C.primary[2]);
  doc.text(`Stima centrale ${est.toLocaleString('it-IT')} €`, px(est), y + 19, { align: 'center' });
  if (requested !== undefined) {
    doc.setTextColor(C.warning[0], C.warning[1], C.warning[2]);
    doc.text('Prezzo richiesto', px(Math.min(Math.max(requested, min), max)), y + 25, { align: 'center' });
  }
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(C.slateText[0], C.slateText[1], C.slateText[2]);
  doc.setFontSize(10);
}

function costTable(writer: PdfWriter, rows: Array<[string, string]>, x1 = 22, x2 = 188): void {
  const { doc } = writer;
  const startY = writer.y;
  let y = startY;
  doc.setFontSize(8);
  rows.forEach(([label, value], i) => {
    if (y > PAGE_HEIGHT - BOTTOM_MARGIN - 8) {
      doc.addPage();
      writer.y = 25;
      y = writer.y;
    }
    if (i % 2 === 1) {
      doc.setFillColor(C.surface[0], C.surface[1], C.surface[2]);
      doc.roundedRect(MARGIN, y - 4.5, CONTENT_W, 8, 2, 2, 'F');
    }
    doc.setTextColor(C.slateText[0], C.slateText[1], C.slateText[2]);
    doc.setFont('helvetica', 'normal');
    doc.text(label, x1, y);
    doc.setTextColor(C.dark[0], C.dark[1], C.dark[2]);
    doc.setFont('helvetica', 'bold');
    doc.text(value, x2, y, { align: 'right' });
    y += 8;
  });
  writer.y = y + 4;
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(C.slateText[0], C.slateText[1], C.slateText[2]);
  doc.setFontSize(10);
}

function specTable(writer: PdfWriter, specs: Array<[string, string]>): void {
  const { doc } = writer;
  const startY = writer.y;
  let y = startY;
  doc.setFontSize(9);
  specs.forEach(([label, value], i) => {
    if (y > PAGE_HEIGHT - BOTTOM_MARGIN - 8) {
      doc.addPage();
      writer.y = 25;
      y = writer.y;
    }
    if (i % 2 === 1) {
      doc.setFillColor(C.surface[0], C.surface[1], C.surface[2]);
      doc.roundedRect(MARGIN, y - 4.5, CONTENT_W, 8, 2, 2, 'F');
    }
    doc.setTextColor(C.slateMuted[0], C.slateMuted[1], C.slateMuted[2]);
    doc.setFont('helvetica', 'normal');
    doc.text(label, 22, y);
    doc.setTextColor(C.dark[0], C.dark[1], C.dark[2]);
    doc.setFont('helvetica', 'bold');
    doc.text(value, 188, y, { align: 'right' });
    y += 8;
  });
  writer.y = y + 4;
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(C.slateText[0], C.slateText[1], C.slateText[2]);
  doc.setFontSize(10);
}

function euro(v: number): string {
  return v.toLocaleString('it-IT') + ' \u00A0€';
}

function costLabel(annualMaintenance: number): string {
  if (annualMaintenance < 400) return 'Bassi';
  if (annualMaintenance < 700) return 'Medi';
  return 'Alti';
}

function buildSpecs(report: AutoReport): Array<[string, string]> {
  const { vehicle } = report;
  const rows: Array<[string, string]> = [
    ['Marca', vehicle.make],
    ['Modello', vehicle.model],
    ['Versione', vehicle.version ?? '—'],
    ['Anno', vehicle.year ? String(vehicle.year) : '—'],
    ['Alimentazione', vehicle.fuel ?? '—'],
    ['Potenza', vehicle.power ?? '—'],
    ['Cilindrata', vehicle.displacement ?? '—'],
    ['Cambio', vehicle.transmission ?? '—'],
    ['Carrozzeria', vehicle.body ?? '—'],
    ['Porte', vehicle.doors ? String(vehicle.doors) : '—'],
    ['Colore', vehicle.color ?? '—'],
    ['Classe Euro', vehicle.euroClass ?? '—'],
  ];
  if (vehicle.plate) rows.push(['Targa', vehicle.plate]);
  if (vehicle.vin) rows.push(['VIN', vehicle.vin]);
  return rows;
}

function formatDate(iso: string | undefined): string {
  if (!iso) return 'analisi indicativa';
  try {
    return 'analisi del ' + new Date(iso).toLocaleDateString('it-IT');
  } catch {
    return 'analisi indicativa';
  }
}

async function loadLogoDataUrl(): Promise<string | null> {
  try {
    const res = await fetch('/icon-512.png');
    if (!res.ok) return null;
    const blob = await res.blob();
    return await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result));
      reader.onerror = () => reject(new Error('read error'));
      reader.readAsDataURL(blob);
    });
  } catch {
    return null;
  }
}

function drawLogo(doc: import('jspdf').jsPDF, logoData: string | null, x: number, y: number, w: number): void {
  if (logoData) {
    try {
      doc.addImage(logoData, 'PNG', x, y, w, w, undefined, 'FAST');
      return;
    } catch {
      // fallback to vector logo
    }
  }
  // Vector badge fallback: AutoEsperto Shield
  doc.setFillColor(37, 99, 235);
  doc.roundedRect(x, y, w, w, 2.5, 2.5, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(Math.round(w * 0.5));
  doc.setFont('helvetica', 'bold');
  doc.text('AE', x + w / 2, y + w * 0.7, { align: 'center' });
}

function drawCover(doc: import('jspdf').jsPDF, report: AutoReport, dateLabel: string, logoData: string | null): void {
  const { vehicle, reliability } = report;

  doc.setFillColor(C.dark[0], C.dark[1], C.dark[2]);
  doc.rect(0, 0, 210, 62, 'F');
  doc.setFillColor(C.primary[0], C.primary[1], C.primary[2]);
  doc.rect(0, 62, 210, 3, 'F');

  drawLogo(doc, logoData, MARGIN, 7, 11);

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(17);
  doc.setFont('helvetica', 'bold');
  doc.text('AUTOESPERTO', MARGIN + 15, 17);
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(191, 219, 254);
  doc.text('Il tuo secondo parere prima di comprare o vendere un\u2019auto usata', MARGIN + 15, 23);
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text('REPORT AUTO', 190, 17, { align: 'right' });
  doc.setFontSize(7);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(203, 213, 225);
  doc.text(dateLabel, 190, 23, { align: 'right' });

  doc.setFontSize(27);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(255, 255, 255);
  doc.text(`${vehicle.make} ${vehicle.model}`, MARGIN, 44);

  const detailParts = [
    vehicle.version,
    vehicle.year ? String(vehicle.year) : '',
    report.price.inputKm ? `circa ${report.price.inputKm.toLocaleString('it-IT')} km` : '',
    vehicle.fuel || '',
    vehicle.body || '',
  ].filter(Boolean);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(191, 219, 254);
  doc.text(detailParts.length ? detailParts.join('  ·  ') : 'Scheda informativa veicolo', MARGIN, 52);

  box({ doc, y: 0 } as PdfWriter, MARGIN, 74, CONTENT_W, 68, C.surface);
  drawCar(doc, 105, 118, 88);

  const facts: Array<[string, string]> = [
    ['Alimentazione', vehicle.fuel],
    ['Cambio', vehicle.transmission],
    ['Potenza', vehicle.power],
    ['Cilindrata', vehicle.displacement],
    ['Carrozzeria', vehicle.body],
    ['Classe Euro', vehicle.euroClass],
  ].filter(([, v]) => Boolean(v)) as Array<[string, string]>;

  const fBoxW = (CONTENT_W - 8) / 2;
  const fBoxH = 21;
  let fy = 152;
  facts.slice(0, 6).forEach(([label, value], i) => {
    const fx = MARGIN + (i % 2) * (fBoxW + 8);
    if (i > 0 && i % 2 === 0) fy += fBoxH + 6;
    box({ doc, y: 0 } as PdfWriter, fx, fy, fBoxW, fBoxH, C.surface);
    doc.setFontSize(7);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(C.slateMuted[0], C.slateMuted[1], C.slateMuted[2]);
    doc.text(label.toUpperCase(), fx + 7, fy + 8);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(C.dark[0], C.dark[1], C.dark[2]);
    doc.text(value, fx + 7, fy + 16);
  });
  const factsBottom = fy + fBoxH + 10;

  const verdict = verdictColors(reliability.verdict);
  box({ doc, y: 0 } as PdfWriter, MARGIN, factsBottom, CONTENT_W, 22, verdict.bg);
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(verdict.text[0], verdict.text[1], verdict.text[2]);
  doc.text('VERDETTO', MARGIN + 8, factsBottom + 9);
  doc.text(reliability.verdictLabel.toUpperCase(), MARGIN + 8, factsBottom + 17);

  const summary = doc.splitTextToSize(reliability.summary, 108);
  doc.setFontSize(8.5);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(C.slateText[0], C.slateText[1], C.slateText[2]);
  doc.text(summary.slice(0, 3), 102, factsBottom + 9, { lineHeightFactor: 1.3 });

  doc.setFontSize(8);
  doc.setTextColor(C.slateLight[0], C.slateLight[1], C.slateLight[2]);
  doc.text('AutoEsperto — autoesperto.it · Report generato automaticamente', MARGIN, 268);
}

function drawSintesi(doc: import('jspdf').jsPDF, report: AutoReport): void {
  const { reliability, price } = report;
  const w: PdfWriter = { doc, y: 25 };

  sectionTitle(w, 'Sintesi della valutazione');

  const verdict = verdictColors(reliability.verdict);
  box(w, MARGIN, w.y, CONTENT_W, 24, verdict.bg);
  doc.setFillColor(verdict.text[0], verdict.text[1], verdict.text[2]);
  doc.roundedRect(MARGIN, w.y, 3, 24, 1.5, 1.5, 'F');
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(verdict.text[0], verdict.text[1], verdict.text[2]);
  doc.text(reliability.verdictLabel.toUpperCase(), MARGIN + 12, w.y + 10);
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(C.slateText[0], C.slateText[1], C.slateText[2]);
  doc.text(`Punteggio affidabilità ${reliability.score.toFixed(1)}/10`, MARGIN + 12, w.y + 18);
  w.y += 32;

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(C.slateText[0], C.slateText[1], C.slateText[2]);
  const sumLines = doc.splitTextToSize(reliability.summary, CONTENT_W);
  writeLine(w, sumLines.join(' '), MARGIN, 6, CONTENT_W);

  const boxH = 26;
  const boxGap = 4;
  const boxW = (CONTENT_W - boxGap * 3) / 4;
  const kpiY = w.y + 6;
  const relColor = verdictColors(reliability.verdict);

  kpiBox(w, 'Valore', euro(price.estimatedValue), `${euro(price.min)} – ${euro(price.max)}`, MARGIN, kpiY, boxW, boxH, [239, 246, 255], C.primary);
  kpiBox(w, 'Affidabilità', `${reliability.score.toFixed(1)}/10`, 'punteggio 0-10', MARGIN + boxW + boxGap, kpiY, boxW, boxH, relColor.bg, relColor.text);
  kpiBox(w, 'Costi', costLabel(reliability.futureCosts.annualMaintenance), 'mantenimento annuo', MARGIN + (boxW + boxGap) * 2, kpiY, boxW, boxH, [241, 245, 249], C.dark);
  kpiBox(w, 'Verdetto', reliability.verdictLabel, 'dalla combinazione dei dati', MARGIN + (boxW + boxGap) * 3, kpiY, boxW, boxH, relColor.bg, relColor.text);

  w.y = kpiY + boxH + 8;

  sectionTitle(w, 'Valore di mercato');

  drawPriceBand(doc, MARGIN + 12, w.y + 8, 146, price.min, price.estimatedValue, price.max, price.requestedPrice);
  w.y += 42;

  const marketLines: string[] = [];
  if (price.adjustedForKm !== undefined) {
    marketLines.push(`Valore corretto per il chilometraggio: ${euro(price.adjustedForKm)}.`);
  }
  marketLines.push(`Stima di mercato: ${euro(price.min)} – ${euro(price.max)} · valore centrale ${euro(price.estimatedValue)}.`);
  if (price.requestedPrice) {
    marketLines.push(`Prezzo richiesto: ${euro(price.requestedPrice)}.`);
  }
  if (price.priceVsMarketPercent !== undefined) {
    const rel = price.priceVsMarketPercent > 0 ? 'sopra' : 'sotto';
    marketLines.push(`Il prezzo richiesto è ${rel} di ${Math.abs(price.priceVsMarketPercent)}% rispetto alla stima di mercato.`);
  }
  marketLines.push(price.comment);

  marketLines.forEach((line) => writeLine(w, line, MARGIN, 6, CONTENT_W));

  if (price.market?.comparison?.disclosure) {
    w.y += 2;
    doc.setFontSize(8);
    doc.setFont('helvetica', 'italic');
    doc.setTextColor(C.slateLight[0], C.slateLight[1], C.slateLight[2]);
    writeLine(w, price.market.comparison.disclosure, MARGIN, 5, CONTENT_W);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.setTextColor(C.slateText[0], C.slateText[1], C.slateText[2]);
  }
}

function drawReliability(doc: import('jspdf').jsPDF, report: AutoReport): void {
  const { reliability } = report;
  const w: PdfWriter = { doc, y: 25 };

  sectionTitle(w, 'Affidabilità del modello');

  const relColor = verdictColors(reliability.verdict);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(C.dark[0], C.dark[1], C.dark[2]);
  doc.text('Punteggio complessivo', MARGIN, w.y + 4);
  scoreBar(w, MARGIN + 58, w.y, 70, reliability.score, relColor.text);
  w.y += 14;

  const colW = (CONTENT_W - 10) / 2;
  const colStart = w.y + 2;
  const left: PdfWriter = { doc, y: colStart };
  const right: PdfWriter = { doc, y: colStart };
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(C.success[0], C.success[1], C.success[2]);
  doc.text('Punti di forza', MARGIN, colStart);
  doc.setTextColor(C.danger[0], C.danger[1], C.danger[2]);
  doc.text('Punti di debolezza', MARGIN + colW + 10, colStart);
  left.y += 5;
  right.y += 5;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  writeList(left, reliability.strengths, MARGIN, colW, '+', 6);
  writeList(right, reliability.weaknesses, MARGIN + colW + 10, colW, '–', 6);
  w.y = Math.max(left.y, right.y) + 4;

  if (reliability.categoryScores) {
    sectionTitle(w, 'Punteggi per area');
    const labels: Array<[keyof NonNullable<typeof reliability.categoryScores>, string]> = [
      ['engine', 'Motore'],
      ['transmission', 'Cambio'],
      ['electronics', 'Elettronica'],
      ['suspension', 'Sospensioni'],
      ['body', 'Carrozzeria'],
    ];
    drawRadar(doc, 105, w.y + 52, 40, labels.map(([, l]) => l), labels.map(([k]) => reliability.categoryScores![k] ?? 0));
    w.y += 122;
  }

  const usageRows: Array<[string, string]> = [
    ['Uso cittadino', reliability.usage.city],
    ['Uso familiare', reliability.usage.family],
    ['Uso autostradale', reliability.usage.highway],
    ['Neopatentati', reliability.usage.newDriver],
  ].filter(([, v]) => Boolean(v)) as Array<[string, string]>;
  if (usageRows.length) {
    sectionTitle(w, 'A chi si adatta');
    usageRows.forEach(([label, value]) => {
      doc.setFontSize(9);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(C.dark[0], C.dark[1], C.dark[2]);
      doc.text(label, MARGIN, w.y + 2);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(C.slateText[0], C.slateText[1], C.slateText[2]);
      const wrapped = doc.splitTextToSize(value, CONTENT_W - 70);
      doc.text(wrapped, MARGIN + 72, w.y + 2);
      w.y += 4 + wrapped.length * 4.6;
    });
  }
}

function drawCosts(doc: import('jspdf').jsPDF, report: AutoReport): void {
  const { reliability } = report;
  const w: PdfWriter = { doc, y: 25 };

  sectionTitle(w, 'Svalutazione stimata nel tempo');
  const v0 = Math.max(0, report.price.estimatedValue);
  const v1 = Math.max(0, v0 - reliability.futureCosts.depreciation1Year);
  const v3 = Math.max(0, v0 - reliability.futureCosts.depreciation3Years);
  const v5 = Math.max(0, v0 - reliability.futureCosts.depreciation5Years);
  drawDepreciation(doc, MARGIN + 30, w.y, 130, 44, [v0, v1, v3, v5]);
  w.y += 70;

  writeLine(
    w,
    `In 3 anni il valore previsto passa da ${euro(v0)} a circa ${euro(v3)} (${euro(reliability.futureCosts.depreciation3Years)} di perdita).`,
    MARGIN,
    6,
    CONTENT_W
  );
  w.y += 2;

  sectionTitle(w, 'Costi di gestione');
  const costRows: Array<[string, string]> = [
    ['Manutenzione annuale (stima)', euro(reliability.futureCosts.annualMaintenance)],
    ['Carburante ogni 100 km', `${reliability.futureCosts.fuelCostPer100Km.toFixed(1)} €`],
    ['Assicurazione annuale (stima)', euro(reliability.futureCosts.insuranceEstimate)],
  ];
  if (reliability.taxAnnual !== undefined) costRows.push(['Bollo annuale (stima)', euro(reliability.taxAnnual)]);
  if (reliability.serviceIntervalKm !== undefined) {
    costRows.push(['Intervallo di manutenzione', `ogni ${reliability.serviceIntervalKm.toLocaleString('it-IT')} km`]);
  }
  costRows.push(['Svalutazione prevista in 3 anni', `-${euro(reliability.futureCosts.depreciation3Years)}`]);
  costRows.push(['Svalutazione prevista in 5 anni', `-${euro(reliability.futureCosts.depreciation5Years)}`]);
  costTable(w, costRows);
  w.y += 2;

  if (reliability.consumption?.combined) {
    sectionTitle(w, 'Consumi');
    const { consumption } = reliability;
    const writeConsumption = (label: string, v: number | undefined, x: number) => {
      const bw = 48;
      doc.setTextColor(C.slateMuted[0], C.slateMuted[1], C.slateMuted[2]);
      doc.setFontSize(8);
      doc.setFont('helvetica', 'bold');
      doc.text(label.toUpperCase(), x, w.y);
      doc.setFillColor(C.border[0], C.border[1], C.border[2]);
      doc.roundedRect(x, w.y + 3, bw, 7, 3.5, 3.5, 'F');
      const frac = v !== undefined ? Math.max(0.05, Math.min(1, v / (consumption.city || 20))) : 0;
      doc.setFillColor(C.primary[0], C.primary[1], C.primary[2]);
      doc.roundedRect(x, w.y + 3, bw * frac, 7, 3.5, 3.5, 'F');
      doc.setFontSize(8.5);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(C.dark[0], C.dark[1], C.dark[2]);
      doc.text(v !== undefined ? `${v}${consumption.fuelType ? ' ' + consumption.fuelType : ''}` : '—', x, w.y + 15);
    };
    writeConsumption('Città', consumption.city, MARGIN);
    writeConsumption('Combinato', consumption.combined, MARGIN + 60);
    writeConsumption('Autostrada', consumption.highway, MARGIN + 120);
    w.y += 20;
  }
}

function drawChecklist(doc: import('jspdf').jsPDF, report: AutoReport): void {
  const { reliability } = report;
  const w: PdfWriter = { doc, y: 25 };

  const checkList = reliability.advice.length
    ? reliability.advice
    : reliability.commonIssues.length
      ? reliability.commonIssues
      : reliability.weaknesses;

  sectionTitle(w, 'Punti da controllare prima dell\u2019acquisto');
  if (checkList.length) {
    writeList(w, checkList, MARGIN + 4, CONTENT_W - 6, '\u2022', 8);
  } else {
    writeLine(w, 'Nessun punto specifico da segnalare.', MARGIN + 4, 6, CONTENT_W - 6);
  }
  w.y += 2;

  if (reliability.commonIssues.length) {
    sectionTitle(w, 'Problemi comuni del modello');
    writeList(w, reliability.commonIssues, MARGIN + 4, CONTENT_W - 6, '\u2022', 8);
    w.y += 2;
  }

  const colW = (CONTENT_W - 10) / 2;
  const colStart = w.y + 2;
  const left: PdfWriter = { doc, y: colStart };
  const right: PdfWriter = { doc, y: colStart };
  if (reliability.recommendedVersions?.length || reliability.versionsToAvoid?.length) {
    if (reliability.recommendedVersions?.length) {
      doc.setFontSize(9);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(C.success[0], C.success[1], C.success[2]);
      doc.text('Versioni consigliate', MARGIN, colStart);
      left.y += 5;
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9);
      writeList(left, reliability.recommendedVersions, MARGIN, colW, '+', 6);
    }
    if (reliability.versionsToAvoid?.length) {
      doc.setFontSize(9);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(C.danger[0], C.danger[1], C.danger[2]);
      doc.text('Versioni da evitare', MARGIN + colW + 10, colStart);
      right.y += 5;
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9);
      writeList(right, reliability.versionsToAvoid, MARGIN + colW + 10, colW, '–', 6);
    }
    w.y = Math.max(left.y, right.y) + 4;
  }
}

function drawDataNotes(doc: import('jspdf').jsPDF, report: AutoReport): void {
  const { vehicle, reliability, price } = report;
  const w: PdfWriter = { doc, y: 25 };

  sectionTitle(w, 'Dati del veicolo');
  specTable(w, buildSpecs(report));
  w.y += 2;

  if (reliability.engine) {
    sectionTitle(w, 'Motore e trasmissione');
    writeLine(w, `Motore: ${reliability.engine}`, MARGIN, 6, CONTENT_W);
    if (reliability.transmission) writeLine(w, `Trasmissione: ${reliability.transmission}`, MARGIN, 6, CONTENT_W);
  }

  if (report.alternatives && report.alternatives.length) {
    sectionTitle(w, 'Alternative da valutare');
    const altRows: Array<[string, string]> = report.alternatives.slice(0, 6).map(
      (alt): [string, string] => [`${alt.make} ${alt.model}`, `${euro(alt.estimatedMin)} – ${euro(alt.estimatedMax)}`]
    );
    costTable(w, altRows, 22, 160);
    w.y += 2;
  }

  sectionTitle(w, 'Note');
  writeLine(
    w,
    'Questa analisi è indicativa e basata sui dati di mercato disponibili. La stima del valore usa i prezzi pubblicati negli annunci reali e può differire dal prezzo finale di vendita. Non sostituisce un\u2019ispezione fisica o una perizia professionale: per decisioni d\u2019acquisto verifica sempre l\u2019esemplare specifico.',
    MARGIN,
    6,
    CONTENT_W
  );
  w.y += 1;
  if (vehicle.dataSource === 'model') {
    writeLine(
      w,
      'Identificazione del veicolo basata sul modello indicato, non su dati di targa o VIN.',
      MARGIN,
      6,
      CONTENT_W
    );
  }
  if (price.marketUrls && price.marketUrls.length) {
    w.y += 1;
    doc.setFontSize(8);
    doc.setFont('helvetica', 'italic');
    doc.setTextColor(C.slateLight[0], C.slateLight[1], C.slateLight[2]);
    writeLine(w, 'Fonti di mercato consultate: ' + price.marketUrls.map((m) => m.source).join(', ') + '.', MARGIN, 5, CONTENT_W);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(C.slateText[0], C.slateText[1], C.slateText[2]);
    doc.setFontSize(10);
  }
}

function drawConditionPage(doc: import('jspdf').jsPDF, data: PDFConditionData): void {
  const w: PdfWriter = { doc, y: 25 };
  sectionTitle(w, 'Stato del veicolo e stima ripristini');

  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(C.dark[0], C.dark[1], C.dark[2]);
  writeLine(w, 'Dati inseriti per la valutazione dello stato:', MARGIN, 6, CONTENT_W);
  w.y += 2;

  const specs: Array<[string, string]> = [
    ['Anno immatricolazione', String(data.refinedYear)],
    ['Chilometraggio reale', `${data.refinedKm.toLocaleString('it-IT')} km`],
    ['Storico incidenti', data.accidentHistoryLabel],
    ['Modalita di calcolo selezionata', data.costModeLabel],
  ];
  specTable(w, specs);
  w.y += 4;

  // Recalculated value banner
  box(w, MARGIN, w.y, CONTENT_W, 20, [239, 246, 255]); // light blue
  doc.setFontSize(7.5);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(C.primary[0], C.primary[1], C.primary[2]);
  doc.text('VALORE DI MERCATO RICALCOLATO PER ANNO & KM:', MARGIN + 6, w.y + 6);
  doc.setFontSize(14);
  doc.text(euro(data.recalculatedValue), MARGIN + 6, w.y + 14);
  w.y += 24;

  // Verdict banner
  let vColor = C.success;
  let vBg = C.successBg;
  if (data.verdictType === 'evaluate') {
    vColor = C.warning;
    vBg = C.warningBg;
  } else if (data.verdictType === 'sell') {
    vColor = C.danger;
    vBg = C.dangerBg;
  }
  
  box(w, MARGIN, w.y, CONTENT_W, 26, vBg);
  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(vColor[0], vColor[1], vColor[2]);
  doc.text(`VERDETTO CONVENIENZA: ${data.verdictLabel.toUpperCase()}`, MARGIN + 6, w.y + 7);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(C.slateText[0], C.slateText[1], C.slateText[2]);
  const descLines = doc.splitTextToSize(data.verdictDescription, CONTENT_W - 12);
  let dy = w.y + 13;
  descLines.slice(0, 3).forEach((line: string) => {
    doc.text(line, MARGIN + 6, dy);
    dy += 4.5;
  });
  w.y += 32;

  // Cost comparison summary
  sectionTitle(w, 'Confronto costi di ripristino totali');
  
  const compRows: Array<[string, string]> = [
    ['Fai-da-te (solo ricambi)', `${euro(data.totalDiyMin)} – ${euro(data.totalDiyMax)}`],
    ['Meccanico (ricambi + manodopera)', `${euro(data.totalMechMin)} – ${euro(data.totalMechMax)}`],
  ];
  costTable(w, compRows, MARGIN + 2, 188);
  w.y += 2;

  // List of damage/warning items
  if (data.items.length > 0) {
    sectionTitle(w, 'Dettaglio componenti e ricambi stimati');
    
    const itemsRows: Array<[string, string]> = data.items.map(item => {
      const typeLabel = item.type === 'spia' ? '[Spia]' : '[Danno]';
      const name = `${typeLabel} ${item.label}`;
      const costRange = data.costModeLabel.includes('Fai-da-te') ? item.diyCost : item.mechCost;
      return [name, costRange];
    });
    costTable(w, itemsRows, MARGIN + 2, 188);
  } else {
    w.y += 2;
    writeLine(w, 'Nessuna spia o danno estetico inserito. Il veicolo risulta privo di anomalie evidenti.', MARGIN, 6, CONTENT_W);
  }
}

export async function downloadPDF(report: AutoReport, conditionData?: PDFConditionData) {
  try {
    const { jsPDF } = await import('jspdf');
    const doc = new jsPDF();
    const { vehicle } = report;
    const dateLabel = formatDate(report.createdAt);
    const logoData = await loadLogoDataUrl();

    doc.setFont('helvetica');

    drawCover(doc, report, dateLabel, logoData);

    doc.addPage();
    drawSintesi(doc, report);

    if (conditionData) {
      doc.addPage();
      drawConditionPage(doc, conditionData);
    }

    doc.addPage();
    drawReliability(doc, report);

    doc.addPage();
    drawCosts(doc, report);

    doc.addPage();
    drawChecklist(doc, report);

    doc.addPage();
    drawDataNotes(doc, report);

    // ── Header & Footer su tutte le pagine ──
    const pageCount = doc.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      if (i > 1) {
        drawLogo(doc, logoData, MARGIN, 8, 7);
        doc.setFontSize(9);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(C.dark[0], C.dark[1], C.dark[2]);
        doc.text('AUTOESPERTO', MARGIN + 9, 13);
        doc.setFontSize(8);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(C.slateMuted[0], C.slateMuted[1], C.slateMuted[2]);
        doc.text(`${vehicle.make} ${vehicle.model} · Report Analisi`, 190, 13, { align: 'right' });
        doc.setDrawColor(C.border[0], C.border[1], C.border[2]);
        doc.setLineWidth(0.3);
        doc.line(MARGIN, 16, 190, 16);
      }

      doc.setDrawColor(C.border[0], C.border[1], C.border[2]);
      doc.setLineWidth(0.3);
      doc.line(MARGIN, 284, 190, 284);
      doc.setFontSize(7);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(C.slateLight[0], C.slateLight[1], C.slateLight[2]);
      doc.text('AutoEsperto — autoesperto.it · Stima indicativa, non una perizia', MARGIN, 289);
      doc.text(`Pagina ${i} di ${pageCount}`, 190, 289, { align: 'right' });
    }

    const filename = `AutoEsperto-${vehicle.plate || `${vehicle.make}-${vehicle.model}`}.pdf`;
    doc.save(filename);
  } catch (err) {
    alert('Errore durante la generazione del PDF. Riprova o verifica la connessione.');
  }
}
