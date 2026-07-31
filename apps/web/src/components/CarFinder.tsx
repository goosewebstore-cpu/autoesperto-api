'use client';

import { useMemo, useState } from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';
import { slugify } from '@/lib/catalogo';

type UseCase = 'citta' | 'famiglia' | 'affidabilita';

const suggestions: Array<{ make: string; model: string; max: number; uses: UseCase[]; note: string }> = [
  { make: 'Toyota', model: 'Yaris', max: 16000, uses: ['citta', 'affidabilita'], note: 'Compatta, parsimoniosa e nota per l’affidabilità.' },
  { make: 'Fiat', model: 'Panda', max: 11000, uses: ['citta'], note: 'Semplice da gestire e pratica per gli spostamenti quotidiani.' },
  { make: 'Suzuki', model: 'Swift', max: 15000, uses: ['citta', 'affidabilita'], note: 'Leggera, concreta e con costi prevedibili.' },
  { make: 'Honda', model: 'Jazz', max: 18000, uses: ['citta', 'famiglia', 'affidabilita'], note: 'Spazio intelligente e ottima reputazione meccanica.' },
  { make: 'Dacia', model: 'Duster', max: 20000, uses: ['famiglia'], note: 'Spazio e altezza da terra con un budget equilibrato.' },
  { make: 'Toyota', model: 'Corolla', max: 26000, uses: ['famiglia', 'affidabilita'], note: 'Ibrida versatile, adatta anche a percorrenze maggiori.' },
  { make: 'Mazda', model: 'CX-5', max: 30000, uses: ['famiglia'], note: 'SUV solido per chi cerca comfort e spazio.' },
];

export default function CarFinder() {
  const [budget, setBudget] = useState(16000);
  const [useCase, setUseCase] = useState<UseCase>('citta');

  const matches = useMemo(() => {
    const matchingUse = suggestions.filter((car) => car.uses.includes(useCase));
    return [...matchingUse]
      .sort((a, b) => Math.abs(a.max - budget) - Math.abs(b.max - budget))
      .slice(0, 3);
  }, [budget, useCase]);

  return (
    <section id="consigliatore" className="py-12 md:py-16 border-t border-border/60">
      <div className="grid lg:grid-cols-[0.9fr_1.1fr] gap-7 items-start">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-accent mb-2">Consigliatore AutoEsperto</p>
          <h2 className="text-2xl md:text-3xl font-bold text-text-primary">Quale auto è più adatta a te?</h2>
          <p className="text-text-secondary mt-2 leading-relaxed">
            Parti dal tuo budget e dal tipo di utilizzo: ti proponiamo modelli da approfondire con prezzi reali, affidabilità e confronti.
          </p>
          <div className="mt-6 space-y-4 bg-surface-2 rounded-2xl p-5 border border-border">
            <label className="block text-sm font-semibold text-text-primary">
              Budget indicativo
              <select value={budget} onChange={(event) => setBudget(Number(event.target.value))} className="mt-2 w-full rounded-xl border border-border bg-white px-3 py-2.5 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-accent/30">
                <option value={10000}>Fino a €10.000</option>
                <option value={16000}>Fino a €16.000</option>
                <option value={22000}>Fino a €22.000</option>
                <option value={30000}>Fino a €30.000</option>
              </select>
            </label>
            <label className="block text-sm font-semibold text-text-primary">
              Uso principale
              <select value={useCase} onChange={(event) => setUseCase(event.target.value as UseCase)} className="mt-2 w-full rounded-xl border border-border bg-white px-3 py-2.5 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-accent/30">
                <option value="citta">Città e tragitti quotidiani</option>
                <option value="famiglia">Famiglia e viaggi</option>
                <option value="affidabilita">Priorità affidabilità</option>
              </select>
            </label>
          </div>
        </div>
        <div className="bg-white rounded-2xl shadow-card border border-border p-5 md:p-6">
          <div className="flex items-center gap-2 text-sm font-semibold text-text-primary mb-4">
            <Sparkles className="w-4 h-4 text-accent" />
            Modelli da valutare
          </div>
          <div className="space-y-3">
            {matches.map((car) => (
              <a key={`${car.make}-${car.model}`} href={`/valutazione/${slugify(car.make)}/${slugify(car.model)}/`} className="group block rounded-xl border border-border bg-surface-2 hover:bg-white hover:border-accent/40 px-4 py-3.5 transition-colors">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <h3 className="font-bold text-text-primary">{car.make} {car.model}</h3>
                    <p className="text-sm text-text-secondary mt-0.5">{car.note}</p>
                  </div>
                  <ArrowRight className="w-4 h-4 flex-shrink-0 text-text-tertiary group-hover:text-accent" />
                </div>
              </a>
            ))}
          </div>
          <p className="text-xs text-text-tertiary mt-4">Consiglio iniziale basato su budget e utilizzo: verifica sempre il singolo esemplare nel report.</p>
        </div>
      </div>
    </section>
  );
}
