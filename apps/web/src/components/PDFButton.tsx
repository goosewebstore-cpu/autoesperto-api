'use client';

import { Download } from 'lucide-react';
import type { AutoReport } from '@autoesperto/types';

interface PDFButtonProps {
  report: AutoReport;
}

export default function PDFButton({ report }: PDFButtonProps) {
  const handleDownload = async () => {
    try {
      const { jsPDF } = await import('jspdf');
      const doc = new jsPDF();
      const { vehicle, reliability, price } = report;
      let y = 25;

      doc.setFont('helvetica');
      doc.setFontSize(22);
      doc.text('AutoEsperto — Report', 20, y);
      y += 14;

      doc.setFontSize(12);
      doc.text(`Targa: ${vehicle.plate || '—'}`, 20, y); y += 8;
      doc.text(`Veicolo: ${vehicle.make} ${vehicle.model} ${vehicle.version || ''}`, 20, y); y += 8;
      doc.text(`Anno: ${vehicle.year || '—'}  ·  Alimentazione: ${vehicle.fuel || '—'}  ·  Potenza: ${vehicle.power || '—'}`, 20, y);
      y += 12;

      doc.setFontSize(16);
      doc.text(`Indice di affidabilità: ${reliability.score.toFixed(1)}/10`, 20, y);
      y += 8;
      doc.setFontSize(11);
      doc.text(`Verdetto: ${reliability.verdictLabel} — ${reliability.verdict === 'BUY' ? 'COMPRA' : reliability.verdict === 'NEGOTIATE' ? 'TRATTA IL PREZZO' : 'EVITA'}`, 20, y);
      y += 10;

      doc.setFontSize(13);
      doc.text('Valutazione di mercato', 20, y); y += 7;
      doc.setFontSize(11);
      doc.text(`Valore stimato: ${price.estimatedValue.toLocaleString('it-IT')} EUR`, 20, y); y += 6;
      doc.text(`Range: ${price.min.toLocaleString('it-IT')} – ${price.max.toLocaleString('it-IT')} EUR`, 20, y); y += 6;
      if (price.requestedPrice) {
        doc.text(`Prezzo richiesto: ${price.requestedPrice.toLocaleString('it-IT')} EUR — ${price.comment}`, 20, y); y += 6;
      }
      y += 5;

      doc.setFontSize(13);
      doc.text('Problemi comuni', 20, y); y += 7;
      doc.setFontSize(10);
      reliability.commonIssues.forEach((issue) => {
        doc.text(`• ${issue}`, 22, y); y += 6;
        if (y > 270) { doc.addPage(); y = 25; }
      });
      y += 5;

      doc.setFontSize(13);
      doc.text('Costi stimati', 20, y); y += 7;
      doc.setFontSize(10);
      doc.text(`Manutenzione annuale: ${reliability.futureCosts.annualMaintenance.toLocaleString('it-IT')} EUR`, 22, y); y += 5;
      doc.text(`Carburante / 100 km: ${reliability.futureCosts.fuelCostPer100Km.toFixed(1)} EUR`, 22, y); y += 5;
      doc.text(`Assicurazione / anno: ~${reliability.futureCosts.insuranceEstimate.toLocaleString('it-IT')} EUR`, 22, y); y += 5;
      doc.text(`Svalutazione 3 anni: ~${reliability.futureCosts.depreciation3Years.toLocaleString('it-IT')} EUR`, 22, y); y += 10;

      doc.setFontSize(13);
      doc.text('Annunci simili', 20, y); y += 7;
      doc.setFontSize(10);
      price.listings.forEach((l) => {
        doc.text(`${l.source}: ${l.title} — ${l.price.toLocaleString('it-IT')} EUR (${l.km.toLocaleString('it-IT')} km)`, 22, y); y += 5;
        if (y > 270) { doc.addPage(); y = 25; }
      });

      const filename = `AutoEsperto-${vehicle.plate || vehicle.make}-report.pdf`;
      doc.save(filename);
    } catch (err) {
      alert('Errore durante la generazione del PDF. Riprova o verifica la connessione.');
    }
  };

  return (
    <button
      onClick={handleDownload}
      className="w-full h-14 rounded-2xl bg-accent text-white font-semibold text-base flex items-center justify-center gap-3 hover:bg-accent-hover active:scale-[0.98] transition-all"
    >
      <Download className="w-5 h-5" />
      Scarica report PDF
    </button>
  );
}
