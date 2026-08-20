import Link from 'next/link';
import { ArrowRight, Banknote, Calculator, Car, Fuel, Gauge, Hammer, Scale, SearchCheck, ShieldAlert, Trophy, Wrench, Zap } from 'lucide-react';

interface ToolLink {
  label: string;
  href: string;
  desc: string;
  icon: typeof Calculator;
}

const ALL_TOOLS: ToolLink[] = [
  { label: 'Conviene comprarla?', href: '/compra', desc: 'Prezzo e verdetto pre-acquisto', icon: SearchCheck },
  { label: 'Quanto vale?', href: '/vendi', desc: 'Valore di mercato e annuncio', icon: Banknote },
  { label: 'Migliori auto usate', href: '/migliori-auto-usate', desc: 'Classifica per budget 2026', icon: Trophy },
  { label: 'Incentivi ed Ecobonus', href: '/incentivi-auto', desc: 'Calcolo bonus rottamazione', icon: Zap },
  { label: 'Blocchi del traffico', href: '/blocchi-traffico', desc: 'Verifica classi Euro e ZTL', icon: ShieldAlert },
  { label: 'Auto per neopatentati', href: '/neopatentati', desc: 'Limiti kW e modelli 2026', icon: Car },
  { label: 'Passaggio di proprietà', href: '/passaggio-proprieta', desc: 'Costo per kW e provincia', icon: Calculator },
  { label: 'Problemi motori noti', href: '/motori-problemi', desc: 'Difetti ricorrenti e costi', icon: Wrench },
  { label: 'Affidabilità e guasti', href: '/affidabilita', desc: 'Problemi noti per modello', icon: Hammer },
  { label: 'Consumi reali', href: '/consumi', desc: 'Consumi veri, non da listino', icon: Fuel },
  { label: 'Valuta la condizione', href: '/condizione', desc: 'Riparare o vendere?', icon: Scale },
  { label: 'Valutazione per modello', href: '/valutazione', desc: 'Prezzi reali per marca', icon: Gauge },
];

interface RelatedToolsProps {
  /** The current page's href, so we exclude it from the list */
  currentHref: string;
  /** Max number of related tools to show */
  max?: number;
}

export default function RelatedTools({ currentHref, max = 4 }: RelatedToolsProps) {
  const related = ALL_TOOLS.filter((t) => t.href !== currentHref).slice(0, max);

  if (related.length === 0) return null;

  return (
    <section className="mt-12 rounded-2xl border border-slate-200 bg-slate-50/80 p-6">
      <h2 className="text-base font-bold text-slate-900 mb-1">Potrebbe interessarti anche</h2>
      <p className="text-xs text-slate-500 mb-4">Altri strumenti gratuiti per chi compra o vende un&apos;auto usata.</p>
      <div className="grid sm:grid-cols-2 gap-3">
        {related.map((tool) => {
          const Icon = tool.icon;
          return (
            <Link
              key={tool.href}
              href={tool.href}
              className="group flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-3.5 hover:border-blue-500/50 hover:shadow-sm transition-all"
            >
              <span className="grid h-9 w-9 place-items-center rounded-lg bg-blue-50 text-blue-600 shrink-0">
                <Icon className="h-4 w-4" />
              </span>
              <div className="min-w-0 flex-1">
                <span className="text-sm font-semibold text-slate-900 group-hover:text-blue-600 transition-colors">{tool.label}</span>
                <p className="text-[11px] text-slate-500 truncate">{tool.desc}</p>
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-600 group-hover:translate-x-0.5 transition-all shrink-0" />
            </Link>
          );
        })}
      </div>
    </section>
  );
}
