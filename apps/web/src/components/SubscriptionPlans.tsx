'use client';

import { Check, Crown } from 'lucide-react';

const userPlans = [
  { id: 'free', name: 'Free', price: '0', period: '/mese', features: ['1 analisi gratuita', 'Dati base veicolo', 'Valutazione semplice'], popular: false, btn: 'Inizia gratis' },
  { id: 'plus', name: 'Plus', price: '5,99', period: '/mese', features: ['30 analisi al mese', 'Nessuna pubblicità', 'Report completo', 'Prezzo di mercato', 'Problemi conosciuti', 'Report PDF'], popular: true, btn: 'Passa a Plus' },
  { id: 'pro', name: 'Pro', price: '14,99', period: '/mese', features: ['Analisi illimitate', 'AI avanzata', 'Confronto auto', 'Centro conoscenza', 'Previsioni valore futuro', 'Report avanzati'], popular: false, btn: 'Passa a Pro' },
];

const dealerPlans = [
  { id: 'dealer-base', name: 'Concessionario Base', price: '99', period: '/mese', features: ['Profilo aziendale', 'Fino a 20 veicoli', 'Statistiche base'] },
  { id: 'dealer-premium', name: 'Concessionario Premium', price: '199', period: '/mese', features: ['Pubblicazione illimitata', 'Lead prioritari', 'Statistiche avanzate', 'Pubblicità veicoli'] },
  { id: 'dealer-enterprise', name: 'Concessionario Enterprise', price: '', period: 'personalizzato', features: ['Soluzione su misura', 'API dedicata', 'Supporto priority'] },
];

export default function SubscriptionPlans() {
  return (
    <div className="space-y-10">
      {/* User plans */}
      <section>
        <h2 className="text-2xl font-bold text-text-primary mb-2">Scegli il tuo piano</h2>
        <p className="text-text-secondary mb-6">Inizia gratis, passa al piano che ti serve quando vuoi.</p>
        <div className="flex flex-col gap-4">
          {userPlans.map((plan) => (
            <div key={plan.id} className={`bg-surface rounded-3xl shadow-card p-6 md:p-8 relative ${plan.popular ? 'ring-2 ring-accent' : ''}`}>
              {plan.popular && (
                <span className="absolute -top-3 left-6 bg-accent text-white text-xs font-semibold px-4 py-1.5 rounded-full flex items-center gap-1">
                  <Crown className="w-3 h-3" /> Più scelto
                </span>
              )}
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="text-xl font-bold text-text-primary">{plan.name}</div>
                  <div className="text-text-secondary text-sm">{plan.period}</div>
                </div>
                <div className="text-right">
                  {plan.price ? (
                    <div className="text-4xl font-extrabold tracking-tight text-text-primary">€{plan.price}</div>
                  ) : null}
                </div>
              </div>
              <ul className="space-y-3 mb-6">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-center gap-3 text-sm text-text-secondary">
                    <Check className="w-4 h-4 text-success flex-shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
              <button
                onClick={() => alert('Piano «' + plan.name + '» disponibile a breve. Pagamenti Stripe in fase di configurazione.')}
                className={`w-full h-12 rounded-xl font-semibold text-sm transition-colors ${
                  plan.popular
                    ? 'bg-accent text-white hover:bg-accent-hover'
                    : 'bg-surface-2 text-text-primary hover:bg-border'
                }`}
              >
                {plan.btn}
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Dealer plans */}
      <section>
        <h2 className="text-2xl font-bold text-text-primary mb-2">Sei un concessionario?</h2>
        <p className="text-text-secondary mb-6">AutoEsperto Business: pubblica il tuo inventario e ottieni lead qualificati.</p>
        <div className="grid md:grid-cols-3 gap-4">
          {dealerPlans.map((plan) => (
            <div key={plan.id} className="bg-surface rounded-3xl shadow-card p-6">
              <div className="text-lg font-bold text-text-primary mb-1">{plan.name}</div>
              <div className="text-3xl font-extrabold tracking-tight text-text-primary mb-1">
                {plan.price ? `€${plan.price}` : 'Su misura'}
              </div>
              <div className="text-text-secondary text-sm mb-4">{plan.period}</div>
              <ul className="space-y-2 mb-6">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm text-text-secondary">
                    <Check className="w-3.5 h-3.5 text-success flex-shrink-0" /> {f}
                  </li>
                ))}
              </ul>
              <button
                onClick={() => alert('Area concessionari in arrivo. Contattaci per attivare il tuo profilo business.')}
                className="w-full h-12 rounded-xl bg-surface-2 text-text-primary font-semibold text-sm hover:bg-border transition-colors"
              >
                Contattaci
              </button>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
