'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Lock, ChevronRight, CheckCircle2, FileText, Crown } from 'lucide-react';
import type { AutoReport } from '@autoesperto/types';
import { getPremiumPricing, getReportPricing } from '@/lib/pricing';
import { createCheckout } from '@/lib/api';
import { getAuthToken } from '@/lib/auth';
import { trackEvent } from '@/lib/analytics';

interface BasicResultViewProps {
  report: AutoReport;
}

export function BasicResultView({ report }: BasicResultViewProps) {
  const pricing = getPremiumPricing();
  const reportPrice = getReportPricing().displayPrice;
  const router = useRouter();

  const handleBuyReport = () => {
    trackEvent('report_purchase_started', { source: 'basic_result_view' });
    if (!getAuthToken()) {
      router.push('/accesso?next=/account?report=checkout');
      return;
    }
    createCheckout()
      .then((res) => { window.location.assign(res.url); })
      .catch((err: unknown) => {
        if (err instanceof Error && err.message) alert(err.message);
      });
  };
  
  return (
    <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-8 animate-fade-in">
      {/* Header Badge */}
      <div className="flex justify-center">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-600 text-sm font-medium border border-slate-200">
          <CheckCircle2 className="w-4 h-4 text-success" />
          Veicolo riconosciuto
        </span>
      </div>

      {/* Basic Data Grid */}
      <div className="bg-white rounded-2xl shadow-card border border-border p-6 sm:p-8">
        <h2 className="text-2xl font-bold text-text-primary mb-6 text-center">
          {report.vehicle.make} {report.vehicle.model}
        </h2>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          <div className="p-4 rounded-xl bg-surface-2 border border-border">
            <span className="block text-sm font-medium text-text-tertiary mb-1">Marca</span>
            <span className="block text-lg font-semibold text-text-primary">{report.vehicle.make}</span>
          </div>
          <div className="p-4 rounded-xl bg-surface-2 border border-border">
            <span className="block text-sm font-medium text-text-tertiary mb-1">Modello</span>
            <span className="block text-lg font-semibold text-text-primary">{report.vehicle.model}</span>
          </div>
          <div className="p-4 rounded-xl bg-surface-2 border border-border">
            <span className="block text-sm font-medium text-text-tertiary mb-1">Anno stimato</span>
            <span className="block text-lg font-semibold text-text-primary">{report.vehicle.year || 'N/A'}</span>
          </div>
          <div className="p-4 rounded-xl bg-surface-2 border border-border">
            <span className="block text-sm font-medium text-text-tertiary mb-1">Carrozzeria</span>
            <span className="block text-lg font-semibold text-text-primary">{report.vehicle.body || 'N/A'}</span>
          </div>
        </div>
      </div>

      {/* Premium Upsell Card */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 to-slate-800 border border-slate-700 shadow-premium-lg p-1 sm:p-2">
        
        <div className="relative bg-slate-900/50 backdrop-blur-xl rounded-xl p-6 sm:p-10 flex flex-col items-center text-center">
          <div className="w-16 h-16 rounded-full bg-accent/20 flex items-center justify-center mb-6">
            <Lock className="w-8 h-8 text-accent-light" />
          </div>
          
          <h3 className="text-2xl sm:text-3xl font-bold text-white mb-4">
            Sblocca il report completo
          </h3>
          
          <p className="text-slate-300 text-lg max-w-2xl mb-8">
            Scopri la valutazione di mercato esatta, l'affidabilità, i difetti noti e confronta i prezzi reali dagli annunci per questo modello.
          </p>

          <div className="grid sm:grid-cols-2 gap-4 w-full max-w-xl text-left mb-10">
            {[
              'Valutazione di mercato aggiornata',
              'Analisi affidabilità e difetti comuni',
              'Confronto annunci reali (Subito, AutoScout)',
              'Generatore annuncio di vendita',
              'Download PDF del report',
              'Nessuna pubblicità'
            ].map((feature, i) => (
              <div key={i} className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-accent-light shrink-0 mt-0.5" />
                <span className="text-slate-200">{feature}</span>
              </div>
            ))}
          </div>
          
          <div className="grid sm:grid-cols-2 gap-3 w-full max-w-xl">
            <button
              type="button"
              onClick={handleBuyReport}
              className="group inline-flex items-center justify-center gap-2 px-6 py-4 bg-accent hover:bg-accent-hover text-white text-base font-bold rounded-xl transition-all hover:scale-105 hover:shadow-glow-accent"
            >
              <FileText className="w-5 h-5" />
              Report completo · {reportPrice}
            </button>
            <Link
              href="/account?upgrade=true"
              onClick={() => trackEvent('premium_checkout_started', { source: 'basic_result_view' })}
              className="group inline-flex items-center justify-center gap-2 px-6 py-4 border border-slate-500 hover:border-white text-white text-base font-bold rounded-xl transition-all hover:bg-white/10"
            >
              <Crown className="w-5 h-5" />
              Premium · {pricing.displayPrice}/mese
            </Link>
          </div>
          
          <p className="text-slate-400 text-sm mt-6">
            Un solo report {reportPrice} o analisi illimitate con Premium. Annulla quando vuoi.
          </p>
        </div>
      </div>
    </div>
  );
}
