'use client';

import { useMemo, useState } from 'react';
import { ArrowRight, CarFront, Sparkles } from 'lucide-react';
import { slugify } from '@/lib/catalogo';

type BodyType = 'city' | 'suv' | 'family' | 'sport' | 'premium';
type UseCase = 'city' | 'travel' | 'family' | 'reliable';

const suggestions: Array<{ make: string; model: string; types: BodyType[]; uses: UseCase[]; note: string }> = [
  { make: 'Mazda', model: 'CX-3', types: ['suv'], uses: ['city', 'travel', 'reliable'], note: 'SUV compatto, concreto e piacevole da guidare.' },
  { make: 'Toyota', model: 'Yaris', types: ['city'], uses: ['city', 'reliable'], note: 'Compatta, parsimoniosa e molto adatta alla città.' },
  { make: 'Suzuki', model: 'Vitara', types: ['suv'], uses: ['city', 'travel', 'reliable'], note: 'SUV leggero con costi di gestione prevedibili.' },
  { make: 'Honda', model: 'Jazz', types: ['city', 'family'], uses: ['city', 'family', 'reliable'], note: 'Spazio intelligente e ottima reputazione meccanica.' },
  { make: 'Skoda', model: 'Octavia', types: ['family'], uses: ['travel', 'family'], note: 'Spaziosa e razionale per viaggi e famiglia.' },
  { make: 'BMW', model: 'Serie 3', types: ['premium', 'sport'], uses: ['travel'], note: 'Berlina di guida, da scegliere con storico completo.' },
  { make: 'Porsche', model: 'Macan', types: ['suv', 'sport', 'premium'], uses: ['travel'], note: 'SUV sportivo: manutenzione e versione fanno la differenza.' },
];

export default function CarFinder() {
  const [bodyType, setBodyType] = useState<BodyType>('suv');
  const [useCase, setUseCase] = useState<UseCase>('city');
  const matches = useMemo(() => {
    const exact = suggestions.filter((car) => car.types.includes(bodyType) && car.uses.includes(useCase));
    const byType = suggestions.filter((car) => car.types.includes(bodyType));
    return (exact.length ? exact : byType).slice(0, 3);
  }, [bodyType, useCase]);

  return (
    <section id="consigliatore" className="py-12 md:py-16 border-t border-border/60">
      <div className="grid lg:grid-cols-[0.9fr_1.1fr] gap-7 items-start">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-accent mb-2">Consigliatore AutoEsperto</p>
          <h2 className="text-2xl md:text-3xl font-bold text-text-primary">Che auto stai cercando?</h2>
          <p className="text-text-secondary mt-2 leading-relaxed">Scegli il tipo di auto e come la userai: trovi modelli sensati da approfondire, non un elenco casuale.</p>
          <div className="mt-6 space-y-5 bg-surface-2 rounded-2xl p-5 border border-border">
            <fieldset>
              <legend className="text-sm font-semibold text-text-primary mb-2.5">Tipo di auto</legend>
              <div className="grid grid-cols-2 gap-2">
                {([{ id: 'city', label: 'City car' }, { id: 'suv', label: 'SUV' }, { id: 'family', label: 'Familiare' }, { id: 'sport', label: 'Sportiva' }, { id: 'premium', label: 'Premium' }] as const).map((item) => (
                  <button key={item.id} type="button" onClick={() => setBodyType(item.id)} className={`rounded-xl border px-3 py-2.5 text-sm font-semibold text-left transition-colors ${bodyType === item.id ? 'border-accent bg-white text-accent' : 'border-border bg-white text-text-secondary hover:border-accent/40'}`}>{item.label}</button>
                ))}
              </div>
            </fieldset>
            <label className="block text-sm font-semibold text-text-primary">Come la userai?
              <select value={useCase} onChange={(event) => setUseCase(event.target.value as UseCase)} className="mt-2 w-full rounded-xl border border-border bg-white px-3 py-2.5 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-accent/30">
                <option value="city">Città e tragitti quotidiani</option>
                <option value="travel">Viaggi e autostrada</option>
                <option value="family">Famiglia e spazio</option>
                <option value="reliable">Massima affidabilità</option>
              </select>
            </label>
          </div>
        </div>
        <div className="bg-white rounded-2xl shadow-card border border-border p-5 md:p-6">
          <div className="flex items-center gap-2 text-sm font-semibold text-text-primary mb-4"><Sparkles className="w-4 h-4 text-accent" /> Modelli da guardare</div>
          <div className="space-y-3">
            {matches.map((car) => <a key={`${car.make}-${car.model}`} href={`/valutazione/${slugify(car.make)}/${slugify(car.model)}/`} className="group block rounded-xl border border-border bg-surface-2 hover:bg-white hover:border-accent/40 px-4 py-3.5 transition-colors"><div className="flex items-center justify-between gap-3"><div><div className="flex items-center gap-2"><CarFront className="w-4 h-4 text-accent" /><h3 className="font-bold text-text-primary">{car.make} {car.model}</h3></div><p className="text-sm text-text-secondary mt-1">{car.note}</p></div><ArrowRight className="w-4 h-4 flex-shrink-0 text-text-tertiary group-hover:text-accent" /></div></a>)}
          </div>
          <p className="text-xs text-text-tertiary mt-4">Sono suggerimenti iniziali: apri il report per confrontare anno, chilometri, prezzo e punti da verificare.</p>
        </div>
      </div>
    </section>
  );
}
