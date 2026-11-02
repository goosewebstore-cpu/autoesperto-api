import { depreciationScenario, suggestedDepreciationRate } from '../depreciation';
import { jsPDF } from 'jspdf';
import type { AutoReport } from '@autoesperto/types';
import type { PDFConditionData } from './types';
import type { PdfEdition } from './access';
import { PDF_LOGO } from './logo';
import { computeScores } from '../score';
import { calculateAnnualBudget, type ReportWithTools } from '../reportTools';

const BLUE = [37, 99, 235] as const;
const DARK = [15, 23, 42] as const;
const MUTED = [71, 85, 105] as const;
const text = (value: unknown) => String(value ?? '').replace(/[\u0000-\u0008\u000b-\u001f]/g, '').replace(/[\u2010-\u2014]/g, '-').replace(/[\u2018\u2019]/g, "'").replace(/[\u201c\u201d]/g, '"').replace(/[✓✔→•]/g, '-');
const euro = (value?: number, digits = 0) => Number.isFinite(value) && value! >= 0 ? `${value!.toLocaleString('it-IT',{minimumFractionDigits:digits,maximumFractionDigits:digits})} €` : 'Non disponibile';
const items = (value?: string[]) => Array.isArray(value) ? value.filter(v => typeof v === 'string' && v.trim()) : [];
const date = (value: string) => Number.isFinite(Date.parse(value)) ? new Date(value).toLocaleDateString('it-IT', { timeZone: 'Europe/Rome' }) : 'Non indicata';

/** Builds the document on the server; premium callers must pass the access check first. */
export function buildReportPdf(report: AutoReport, edition: PdfEdition, condition?: PDFConditionData): Uint8Array {
  const doc = new jsPDF({ unit: 'mm', format: 'a4', compress: true });
  const { vehicle, reliability, price } = report;
  const title = text([vehicle.make, vehicle.model].filter(Boolean).join(' ') || 'Veicolo');
  const editionName = edition === 'premium' ? 'REPORT COMPLETO' : 'SINTESI GRATUITA';
  let y = 38;
  let currentTitle = '';
  doc.setProperties({ title: `AutoEsperto - ${title} - ${editionName}`, author: 'AutoEsperto', subject: 'Valutazione indicativa auto usata', creator: 'AutoEsperto' });
  const font = (size = 10, bold = false) => { doc.setFont('helvetica', bold ? 'bold' : 'normal'); doc.setFontSize(size); doc.setTextColor(...MUTED); };
  const header = () => {
    doc.saveGraphicsState(); doc.circle(24, 16, 6, null); doc.clip(); doc.discardPath(); doc.addImage(PDF_LOGO, 'PNG', 18, 10, 12, 12); doc.restoreGraphicsState();
    font(14, true); doc.setTextColor(...DARK); doc.text('AutoEsperto', 34, 16);
    font(8); doc.text('Il tuo secondo parere sull’auto usata', 34, 21);
    font(8, true); doc.setTextColor(...BLUE); doc.text(editionName, 192, 16, { align: 'right' });
    doc.setDrawColor(226, 232, 240); doc.line(18, 27, 192, 27);
  };
  header();
  const page = (heading: string) => { doc.addPage(); header(); y = 39; currentTitle = heading; headingText(heading); };
  const ensure = (height: number) => { if (y + height > 265) { doc.addPage(); header(); y = 39; if (currentTitle) { font(10,true); doc.text(`${currentTitle} - continua`,18,y); y += 10; } } };
  const headingText = (heading: string) => { ensure(20); font(19,true); doc.setTextColor(...DARK); const lines = doc.splitTextToSize(text(heading),174); doc.text(lines,18,y); y += lines.length*8+6; };
  const paragraph = (value: unknown, options: { size?: number; maxLines?: number; bold?: boolean } = {}) => {
    if (!value) return;
    font(options.size || 10,options.bold); let lines:string[] = doc.splitTextToSize(text(value),174);
    if(options.maxLines && lines.length > options.maxLines) { lines = lines.slice(0,options.maxLines); lines[lines.length-1] += '...'; }
    for(const line of lines){ ensure(5.5); doc.text(line,18,y); y += 5.5; } y += 3;
  };
  const section = (label:string) => { ensure(19); y+=3; font(11,true); doc.setTextColor(...BLUE); doc.text(text(label),18,y); y+=8; };
  const row = (label:string,value:unknown) => { font(10);const lines:string[]=doc.splitTextToSize(text(value || 'Non disponibile'),100);ensure(Math.max(10,lines.length*5+4));doc.setTextColor(...MUTED);doc.text(text(label),18,y);doc.setFont('helvetica','bold');doc.setTextColor(...DARK);doc.text(lines,90,y);y+=Math.max(10,lines.length*5+4);doc.setDrawColor(241,245,249);doc.line(18,y-4,192,y-4); };
  const list = (values:string[], fallback = 'Nessuna informazione specifica disponibile.') => { if(!values.length) { paragraph(fallback); return; } for(const item of values) paragraph(`- ${item}`); };
  const notice = () => paragraph('Stima indicativa sui dati disponibili: non è una perizia e non certifica lo stato del veicolo. Verifica documenti e condizioni reali con un professionista prima dell’acquisto.',{size:9});
  const verdict = reliability.verdict === 'AVOID' ? 'Valuta con cautela' : reliability.verdict === 'BUY' ? 'Modello interessante: verifica l’esemplare' : 'Valuta prezzo e condizioni';
  const rel = Number(reliability.score);
  const relLabel = Number.isFinite(rel) ? `${(rel > 10 ? rel/10 : rel).toLocaleString('it-IT',{maximumFractionDigits:1})} / 10` : 'Non disponibile';
  headingText(title);
  paragraph([vehicle.version,vehicle.year,vehicle.fuel,price.inputKm != null ? `${price.inputKm.toLocaleString('it-IT')} km` : undefined].filter(Boolean).join(' · '));
  paragraph(`Data analisi: ${date(report.createdAt)} | Esportato il ${date(new Date().toISOString())}`,{size:8});
  ensure(23); doc.setFillColor(239,246,255);doc.roundedRect(18,y,174,20,3,3,'F');font(12,true);doc.setTextColor(...DARK);doc.text(verdict,24,y+12);y+=29;
  row('Indice complessivo',`${computeScores(report).overall} / 100`);
  row('Fascia di valore',price.min > 0 && price.max >= price.min ? `${euro(price.min)} - ${euro(price.max)}` : euro(price.estimatedValue));
  row('Prezzo richiesto',price.requestedPrice ? euro(price.requestedPrice) : 'Non inserito');
  row('Affidabilità del modello',relLabel);
  section('Prima di decidere');
  if(edition === 'basic') {
    const advice=items(reliability.advice).length ? items(reliability.advice) : ['Controlla tagliandi, revisioni e documenti.', 'Fai una prova su strada e una verifica in officina.'];
    for(const item of advice.slice(0,3))paragraph(`- ${item}`,{maxLines:2,size:10});
    section('Come leggere questa sintesi');notice();
    paragraph('La sintesi gratuita riporta i dati essenziali. Il PDF completo dell’abbonamento include gli approfondimenti disponibili su mercato, affidabilità, costi e verifiche.',{size:9,maxLines:3});
  } else {
    paragraph(reliability.summary || 'Approfondisci le criticità del modello e verifica l’esemplare prima di decidere.',{maxLines:6});
    section('I prossimi controlli');
    for(const item of items(reliability.advice).slice(0,3))paragraph(`- ${item}`,{maxLines:2});
    notice();
    page('01 / Prezzo e mercato');
    row('Valore centrale stimato',euro(price.estimatedValue));row('Prezzo richiesto',price.requestedPrice ? euro(price.requestedPrice) : 'Non inserito');
    section('Lettura della stima');paragraph(price.comment || 'Nessun commento specifico disponibile.');
    if(price.market?.comparison?.disclosure)paragraph(price.market.comparison.disclosure,{size:9});
    const listings=price.market?.listings || [];
    section('Confronti disponibili');
    if(!listings.length)paragraph('Nessun annuncio di confronto allegato. Il valore resta una stima indicativa, senza un campione di annunci verificabile in questo PDF.');
    for(const listing of listings.slice(0,12)) { paragraph(`${listing.title} - ${euro(listing.price)}`,{bold:true});paragraph([listing.year,listing.km ? `${listing.km.toLocaleString('it-IT')} km` : '',listing.city,listing.source].filter(Boolean).join(' · '),{size:9});paragraph(listing.sourceUrl,{size:8}); }
    section('Come si compone l’indice');
    const scores=computeScores(report);for(const [label,value] of [['Prezzo',scores.priceScore],['Affidabilità',scores.reliabilityScore],['Costi di gestione',scores.costScore],['Consumi',scores.consumptionScore],['Rischio acquisto',scores.riskScore]])row(String(label),`${value} / 100`);
    paragraph('L’indice complessivo è la media delle cinque voci. Un valore più alto è più favorevole. Le voci senza dati specifici usano valori indicativi del modello; il punteggio non misura l’attendibilità della stima.',{size:9});
    page('02 / Affidabilità e controlli');
    section('Punti di forza');list(items(reliability.strengths));section('Criticità da verificare');list(items(reliability.weaknesses));
    if(items(reliability.commonIssues).length){section('Problemi noti del modello');list(items(reliability.commonIssues));}
    section('Motore e cambio');paragraph(reliability.engine);paragraph(reliability.transmission);
    section('Checklist prima dell’acquisto');list(items(reliability.advice),'Controlla documenti, revisioni, tagliandi e condizioni con un professionista.');
    if(report.photoAnalysis) { const photo=report.photoAnalysis;section('Valutazione visiva disponibile');paragraph(photo.inspection?.summary || photo.damage?.description);for(const area of photo.inspection?.areas || [])paragraph(`${area.area}: ${area.details}`);if(photo.repairRange)row('Riparazione indicativa',`${euro(photo.repairRange.min)} - ${euro(photo.repairRange.max)}`);paragraph(`Attendibilità visiva: ${photo.inspection?.confidence || photo.vehicle?.confidence || 'non indicata'}. ${photo.inspection?.limitations?.join(' ') || ''} ${photo.note || ''}`,{size:9}); }
    page('03 / Costi e utilizzo');
    paragraph('Importi indicativi, da confrontare con preventivi e uso reale. Le voci non sono sommate perché le percorrenze e le ipotesi possono differire.',{size:9});
    row('Manutenzione annua',euro(reliability.futureCosts?.annualMaintenance));row('Bollo annuo indicativo',euro(reliability.taxAnnual));row('Assicurazione indicativa',euro(reliability.futureCosts?.insuranceEstimate));row('Carburante / 100 km',euro(reliability.futureCosts?.fuelCostPer100Km,2));
    if(reliability.consumption){const c=reliability.consumption;section('Consumi indicativi');row('Ciclo combinato',Number.isFinite(c.combined) ? `${c.combined.toLocaleString('it-IT')} ${c.fuelType || 'L/100 km'}` : 'Non disponibile');row('Città',Number.isFinite(c.city) ? `${c.city.toLocaleString('it-IT')} ${c.fuelType || 'L/100 km'}` : 'Non disponibile');row('Extraurbano',Number.isFinite(c.highway) ? `${c.highway.toLocaleString('it-IT')} ${c.fuelType || 'L/100 km'}` : 'Non disponibile');}
    if(price.estimatedValue > 0){section('Simulazione del valore futuro');const asOfYear=Number.isFinite(Date.parse(report.createdAt))?new Date(report.createdAt).getFullYear():new Date().getFullYear();const saved=(report as ReportWithTools).userTools?.depreciationRate;const rate=Number.isFinite(saved)?Math.min(25,Math.max(0,saved!)):suggestedDepreciationRate(vehicle.year,asOfYear);paragraph('Ipotesi: perdita annua composta del '+rate+'%. Scenario di pianificazione, non una previsione di mercato. Parametro modificabile nel report; non incorpora chilometri futuri, allestimento, domanda o condizioni.');for(const point of depreciationScenario(price.estimatedValue,rate).filter(p=>[1,3,5].includes(p.year))){row('Valore fra '+point.year+(point.year===1?' anno':' anni'),euro(point.value));}paragraph('Formula: valore attuale x (1 - tasso annuo) ^ anni; arrotondamento a 100 euro.',{size:9});}
    if(reliability.usage){section('Uso del modello');for(const [label,value] of [['Città',reliability.usage.city],['Famiglia',reliability.usage.family],['Autostrada',reliability.usage.highway],['Neopatentati',reliability.usage.newDriver]])if(value)paragraph(`${label}: ${value}`);}
    const tools=(report as ReportWithTools).userTools;
    if(tools?.budget || tools?.checklist?.length || tools?.conditionSimulation)page('04 / Le tue ipotesi e verifiche');
    if(tools?.budget){section('Il tuo budget personalizzato');paragraph('Ipotesi inserite dall’utente, non preventivi. Sono esclusi acquisto, finanziamento, svalutazione e imprevisti non inseriti.',{size:9});row('Percorrenza annua',`${tools.budget.annualKm.toLocaleString('it-IT')} km`);row('Energia ogni 100 km',euro(tools.budget.energyPer100Km,2));row('Assicurazione annua',euro(tools.budget.insurance));row('Manutenzione annua',euro(tools.budget.maintenance));row('Bollo annuo',euro(tools.budget.tax));row('Pneumatici e altri costi',euro(tools.budget.tires));const total=calculateAnnualBudget(tools.budget);row('Totale annuo simulato',euro(total.total));row('Media mensile simulata',euro(total.monthly));}
    if(tools?.checklist?.length){section('Controlli annotati dall’utente');list(tools.checklist);paragraph('Le spunte sono annotazioni dell’utente e non certificano l’esito dei controlli.',{size:9});}
    if(tools?.conditionSimulation){section('Simulazione spese dell’utente');row('Valore prima della simulazione',euro(tools.conditionSimulation.baseValue));row('Importo sottratto',euro(tools.conditionSimulation.deduction));paragraph(tools.conditionSimulation.note);paragraph('La simulazione non modifica il punteggio di affidabilità e non costituisce un preventivo.',{size:9});}
    page(tools?.budget || tools?.checklist?.length || tools?.conditionSimulation ? '05 / Scheda, alternative e fonti' : '04 / Scheda, alternative e fonti');
    for(const [label,value] of [['Marca',vehicle.make],['VIN dichiarato',vehicle.vin],['Modello',vehicle.model],['Versione',vehicle.version],['Anno',vehicle.year],['Alimentazione',vehicle.fuel],['Potenza',vehicle.power],['Cilindrata',vehicle.displacement],['Cambio',vehicle.transmission],['Carrozzeria',vehicle.body],['Classe Euro',vehicle.euroClass]])if(value)row(String(label),value);
    if(report.alternatives?.length){section('Alternative da confrontare');for(const alt of report.alternatives.slice(0,8))paragraph(`${alt.make} ${alt.model} - valore indicativo ${euro(alt.estimatedValue)}`);}
    section('Fonti e limiti');paragraph(vehicle.dataSource === 'model' ? 'Dati per modello: non costituiscono un’ispezione dell’esemplare.' : 'Analisi delle informazioni disponibili e dei dati inseriti.');
    if(price.market){paragraph(`Fonte mercato: ${price.market.source || 'Non indicata'}. Aggiornamento: ${date(price.market.fetchedAt)}.`,{size:9});}
    for(const link of price.marketUrls || [])paragraph(`${link.source}: ${link.url}`,{size:8});
    notice();
    if(condition){page('Condizioni inserite e simulazione');paragraph('Questa sezione riporta le condizioni e le ipotesi inserite dall’utente. Non equivale a una diagnosi o a un preventivo professionale.',{size:9});row('Anno / chilometri',`${condition.refinedYear} / ${condition.refinedKm.toLocaleString('it-IT')} km`);row('Valore simulato',euro(condition.recalculatedValue));paragraph(condition.verdictLabel,{bold:true});paragraph(condition.verdictDescription);for(const [label,value] of [['Storico incidenti',condition.accidentHistoryLabel],['Tagliandi',condition.serviceHistoryLabel],['Proprietari',condition.previousOwnersLabel],['Interni',condition.interiorConditionLabel]])if(value)row(label,value);list(items(condition.optionsListLabels),'Nessun optional inserito.');for(const item of condition.items || []){section(item.label);paragraph(item.detail);row('Solo ricambi',item.diyCost);row('Officina / carrozzeria',item.mechCost);if(item.urgencyLabel)paragraph(`Priorità indicata: ${item.urgencyLabel}`);}row('Totale ricambi stimato',`${euro(condition.totalDiyMin)} - ${euro(condition.totalDiyMax)}`);row('Totale officina stimato',`${euro(condition.totalMechMin)} - ${euro(condition.totalMechMax)}`);}
  }
  const pages=doc.getNumberOfPages();
  for(let p=1;p<=pages;p++){doc.setPage(p);doc.setDrawColor(226,232,240);doc.line(18,279,192,279);font(7);doc.text('autoesperto.it  |  Stima indicativa, non una perizia',18,285);doc.text(`${p} / ${pages}`,192,285,{align:'right'});}
  return new Uint8Array(doc.output('arraybuffer'));
}
