import Link from 'next/link';
import { ArrowRight, Banknote, Bot, Calculator, Car, Compass, Fuel, Gauge, Hammer, Scale, SearchCheck, ShieldAlert, ShieldCheck, Trophy, Wrench, Zap } from 'lucide-react';

interface ToolLink {
  label: string;
  href: string;
  desc: string;
  icon: typeof Calculator;
}

const ALL_TOOLS: ToolLink[] = [
  { label: 'Auto Finder Intelligente', href: '/auto-finder', desc: 'Trova l\'auto usata perfetta per budget ed esigenze', icon: Compass as any },
  { label: 'AI Car Advisor', href: '/ai-car-advisor', desc: 'Consulente indipendente: la compreresti e quanto offrire', icon: Bot as any },
  { label: 'Controlla Annuncio & Trust Score', href: '/analizza-annuncio', desc: 'Trust score 0-100 prima di comprare', icon: ShieldCheck as any },
  { label: 'Profilo Digitale Auto', href: '/passport', desc: 'Libretto digitale, scadenze e storico manutenzioni', icon: ShieldCheck as any },
  { label: 'Conviene comprarla?', href: '/compra', desc: 'Prezzo e verdetto pre-acquisto', icon: SearchCheck as any },
  { label: 'Quanto vale la mia auto?', href: '/vendi', desc: 'Valore di mercato e annuncio pronto', icon: Banknote as any },
  { label: 'Migliori auto usate', href: '/migliori-auto-usate', desc: 'Classifica per budget 2026', icon: Trophy as any },
  { label: 'Incentivi ed Ecobonus', href: '/incentivi-auto', desc: 'Calcolo bonus rottamazione', icon: Zap as any },
  { label: 'Blocchi del traffico', href: '/blocchi-traffico', desc: 'Verifica classi Euro e ZTL', icon: ShieldAlert as any },
  { label: 'Auto per neopatentati', href: '/neopatentati', desc: 'Limiti kW e modelli 2026', icon: Car as any },
  { label: 'Passaggio di proprietà', href: '/passaggio-proprieta', desc: 'Costo per kW e provincia', icon: Calculator as any },
  { label: 'Problemi motori noti', href: '/motori-problemi', desc: 'Difetti ricorrenti e costi', icon: Wrench as any },
  { label: 'Affidabilità e guasti', href: '/affidabilita', desc: 'Problemi noti per modello', icon: Hammer as any },
  { label: 'Consumi reali', href: '/consumi', desc: 'Consumi veri, non da listino', icon: Fuel as any },
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
