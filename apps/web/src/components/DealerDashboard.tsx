'use client';

import { BarChart3, Car, Eye, MessageSquare, Plus, Settings, TrendingUp, Users } from 'lucide-react';

export default function DealerDashboard() {
  const stats = [
    { icon: Car, label: 'Veicoli pubblicati', value: '12', change: '+2 questo mese' },
    { icon: Eye, label: 'Visualizzazioni', value: '3.4k', change: '+18% vs mese scorso' },
    { icon: MessageSquare, label: 'Contatti ricevuti', value: '47', change: '+5 questa settimana' },
    { icon: TrendingUp, label: 'Lead qualificati', value: '18', change: 'Tasso conversione 38%' },
  ];

  const listings = [
    { title: 'Fiat 500 2018', price: 10500, km: 65000, views: 340, leads: 12 },
    { title: 'Volkswagen Golf 2019', price: 16500, km: 43000, views: 280, leads: 8 },
    { title: 'BMW Serie 1 2020', price: 22500, km: 35000, views: 410, leads: 15 },
    { title: 'Renault Captur 2017', price: 12000, km: 78000, views: 190, leads: 5 },
  ];

  return (
    <div className="space-y-8">
      <section>
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-2xl font-bold text-text-primary">
            <span className="flex items-center gap-2"><BarChart3 className="w-6 h-6 text-accent" /> Dashboard concessionario</span>
          </h2>
          <button className="h-10 px-4 rounded-xl bg-accent text-white text-sm font-semibold hover:bg-accent-hover transition-colors flex items-center gap-2">
            <Plus className="w-4 h-4" /> Nuovo veicolo
          </button>
        </div>
        <p className="text-text-secondary mb-6">Monitora le performance del tuo inventario e i contatti ricevuti.</p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {stats.map((s) => (
            <div key={s.label} className="bg-surface rounded-2xl p-5 shadow-card">
              <div className="flex items-center gap-3 mb-3"><s.icon className="w-5 h-5 text-accent" /></div>
              <div className="text-2xl font-extrabold text-text-primary mb-1">{s.value}</div>
              <div className="text-xs font-medium text-text-secondary">{s.label}</div>
              <div className="text-xs text-text-tertiary mt-1">{s.change}</div>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h3 className="text-xl font-bold text-text-primary mb-4">Veicoli in vendita</h3>
        <div className="bg-surface rounded-3xl shadow-card overflow-hidden">
          <div className="hidden md:grid grid-cols-5 gap-4 p-4 border-b border-border bg-surface-2 text-xs font-semibold text-text-secondary">
            <div>Veicolo</div>
            <div className="text-right">Prezzo</div>
            <div className="text-right">Km</div>
            <div className="text-right">Visualizzazioni</div>
            <div className="text-right">Lead</div>
          </div>
          <div className="divide-y divide-border">
            {listings.map((l) => (
              <div key={l.title} className="grid grid-cols-2 md:grid-cols-5 gap-2 md:gap-4 p-4 items-center hover:bg-surface-2 transition-colors">
                <div className="col-span-2 md:col-span-1">
                  <div className="font-semibold text-text-primary text-sm">{l.title}</div>
                  <div className="text-xs text-text-secondary md:hidden">{l.km.toLocaleString('it-IT')} km · €{l.price.toLocaleString('it-IT')}</div>
                </div>
                <div className="hidden md:block text-right text-sm font-semibold text-text-primary">
                  €{l.price.toLocaleString('it-IT')}
                </div>
                <div className="hidden md:block text-right text-sm text-text-secondary">
                  {l.km.toLocaleString('it-IT')} km
                </div>
                <div className="hidden md:block text-right text-sm text-text-secondary">
                  {l.views}
                </div>
                <div className="hidden md:block text-right">
                  <span className="text-sm font-semibold text-accent">{l.leads} contatti</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section>
        <h3 className="text-xl font-bold text-text-primary mb-4">Azioni rapide</h3>
        <div className="grid grid-cols-2 gap-4">
          <button className="bg-surface rounded-2xl p-5 shadow-card text-left hover:shadow-card-hover transition-shadow">
            <Plus className="w-5 h-5 text-accent mb-3" />
            <div className="font-semibold text-text-primary text-sm">Aggiungi veicolo</div>
            <div className="text-xs text-text-secondary mt-1">Pubblica un nuovo annuncio</div>
          </button>
          <button className="bg-surface rounded-2xl p-5 shadow-card text-left hover:shadow-card-hover transition-shadow">
            <Settings className="w-5 h-5 text-accent mb-3" />
            <div className="font-semibold text-text-primary text-sm">Impostazioni profilo</div>
            <div className="text-xs text-text-secondary mt-1">Modifica dati concessionario</div>
          </button>
        </div>
      </section>

      <div className="bg-surface rounded-3xl p-6 shadow-card text-center">
        <Users className="w-8 h-8 text-accent mx-auto mb-3" />
        <div className="font-bold text-text-primary mb-1">Passa al piano Premium</div>
        <div className="text-text-secondary text-sm mb-4">Pubblicazione illimitata, lead prioritari e statistiche avanzate.</div>
        <button className="px-6 py-2.5 rounded-xl bg-accent text-white text-sm font-semibold hover:bg-accent-hover transition-colors">
          Attiva Premium — €199/mese
        </button>
      </div>
    </div>
  );
}
